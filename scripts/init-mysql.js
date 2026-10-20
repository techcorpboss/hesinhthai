/**
 * Script Khởi tạo & Đồng bộ Cơ sở dữ liệu MySQL (hesinhthai_db) cho Hệ sinh thái TechCorp
 * Chạy trên cả Local (Windows) và Server Ubuntu:
 *   node scripts/init-mysql.js
 */

const path = require("path");
const { db } = require("../backend/db");
const { initAndSyncMysql, exportSqlDumpFile } = require("../backend/mysql");

const dumpPath = exportSqlDumpFile(
  db.state,
  path.join(__dirname, "..", "database", "hesinhthai_db.sql")
);
console.log("=================================================================");
console.log("📦 Đã xuất file SQL chuẩn tại:", dumpPath);
console.log("⏳ Đang kết nối và khởi tạo CSDL MySQL `hesinhthai_db`...");

initAndSyncMysql(db.state, function (err, status) {
  if (err) {
    console.error("❌ Lỗi khởi tạo MySQL:", err.message);
    process.exit(1);
  }
  console.log("✅ Khởi tạo & Đồng bộ MySQL thành công!");
  console.log("   • Host:      " + status.host + ":" + status.port);
  console.log("   • Database:  " + status.database);
  console.log("   • Driver:    " + status.driver);
  console.log("   • Số bảng:   " + status.totalTables + " bảng chuẩn quan hệ (UTF8MB4)");
  console.log("   • Đồng bộ:   " + status.lastSyncedAt);
  console.log("=================================================================");
  process.exit(0);
});
