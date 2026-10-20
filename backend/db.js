/**
 * TechCorp Ecosystem Centralized Database Engine (v2.0 - Full Admin CMS, User CRUD, Forum Moderation & Audit Logs)
 * Hỗ trợ lưu trữ bền vững (SQLite + JSON Transactional Storage) cho:
 *  1. App Registry (Xem, Tạo mới, Cập nhật/Sửa, Xoá, Đổi trạng thái Ứng dụng)
 *  2. TechCorp ID Users (Xem, Tạo mới, Sửa, Xoá, Khóa/Mở khóa Tài khoản)
 *  3. Forum Moderation (Thẩm định Duyệt/Từ chối, Tạo mới, Xem, Xoá, Khóa/Lock bình luận, Ghim VIP)
 *  4. User Audit Logs (Truy vết toàn bộ hành động người dùng & quản trị viên theo IP, Thời gian, Hành động)
 *  5. Talent Passports, LMS Contests, B2B Offers & Lighthouse CRM
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DATA_DIR = path.join(__dirname, "..", "data");
const JSON_DB_PATH = path.join(DATA_DIR, "techcorp_hub_db.json");
const SQLITE_DB_PATH = path.join(DATA_DIR, "techcorp_hub.sqlite");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateApiKey(prefix = "tc_live") {
  return `${prefix}_${crypto.randomBytes(16).toString("hex")}`;
}

const CATEGORY_MAP = {
  rfq: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
  comarketing: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
  knowledge: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
  spotlight: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)"
};

const INITIAL_USERS = [
  {
    id: "USR-ADMIN-00",
    personaKey: "super-admin",
    fullName: "Quản trị viên Hệ sinh thái TechCorp",
    email: "admin@techcorp.info.vn",
    phone: "0905.111.999",
    org: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
    role: "super_admin",
    roleBadge: "🛡️ Super Admin TechCorp",
    defaultAppId: "biz-erp",
    assignedApps: ["edu-school", "edu-center", "lms-exam", "biz-web", "biz-erp"],
    status: "active",
    lastLogin: "Vừa xong",
    ipAddress: "103.170.122.138",
    createdAt: "2026-10-01T07:00:00.000Z"
  },
  {
    id: "USR-NT-001",
    personaKey: "ceo-sme",
    fullName: "Nguyễn Hải Đăng (CEO Resort & Travel)",
    email: "ceo@nhatrangbayresort.vn",
    phone: "0914.222.333",
    org: "Nha Trang Bay Resort & Travel",
    role: "ceo_sme",
    roleBadge: "Khối Doanh nghiệp SME",
    defaultAppId: "biz-erp",
    assignedApps: ["biz-erp", "biz-web", "lms-exam"],
    status: "active",
    lastLogin: "10 phút trước",
    ipAddress: "113.160.214.88",
    createdAt: "2026-10-02T08:30:00.000Z"
  },
  {
    id: "USR-NT-002",
    personaKey: "center-dir",
    fullName: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
    email: "director@oceanenglish.edu.vn",
    phone: "0988.444.555",
    org: "Ocean English & IT Center Nha Trang",
    role: "center_director",
    roleBadge: "Khối Đào tạo NN-TH",
    defaultAppId: "edu-center",
    assignedApps: ["edu-center", "lms-exam", "biz-web"],
    status: "active",
    lastLogin: "25 phút trước",
    ipAddress: "14.161.45.120",
    createdAt: "2026-10-03T09:15:00.000Z"
  },
  {
    id: "USR-NT-003",
    personaKey: "school-principal",
    fullName: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
    email: "bgh@saobienschool.edu.vn",
    phone: "0903.666.777",
    org: "Hệ thống Giáo dục Sao Biển Nha Trang",
    role: "school_principal",
    roleBadge: "Khối Cơ sở Giáo dục",
    defaultAppId: "edu-school",
    assignedApps: ["edu-school", "lms-exam"],
    status: "active",
    lastLogin: "1 giờ trước",
    ipAddress: "27.68.112.41",
    createdAt: "2026-10-04T10:00:00.000Z"
  },
  {
    id: "USR-NT-004",
    personaKey: "student-user",
    fullName: "Nguyễn Minh Khôi (Sinh viên Năm cuối)",
    email: "khoi.nm.64cntt@ntu.edu.vn",
    phone: "0399.888.111",
    org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821",
    role: "student_parent",
    roleBadge: "Cộng đồng Học viên / SV",
    defaultAppId: "lms-exam",
    assignedApps: ["lms-exam", "edu-school"],
    status: "active",
    lastLogin: "2 giờ trước",
    ipAddress: "171.244.19.72",
    createdAt: "2026-10-05T14:20:00.000Z"
  }
];

const INITIAL_FORUM_POSTS = [
  {
    id: "POST-101",
    category: "rfq",
    categoryLabel: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
    status: "approved",
    locked: false,
    pinned: true,
    title: "[Cần tìm đối tác tại Nha Trang] Tìm Trung tâm đào tạo Tiếng Anh & Tiếng Hàn giao tiếp cho 25 nhân sự Lễ tân - Nhà hàng",
    content:
      "Chào các anh/chị trong Cộng đồng TechCorp Khánh Hòa. Chuẩn bị đón đoàn khách quốc tế mùa cao điểm cuối năm, Nha Trang Bay Resort cần tìm 01 Trung tâm Ngoại ngữ uy tín trong hệ sinh thái để đào tạo cấp tốc 8 tuần (học kết hợp trên LMS Thi Online của TechCorp và thực hành tại khách sạn). Ưu tiên các trung tâm đang dùng hệ thống TechCorp để đồng bộ điểm chuyên cần trực tiếp về phân hệ HRM của chúng tôi.",
    memberDeal: "Ký hợp đồng đào tạo dài hạn 12 tháng + Tài trợ địa điểm tổ chức sự kiện cho Trung tâm tại Resort.",
    author: {
      name: "Nguyễn Hải Đăng (CEO Resort & Travel)",
      org: "Nha Trang Bay Resort & Travel",
      roleBadge: "Khối Doanh nghiệp SME",
      verifiedApp: "Đang dùng: ERP + Website TechCorp"
    },
    createdAt: "30 phút trước",
    likes: 18,
    views: 142,
    comments: [
      {
        id: "CMT-1",
        authorName: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
        authorOrg: "Ocean English & IT Center Nha Trang",
        roleBadge: "Khối Đào tạo NN-TH",
        text: "Chào anh! Bên em có sẵn khung chương trình Tiếng Anh & Hàn chuyên ngành Hospitality trên LMS TechCorp, giảm ngay 25% học phí cho doanh nghiệp cùng hệ sinh thái. Em vừa gửi báo giá qua Hub nhé ạ!",
        time: "15 phút trước"
      },
      {
        id: "CMT-2",
        authorName: "Trung tâm Ngoại ngữ Á Châu (Vĩnh Điềm Trung)",
        authorOrg: "Á Châu Language Center",
        roleBadge: "Khối Đào tạo NN-TH",
        text: "Bên mình có đội ngũ giáo viên bản xứ Hàn Quốc chuyên đào tạo cho các resort Bãi Dài - Cam Ranh và Trần Phú. Rất mong được kết nối hợp tác!",
        time: "8 phút trước"
      }
    ]
  },
  {
    id: "POST-102",
    category: "spotlight",
    categoryLabel: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)",
    status: "approved",
    locked: false,
    pinned: true,
    title: "[Tài trợ Học bổng & Kiểm tra Năng lực] Tặng 500 suất Thi thử IELTS/TOEIC & Tin học Quốc tế + Học bổng 40% cho con em Doanh nghiệp & Trường học",
    content:
      "Nhằm đồng hành cùng các Trường Mầm non - Phổ thông và gia đình cán bộ nhân viên các Doanh nghiệp SME tại Nha Trang, Ocean English & IT Center mở cổng kiểm tra năng lực Ngoại ngữ - Tin học định kỳ hoàn toàn miễn phí trên nền tảng Thi Online TechCorp. Toàn bộ kết quả được trả tự động về Sổ liên lạc điện tử của Phụ huynh.",
    memberDeal: "🎁 Đặc quyền bắt buộc (Give-to-Get): Giảm 40% học phí khóa đầu tiên + Tặng tài khoản luyện đề Online 6 tháng cho toàn bộ thành viên có TechCorp ID.",
    author: {
      name: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
      org: "Ocean English & IT Center Nha Trang",
      roleBadge: "Khối Đào tạo NN-TH",
      verifiedApp: "Đang dùng: QL Trung tâm + Thi Online"
    },
    createdAt: "2 giờ trước",
    likes: 34,
    views: 289,
    comments: [
      {
        id: "CMT-3",
        authorName: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
        authorOrg: "Hệ thống Giáo dục Sao Biển Nha Trang",
        roleBadge: "Khối Cơ sở Giáo dục",
        text: "Chương trình rất thiết thực! Trường Sao Biển đăng ký 120 suất kiểm tra tiếng Anh năng khiếu cuối tuần này cho các bé khối Lá và Tiểu học nhé.",
        time: "1 giờ trước"
      }
    ]
  },
  {
    id: "POST-103",
    category: "comarketing",
    categoryLabel: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
    status: "pending",
    locked: false,
    pinned: false,
    title: "[Chờ thẩm định] Mời 05 Doanh nghiệp Du lịch / F&B / Nha khoa tại Nha Trang đồng hành Ngày hội Gia đình & Tuyển sinh Mùa Hè (Quy mô 800 Phụ huynh)",
    content:
      "Tháng tới Hệ thống Giáo dục Sao Biển (KĐT Mỹ Gia & Vĩnh Điềm Trung) tổ chức Ngày hội Trải nghiệm Công nghệ & Kỹ năng cho 800 phụ huynh học sinh. Nhà trường dành tặng 05 gian hàng trưng bày miễn phí và tích hợp phát E-Voucher trên App Sổ liên lạc Điện tử cho các doanh nghiệp cùng thuộc Hệ sinh thái TechCorp.",
    memberDeal: "Miễn phí 100% gian hàng + Đẩy thông báo thương hiệu tài trợ tới 1.200 Phụ huynh trên App Trường.",
    author: {
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Sao Biển Nha Trang",
      roleBadge: "Khối Cơ sở Giáo dục",
      verifiedApp: "Đang dùng: QL Trường học + LMS"
    },
    createdAt: "4 giờ trước",
    likes: 12,
    views: 95,
    comments: []
  },
  {
    id: "POST-104",
    category: "knowledge",
    categoryLabel: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
    status: "approved",
    locked: true,
    pinned: false,
    title: "[Chủ đề đã chốt quy trình] Kinh nghiệm tự động hóa 95% quy trình thu học phí QR & chấm công giáo viên tại Nha Trang bằng hệ sinh thái TechCorp",
    content:
      "Trước đây mỗi đầu tháng bộ phận kế toán của trường mất gần 5 ngày để đối soát tin nhắn chuyển khoản học phí của phụ huynh. Từ khi bật tính năng gạch nợ tự động qua QR động trên phần mềm Quản lý Trường học và đồng bộ sang phân hệ Tài chính ERP của TechCorp, phụ huynh quét mã 3 giây là biên lai điện tử xuất tự động, kế toán giảm được 80% khối lượng việc thủ công.",
    memberDeal: "Chia sẻ miễn phí bộ quy trình & biểu mẫu thiết lập thu học phí không tiền mặt cho các trường tại Khánh Hòa.",
    author: {
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Sao Biển Nha Trang",
      roleBadge: "Khối Cơ sở Giáo dục",
      verifiedApp: "Đang dùng: QL Trường học + LMS"
    },
    createdAt: "1 ngày trước",
    likes: 41,
    views: 310,
    comments: []
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-10004",
    timestamp: "2026-10-20 11:35:10",
    actorId: "USR-ADMIN-00",
    actorName: "Quản trị viên Hệ sinh thái TechCorp",
    actorOrg: "TechCorp Headquarters",
    ipAddress: "103.170.122.138",
    action: "FORUM_MODERATE_APPROVE",
    target: "Bài viết POST-102 (Ocean English Center)",
    severity: "INFO",
    details: "Thẩm định đạt chuẩn Give-to-Get (Có ưu đãi học bổng 40% cho thành viên) và cho phép hiển thị công khai."
  },
  {
    id: "AUD-10003",
    timestamp: "2026-10-20 11:20:05",
    actorId: "USR-ADMIN-00",
    actorName: "Quản trị viên Hệ sinh thái TechCorp",
    actorOrg: "TechCorp Headquarters",
    ipAddress: "103.170.122.138",
    action: "FORUM_LOCK_TOPIC",
    target: "Bài viết POST-104 (Quy trình thu học phí QR)",
    severity: "WARNING",
    details: "Đã khóa bình luận (Lock) chủ đề hướng dẫn sau khi chốt tài liệu chuẩn để tránh trôi bài."
  },
  {
    id: "AUD-10002",
    timestamp: "2026-10-20 10:50:42",
    actorId: "USR-NT-001",
    actorName: "Nguyễn Hải Đăng (CEO Resort & Travel)",
    actorOrg: "Nha Trang Bay Resort & Travel",
    ipAddress: "113.160.214.88",
    action: "HRM_CANDIDATE_IMPORT",
    target: "Ứng viên NT-01 (Trần Ngọc Bảo Trâm - IELTS 7.0)",
    severity: "INFO",
    details: "Đồng bộ 1-Click Hồ sơ Năng lực Số từ Nền tảng Thi Online vào phân hệ HRM trên ERP."
  },
  {
    id: "AUD-10001",
    timestamp: "2026-10-20 09:15:00",
    actorId: "USR-ADMIN-00",
    actorName: "Quản trị viên Hệ sinh thái TechCorp",
    actorOrg: "TechCorp Headquarters",
    ipAddress: "103.170.122.138",
    action: "SYSTEM_BOOTSTRAP",
    target: "Cơ sở dữ liệu Tập trung (SQLite + JSON)",
    severity: "INFO",
    details: "Khởi tạo 5 ứng dụng lõi và kích hoạt dịch vụ xác thực tập trung TechCorp ID (SSO JWT)."
  }
];

const INITIAL_SEED = {
  meta: {
    domain: "hesinhthai.techcorp.info.vn",
    version: "2.0.0",
    region: "Nha Trang - Khánh Hòa",
    updatedAt: new Date().toISOString()
  },
  apps: [
    {
      id: "edu-school",
      name: "QL Trường học (Mầm non - ĐH)",
      badge: "EdTech",
      category: "education",
      color: "#0ea5e9",
      appUrl: "https://truonghoc.techcorp.info.vn",
      webhookUrl: "https://truonghoc.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Học vụ, Sổ liên lạc điện tử, Thu học phí QR",
      apiKey: "tc_live_eduschool_9a8b7c6d5e4f3a2b1c",
      status: "active",
      scopes: ["sso:login", "talent:export", "parent:voucher", "b2b:request"],
      createdAt: "2026-10-01T08:00:00.000Z"
    },
    {
      id: "edu-center",
      name: "QL Trung tâm Ngoại ngữ - Tin học",
      badge: "EdTech",
      category: "training_center",
      color: "#8b5cf6",
      appUrl: "https://trungtam.techcorp.info.vn",
      webhookUrl: "https://trungtam.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "CRM Tuyển sinh, Lớp học, Học viên, Học phí",
      apiKey: "tc_live_educenter_1f2e3d4c5b6a798877",
      status: "active",
      scopes: ["sso:login", "lead:receive", "talent:export", "contest:cohost"],
      createdAt: "2026-10-01T08:05:00.000Z"
    },
    {
      id: "lms-exam",
      name: "Học & Thi Online (LMS)",
      badge: "Core Funnel",
      category: "lms_testing",
      color: "#10b981",
      appUrl: "https://thionline.techcorp.info.vn",
      webhookUrl: "https://thionline.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phòng thi trực tuyến, Cấp chứng chỉ số QR, Ngân hàng đề",
      apiKey: "tc_live_lmsexam_5566778899aabbccdd",
      status: "active",
      scopes: ["sso:login", "cert:issue", "lead:export", "talent:verify"],
      createdAt: "2026-10-01T08:10:00.000Z"
    },
    {
      id: "biz-web",
      name: "Website Doanh nghiệp Số",
      badge: "BizTech",
      category: "corporate_web",
      color: "#f59e0b",
      appUrl: "https://web.techcorp.info.vn",
      webhookUrl: "https://web.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Thương hiệu số, SEO đa ngôn ngữ, Cổng tuyển dụng nhúng",
      apiKey: "tc_live_bizweb_998877665544332211",
      status: "active",
      scopes: ["sso:login", "job:embed", "voucher:publish", "b2b:listing"],
      createdAt: "2026-10-01T08:15:00.000Z"
    },
    {
      id: "biz-erp",
      name: "Quản trị Doanh nghiệp (ERP)",
      badge: "BizTech",
      category: "enterprise_erp",
      color: "#ef4444",
      appUrl: "https://erp.techcorp.info.vn",
      webhookUrl: "https://erp.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "HRM Nhân sự, CRM Khách hàng, Tài chính, Kho vận, Công việc",
      apiKey: "tc_live_bizerp_112233445566778899",
      status: "active",
      scopes: ["sso:login", "hrm:import_candidate", "job:publish", "crm:voucher", "b2b:order"],
      createdAt: "2026-10-01T08:20:00.000Z"
    }
  ],
  users: INITIAL_USERS,
  personas: {
    "super-admin": {
      id: "super-admin",
      userId: "USR-ADMIN-00",
      name: "Quản trị viên Hệ sinh thái TechCorp",
      org: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
      roleBadge: "🛡️ Super Admin TechCorp",
      defaultAppId: "biz-erp"
    },
    "ceo-sme": {
      id: "ceo-sme",
      userId: "USR-NT-001",
      name: "Nguyễn Hải Đăng (CEO Resort & Travel)",
      org: "Nha Trang Bay Resort & Travel (Đang dùng: ERP + Website)",
      roleBadge: "Khối Doanh nghiệp SME",
      defaultAppId: "biz-erp"
    },
    "center-dir": {
      id: "center-dir",
      userId: "USR-NT-002",
      name: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
      org: "Ocean English & IT Center Nha Trang (Đang dùng: QL Trung tâm + Thi Online)",
      roleBadge: "Khối Đào tạo NN-TH",
      defaultAppId: "edu-center"
    },
    "school-principal": {
      id: "school-principal",
      userId: "USR-NT-003",
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Sao Biển Nha Trang (Đang dùng: QL Trường học + LMS)",
      roleBadge: "Khối Cơ sở Giáo dục",
      defaultAppId: "edu-school"
    },
    "student-user": {
      id: "student-user",
      userId: "USR-NT-004",
      name: "Nguyễn Minh Khôi (Sinh viên Năm cuối)",
      org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821",
      roleBadge: "Cộng đồng Học viên / SV",
      defaultAppId: "lms-exam"
    }
  },
  talents: [
    {
      id: "NT-01",
      name: "Trần Ngọc Bảo Trâm",
      school: "Đại học Nha Trang (Ngành Quản trị Dịch vụ Du lịch & Lữ hành)",
      center: "Ocean English Center Nha Trang",
      certs: ["IELTS 7.0 (Xác thực Thi Online)", "Tin học MOS Specialist", "Tiếng Trung HSK3"],
      domain: "tourism",
      targetRole: "Lễ tân Khách sạn Quốc tế / Điều hành Tour",
      gpa: "3.6/4.0",
      status: "Sẵn sàng nhận việc / Thực tập Full-time",
      syncedToErpCount: 2
    },
    {
      id: "NT-02",
      name: "Lê Hoàng Phúc",
      school: "Đại học Khánh Hòa (Ngành Công nghệ Thông tin)",
      center: "Trung tâm Tin học & Ngoại ngữ TechSkills Nha Trang",
      certs: ["Fullstack Web", "TOEIC 750 (Xác thực Thi Online)", "Quản trị Hệ thống ERP"],
      domain: "it",
      targetRole: "Chuyên viên IT vận hành ERP / Web Developer",
      gpa: "3.5/4.0",
      status: "Sẵn sàng thực tập / Làm việc",
      syncedToErpCount: 4
    },
    {
      id: "NT-03",
      name: "Phạm Thị Thanh Thảo",
      school: "Cao đẳng Du lịch Nha Trang",
      center: "Trung tâm Ngoại ngữ Hàn - Nhật - Anh Á Châu (Vĩnh Điềm Trung)",
      certs: ["Tiếng Hàn TOPIK II", "Tiếng Anh Giao tiếp Nhà hàng - Khách sạn", "Nghiệp vụ F&B"],
      domain: "tourism",
      targetRole: "Chăm sóc Khách hàng Hàn Quốc / Quản lý Ca F&B",
      gpa: "3.7/4.0",
      status: "Sẵn sàng nhận việc ngay",
      syncedToErpCount: 3
    },
    {
      id: "NT-04",
      name: "Võ Quốc Tuấn",
      school: "Đại học Thái Bình Dương (Ngành Kế toán - Tài chính)",
      center: "Trung tâm Tin học Kế toán Thực hành Nha Trang",
      certs: ["Kế toán Tổng hợp trên TechCorp ERP", "Excel Nâng cao (92/100 điểm Thi Online)", "TOEIC 650"],
      domain: "finance",
      targetRole: "Kế toán Nội bộ / Kiểm soát Chi phí Doanh nghiệp",
      gpa: "3.4/4.0",
      status: "Sẵn sàng nhận việc",
      syncedToErpCount: 1
    }
  ],
  contests: [
    {
      id: "EX-01",
      title: "Đấu trường Thử sức IELTS & TOEIC Trực tuyến Khánh Hòa 2026",
      organizer: "Liên minh 10 Trung tâm Ngoại ngữ Nha Trang × TechCorp LMS",
      participants: 1420,
      leadsGenerated: 385,
      targetGroup: "Học sinh THPT, Sinh viên ĐH Nha Trang, ĐH Khánh Hòa, CĐ Du lịch",
      reward: "Cấp Chứng chỉ Năng lực Số + Học bổng 50% từ các Trung tâm hạt nhân"
    },
    {
      id: "EX-02",
      title: "Kiểm tra Năng lực Tư duy & Tiếng Anh Thiếu nhi (Khối Mầm non - Tiểu học)",
      organizer: "15 Trường Mầm non Tư thục KĐT Mỹ Gia / Vĩnh Điềm Trung × Trung tâm Anh ngữ",
      participants: 890,
      leadsGenerated: 240,
      targetGroup: "Phụ huynh sử dụng Sổ liên lạc Điện tử TechCorp tại Nha Trang",
      reward: "Tặng Voucher 1.000.000đ khóa hè & Vé khu vui chơi tại Nha Trang"
    },
    {
      id: "EX-03",
      title: "Sát hạch Nghiệp vụ Tin học Văn phòng & Quản trị Số trên ERP",
      organizer: "TechCorp Academy × Hội Doanh nhân Trẻ Khánh Hòa",
      participants: 610,
      leadsGenerated: 195,
      targetGroup: "Sinh viên năm cuối & Nhân sự văn phòng tại Nha Trang - Cam Ranh",
      reward: "Tuyển thẳng vào 30 Doanh nghiệp SME trong Hệ sinh thái TechCorp"
    }
  ],
  b2bOffers: [
    {
      id: "B2B-01",
      company: "Công ty CP Thực phẩm & Suất ăn Học đường Biển Xanh Nha Trang",
      usingTech: "ERP Kho vận + Website TechCorp",
      category: "Cung ứng Trường học",
      offer: "Giảm 12% hợp đồng suất ăn bán trú chuẩn VietGAP cho 15 Trường Mầm non & Tiểu học thuộc Hệ sinh thái TechCorp.",
      target: "Trường Mầm non & Phổ thông tại Nha Trang"
    },
    {
      id: "B2B-02",
      company: "Nha Trang Bay Resort & Travel",
      usingTech: "ERP HRM/CRM + Website Đa ngôn ngữ",
      category: "Du lịch & Sự kiện",
      offer: "Ưu đãi 25% gói Tour Dã ngoại Học sinh / Teambuilding Doanh nghiệp & Tặng E-Voucher nghỉ dưỡng cho Phụ huynh.",
      target: "Trường học, Trung tâm NN-TH & Cộng đồng Phụ huynh"
    },
    {
      id: "B2B-03",
      company: "Hệ thống Nha khoa & Phòng khám Quốc tế Sài Gòn - Nha Trang",
      usingTech: "CRM Chăm sóc khách hàng TechCorp",
      category: "Y tế & Phúc lợi",
      offer: "Khám răng định kỳ miễn phí tại trường cho học sinh Mầm non + Giảm 30% cho Nhân viên các Doanh nghiệp dùng ERP TechCorp.",
      target: "Toàn bộ Thành viên TechCorp ID tại Khánh Hòa"
    },
    {
      id: "B2B-04",
      company: "Ngân hàng Đối tác Liên kết TechCorp Khánh Hòa",
      usingTech: "API Thu hộ Học phí & Chi lương ERP",
      category: "Tài chính - Thanh toán",
      offer: "Miễn phí 100% phí gạch nợ học phí tự động QR Code cho Trường/Trung tâm & Trả góp học phí 0% lãi suất cho Phụ huynh.",
      target: "Trường học, Trung tâm NN-TH & Phụ huynh"
    }
  ],
  forumPosts: INITIAL_FORUM_POSTS,
  auditLogs: INITIAL_AUDIT_LOGS,
  lighthouseTargets: [
    {
      segment: "1. Trường Đại học / Cao đẳng (Nha Trang)",
      targetCount: 2,
      currentSigned: 1,
      inPipeline: 2,
      focusArea: "Vĩnh Hải, Vĩnh Hòa, Trung tâm Nha Trang",
      comboPackage: "Cổng Thực tập & Việc làm Số + Thi Trắc nghiệm Online",
      notes: "Đã kết nối Trung tâm Hỗ trợ SV; đang chuẩn bị ký MOU đợt 1"
    },
    {
      segment: "2. Trung tâm Ngoại ngữ - Tin học",
      targetCount: 10,
      currentSigned: 4,
      inPipeline: 5,
      focusArea: "KĐT Vĩnh Điềm Trung, Lê Hồng Phong, Phước Hải, Bắc Nha Trang",
      comboPackage: "Gói Tăng tốc Tuyển sinh (QL Trung tâm + LMS Thi Online + Web)",
      notes: "Rất hào hứng với chương trình đồng tổ chức Thi thử IELTS/TOEIC toàn tỉnh"
    },
    {
      segment: "3. Trường Mầm non & Phổ thông Tư thục",
      targetCount: 15,
      currentSigned: 6,
      inPipeline: 7,
      focusArea: "KĐT Mỹ Gia, Hà Quang II, Vĩnh Điềm Trung, Bình Tân",
      comboPackage: "Gói Mầm non Số (15.000đ/trẻ/tháng + Sổ liên lạc + Thu học phí QR)",
      notes: "Chốt nhanh nhờ miễn phí khởi tạo và có nhân sự hỗ trợ tận nơi tại Nha Trang"
    },
    {
      segment: "4. Doanh nghiệp SME (Du lịch, F&B, Thương mại)",
      targetCount: 30,
      currentSigned: 11,
      inPipeline: 14,
      focusArea: "Trần Phú, Nguyễn Thị Minh Khai, Đắc Lộc, Bình Tân",
      comboPackage: "Gói Bệ phóng SME (Tặng Website + Micro-ERP CRM/HRM + Tuyển dụng)",
      notes: "Thu hút mạnh nhờ đặc quyền tuyển thực tập sinh ngoại ngữ/tin học đã xác thực"
    }
  ],
  activityLogs: [
    {
      id: "EVT-1004",
      time: "Vừa xong",
      sourceApp: "biz-erp",
      targetApp: "edu-school",
      eventType: "ERP_JOB_POSTED",
      text: "[ERP -> Trường ĐH/TT] Nha Trang Bay Resort vừa đẩy 05 chỉ tiêu tuyển Lễ tân tiếng Anh/Hàn từ phân hệ HRM lên Cổng Việc làm Sinh viên."
    },
    {
      id: "EVT-1003",
      time: "5 phút trước",
      sourceApp: "lms-exam",
      targetApp: "edu-center",
      eventType: "EXAM_CERT_ISSUED",
      text: "[Thi Online -> Talent Passport] Học viên Trần Ngọc Bảo Trâm vừa hoàn thành bài thi IELTS Mock Test đạt 7.0 tại Ocean English Center."
    },
    {
      id: "EVT-1002",
      time: "18 phút trước",
      sourceApp: "edu-school",
      targetApp: "edu-center",
      eventType: "CROSS_SCHOLARSHIP_SENT",
      text: "[Mầm non -> Trung tâm NN] 32 Phụ huynh tại Trường Mầm non Sao Biển (KĐT Mỹ Gia) đã nhận học bổng kiểm tra tiếng Anh thiếu nhi miễn phí."
    },
    {
      id: "EVT-1001",
      time: "40 phút trước",
      sourceApp: "edu-school",
      targetApp: "biz-erp",
      eventType: "B2B_QUOTE_REQUEST",
      text: "[B2B Matching] Trường Tiểu học Tư thục tại Vĩnh Điềm Trung vừa gửi yêu cầu báo giá Suất ăn học đường tới DN thực phẩm trong hệ sinh thái."
    }
  ]
};

// Optional SQLite Mirroring (for Node 22.5+ / Node 24+)
let sqliteDb = null;
try {
  const { DatabaseSync } = require("node:sqlite");
  sqliteDb = new DatabaseSync(SQLITE_DB_PATH);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS registered_apps (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      badge TEXT,
      category TEXT,
      color TEXT,
      app_url TEXT,
      webhook_url TEXT,
      api_key TEXT,
      status TEXT,
      created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      actor_id TEXT,
      actor_name TEXT,
      ip_address TEXT,
      action TEXT NOT NULL,
      target TEXT,
      severity TEXT,
      details TEXT
    );
  `);
} catch (_) {
  sqliteDb = null;
}

class HubDatabase {
  constructor() {
    this.state = null;
    this.load();
  }

  load() {
    if (fs.existsSync(JSON_DB_PATH)) {
      try {
        const raw = fs.readFileSync(JSON_DB_PATH, "utf8");
        this.state = JSON.parse(raw);
        let needsSave = false;
        if (!Array.isArray(this.state.forumPosts) || this.state.forumPosts.length === 0) {
          this.state.forumPosts = JSON.parse(JSON.stringify(INITIAL_FORUM_POSTS));
          needsSave = true;
        } else {
          this.state.forumPosts.forEach((p) => {
            if (!p.status) {
              p.status = "approved";
              needsSave = true;
            }
            if (typeof p.locked !== "boolean") {
              p.locked = false;
              needsSave = true;
            }
          });
        }
        if (!Array.isArray(this.state.users) || this.state.users.length === 0) {
          this.state.users = JSON.parse(JSON.stringify(INITIAL_USERS));
          needsSave = true;
        }
        if (!Array.isArray(this.state.auditLogs) || this.state.auditLogs.length === 0) {
          this.state.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
          needsSave = true;
        }
        if (!this.state.personas["super-admin"]) {
          this.state.personas["super-admin"] = INITIAL_SEED.personas["super-admin"];
          needsSave = true;
        }
        if (needsSave) this.save();
      } catch (e) {
        this.state = JSON.parse(JSON.stringify(INITIAL_SEED));
        this.save();
      }
    } else {
      this.state = JSON.parse(JSON.stringify(INITIAL_SEED));
      this.save();
    }
    this.syncToSqlite();
  }

  save() {
    this.state.meta.updatedAt = new Date().toISOString();
    const tmpPath = `${JSON_DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(this.state, null, 2), "utf8");
    fs.renameSync(tmpPath, JSON_DB_PATH);
    this.syncToSqlite();
  }

  syncToSqlite() {
    if (!sqliteDb) return;
    try {
      const now = new Date().toISOString();
      const upsertKv = sqliteDb.prepare(
        `INSERT INTO kv_store (key, value, updated_at) VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      );
      upsertKv.run("hub_full_state", JSON.stringify(this.state), now);
    } catch (_) {}
  }

  // ==================== AUDIT LOGGING ====================
  addAuditLog({
    actorKey = "super-admin",
    ipAddress = "103.170.122.138",
    action = "SYSTEM_ACTION",
    target = "System",
    severity = "INFO",
    details = ""
  }) {
    const persona =
      this.state.personas[actorKey] ||
      this.state.users.find((u) => u.id === actorKey || u.personaKey === actorKey) ||
      this.state.personas["super-admin"];

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const entry = {
      id: "AUD-" + Date.now() + "-" + Math.floor(Math.random() * 90 + 10),
      timestamp,
      actorId: persona.userId || persona.id || "USR-ADMIN-00",
      actorName: persona.name || persona.fullName || "Quản trị viên TechCorp",
      actorOrg: persona.org || "TechCorp Hub",
      ipAddress,
      action,
      target,
      severity,
      details
    };

    this.state.auditLogs.unshift(entry);
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    this.save();
    return entry;
  }

  // ==================== APP REGISTRY CRUD ====================
  getPublicApps() {
    return this.state.apps.map(({ apiKey, ...rest }) => ({
      ...rest,
      apiKeyMasked: apiKey ? `${apiKey.slice(0, 12)}...${apiKey.slice(-4)}` : ""
    }));
  }

  registerApp(payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const cleanId = (payload.id || payload.name || "app-" + Date.now())
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const existing = this.state.apps.find((a) => a.id === cleanId);
    if (existing) {
      throw new Error(`Mã ứng dụng '${cleanId}' đã tồn tại trong hệ sinh thái.`);
    }

    const newApp = {
      id: cleanId,
      name: payload.name || cleanId,
      badge: payload.badge || "New App",
      category: payload.category || "custom",
      color: payload.color || "#0ea5e9",
      appUrl: payload.appUrl || `https://${cleanId}.techcorp.info.vn`,
      webhookUrl: payload.webhookUrl || `https://${cleanId}.techcorp.info.vn/api/webhooks/techcorp-hub`,
      desc: payload.desc || "Ứng dụng tích hợp vào Hệ sinh thái TechCorp",
      apiKey: generateApiKey("tc_live"),
      status: payload.status || "active",
      scopes:
        Array.isArray(payload.scopes) && payload.scopes.length
          ? payload.scopes
          : ["sso:login", "events:publish", "events:subscribe"],
      createdAt: new Date().toISOString()
    };

    this.state.apps.push(newApp);
    this.addEvent({
      sourceApp: newApp.id,
      targetApp: "techcorp-hub",
      eventType: "APP_REGISTERED",
      text: `[App Registry] Ứng dụng mới "${newApp.name}" (${newApp.id}) vừa được tích hợp vào Hệ sinh thái TechCorp (${newApp.appUrl}).`
    });
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "APP_CREATE",
      target: `${newApp.name} (${newApp.id})`,
      severity: "INFO",
      details: `Tích hợp ứng dụng mới vào hệ sinh thái với URL: ${newApp.appUrl} (Trạng thái: ${newApp.status}).`
    });
    return newApp;
  }

  updateApp(appId, payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const app = this.state.apps.find((a) => a.id === appId);
    if (!app) {
      throw new Error(`Không tìm thấy ứng dụng có mã '${appId}'.`);
    }

    const oldStatus = app.status;
    if (payload.name !== undefined) app.name = payload.name.trim() || app.name;
    if (payload.badge !== undefined) app.badge = payload.badge.trim() || app.badge;
    if (payload.appUrl !== undefined) app.appUrl = payload.appUrl.trim() || app.appUrl;
    if (payload.webhookUrl !== undefined) app.webhookUrl = payload.webhookUrl.trim();
    if (payload.desc !== undefined) app.desc = payload.desc.trim();
    if (payload.status !== undefined) app.status = payload.status;
    if (payload.regenerateApiKey) {
      app.apiKey = generateApiKey("tc_live");
    }

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: payload.regenerateApiKey ? "APP_ROTATE_KEY" : "APP_UPDATE",
      target: `${app.name} (${app.id})`,
      severity: app.status !== "active" ? "WARNING" : "INFO",
      details: `Cập nhật cấu hình ứng dụng ${app.id}. Trạng thái: ${oldStatus} -> ${app.status}.${
        payload.regenerateApiKey ? " Đã cấp lại API Key mới." : ""
      }`
    });
    this.save();
    return app;
  }

  deleteApp(appId, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const idx = this.state.apps.findIndex((a) => a.id === appId);
    if (idx === -1) {
      throw new Error(`Không tìm thấy ứng dụng '${appId}' để xoá.`);
    }
    const removed = this.state.apps.splice(idx, 1)[0];
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "APP_DELETE",
      target: `${removed.name} (${removed.id})`,
      severity: "CRITICAL",
      details: `Đã xoá ứng dụng "${removed.name}" (${removed.appUrl}) khỏi Hệ sinh thái TechCorp.`
    });
    this.save();
    return removed;
  }

  // ==================== FORUM MODERATION & CRUD ====================
  createForumPost(payload, personaKey = "ceo-sme", ipAddress = "103.170.122.138") {
    const persona = this.state.personas[personaKey] || this.state.personas["ceo-sme"];
    const cat = payload.category || "rfq";
    const title = (payload.title || "").trim();
    const content = (payload.content || "").trim();
    const memberDeal = (payload.memberDeal || "").trim();

    if (!title || !content) {
      throw new Error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài đăng.");
    }

    if ((cat === "spotlight" || cat === "comarketing") && !memberDeal) {
      throw new Error(
        'Theo quy tắc "Give-to-Get" chống spam của TechCorp, bài Quảng bá / Hợp tác bắt buộc phải đi kèm ít nhất 01 Ưu đãi hoặc Quyền lợi dành riêng cho thành viên hệ sinh thái!'
      );
    }

    const nowStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const isAdmin = personaKey === "super-admin" || Boolean(payload.autoApprove);

    const newPost = {
      id: "POST-" + Date.now(),
      category: cat,
      categoryLabel: CATEGORY_MAP[cat] || CATEGORY_MAP.rfq,
      status: payload.status || (isAdmin ? "approved" : "approved"),
      locked: Boolean(payload.locked),
      pinned: Boolean(payload.pinned),
      title,
      content,
      memberDeal:
        memberDeal ||
        "Hỗ trợ kết nối trực tiếp và ưu tiên hợp tác cho các đơn vị có TechCorp ID tại Khánh Hòa.",
      author: {
        name: persona.name,
        org: persona.org,
        roleBadge: persona.roleBadge,
        verifiedApp: `Xác thực SSO • ${persona.defaultAppId}`
      },
      createdAt: `Hôm nay, ${nowStr}`,
      likes: 1,
      views: 1,
      comments: []
    };

    this.state.forumPosts.unshift(newPost);
    this.state.forumPosts.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

    this.addEvent({
      sourceApp: persona.defaultAppId || "techcorp-hub",
      targetApp: "all",
      eventType: "FORUM_POST_PUBLISHED",
      text: `[Diễn đàn Cộng đồng] ${persona.name} vừa đăng bài mới: "${title}"`
    });

    this.addAuditLog({
      actorKey: personaKey,
      ipAddress,
      action: "FORUM_CREATE",
      target: `${newPost.id}: ${title}`,
      severity: "INFO",
      details: `Đăng bài viết mới vào chuyên mục [${cat}] (Trạng thái: ${newPost.status}, Ghim: ${newPost.pinned}).`
    });

    return newPost;
  }

  moderateForumPost(postId, payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const post = this.state.forumPosts.find((p) => p.id === postId);
    if (!post) {
      throw new Error("Không tìm thấy bài viết trên diễn đàn.");
    }

    const changes = [];
    if (payload.status !== undefined && payload.status !== post.status) {
      changes.push(`Trạng thái thẩm định: ${post.status} -> ${payload.status}`);
      post.status = payload.status;
    }
    if (payload.locked !== undefined && Boolean(payload.locked) !== Boolean(post.locked)) {
      changes.push(`Khóa chủ đề (Lock): ${post.locked} -> ${Boolean(payload.locked)}`);
      post.locked = Boolean(payload.locked);
    }
    if (payload.pinned !== undefined && Boolean(payload.pinned) !== Boolean(post.pinned)) {
      changes.push(`Ghim VIP: ${post.pinned} -> ${Boolean(payload.pinned)}`);
      post.pinned = Boolean(payload.pinned);
    }
    if (payload.title !== undefined && payload.title.trim()) {
      post.title = payload.title.trim();
      changes.push("Cập nhật tiêu đề");
    }
    if (payload.content !== undefined && payload.content.trim()) {
      post.content = payload.content.trim();
      changes.push("Cập nhật nội dung");
    }
    if (payload.memberDeal !== undefined) {
      post.memberDeal = payload.memberDeal.trim();
    }

    this.state.forumPosts.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: payload.locked !== undefined ? "FORUM_LOCK_TOGGLE" : "FORUM_MODERATE",
      target: `${post.id}: ${post.title}`,
      severity: post.status === "rejected" || post.locked ? "WARNING" : "INFO",
      details: changes.join(" | ") || "Cập nhật thông tin bài viết diễn đàn."
    });

    this.save();
    return post;
  }

  deleteForumPost(postId, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const idx = this.state.forumPosts.findIndex((p) => p.id === postId);
    if (idx === -1) {
      throw new Error("Không tìm thấy bài viết để xoá.");
    }
    const removed = this.state.forumPosts.splice(idx, 1)[0];
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "FORUM_DELETE",
      target: `${removed.id}: ${removed.title}`,
      severity: "CRITICAL",
      details: `Đã xoá bài viết của "${removed.author?.name}" khỏi Diễn đàn Cộng đồng.`
    });
    this.save();
    return removed;
  }

  addForumComment(postId, commentText, personaKey = "ceo-sme", ipAddress = "103.170.122.138") {
    const post = this.state.forumPosts.find((p) => p.id === postId);
    if (!post) {
      throw new Error("Không tìm thấy bài viết trên diễn đàn.");
    }
    if (post.locked) {
      throw new Error("Chủ đề này đã bị Quản trị viên khóa bình luận (Locked)!");
    }
    const text = (commentText || "").trim();
    if (!text) {
      throw new Error("Vui lòng nhập nội dung phản hồi / chào giá.");
    }
    const persona = this.state.personas[personaKey] || this.state.personas["ceo-sme"];
    const nowStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const cmt = {
      id: "CMT-" + Date.now(),
      authorName: persona.name,
      authorOrg: persona.org,
      roleBadge: persona.roleBadge,
      text,
      time: `Hôm nay, ${nowStr}`
    };

    post.comments.push(cmt);
    post.views = (post.views || 1) + 3;

    this.addEvent({
      sourceApp: persona.defaultAppId || "techcorp-hub",
      targetApp: "all",
      eventType: "FORUM_REPLY_POSTED",
      text: `[Phản hồi Diễn đàn] ${persona.name} vừa gửi phản hồi/báo giá tại bài viết "${post.title}".`
    });

    this.addAuditLog({
      actorKey: personaKey,
      ipAddress,
      action: "FORUM_COMMENT",
      target: `${post.id}: ${post.title}`,
      severity: "INFO",
      details: `Gửi bình luận xác thực: "${text.slice(0, 80)}"`
    });

    return post;
  }

  likeForumPost(postId) {
    const post = this.state.forumPosts.find((p) => p.id === postId);
    if (!post) {
      throw new Error("Không tìm thấy bài viết.");
    }
    post.likes = (post.likes || 0) + 1;
    post.views = (post.views || 0) + 2;
    this.save();
    return post;
  }

  // ==================== USER MANAGEMENT CRUD (TECHCORP ID) ====================
  syncUserToPersonas(user) {
    const key = user.personaKey || user.id.toLowerCase();
    user.personaKey = key;
    if (user.status === "active") {
      this.state.personas[key] = {
        id: key,
        userId: user.id,
        name: user.fullName,
        org: `${user.org}`,
        roleBadge: user.roleBadge || "SSO Member",
        defaultAppId: user.defaultAppId || "biz-erp"
      };
    } else {
      delete this.state.personas[key];
    }
  }

  createUser(payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const fullName = (payload.fullName || "").trim();
    const email = (payload.email || "").trim();
    const org = (payload.org || "").trim();

    if (!fullName || !email || !org) {
      throw new Error("Vui lòng nhập đầy đủ Họ tên, Email và Đơn vị/Tổ chức.");
    }

    const exists = this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error(`Email '${email}' đã tồn tại trên hệ thống TechCorp ID.`);
    }

    const ROLE_BADGES = {
      super_admin: "🛡️ Super Admin TechCorp",
      ceo_sme: "Khối Doanh nghiệp SME",
      center_director: "Khối Đào tạo NN-TH",
      school_principal: "Khối Cơ sở Giáo dục",
      hr_manager: "Quản trị Nhân sự (HR)",
      student_parent: "Cộng đồng Học viên / SV"
    };

    const role = payload.role || "ceo_sme";
    const newId = payload.id || "USR-NT-" + Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: newId,
      personaKey: newId.toLowerCase(),
      fullName,
      email,
      phone: (payload.phone || "0905.000.000").trim(),
      org,
      role,
      roleBadge: payload.roleBadge || ROLE_BADGES[role] || "SSO Member",
      defaultAppId: payload.defaultAppId || "biz-erp",
      assignedApps:
        Array.isArray(payload.assignedApps) && payload.assignedApps.length
          ? payload.assignedApps
          : ["biz-erp", "lms-exam"],
      status: payload.status || "active",
      lastLogin: "Chưa đăng nhập",
      ipAddress: ipAddress,
      createdAt: new Date().toISOString()
    };

    this.state.users.unshift(newUser);
    this.syncUserToPersonas(newUser);

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "USER_CREATE",
      target: `${newUser.fullName} (${newUser.id} - ${newUser.email})`,
      severity: "INFO",
      details: `Tạo mới tài khoản TechCorp ID thuộc đơn vị "${newUser.org}" với vai trò [${newUser.roleBadge}].`
    });

    this.save();
    return newUser;
  }

  updateUser(userId, payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error(`Không tìm thấy tài khoản '${userId}'.`);
    }

    const ROLE_BADGES = {
      super_admin: "🛡️ Super Admin TechCorp",
      ceo_sme: "Khối Doanh nghiệp SME",
      center_director: "Khối Đào tạo NN-TH",
      school_principal: "Khối Cơ sở Giáo dục",
      hr_manager: "Quản trị Nhân sự (HR)",
      student_parent: "Cộng đồng Học viên / SV"
    };

    const changes = [];
    if (payload.fullName !== undefined && payload.fullName.trim()) {
      changes.push(`Họ tên: ${user.fullName} -> ${payload.fullName.trim()}`);
      user.fullName = payload.fullName.trim();
    }
    if (payload.email !== undefined && payload.email.trim()) {
      changes.push(`Email: ${user.email} -> ${payload.email.trim()}`);
      user.email = payload.email.trim();
    }
    if (payload.phone !== undefined) {
      user.phone = payload.phone.trim();
    }
    if (payload.org !== undefined && payload.org.trim()) {
      changes.push(`Đơn vị: ${user.org} -> ${payload.org.trim()}`);
      user.org = payload.org.trim();
    }
    if (payload.role !== undefined && payload.role !== user.role) {
      changes.push(`Vai trò: ${user.role} -> ${payload.role}`);
      user.role = payload.role;
      user.roleBadge = ROLE_BADGES[payload.role] || user.roleBadge;
    }
    if (payload.status !== undefined && payload.status !== user.status) {
      changes.push(`Trạng thái: ${user.status} -> ${payload.status}`);
      user.status = payload.status;
    }
    if (Array.isArray(payload.assignedApps)) {
      user.assignedApps = payload.assignedApps;
      changes.push(`Cập nhật quyền truy cập ứng dụng (${payload.assignedApps.join(", ")})`);
    }

    this.syncUserToPersonas(user);

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: payload.status === "locked" ? "USER_LOCK" : "USER_UPDATE",
      target: `${user.fullName} (${user.id})`,
      severity: user.status === "locked" ? "WARNING" : "INFO",
      details: changes.join(" | ") || "Cập nhật thông tin tài khoản người dùng."
    });

    this.save();
    return user;
  }

  deleteUser(userId, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    if (userId === "USR-ADMIN-00") {
      throw new Error("Không thể xoá tài khoản Super Admin gốc của hệ thống!");
    }
    const idx = this.state.users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      throw new Error(`Không tìm thấy tài khoản '${userId}' để xoá.`);
    }
    const removed = this.state.users.splice(idx, 1)[0];
    if (removed.personaKey) {
      delete this.state.personas[removed.personaKey];
    }

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "USER_DELETE",
      target: `${removed.fullName} (${removed.id} - ${removed.email})`,
      severity: "CRITICAL",
      details: `Đã xoá vĩnh viễn tài khoản TechCorp ID của "${removed.fullName}" (${removed.org}).`
    });

    this.save();
    return removed;
  }

  // ==================== EVENT BUS ====================
  addEvent({ sourceApp = "techcorp-hub", targetApp = "all", eventType = "SYSTEM_SYNC", text }) {
    const nowStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const evt = {
      id: "EVT-" + Date.now(),
      time: `Hôm nay, ${nowStr}`,
      sourceApp,
      targetApp,
      eventType,
      text
    };
    this.state.activityLogs.unshift(evt);
    if (this.state.activityLogs.length > 60) {
      this.state.activityLogs = this.state.activityLogs.slice(0, 60);
    }
    this.save();
    return evt;
  }
}

module.exports = {
  db: new HubDatabase(),
  SQLITE_DB_PATH,
  JSON_DB_PATH
};
