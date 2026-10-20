#!/usr/bin/env bash
# ==============================================================================
# Script tự động khởi tạo & nạp Cơ sở dữ liệu MySQL `hesinhthai_db` trên Ubuntu
# Hỗ trợ cả aaPanel (/www/server/mysql/bin/mysql) và MySQL chuẩn hệ thống
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SQL_FILE="$PROJECT_DIR/database/hesinhthai_db.sql"

MYSQL_BIN="mysql"
if [ -x "/www/server/mysql/bin/mysql" ]; then
  MYSQL_BIN="/www/server/mysql/bin/mysql"
fi

echo "=================================================================="
echo "🚀 Đang khởi tạo CSDL MySQL [hesinhthai_db] từ: $SQL_FILE"
echo "=================================================================="

# Dò mật khẩu từ cấu hình aaPanel hoặc biến môi trường
AAPANEL_PASS=""
if [ -f "/www/server/panel/config/config.json" ]; then
  AAPANEL_PASS=$(python3 -c "import json; print(json.load(open('/www/server/panel/config/config.json')).get('mysql_root',''))" 2>/dev/null || true)
fi

IMPORTED=0
for PW in "$DB_PASSWORD" "$AAPANEL_PASS" "Thong7690@" "root123@" ""; do
  if [ -z "$PW" ]; then
    if "$MYSQL_BIN" -u root < "$SQL_FILE" 2>/dev/null; then
      IMPORTED=1
      USED_PW=""
      break
    fi
  else
    if "$MYSQL_BIN" -u root -p"$PW" < "$SQL_FILE" 2>/dev/null; then
      IMPORTED=1
      USED_PW="$PW"
      break
    fi
  fi
done

if [ "$IMPORTED" -eq 1 ]; then
  echo "✅ Đã nạp thành công 19 bảng dữ liệu vào MySQL [hesinhthai_db]!"
  if [ -z "$USED_PW" ]; then
    "$MYSQL_BIN" -u root -e "USE hesinhthai_db; SHOW TABLES;"
  else
    "$MYSQL_BIN" -u root -p"$USED_PW" -e "USE hesinhthai_db; SHOW TABLES;"
  fi
else
  echo "⚠️ Không tự động đăng nhập được bằng mật khẩu mặc định. Đang thử chạy qua Node.js..."
  node "$PROJECT_DIR/scripts/init-mysql.js"
fi
