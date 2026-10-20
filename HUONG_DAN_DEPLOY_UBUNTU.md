# HƯỚNG DẪN TRIỂN KHAI LÊN SERVER UBUNTU (`hesinhthai.techcorp.info.vn`) & TÀI LIỆU TÍCH HỢP ỨNG DỤNG MỚI

---

## 1. KIẾN TRÚC BACKEND API & CSDL TẬP TRUNG ĐÃ XÂY DỰNG

Hệ thống đã được thiết kế theo mô hình **Zero-Dependency Native Node.js + SQLite/JSON Transactional Storage** để đảm bảo chạy ổn định 100% trên mọi phiên bản Ubuntu Server (20.04 / 22.04 / 24.04) mà không bao giờ gặp lỗi biên dịch thư viện C++ (`node-gyp`).

### Cấu trúc thư mục dự án:
* `server.js`: Máy chủ HTTP, RESTful API Gateway (`/api/v1/*`) và phục vụ cổng Web `TechCorp Hub`.
* `backend/db.js`: Cơ sở dữ liệu tập trung (tự động tạo và đồng bộ song song `data/techcorp_hub.sqlite` và `data/techcorp_hub_db.json`).
* `backend/sso.js`: Dịch vụ cấp phát và xác thực **TechCorp ID (SSO JWT chuẩn HS256)**.
* `widget/techcorp-ecosystem-bar.js`: Thanh công cụ liên thông động (tự động gọi `GET /api/v1/apps` để cập nhật danh sách ứng dụng mới trên toàn hệ sinh thái).
* `deploy/setup-ubuntu.sh` & `deploy/nginx-hesinhthai.techcorp.info.vn.conf`: Bộ script cài đặt tự động lên Ubuntu Server.
* `Dockerfile` & `docker-compose.yml`: Bộ cấu hình chạy bằng Docker.

---

## 2. CÁCH TRIỂN KHAI LÊN SERVER UBUNTU (`hesinhthai.techcorp.info.vn`)

### Bước chuẩn bị DNS:
Trỏ bản ghi **A Record** của tên miền `hesinhthai.techcorp.info.vn` về địa chỉ IP Public của Server Ubuntu.

---

### Cách 1: Triển khai trực tiếp trên Ubuntu bằng Script 1-Click (Khuyên dùng)

1. **Đẩy mã nguồn lên Server Ubuntu** (qua Git hoặc SCP/SFTP vào thư mục bất kỳ, ví dụ `/root/HesinhthaiTC`).
2. **Chạy lệnh cài đặt tự động:**
   ```bash
   cd /root/HesinhthaiTC
   sudo bash deploy/setup-ubuntu.sh
   ```
   *(Script sẽ tự động cài đặt Node.js 22 LTS, PM2, Nginx, khởi tạo CSDL SQLite/JSON tại `/var/www/hesinhthai-techcorp/data`, chạy ngầm dịch vụ `techcorp-hub` ở cổng `3000` và cấu hình Nginx Reverse Proxy cho `hesinhthai.techcorp.info.vn`).*
3. **Kích hoạt chứng chỉ bảo mật HTTPS (SSL Let's Encrypt miễn phí):**
   ```bash
   sudo certbot --nginx -d hesinhthai.techcorp.info.vn
   ```

---

### Cách 2: Triển khai bằng Docker Compose trên Ubuntu

Nếu Server Ubuntu của bạn đang dùng Docker:
```bash
docker compose up -d --build
```
Sau đó copy file `deploy/nginx-hesinhthai.techcorp.info.vn.conf` vào `/etc/nginx/sites-enabled/` và chạy `sudo systemctl reload nginx`.

---

## 3. QUY TRÌNH TÍCH HỢP NHANH 1 ỨNG DỤNG MỚI VÀO HỆ SINH THÁI (TRONG 3 PHÚT)

Khi TechCorp phát triển thêm sản phẩm thứ 6, thứ 7 (ví dụ: *Phần mềm Quản lý Khách sạn PMS*, *Phần mềm Quản lý Phòng khám*, *Cổng Thanh toán Học phí*...), đội ngũ kỹ thuật chỉ cần thực hiện **3 bước**:

### Bước 1: Đăng ký Ứng dụng Mới để nhận `appId` và `apiKey`
Truy cập trực tiếp giao diện **`https://hesinhthai.techcorp.info.vn` $\rightarrow$ Tab 2 (Tích hợp Ứng dụng Mới & SSO API)** hoặc gọi API:
```bash
curl -X POST "https://hesinhthai.techcorp.info.vn/api/v1/apps/register" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "biz-hotel-pms",
    "name": "QL Khách sạn & Resort (PMS)",
    "badge": "Hospitality",
    "appUrl": "https://pms.techcorp.info.vn",
    "webhookUrl": "https://pms.techcorp.info.vn/api/webhooks/techcorp-hub",
    "desc": "Quản lý buồng phòng, đặt phòng & kết nối thực tập sinh Du lịch Nha Trang"
  }'
```
* **Kết quả tức thì:** CSDL tập trung lưu ứng dụng mới, trả về `apiKey` (`tc_live_...`), và **Thanh Liên thông trên tất cả 5 phần mềm cũ tự động xuất hiện nút chuyển sang ứng dụng mới** mà không cần sửa code của 5 phần mềm cũ!

### Bước 2: Nhúng Thanh Liên thông vào Header của Ứng dụng Mới
Thêm 1 dòng duy nhất vào file HTML/Layout của ứng dụng mới:
```html
<script
  src="https://hesinhthai.techcorp.info.vn/widget/techcorp-ecosystem-bar.js"
  data-hub-url="https://hesinhthai.techcorp.info.vn"
  data-app-id="biz-hotel-pms"
  data-org-name="Khách sạn Biển Nha Trang"
  data-user-role="Quản lý"
  defer
></script>
```

### Bước 3: Xác thực SSO (`TechCorp ID`) & Bắn sự kiện Liên thông
* **Xác thực JWT Token khi người dùng chuyển từ Hub sang ứng dụng mới:**
  ```bash
  GET https://hesinhthai.techcorp.info.vn/api/v1/sso/verify
  Authorization: Bearer <SSO_JWT_TOKEN>
  ```
* **Đẩy dữ liệu liên thông từ ứng dụng mới lên Hub (VD: đăng tin tuyển thực tập sinh, cấp chứng chỉ, phát hành voucher):**
  ```bash
  curl -X POST "https://hesinhthai.techcorp.info.vn/api/v1/events/publish" \
    -H "Content-Type: application/json" \
    -H "X-TechCorp-Api-Key: <API_KEY_CUA_UNG_DUNG>" \
    -d '{
      "sourceApp": "biz-hotel-pms",
      "targetApp": "edu-school",
      "eventType": "HOTEL_INTERNSHIP_OPEN",
      "text": "[PMS Khách sạn -> Trường ĐH/CĐ] Tuyển 10 Thực tập sinh Buồng phòng & Lễ tân tiếng Anh tại Nha Trang"
    }'
  ```

---

## 4. DANH MỤC API TẬP TRUNG TRÊN `hesinhthai.techcorp.info.vn`

| Phương thức & Endpoint | Chức năng |
| :--- | :--- |
| `GET /api/v1/health` | Kiểm tra trạng thái hoạt động của Backend API & SQLite/JSON DB |
| `GET /api/v1/bootstrap` | Tải toàn bộ dữ liệu khởi tạo cho cổng `TechCorp Hub` |
| `GET /api/v1/apps` | Lấy danh sách toàn bộ ứng dụng đã tích hợp (dùng cho Topbar Widget) |
| `POST /api/v1/apps/register` | Đăng ký ứng dụng mới vào hệ sinh thái, sinh `API Key` & đoạn mã nhúng |
| `POST /api/v1/sso/token` | Cấp phát JWT Token (`TechCorp ID`) cho phiên đăng nhập liên thông |
| `GET /api/v1/sso/verify` | Xác thực tính hợp lệ và giải mã thông tin người dùng từ JWT Token |
| `POST /api/v1/events/publish` | Nhận sự kiện liên thông từ các ứng dụng thành viên qua `X-TechCorp-Api-Key` |
| `POST /api/v1/talents/:id/push-erp` | Đồng bộ Hồ sơ Năng lực Số của sinh viên/học viên thẳng vào phân hệ HRM trên ERP |
| `POST /api/v1/contests/:id/sync-leads` | Phân bổ danh sách học viên tiềm năng từ kỳ thi Online về CRM Trung tâm |
| `POST /api/v1/b2b/connect` | Ghi nhận yêu cầu kết nối giao thương B2B giữa các đơn vị tại Khánh Hòa |
| `POST /api/v1/lighthouse/:idx/increment` | Cập nhật tiến độ chốt 57 khách hàng hạt nhân tại Nha Trang vào CSDL |
