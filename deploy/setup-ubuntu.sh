#!/usr/bin/env bash
# ==============================================================================
# SCRIPT TRIỂN KHAI TỰ ĐỘNG TECHCORP ECOSYSTEM HUB TRÊN UBUNTU SERVER
# Tên miền đích: https://hesinhthai.techcorp.info.vn
# Cách chạy trên Ubuntu: sudo bash deploy/setup-ubuntu.sh
# ==============================================================================

set -e

DOMAIN="hesinhthai.techcorp.info.vn"
APP_DIR="/var/www/hesinhthai-techcorp"
PORT=3000

echo "=== [1/6] Cập nhật hệ thống Ubuntu & Cài đặt gói cơ bản ==="
apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx

echo "=== [2/6] Kiểm tra & Cài đặt Node.js 22 LTS + PM2 ==="
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
npm install -g pm2

echo "=== [3/6] Sao chép mã nguồn vào ${APP_DIR} ==="
mkdir -p "${APP_DIR}"
cp -r ./* "${APP_DIR}/"
mkdir -p "${APP_DIR}/data"

cd "${APP_DIR}"
node server.js --seed

echo "=== [4/6] Khởi chạy Backend API & SSO Server bằng PM2 ==="
export PORT="${PORT}"
export TECHCORP_HUB_DOMAIN="https://${DOMAIN}"
pm2 delete techcorp-hub >/dev/null 2>&1 || true
pm2 start server.js --name "techcorp-hub" --update-env
pm2 save
pm2 startup systemd -u root --hp /root || true

echo "=== [5/6] Cấu hình Nginx Reverse Proxy cho ${DOMAIN} ==="
cp "${APP_DIR}/deploy/nginx-hesinhthai.techcorp.info.vn.conf" "/etc/nginx/sites-available/${DOMAIN}"
ln -sf "/etc/nginx/sites-available/${DOMAIN}" "/etc/nginx/sites-enabled/${DOMAIN}"
nginx -t
systemctl reload nginx

echo "=== [6/6] Hoàn tất! Kiểm tra trạng thái API ==="
curl -s "http://127.0.0.1:${PORT}/api/v1/health" || true
echo ""
echo "------------------------------------------------------------------------------"
echo "✅ TechCorp Ecosystem Hub đã chạy tại: http://${DOMAIN}"
echo "🔒 Để kích hoạt HTTPS (SSL miễn phí Let's Encrypt), chạy lệnh:"
echo "   sudo certbot --nginx -d ${DOMAIN}"
echo "------------------------------------------------------------------------------"
