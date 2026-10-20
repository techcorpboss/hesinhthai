#!/usr/bin/env bash
# ==============================================================================
# Script tự động khởi tạo & nạp Cơ sở dữ liệu MySQL `hesinhthai_db` trên Ubuntu
# Mật khẩu MySQL Server Ubuntu: Thong1976
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SQL_FILE="$PROJECT_DIR/database/hesinhthai_db.sql"

# Đảm bảo file .env trên Server Ubuntu có DB_PASSWORD=Thong1976
cp -f "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"

MYSQL_BIN="mysql"
if [ -x "/www/server/mysql/bin/mysql" ]; then
  MYSQL_BIN="/www/server/mysql/bin/mysql"
fi

echo "=================================================================="
echo "🚀 Đang khởi tạo CSDL MySQL [hesinhthai_db] từ: $SQL_FILE"
echo "=================================================================="

IMPORTED=0
for PW in "Thong1976" "$DB_PASSWORD" "Thong7690@" "root123@" ""; do
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
  echo "✅ Đã nạp thành công 19 bảng dữ liệu vào MySQL [hesinhthai_db] qua MySQL CLI!"
  if [ -z "$USED_PW" ]; then
    "$MYSQL_BIN" -u root -D hesinhthai_db -e "SHOW TABLES;"
  else
    "$MYSQL_BIN" -u root -p"$USED_PW" -D hesinhthai_db -e "SHOW TABLES;"
  fi
fi

echo "⏳ Đang kiểm tra kết nối Node.js -> MySQL [hesinhthai_db]..."
node "$PROJECT_DIR/scripts/init-mysql.js"
