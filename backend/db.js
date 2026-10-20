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
const { initAndSyncMysql, syncStateToMysqlAsync, getMysqlStatus } = require("./mysql");

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
    defaultAppId: "erp",
    assignedApps: [
      "mamnon",
      "tieuhoc",
      "thcs",
      "thpt",
      "gdtx",
      "qldt",
      "ttnn",
      "lms",
      "learn",
      "kpi",
      "erp",
      "jobai",
      "qldh",
      "bds",
      "noithat",
      "techcorp"
    ],
    status: "active",
    lastLogin: "Vừa xong",
    ipAddress: "103.170.122.138",
    createdAt: "2026-10-01T07:00:00.000Z"
  },
  {
    id: "USR-NT-001",
    personaKey: "ceo-sme",
    fullName: "Nguyễn Hải Đăng (CEO Resort & Doanh nghiệp)",
    email: "ceo@nhatrangbayresort.vn",
    phone: "0914.222.333",
    org: "Nha Trang Bay Resort & Hưng Phát Land",
    role: "ceo_sme",
    roleBadge: "Khối Doanh nghiệp SME",
    defaultAppId: "erp",
    assignedApps: ["erp", "kpi", "jobai", "qldh", "bds", "noithat", "lms", "techcorp"],
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
    defaultAppId: "ttnn",
    assignedApps: ["ttnn", "lms", "learn", "jobai", "gdtx", "kpi"],
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
    org: "Hệ thống Giáo dục Liên cấp & ĐH Nha Trang",
    role: "school_principal",
    roleBadge: "Khối Cơ sở Giáo dục",
    defaultAppId: "thpt",
    assignedApps: ["mamnon", "tieuhoc", "thcs", "thpt", "gdtx", "qldt", "lms", "learn", "jobai"],
    status: "active",
    lastLogin: "1 giờ trước",
    ipAddress: "27.68.112.41",
    createdAt: "2026-10-04T10:00:00.000Z"
  },
  {
    id: "USR-NT-004",
    personaKey: "student-user",
    fullName: "Nguyễn Minh Khôi (Sinh viên / Học viên)",
    email: "khoi.nm.64cntt@ntu.edu.vn",
    phone: "0399.888.111",
    org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821",
    role: "student_parent",
    roleBadge: "Cộng đồng Học viên / SV",
    defaultAppId: "lms",
    assignedApps: ["lms", "learn", "jobai", "qldt", "ttnn"],
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

const INITIAL_HERO_SLIDERS = [
  {
    id: "slide-1",
    order: 1,
    badge: "⚡ NỀN TẢNG HỆ SINH THÁI SỐ ĐA CHIỀU • 16 HỆ THỐNG LIVE",
    title: "Kết nối Trường học – Trung tâm Đào tạo – Sàn Tuyển dụng AI & Doanh nghiệp trên Một Trục Duy nhất",
    subtitle:
      "Hệ sinh thái TechCorp hợp nhất 16 nền tảng phần mềm chuyên sâu đang vận hành thực tế trên *.techcorp.info.vn: nơi các Trường học, Trung tâm Ngoại ngữ - Tin học, Doanh nghiệp SME và Học viên/Phụ huynh liên thông dữ liệu và trao đổi cơ hội bằng định danh duy nhất TechCorp ID (SSO).",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "🚀 Khám phá 16 Sản phẩm Thực tế",
    ctaPrimaryUrl: "#sec-products",
    ctaSecondaryText: "🔐 Đăng nhập Quản trị (Theo Vai trò)",
    ctaSecondaryUrl: "login.html",
    metric1Value: "16 Hệ thống",
    metric1Sub: "Vận hành thực tế trên *.techcorp.info.vn",
    metric2Value: "2.920+ Hồ sơ",
    metric2Sub: "Ứng viên & Học viên xác thực Điểm Thi Online"
  },
  {
    id: "slide-2",
    order: 2,
    badge: "🤖 SÀN TUYỂN DỤNG & TÌM VIỆC THÔNG MINH • JOBAI.TECHCORP.INFO.VN",
    title: "TechCorp HireMind AI — Sàn Tuyển dụng, Tìm việc & Phân tích Nhân sự Đa ngôn ngữ AI ATS",
    subtitle:
      "Kết nối trực tiếp Sinh viên các Trường Đại học/Cao đẳng, Học viên Trung tâm Ngoại ngữ - Tin học với hàng trăm Doanh nghiệp & Resort. Sàng lọc CV tự động bằng AI đa ngôn ngữ (Việt - Anh - Hàn - Nhật - Trung) và đồng bộ 1-Click về phân hệ HRM trên TechCorp ERP.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "💼 Truy cập Sàn Tuyển dụng JobAI ↗",
    ctaPrimaryUrl: "https://jobai.techcorp.info.vn",
    ctaSecondaryText: "👨‍🎓 Xem Sàn Nhân lực Xác thực",
    ctaSecondaryUrl: "#sec-talent-b2b",
    metric1Value: "AI ATS 7 Ngôn ngữ",
    metric1Sub: "Chấm điểm độ phù hợp CV & JD tự động",
    metric2Value: "1-Click HRM Sync",
    metric2Sub: "Đẩy thẳng hồ sơ ứng viên vào TechCorp ERP"
  },
  {
    id: "slide-3",
    order: 3,
    badge: "🎓 KHỐI GIÁO DỤC MẦM NON & PHỔ THÔNG K-12 • 05 NỀN TẢNG CHUYÊN SÂU",
    title: "EduManager Pro K-12 — Quản trị Toàn diện Trường Mầm non, Tiểu học, THCS, THPT & GDTX",
    subtitle:
      "Tự động hóa điểm danh AI, thực đơn dinh dưỡng, học bạ số theo Thông tư Bộ GD&ĐT, phân ban GDPT 2018, Sổ liên lạc điện tử Phụ huynh và gạch nợ học phí QR động trong 3 giây.",
    imageUrl:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "🏫 Khám phá Khối Trường học K-12",
    ctaPrimaryUrl: "#sec-products",
    ctaSecondaryText: "🎓 Đăng nhập Workspace Hiệu trưởng",
    ctaSecondaryUrl: "login.html?role=school-principal",
    metric1Value: "05 Cấp học",
    metric1Sub: "Mầm non • Tiểu học • THCS • THPT • GDTX",
    metric2Value: "96.4% QR Auto",
    metric2Sub: "Gạch nợ học phí tự động không tiền mặt"
  },
  {
    id: "slide-4",
    order: 4,
    badge: "🏫 ĐẠI HỌC, NGOẠI NGỮ & KHẢO THÍ TRỰC TUYẾN • 04 NỀN TẢNG SỐ",
    title: "TC COMPASS, Trung tâm Ngoại ngữ - Tin học, TechCorp LMS & Cổng Học tập TechCorpLearn",
    subtitle:
      "Quản trị đào tạo tín chỉ Đại học, CRM tuyển sinh Trung tâm Ngoại ngữ - Tin học, phòng thi trực tuyến chống gian lận AI (IELTS/TOEIC/MOS) và cấp Chứng chỉ Năng lực Số kèm mã QR xác thực.",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "📝 Mở Nền tảng Thi Online LMS ↗",
    ctaPrimaryUrl: "https://lms.techcorp.info.vn",
    ctaSecondaryText: "🏫 Đăng nhập Workspace Trung tâm",
    ctaSecondaryUrl: "login.html?role=center-dir",
    metric1Value: "1.420+ Thí sinh",
    metric1Sub: "Dự thi IELTS/TOEIC/Tin học trên TechCorp LMS",
    metric2Value: "Chứng chỉ QR",
    metric2Sub: "Xác thực năng lực trực tiếp trên Talent Passport"
  },
  {
    id: "slide-5",
    order: 5,
    badge: "🏢 ĐIỀU HÀNH DOANH NGHIỆP & QUẢN TRỊ HIỆU SUẤT • ERP & BSC-KPI",
    title: "TechCorp ERP, Quản trị Mục tiêu BSC-KPI & Giải pháp Chuyển đổi Số TechCorp Academy",
    subtitle:
      "Hợp nhất mọi quy trình điều hành doanh nghiệp: Nhân sự - Tiền lương (HRM), Chăm sóc khách hàng (CRM), Tài chính - Kế toán, Kho vận và Thẻ điểm cân bằng BSC-KPI từ Ban Giám đốc tới từng nhân viên.",
    imageUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "📊 Truy cập Hệ thống TechCorp ERP ↗",
    ctaPrimaryUrl: "https://erp.techcorp.info.vn",
    ctaSecondaryText: "🏢 Đăng nhập Workspace Doanh nghiệp",
    ctaSecondaryUrl: "login.html?role=ceo-sme",
    metric1Value: "ERP + BSC-KPI",
    metric1Sub: "Quản trị mục tiêu & điều hành doanh nghiệp số",
    metric2Value: "Give-to-Get B2B",
    metric2Sub: "Phát hành E-Voucher tới >10.000 Phụ huynh & SV"
  },
  {
    id: "slide-6",
    order: 6,
    badge: "🏨 GIẢI PHÁP CHUYÊN NGÀNH • KHÁCH SẠN PMS, BẤT ĐỘNG SẢN AI & NỘI THẤT",
    title: "TechCorp PMS Khách sạn - Resort, Sàn BĐS Hưng Phát Land AI & Showroom Nội thất 3D",
    subtitle:
      "Bộ giải pháp chuyên ngành may đo cho nền kinh tế Du lịch - Dịch vụ & Đô thị biển: Quản lý vận hành Khách sạn & Resort (PMS), Sàn giao dịch Bất động sản tích hợp Trợ lý AI 24/7 và Thiết kế - Thi công Nội thất.",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    ctaPrimaryText: "🏨 Xem Hệ thống PMS Khách sạn ↗",
    ctaPrimaryUrl: "https://qldh.techcorp.info.vn",
    ctaSecondaryText: "💬 Diễn đàn Giao thương B2B",
    ctaSecondaryUrl: "#sec-forum",
    metric1Value: "03 Chuyên ngành",
    metric1Sub: "Khách sạn PMS • Sàn BĐS AI • Nội thất 3D",
    metric2Value: "15% – 40%",
    metric2Sub: "Đặc quyền chiết khấu nội bộ trong Hệ sinh thái"
  }
];

const INITIAL_DEMO_REQUESTS = [
  {
    id: "DEMO-261001",
    fullName: "ThS. Nguyễn Thị Lan Anh",
    phone: "0905.382.119",
    email: "lananh.principal@saobienedu.vn",
    orgName: "Hệ thống Mầm non & Tiểu học Sao Biển (KĐT Mỹ Gia, Nha Trang)",
    orgScale: "300 - 800 học sinh / nhân sự",
    productId: "mamnon",
    productName: "EduManager Pro — Quản lý Trường Mầm non & AI",
    appUrl: "https://mamnon.techcorp.info.vn",
    preferredTime: "Sáng thứ 5 (09:00 - 11:00) tại trường hoặc qua Google Meet",
    notes: "Cần demo tính năng Điểm danh AI nhận diện khuôn mặt, thực đơn dinh dưỡng tự động và gạch nợ học phí VietQR.",
    status: "scheduled",
    adminNote: "Đã liên hệ Zalo, hẹn lịch demo trực tiếp tại KĐT Mỹ Gia sáng thứ 5.",
    ipAddress: "113.160.214.88",
    createdAt: "2026-10-20 08:45:12"
  },
  {
    id: "DEMO-261002",
    fullName: "Ông Trần Quốc Bảo",
    phone: "0914.775.680",
    email: "baotq@asiabayresort.com",
    orgName: "Asia Bay Resort & Spa Cam Ranh",
    orgScale: "150 - 300 nhân sự",
    productId: "qldh",
    productName: "TechCorp PMS — Hệ thống Quản lý Khách sạn & Resort",
    appUrl: "https://qldh.techcorp.info.vn",
    preferredTime: "Chiều nay 14:30",
    notes: "Muốn trải nghiệm luồng đồng bộ đặt phòng PMS + POS nhà hàng và kết nối tuyển dụng nhân sự từ Sàn HireMind AI.",
    status: "contacted",
    adminNote: "Đã gửi tài khoản dùng thử PMS + ERP qua email, đang chờ phản hồi lịch họp với GM.",
    ipAddress: "14.161.42.19",
    createdAt: "2026-10-20 09:20:05"
  },
  {
    id: "DEMO-261003",
    fullName: "TS. Lê Minh Hoàng",
    phone: "0988.412.909",
    email: "hoanglm@pacificuni.edu.vn",
    orgName: "Trường Cao đẳng Kỹ thuật & Du lịch Miền Trung",
    orgScale: "Trên 1.000 sinh viên / giảng viên",
    productId: "qldt",
    productName: "TC COMPASS — Quản trị Đại học & Đánh giá Hiệu suất",
    appUrl: "https://qldt.techcorp.info.vn",
    preferredTime: "Tuần này (Thứ 4 hoặc Thứ 6)",
    notes: "Quan tâm hệ thống quản trị tín chỉ TC COMPASS kết hợp đánh giá KPI giảng viên và cổng thực tập sinh viên.",
    status: "new",
    adminNote: "",
    ipAddress: "171.244.18.102",
    createdAt: "2026-10-20 10:15:40"
  },
  {
    id: "DEMO-261004",
    fullName: "Bà Phạm Hoàng Yến",
    phone: "0935.889.234",
    email: "yenpham@globalenglish-nt.vn",
    orgName: "Hệ thống Anh ngữ Quốc tế Global Star (3 cơ sở Nha Trang)",
    orgScale: "500 - 1.500 học viên",
    productId: "ttnn",
    productName: "Quản lý Trung tâm Ngoại ngữ & Tin học Chuẩn Quốc tế",
    appUrl: "https://ttnn.techcorp.info.vn",
    preferredTime: "10:00 sáng mai",
    notes: "Đăng ký nhận tài khoản Demo CRM tuyển sinh đa kênh + Phòng thi thử IELTS/TOEIC trực tuyến.",
    status: "completed",
    adminNote: "Đã bàn giao tài khoản Demo và ký MOU tham gia gói Hạt nhân Nha Trang.",
    ipAddress: "113.172.55.14",
    createdAt: "2026-10-19 16:10:22"
  },
  {
    id: "DEMO-261005",
    fullName: "Ông Vũ Đình Khôi",
    phone: "0903.551.890",
    email: "khoivd@seatechgroup.vn",
    orgName: "Công ty CP Thương mại & Dịch vụ SeaTech Khánh Hòa",
    orgScale: "50 - 150 nhân sự",
    productId: "erp",
    productName: "TechCorp ERP — Quản trị Doanh nghiệp Tổng thể",
    appUrl: "https://erp.techcorp.info.vn",
    preferredTime: "15:00 chiều mai",
    notes: "Cần tư vấn Combo TechCorp ERP + BSC-KPI + Sàn Tuyển dụng AI HireMind cho 80 nhân sự.",
    status: "new",
    adminNote: "",
    ipAddress: "27.67.110.45",
    createdAt: "2026-10-20 11:05:19"
  }
];

const INITIAL_SEED = {
  meta: {
    domain: "hesinhthai.techcorp.info.vn",
    version: "6.4.0",
    region: "Nha Trang - Khánh Hòa",
    updatedAt: new Date().toISOString()
  },
  heroSliders: INITIAL_HERO_SLIDERS,
  demoRequests: INITIAL_DEMO_REQUESTS,
  apps: [
    {
      id: "mamnon",
      name: "EduManager Pro — Quản lý Trường Mầm non & AI",
      badge: "EdTech K-12",
      category: "k12_edu",
      color: "#0284c7",
      appUrl: "https://mamnon.techcorp.info.vn",
      webhookUrl: "https://mamnon.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý hồ sơ trẻ, điểm danh AI, thực đơn dinh dưỡng, Sổ liên lạc điện tử Phụ huynh & thu học phí QR tự động.",
      apiKey: "tc_live_mamnon_9a8b7c6d5e4f3a2b01",
      status: "active",
      scopes: ["sso:login", "parent:voucher", "b2b:request", "tuition:qr"],
      createdAt: "2026-10-01T08:00:00.000Z"
    },
    {
      id: "tieuhoc",
      name: "EduManager Pro — Quản lý Trường Tiểu học & AI",
      badge: "EdTech K-12",
      category: "k12_edu",
      color: "#0369a1",
      appUrl: "https://tieuhoc.techcorp.info.vn",
      webhookUrl: "https://tieuhoc.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý học vụ Tiểu học, đánh giá phẩm chất & năng lực theo Thông tư Bộ GD&ĐT, học bạ số và kết nối Phụ huynh.",
      apiKey: "tc_live_tieuhoc_9a8b7c6d5e4f3a2b02",
      status: "active",
      scopes: ["sso:login", "parent:voucher", "b2b:request", "tuition:qr"],
      createdAt: "2026-10-01T08:02:00.000Z"
    },
    {
      id: "thcs",
      name: "EduManager Pro — Quản lý Trường THCS & Trợ lý AI",
      badge: "EdTech K-12",
      category: "k12_edu",
      color: "#2563eb",
      appUrl: "https://thcs.techcorp.info.vn",
      webhookUrl: "https://thcs.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý giáo vụ Trung học Cơ sở, phân công giảng dạy, sổ điểm điện tử, học bạ số và kiểm tra định kỳ trên LMS.",
      apiKey: "tc_live_thcs_9a8b7c6d5e4f3a2b03",
      status: "active",
      scopes: ["sso:login", "lms:sync", "parent:voucher", "tuition:qr"],
      createdAt: "2026-10-01T08:04:00.000Z"
    },
    {
      id: "thpt",
      name: "EduManager Pro — Quản lý Trường THPT & Hướng nghiệp AI",
      badge: "EdTech K-12",
      category: "k12_edu",
      color: "#1d4ed8",
      appUrl: "https://thpt.techcorp.info.vn",
      webhookUrl: "https://thpt.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý toàn diện trường THPT, phân ban tổ hợp môn Chương trình GDPT 2018, luyện thi tốt nghiệp & hướng nghiệp AI.",
      apiKey: "tc_live_thpt_9a8b7c6d5e4f3a2b04",
      status: "active",
      scopes: ["sso:login", "lms:sync", "talent:export", "tuition:qr"],
      createdAt: "2026-10-01T08:06:00.000Z"
    },
    {
      id: "gdtx",
      name: "EduManager Pro — Quản lý Trung tâm GDNN - GDTX",
      badge: "EdTech K-12",
      category: "k12_edu",
      color: "#4f46e5",
      appUrl: "https://gdtx.techcorp.info.vn",
      webhookUrl: "https://gdtx.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý học viên Giáo dục Thường xuyên, liên kết đào tạo nghề, văn bằng chứng chỉ và giới thiệu việc làm doanh nghiệp.",
      apiKey: "tc_live_gdtx_9a8b7c6d5e4f3a2b05",
      status: "active",
      scopes: ["sso:login", "talent:export", "lms:sync"],
      createdAt: "2026-10-01T08:08:00.000Z"
    },
    {
      id: "qldt",
      name: "TC COMPASS — Quản trị Đại học & Đánh giá Hiệu suất",
      badge: "EdTech & LMS",
      category: "higher_ed_lms",
      color: "#7c3aed",
      appUrl: "https://qldt.techcorp.info.vn",
      webhookUrl: "https://qldt.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Hệ thống TC COMPASS v1.0 quản trị đào tạo Đại học/Cao đẳng theo học chế tín chỉ, KPI giảng viên & cổng thực tập sinh viên.",
      apiKey: "tc_live_qldt_9a8b7c6d5e4f3a2b06",
      status: "active",
      scopes: ["sso:login", "talent:export", "kpi:sync", "erp:internship"],
      createdAt: "2026-10-01T08:10:00.000Z"
    },
    {
      id: "ttnn",
      name: "Quản lý Trung tâm Ngoại ngữ & Tin học Chuẩn Quốc tế",
      badge: "EdTech & LMS",
      category: "higher_ed_lms",
      color: "#8b5cf6",
      appUrl: "https://ttnn.techcorp.info.vn",
      webhookUrl: "https://ttnn.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "CRM Tuyển sinh đa kênh, quản lý lớp học, lịch giáo viên bản xứ, học phí và liên thông phòng thi IELTS/TOEIC/MOS.",
      apiKey: "tc_live_ttnn_9a8b7c6d5e4f3a2b07",
      status: "active",
      scopes: ["sso:login", "lead:receive", "talent:export", "contest:cohost"],
      createdAt: "2026-10-01T08:12:00.000Z"
    },
    {
      id: "lms",
      name: "TechCorp LMS & E-Testing — Đào tạo & Khảo thí Trực tuyến",
      badge: "EdTech & LMS",
      category: "higher_ed_lms",
      color: "#059669",
      appUrl: "https://lms.techcorp.info.vn",
      webhookUrl: "https://lms.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phòng thi trực tuyến chống gian lận, ngân hàng đề chuẩn hóa, chấm điểm tự động và cấp Chứng chỉ Năng lực Số QR.",
      apiKey: "tc_live_lms_9a8b7c6d5e4f3a2b08",
      status: "active",
      scopes: ["sso:login", "cert:issue", "lead:export", "talent:verify"],
      createdAt: "2026-10-01T08:14:00.000Z"
    },
    {
      id: "learn",
      name: "TechCorpLearn — Nền tảng Học Trực tuyến & Khóa học Số",
      badge: "EdTech & LMS",
      category: "higher_ed_lms",
      color: "#10b981",
      appUrl: "https://learn.techcorp.info.vn",
      webhookUrl: "https://learn.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Cổng học tập trực tuyến ('Học để dẫn đầu') cung cấp khóa học video tương tác, lộ trình kỹ năng số, AI & ngoại ngữ thực chiến.",
      apiKey: "tc_live_learn_9a8b7c6d5e4f3a2b09",
      status: "active",
      scopes: ["sso:login", "course:enroll", "cert:issue", "talent:verify"],
      createdAt: "2026-10-01T08:16:00.000Z"
    },
    {
      id: "kpi",
      name: "TechCorp BSC-KPI — Quản trị Mục tiêu & Hiệu suất Thông minh",
      badge: "Enterprise & KPI",
      category: "enterprise_erp",
      color: "#0052d4",
      appUrl: "https://kpi.techcorp.info.vn",
      webhookUrl: "https://kpi.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Hệ thống Thẻ điểm cân bằng BSC & quản trị mục tiêu KPI/OKR tự động từ Ban Giám đốc xuống từng phòng ban và nhân sự.",
      apiKey: "tc_live_kpi_9a8b7c6d5e4f3a2b10",
      status: "active",
      scopes: ["sso:login", "hrm:kpi_sync", "erp:analytics"],
      createdAt: "2026-10-01T08:18:00.000Z"
    },
    {
      id: "erp",
      name: "TechCorp ERP — Quản trị Doanh nghiệp Tổng thể",
      badge: "Enterprise & KPI",
      category: "enterprise_erp",
      color: "#dc2626",
      appUrl: "https://erp.techcorp.info.vn",
      webhookUrl: "https://erp.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Điều hành doanh nghiệp hợp nhất: HRM Nhân sự & Tuyển dụng 1-Click, CRM Khách hàng, Tài chính - Kế toán, Kho vận & Dự án.",
      apiKey: "tc_live_erp_9a8b7c6d5e4f3a2b11",
      status: "active",
      scopes: ["sso:login", "hrm:import_candidate", "job:publish", "crm:voucher", "b2b:order"],
      createdAt: "2026-10-01T08:20:00.000Z"
    },
    {
      id: "jobai",
      name: "TechCorp HireMind AI — Sàn Tuyển dụng & Tìm việc AI ATS",
      badge: "Enterprise & KPI",
      category: "enterprise_erp",
      color: "#0d9488",
      appUrl: "https://jobai.techcorp.info.vn",
      webhookUrl: "https://jobai.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Sàn Tuyển dụng & Tìm việc thông minh tích hợp AI ATS đa ngôn ngữ: Phân tích CV tự động, gợi ý việc làm chuẩn xác & kết nối Sinh viên - Doanh nghiệp.",
      apiKey: "tc_live_jobai_9a8b7c6d5e4f3a2b16",
      status: "active",
      scopes: ["sso:login", "ai:ats_matching", "talent:import", "job:marketplace"],
      createdAt: "2026-10-01T08:21:00.000Z"
    },
    {
      id: "techcorp",
      name: "TechCorp Academy — Giải pháp PMS, ERP, LMS & Đào tạo",
      badge: "Enterprise & KPI",
      category: "enterprise_erp",
      color: "#0284c7",
      appUrl: "https://techcorp.info.vn",
      webhookUrl: "https://techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Cổng thông tin chính thức TechCorp Academy: Cung cấp giải pháp phần mềm quản trị PMS, ERP, LMS và đào tạo chuyển đổi số thực chiến.",
      apiKey: "tc_live_techcorp_9a8b7c6d5e4f3a2b12",
      status: "active",
      scopes: ["sso:login", "brand:showcase", "b2b:consulting"],
      createdAt: "2026-10-01T08:22:00.000Z"
    },
    {
      id: "qldh",
      name: "TechCorp PMS — Hệ thống Quản lý Khách sạn & Resort",
      badge: "Chuyên ngành",
      category: "industry_vertical",
      color: "#d97706",
      appUrl: "https://qldh.techcorp.info.vn",
      webhookUrl: "https://qldh.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phần mềm Quản lý Khách sạn & Resort (PMS): Đặt phòng, Lễ tân (Front Office), Buồng phòng, POS Nhà hàng & kết nối nhân sự du lịch.",
      apiKey: "tc_live_qldh_9a8b7c6d5e4f3a2b13",
      status: "active",
      scopes: ["sso:login", "pms:booking", "hrm:hospitality_talent", "b2b:voucher"],
      createdAt: "2026-10-01T08:24:00.000Z"
    },
    {
      id: "bds",
      name: "Hưng Phát Land — Sàn Giao dịch Bất động sản & Trợ lý AI",
      badge: "Chuyên ngành",
      category: "industry_vertical",
      color: "#ea580c",
      appUrl: "https://bds.techcorp.info.vn",
      webhookUrl: "https://bds.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Sàn giao dịch Bất động sản cao cấp tích hợp Trợ lý AI tư vấn 24/7, quản lý giỏ hàng dự án, CRM môi giới & pháp lý số.",
      apiKey: "tc_live_bds_9a8b7c6d5e4f3a2b14",
      status: "active",
      scopes: ["sso:login", "crm:leads", "ai:advisor", "b2b:listing"],
      createdAt: "2026-10-01T08:26:00.000Z"
    },
    {
      id: "noithat",
      name: "TechCorp Interior — Thiết kế, Thi công & Showroom Nội thất",
      badge: "Chuyên ngành",
      category: "industry_vertical",
      color: "#b45309",
      appUrl: "https://noithat.techcorp.info.vn",
      webhookUrl: "https://noithat.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Nền tảng Kiến tạo Không gian Hoàn mỹ: Trưng bày sản phẩm nội thất, báo giá dự toán thiết kế - thi công & quản lý công trình.",
      apiKey: "tc_live_noithat_9a8b7c6d5e4f3a2b15",
      status: "active",
      scopes: ["sso:login", "catalog:3d", "b2b:quotation", "erp:inventory"],
      createdAt: "2026-10-01T08:28:00.000Z"
    }
  ],
  users: INITIAL_USERS,
  personas: {
    "super-admin": {
      id: "super-admin",
      userId: "USR-ADMIN-00",
      name: "Quản trị viên Hệ sinh thái TechCorp",
      org: "TechCorp Headquarters (Điều hành 16 Hệ thống Live)",
      roleBadge: "🛡️ Super Admin TechCorp",
      defaultAppId: "erp"
    },
    "ceo-sme": {
      id: "ceo-sme",
      userId: "USR-NT-001",
      name: "Nguyễn Hải Đăng (CEO Resort & Doanh nghiệp)",
      org: "Nha Trang Bay Resort & Hưng Phát Land (Đang dùng: ERP, KPI, PMS, BĐS)",
      roleBadge: "Khối Doanh nghiệp SME",
      defaultAppId: "erp"
    },
    "center-dir": {
      id: "center-dir",
      userId: "USR-NT-002",
      name: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
      org: "Ocean English & IT Center Nha Trang (Đang dùng: TTNN, LMS, Learn)",
      roleBadge: "Khối Đào tạo NN-TH",
      defaultAppId: "ttnn"
    },
    "school-principal": {
      id: "school-principal",
      userId: "USR-NT-003",
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Liên cấp & ĐH Nha Trang (Mầm non - THPT & TC COMPASS)",
      roleBadge: "Khối Cơ sở Giáo dục",
      defaultAppId: "thpt"
    },
    "student-user": {
      id: "student-user",
      userId: "USR-NT-004",
      name: "Nguyễn Minh Khôi (Sinh viên / Học viên)",
      org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821 (LMS + TechCorpLearn)",
      roleBadge: "Cộng đồng Học viên / SV",
      defaultAppId: "lms"
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
  announcements: [
    {
      id: "ANN-MASTER-01",
      sourceType: "master",
      badge: "👑 THÔNG BÁO ĐIỀU HÀNH TỪ CHỦ HỆ SINH THÁI TECHCORP",
      title: "Chính thức Liên thông 15 Nền tảng Phần mềm Thực tế trên *.techcorp.info.vn qua Trục SSO TechCorp ID v5.1",
      summary: "Toàn bộ 15 hệ thống đang chạy thực tế gồm: Giáo dục K12 (mamnon, tieuhoc, thcs, thpt, gdtx), Đại học & Khảo thí (qldt TC COMPASS, ttnn, lms, learn), Quản trị Doanh nghiệp (erp, kpi, techcorp) và Chuyên ngành (qldh PMS Khách sạn, bds AI, noithat) đã được kết nối tập trung.",
      authorName: "Ban Điều hành Hệ sinh thái TechCorp",
      authorOrg: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
      createdAt: "Hôm nay, 08:00",
      pinned: true,
      actionLabel: "Xem Sơ đồ Vận hành",
      actionView: "view-plaza"
    },
    {
      id: "ANN-MASTER-02",
      sourceType: "master",
      badge: "📢 CHÍNH SÁCH LIÊN KẾT HẠT NHÂN KHÁNH HÒA",
      title: "Tài trợ 100% Phí Khởi tạo & Tặng Website Chuẩn SEO cho 57 Đơn vị Hạt nhân Giai đoạn 1 tại Nha Trang",
      summary: "Áp dụng cho 02 Trường ĐH/CĐ, 10 Trung tâm Ngoại ngữ - Tin học, 15 Trường Mầm non/Phổ thông và 30 Doanh nghiệp SME đầu tiên kích hoạt liên thông dữ liệu trên TechCorp Hub.",
      authorName: "Chủ Hệ sinh thái TechCorp",
      authorOrg: "TechCorp Headquarters",
      createdAt: "Hôm nay, 09:30",
      pinned: true,
      actionLabel: "Mở Không gian Quản trị",
      actionView: "view-workspace"
    },
    {
      id: "ANN-MEM-01",
      sourceType: "member",
      badge: "🏨 TIN TỪ DOANH NGHIỆP THÀNH VIÊN (SME)",
      title: "Nha Trang Bay Resort & Travel mở đợt tuyển 25 Thực tập sinh & Nhân sự Lễ tân Tiếng Anh/Hàn học kỳ Hè - Thu",
      summary: "Ưu tiên xét tuyển thẳng (không qua vòng sơ loại CV) đối với Sinh viên ĐH Nha Trang, ĐH Khánh Hòa, CĐ Du lịch có chứng chỉ xác thực trên Nền tảng Thi Online TechCorp.",
      authorName: "Nguyễn Hải Đăng (CEO)",
      authorOrg: "Nha Trang Bay Resort & Travel",
      createdAt: "1 giờ trước",
      pinned: false,
      actionLabel: "Xem Sàn Nhân lực",
      actionView: "view-talent-lms"
    },
    {
      id: "ANN-MEM-02",
      sourceType: "member",
      badge: "🏫 TIN TỪ TRUNG TÂM ĐÀO TẠO THÀNH VIÊN",
      title: "Ocean English & IT Center tài trợ 500 suất Thi thử IELTS/TOEIC & Học bổng 40% cho con em Doanh nghiệp & Trường học",
      summary: "Kết quả thi thử được đồng bộ tự động về Sổ liên lạc điện tử của Phụ huynh và Hồ sơ Năng lực Số của Sinh viên trên toàn hệ sinh thái.",
      authorName: "Trần Thanh Tâm (Giám đốc)",
      authorOrg: "Ocean English & IT Center Nha Trang",
      createdAt: "2 giờ trước",
      pinned: false,
      actionLabel: "Xem Đấu trường LMS",
      actionView: "view-talent-lms"
    }
  ],
  rbacMatrix: {
    super_admin: {
      roleName: "👑 Chủ Hệ sinh thái (TechCorp Master Admin)",
      roleCode: "super_admin",
      desc: "Toàn quyền điều hành hạ tầng, cấu hình phân quyền RBAC, phê duyệt ứng dụng, kiểm duyệt diễn đàn và truy vết an ninh.",
      permissions: {
        viewPlaza: true,
        postMemberNews: true,
        manageOwnOrg: true,
        postForumB2B: true,
        accessTalentPool: true,
        manageLmsContests: true,
        publishMasterBulletin: true,
        manageAppsUsersRbac: true,
        moderateForumAudit: true
      }
    },
    ceo_sme: {
      roleName: "🏢 Chủ Doanh nghiệp Thành viên (CEO SME)",
      roleCode: "ceo_sme",
      desc: "Quản trị Workspace Doanh nghiệp (ERP/Web), đăng tuyển dụng liên thông, nhập CV ứng viên vào HRM và phát hành E-Voucher B2B.",
      permissions: {
        viewPlaza: true,
        postMemberNews: true,
        manageOwnOrg: true,
        postForumB2B: true,
        accessTalentPool: true,
        manageLmsContests: false,
        publishMasterBulletin: false,
        manageAppsUsersRbac: false,
        moderateForumAudit: false
      }
    },
    center_director: {
      roleName: "🏫 Giám đốc Trung tâm Ngoại ngữ - Tin học",
      roleCode: "center_director",
      desc: "Quản trị Workspace Trung tâm, tổ chức Đấu trường Thi Online, nhận Lead học viên về CRM và cấp chứng chỉ năng lực số.",
      permissions: {
        viewPlaza: true,
        postMemberNews: true,
        manageOwnOrg: true,
        postForumB2B: true,
        accessTalentPool: true,
        manageLmsContests: true,
        publishMasterBulletin: false,
        manageAppsUsersRbac: false,
        moderateForumAudit: false
      }
    },
    school_principal: {
      roleName: "🎓 Hiệu trưởng Trường học (Mầm non - ĐH)",
      roleCode: "school_principal",
      desc: "Quản trị Workspace Nhà trường, theo dõi học vụ & thu học phí QR, kết nối thực tập sinh viên và nhận học bổng/tài trợ cho phụ huynh.",
      permissions: {
        viewPlaza: true,
        postMemberNews: true,
        manageOwnOrg: true,
        postForumB2B: true,
        accessTalentPool: true,
        manageLmsContests: true,
        publishMasterBulletin: false,
        manageAppsUsersRbac: false,
        moderateForumAudit: false
      }
    },
    student_parent: {
      roleName: "👨‍🎓 Học viên / Sinh viên / Phụ huynh",
      roleCode: "student_parent",
      desc: "Sử dụng Cổng Công dân Số TechCorp ID: Xem Hồ sơ Năng lực Số, thi trực tuyến, ứng tuyển việc làm 1-Click và nhận Voucher ưu đãi.",
      permissions: {
        viewPlaza: true,
        postMemberNews: false,
        manageOwnOrg: true,
        postForumB2B: false,
        accessTalentPool: false,
        manageLmsContests: false,
        publishMasterBulletin: false,
        manageAppsUsersRbac: false,
        moderateForumAudit: false
      }
    }
  },
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
        if (!Array.isArray(this.state.announcements) || this.state.announcements.length === 0) {
          this.state.announcements = JSON.parse(JSON.stringify(INITIAL_SEED.announcements));
          needsSave = true;
        }
        if (!this.state.rbacMatrix || !this.state.rbacMatrix.super_admin) {
          this.state.rbacMatrix = JSON.parse(JSON.stringify(INITIAL_SEED.rbacMatrix));
          needsSave = true;
        }
        if (!this.state.personas["super-admin"]) {
          this.state.personas["super-admin"] = INITIAL_SEED.personas["super-admin"];
          needsSave = true;
        }
        if (!Array.isArray(this.state.heroSliders) || this.state.heroSliders.length === 0) {
          this.state.heroSliders = JSON.parse(JSON.stringify(INITIAL_HERO_SLIDERS));
          needsSave = true;
        }
        if (!Array.isArray(this.state.demoRequests)) {
          this.state.demoRequests = JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS));
          needsSave = true;
        }
        if (!this.state.meta || this.state.meta.version !== "6.4.0") {
          this.state.meta = JSON.parse(JSON.stringify(INITIAL_SEED.meta));
          this.state.apps = JSON.parse(JSON.stringify(INITIAL_SEED.apps));
          this.state.users = JSON.parse(JSON.stringify(INITIAL_USERS));
          this.state.personas = JSON.parse(JSON.stringify(INITIAL_SEED.personas));
          if (!Array.isArray(this.state.heroSliders) || this.state.heroSliders.length < 6) {
            this.state.heroSliders = JSON.parse(JSON.stringify(INITIAL_HERO_SLIDERS));
          }
          if (!Array.isArray(this.state.demoRequests) || this.state.demoRequests.length === 0) {
            this.state.demoRequests = JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS));
          }
          if (Array.isArray(this.state.announcements) && this.state.announcements.length > 0) {
            this.state.announcements[0] = JSON.parse(JSON.stringify(INITIAL_SEED.announcements[0]));
          }
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
    initAndSyncMysql(this.state);
  }

  save() {
    this.state.meta.updatedAt = new Date().toISOString();
    const tmpPath = `${JSON_DB_PATH}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(this.state, null, 2), "utf8");
    fs.renameSync(tmpPath, JSON_DB_PATH);
    this.syncToSqlite();
    syncStateToMysqlAsync(this.state);
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
      details: `Đã xoá bài viết của "${(removed.author && removed.author.name) || "Thành viên"}" khỏi Diễn đàn Cộng đồng.`
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

  // ==================== RBAC & ANNOUNCEMENTS ====================
  updateRbacPermission(roleCode, permKey, value, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    if (!this.state.rbacMatrix || !this.state.rbacMatrix[roleCode]) {
      throw new Error(`Vai trò '${roleCode}' không tồn tại trong Ma trận Phân quyền.`);
    }
    this.state.rbacMatrix[roleCode].permissions[permKey] = Boolean(value);
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "RBAC_PERMISSION_UPDATE",
      target: `Vai trò [${this.state.rbacMatrix[roleCode].roleName}] -> Quyền [${permKey}]`,
      severity: "WARNING",
      details: `Cập nhật cấu hình phân quyền RBAC: ${permKey} = ${Boolean(value) ? "CHO PHÉP (ALLOW)" : "TỪ CHỐI (DENY)"}.`
    });
    this.save();
    return this.state.rbacMatrix;
  }

  createAnnouncement(payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const title = (payload.title || "").trim();
    const summary = (payload.summary || "").trim();
    if (!title || !summary) {
      throw new Error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung thông báo.");
    }
    const persona =
      (this.state.personas && this.state.personas[actorKey]) ||
      this.state.personas["super-admin"] || {
        name: "Ban Điều hành Hệ sinh thái",
        org: "TechCorp Headquarters"
      };
    const isMaster = payload.sourceType === "master" || actorKey === "super-admin";
    const newAnn = {
      id: "ANN-" + Date.now(),
      sourceType: isMaster ? "master" : "member",
      badge:
        payload.badge ||
        (isMaster
          ? "👑 THÔNG BÁO ĐIỀU HÀNH TỪ CHỦ HỆ SINH THÁI TECHCORP"
          : "🌟 THÔNG TIN TỪ ĐƠN VỊ THÀNH VIÊN"),
      title,
      summary,
      authorName: payload.authorName || persona.name,
      authorOrg: payload.authorOrg || persona.org,
      createdAt: "Vừa xong",
      pinned: Boolean(payload.pinned),
      actionLabel: payload.actionLabel || "Xem chi tiết",
      actionView: payload.actionView || "view-workspace"
    };
    this.state.announcements.unshift(newAnn);
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: isMaster ? "MASTER_BULLETIN_PUBLISH" : "MEMBER_NEWS_PUBLISH",
      target: `${newAnn.id}: ${newAnn.title}`,
      severity: "INFO",
      details: `Đăng tải thông báo lên Trang chính Hệ sinh thái (${newAnn.badge}).`
    });
    this.save();
    return newAnn;
  }

  deleteAnnouncement(annId, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    const idx = (this.state.announcements || []).findIndex((a) => a.id === annId);
    if (idx === -1) {
      throw new Error("Không tìm thấy thông báo để xoá.");
    }
    const removed = this.state.announcements.splice(idx, 1)[0];
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "ANNOUNCEMENT_DELETE",
      target: `${removed.id}: ${removed.title}`,
      severity: "WARNING",
      details: `Xoá thông báo khỏi Bảng tin Chung Hệ sinh thái.`
    });
    this.save();
    return removed;
  }

  // ==================== HERO SLIDERS CMS (6 SLIDES) ====================
  updateHeroSlider(slideId, payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    if (!Array.isArray(this.state.heroSliders)) {
      this.state.heroSliders = JSON.parse(JSON.stringify(INITIAL_HERO_SLIDERS));
    }
    const slide = this.state.heroSliders.find((s) => s.id === slideId);
    if (!slide) {
      throw new Error(`Không tìm thấy Slide '${slideId}'.`);
    }
    if (payload.badge !== undefined) slide.badge = String(payload.badge).trim();
    if (payload.title !== undefined && String(payload.title).trim()) {
      slide.title = String(payload.title).trim();
    }
    if (payload.subtitle !== undefined) slide.subtitle = String(payload.subtitle).trim();
    if (payload.imageUrl !== undefined && String(payload.imageUrl).trim()) {
      slide.imageUrl = String(payload.imageUrl).trim();
    }
    if (payload.ctaPrimaryText !== undefined) slide.ctaPrimaryText = String(payload.ctaPrimaryText).trim();
    if (payload.ctaPrimaryUrl !== undefined) slide.ctaPrimaryUrl = String(payload.ctaPrimaryUrl).trim();
    if (payload.ctaSecondaryText !== undefined) slide.ctaSecondaryText = String(payload.ctaSecondaryText).trim();
    if (payload.ctaSecondaryUrl !== undefined) slide.ctaSecondaryUrl = String(payload.ctaSecondaryUrl).trim();
    if (payload.metric1Value !== undefined) slide.metric1Value = String(payload.metric1Value).trim();
    if (payload.metric1Sub !== undefined) slide.metric1Sub = String(payload.metric1Sub).trim();
    if (payload.metric2Value !== undefined) slide.metric2Value = String(payload.metric2Value).trim();
    if (payload.metric2Sub !== undefined) slide.metric2Sub = String(payload.metric2Sub).trim();

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "HERO_SLIDER_UPDATE",
      target: `Hero Slider #${slide.order} (${slide.id})`,
      severity: "INFO",
      details: `Cập nhật hình ảnh & nội dung Slide #${slide.order}: "${slide.title}".`
    });
    this.save();
    return slide;
  }

  resetHeroSliders(actorKey = "super-admin", ipAddress = "103.170.122.138") {
    this.state.heroSliders = JSON.parse(JSON.stringify(INITIAL_HERO_SLIDERS));
    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "HERO_SLIDER_RESET",
      target: "Toàn bộ 6 Hero Sliders",
      severity: "WARNING",
      details: "Khôi phục cấu hình hình ảnh và nội dung mặc định cho 6 Slide trang chủ Public."
    });
    this.save();
    return this.state.heroSliders;
  }

  // ==================== DEMO REQUESTS / CUSTOMER LEADS CRUD ====================
  createDemoRequest(payload, ipAddress = "103.170.122.138") {
    if (!Array.isArray(this.state.demoRequests)) {
      this.state.demoRequests = JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS));
    }
    const fullName = String(payload.fullName || "").trim();
    const phone = String(payload.phone || "").trim();
    const email = String(payload.email || "").trim();
    const orgName = String(payload.orgName || "").trim();
    const productId = String(payload.productId || "erp").trim();

    if (!fullName || !phone || !orgName) {
      throw new Error("Vui lòng nhập đầy đủ Họ tên người liên hệ, Số điện thoại/Zalo và Tên Đơn vị/Doanh nghiệp.");
    }

    const matchedApp = this.state.apps.find((a) => a.id === productId);
    const productName = payload.productName || (matchedApp ? matchedApp.name : "Giải pháp Hệ sinh thái TechCorp");
    const appUrl = payload.appUrl || (matchedApp ? matchedApp.appUrl : "https://hesinhthai.techcorp.info.vn");

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
      now.getHours()
    )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newLead = {
      id: "DEMO-" + String(Date.now()).slice(-6),
      fullName,
      phone,
      email: email || "Chưa cung cấp",
      orgName,
      orgScale: String(payload.orgScale || "50 - 200 nhân sự / học viên").trim(),
      productId,
      productName,
      appUrl,
      preferredTime: String(payload.preferredTime || "Trong giờ hành chính").trim(),
      notes: String(payload.notes || "Đăng ký nhận tài khoản dùng thử & tư vấn triển khai.").trim(),
      status: "new",
      adminNote: "",
      ipAddress,
      createdAt
    };

    this.state.demoRequests.unshift(newLead);

    this.addEvent({
      sourceApp: productId,
      targetApp: "techcorp-hub",
      eventType: "DEMO_LEAD_REGISTERED",
      text: `[Đăng ký Demo mới] Khách hàng "${fullName}" (${orgName} - SĐT: ${phone}) vừa đăng ký trải nghiệm Demo hệ thống "${productName}".`
    });

    this.addAuditLog({
      actorKey: "super-admin",
      ipAddress,
      action: "DEMO_REQUEST_CREATED",
      target: `${newLead.id}: ${fullName} (${orgName})`,
      severity: "INFO",
      details: `Khách hàng đăng ký Demo sản phẩm [${productId}] "${productName}" • SĐT: ${phone} • Email: ${newLead.email}.`
    });

    this.save();
    return newLead;
  }

  updateDemoRequest(leadId, payload, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    if (!Array.isArray(this.state.demoRequests)) {
      this.state.demoRequests = JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS));
    }
    const lead = this.state.demoRequests.find((item) => item.id === leadId);
    if (!lead) {
      throw new Error(`Không tìm thấy yêu cầu đăng ký Demo mã '${leadId}'.`);
    }

    const oldStatus = lead.status;
    if (payload.status !== undefined) {
      lead.status = String(payload.status).trim();
    }
    if (payload.adminNote !== undefined) {
      lead.adminNote = String(payload.adminNote).trim();
    }
    if (payload.preferredTime !== undefined) {
      lead.preferredTime = String(payload.preferredTime).trim();
    }

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "DEMO_REQUEST_UPDATE",
      target: `${lead.id}: ${lead.fullName} (${lead.orgName})`,
      severity: "INFO",
      details: `Cập nhật trạng thái xử lý Demo [${lead.productName}]: ${oldStatus} -> ${lead.status}. Ghi chú: ${lead.adminNote || "Không có"}`
    });

    this.save();
    return lead;
  }

  deleteDemoRequest(leadId, actorKey = "super-admin", ipAddress = "103.170.122.138") {
    if (!Array.isArray(this.state.demoRequests)) {
      this.state.demoRequests = JSON.parse(JSON.stringify(INITIAL_DEMO_REQUESTS));
    }
    const idx = this.state.demoRequests.findIndex((item) => item.id === leadId);
    if (idx === -1) {
      throw new Error(`Không tìm thấy yêu cầu đăng ký Demo mã '${leadId}' để xoá.`);
    }
    const removed = this.state.demoRequests.splice(idx, 1)[0];

    this.addAuditLog({
      actorKey,
      ipAddress,
      action: "DEMO_REQUEST_DELETE",
      target: `${removed.id}: ${removed.fullName} (${removed.orgName})`,
      severity: "WARNING",
      details: `Đã xoá yêu cầu đăng ký Demo sản phẩm "${removed.productName}" của khách hàng ${removed.fullName}.`
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
  JSON_DB_PATH,
  getMysqlStatus
};

