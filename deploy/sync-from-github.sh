#!/usr/bin/env bash
# ==============================================================================
# SCRIPT ĐỒNG BỘ TỰ ĐỘNG TỪ GITHUB LÊN SERVER UBUNTU (HỖ TRỢ CẢ AAPANEL & NGINX)
# Repo: https://github.com/techcorpboss/hesinhthai.git
# Domain: https://hesinhthai.techcorp.info.vn
# ==============================================================================

set -e

REPO_URL="https://github.com/techcorpboss/hesinhthai.git"
DOMAIN="hesinhthai.techcorp.info.vn"
PORT=3000

# Tự động nhận diện thư mục Web của aaPanel (/www/wwwroot/...) hoặc chuẩn (/var/www/...)
if [ -d "/www/wwwroot/${DOMAIN}" ]; then
  TARGET_DIR="/www/wwwroot/${DOMAIN}"
  echo "✅ Phát hiện thư mục Website aaPanel: ${TARGET_DIR}"
elif [ -d "/www/wwwroot" ]; then
  TARGET_DIR="/www/wwwroot/${DOMAIN}"
  mkdir -p "${TARGET_DIR}"
else
  TARGET_DIR="/var/www/${DOMAIN}"
  mkdir -p "${TARGET_DIR}"
fi

echo "=== [1/4] Đồng bộ mã nguồn mới nhất từ GitHub (${REPO_URL}) ==="
if ! command -v git >/dev/null 2>&1; then
  apt-get update -y && apt-get install -y git curl
fi

TMP_CLONE="/tmp/hesinhthai_sync_$$"
rm -rf "${TMP_CLONE}"
git clone --depth 1 "${REPO_URL}" "${TMP_CLONE}"

# Xóa file index.html mặc định ("Site is created successfully!") của aaPanel
rm -f "${TARGET_DIR}/index.html" "${TARGET_DIR}/404.html"

# Sao chép toàn bộ mã nguồn vào thư mục Website
cp -rf "${TMP_CLONE}/." "${TARGET_DIR}/"
rm -rf "${TMP_CLONE}"
mkdir -p "${TARGET_DIR}/data"

echo "=== [2/4] Kiểm tra Node.js & PM2 ==="
export PATH=$PATH:/usr/local/bin:~/.nvm/versions/node/$(ls ~/.nvm/versions/node 2>/dev/null | tail -n 1)/bin:/www/server/nodejs/v22.11.0/bin:/www/server/nodejs/v20.18.0/bin:/www/server/nodejs/v18.20.0/bin

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2 || true
fi

echo "=== [3/4] Khởi tạo CSDL & Chạy Backend API + SSO + Forum (Port ${PORT}) ==="
cd "${TARGET_DIR}"
node server.js --seed
export PORT="${PORT}"
export TECHCORP_HUB_DOMAIN="https://${DOMAIN}"

if command -v pm2 >/dev/null 2>&1; then
  pm2 delete techcorp-hub >/dev/null 2>&1 || true
  pm2 start server.js --name "techcorp-hub" --update-env
  pm2 save || true
else
  pkill -f "node server.js" >/dev/null 2>&1 || true
  nohup node server.js > "${TARGET_DIR}/hub-server.log" 2>&1 &
fi

# Tự động cấu hình Reverse Proxy cho /api/ và tắt Cache tĩnh cũ trên aaPanel Nginx nếu có
AAPANEL_NGINX_CONF="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
if [ -f "${AAPANEL_NGINX_CONF}" ]; then
  if ! grep -q "proxy_pass http://127.0.0.1:3000" "${AAPANEL_NGINX_CONF}"; then
    echo "=== [4/4] Tích hợp Reverse Proxy /api/ vào cấu hình Nginx của aaPanel ==="
    cp "${AAPANEL_NGINX_CONF}" "${AAPANEL_NGINX_CONF}.bak"
    PROXY_SNIPPET="\n    location ^~ /api/ {\n        proxy_pass http://127.0.0.1:3000/api/;\n        proxy_http_version 1.1;\n        proxy_set_header Host \$host;\n        proxy_set_header X-Real-IP \$remote_addr;\n        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto \$scheme;\n    }\n"
    sed -i "s|#ERROR-PAGE-START|${PROXY_SNIPPET}\n    #ERROR-PAGE-START|g" "${AAPANEL_NGINX_CONF}"
  fi
  # Đảm bảo Nginx không lưu cache cũ đối với .js và .css
  sed -i 's/expires .*12h;/expires -1;/g' "${AAPANEL_NGINX_CONF}" || true
  if /etc/init.d/nginx configtest >/dev/null 2>&1 || nginx -t >/dev/null 2>&1; then
    /etc/init.d/nginx reload >/dev/null 2>&1 || systemctl reload nginx >/dev/null 2>&1 || true
    echo "✅ Đã làm mới Nginx & tắt Cache tĩnh cũ thành công!"
  fi
fi

# Phân quyền chuẩn cho www (aaPanel) nếu có user www
if id "www" >/dev/null 2>&1; then
  chown -R www:www "${TARGET_DIR}" || true
fi

echo "=============================================================================="
echo "🎉 ĐỒNG BỘ HOÀN TẤT LÊN: https://${DOMAIN}/ (PHIÊN BẢN ENTERPRISE v4.0)"
echo "🌐 Giao diện Web & Widget : ${TARGET_DIR}/index.html"
echo "🚀 Backend API & SSO Hub  : http://127.0.0.1:${PORT}/api/v1/health"
echo "=============================================================================="
