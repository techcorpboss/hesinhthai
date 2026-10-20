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
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "=== [3/4] Khởi tạo CSDL & Chạy Backend API + SSO + Forum (Port ${PORT}) ==="
cd "${TARGET_DIR}"
node server.js --seed
export PORT="${PORT}"
export TECHCORP_HUB_DOMAIN="https://${DOMAIN}"

pm2 delete techcorp-hub >/dev/null 2>&1 || true
pm2 start server.js --name "techcorp-hub" --update-env
pm2 save

# Tự động cấu hình Reverse Proxy cho /api/ trên aaPanel Nginx nếu có
AAPANEL_NGINX_CONF="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
if [ -f "${AAPANEL_NGINX_CONF}" ]; then
  if ! grep -q "proxy_pass http://127.0.0.1:3000" "${AAPANEL_NGINX_CONF}"; then
    echo "=== [4/4] Tích hợp Reverse Proxy /api/ vào cấu hình Nginx của aaPanel ==="
    sed -i '/server_name/a \
    location /api/ {\
        proxy_pass http://127.0.0.1:3000/api/;\
        proxy_http_version 1.1;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
    }' "${AAPANEL_NGINX_CONF}"
    /etc/init.d/nginx reload || systemctl reload nginx || true
  fi
fi

# Phân quyền chuẩn cho www (aaPanel) nếu có user www
if id "www" >/dev/null 2>&1; then
  chown -R www:www "${TARGET_DIR}" || true
fi

echo "=============================================================================="
echo "🎉 ĐỒNG BỘ HOÀN TẤT LÊN: https://${DOMAIN}/"
echo "🌐 Giao diện Web & Widget : ${TARGET_DIR}/index.html"
echo "🚀 Backend API & SSO Hub  : http://127.0.0.1:${PORT}/api/v1/health"
echo "=============================================================================="
