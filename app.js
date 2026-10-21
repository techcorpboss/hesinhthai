/**
 * TechCorp Ecosystem Hub (v2.0) - Frontend Application
 * Tích hợp đầy đủ:
 *   1. Quản trị Ứng dụng Hệ sinh thái (Thêm mới, Xem, Sửa, Cấp lại Key, Khóa, Xoá)
 *   2. Quản trị Diễn đàn (Thẩm định Duyệt/Từ chối, Tạo mới, Xem/Sửa, Xoá, Clock/Lock bình luận)
 *   3. Quản lý Tài khoản Người dùng TechCorp ID (Xem, Tạo mới, Sửa, Phân quyền, Khóa, Xoá)
 *   4. Truy vết Người dùng & Nhật ký Kiểm toán (Audit Logs + Xuất CSV)
 */

const STATE = {
  apiOnline: false,
  ssoToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2hlc2luaHRoYWkudGVjaGNvcnAuaW5mby52biIsInN1YiI6IlVTUi1BRE1JTi0wMCIsInBlcnNvbmFLZXkiOiJzdXBlci1hZG1pbiIsImVjb3N5c3RlbVJlZ2lvbiI6Iktow6FuaCBIw7JhIn0.techcorp_verified_signature",
  currentPersona: "super-admin",
  selectedForumCategory: "all",
  selectedProductCategory: "all",
  apps: [
    {
      id: "mamnon",
      name: "EduManager Pro — Quản lý Trường Mầm non & AI",
      badge: "EdTech K-12",
      appUrl: "https://mamnon.techcorp.info.vn",
      webhookUrl: "https://mamnon.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý hồ sơ trẻ, điểm danh AI, thực đơn dinh dưỡng, Sổ liên lạc điện tử Phụ huynh & thu học phí QR tự động.",
      apiKeyMasked: "tc_live_mamn...2b01",
      status: "active"
    },
    {
      id: "tieuhoc",
      name: "EduManager Pro — Quản lý Trường Tiểu học & AI",
      badge: "EdTech K-12",
      appUrl: "https://tieuhoc.techcorp.info.vn",
      webhookUrl: "https://tieuhoc.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý học vụ Tiểu học, đánh giá phẩm chất & năng lực theo Thông tư Bộ GD&ĐT, học bạ số và kết nối Phụ huynh.",
      apiKeyMasked: "tc_live_tieu...2b02",
      status: "active"
    },
    {
      id: "thcs",
      name: "EduManager Pro — Quản lý Trường THCS & Trợ lý AI",
      badge: "EdTech K-12",
      appUrl: "https://thcs.techcorp.info.vn",
      webhookUrl: "https://thcs.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý giáo vụ Trung học Cơ sở, phân công giảng dạy, sổ điểm điện tử, học bạ số và kiểm tra định kỳ trên LMS.",
      apiKeyMasked: "tc_live_thcs...2b03",
      status: "active"
    },
    {
      id: "thpt",
      name: "EduManager Pro — Quản lý Trường THPT & Hướng nghiệp AI",
      badge: "EdTech K-12",
      appUrl: "https://thpt.techcorp.info.vn",
      webhookUrl: "https://thpt.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý toàn diện trường THPT, phân ban tổ hợp môn Chương trình GDPT 2018, luyện thi tốt nghiệp & hướng nghiệp AI.",
      apiKeyMasked: "tc_live_thpt...2b04",
      status: "active"
    },
    {
      id: "gdtx",
      name: "EduManager Pro — Quản lý Trung tâm GDNN - GDTX",
      badge: "EdTech K-12",
      appUrl: "https://gdtx.techcorp.info.vn",
      webhookUrl: "https://gdtx.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Quản lý học viên Giáo dục Thường xuyên, liên kết đào tạo nghề, văn bằng chứng chỉ và giới thiệu việc làm doanh nghiệp.",
      apiKeyMasked: "tc_live_gdtx...2b05",
      status: "active"
    },
    {
      id: "qldt",
      name: "TC COMPASS — Quản trị Đại học & Đánh giá Hiệu suất",
      badge: "EdTech & LMS",
      appUrl: "https://qldt.techcorp.info.vn",
      webhookUrl: "https://qldt.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Hệ thống TC COMPASS v1.0 quản trị đào tạo Đại học/Cao đẳng theo học chế tín chỉ, KPI giảng viên & cổng thực tập sinh viên.",
      apiKeyMasked: "tc_live_qldt...2b06",
      status: "active"
    },
    {
      id: "ttnn",
      name: "Quản lý Trung tâm Ngoại ngữ & Tin học Chuẩn Quốc tế",
      badge: "EdTech & LMS",
      appUrl: "https://ttnn.techcorp.info.vn",
      webhookUrl: "https://ttnn.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "CRM Tuyển sinh đa kênh, quản lý lớp học, lịch giáo viên bản xứ, học phí và liên thông phòng thi IELTS/TOEIC/MOS.",
      apiKeyMasked: "tc_live_ttnn...2b07",
      status: "active"
    },
    {
      id: "lms",
      name: "TechCorp LMS & E-Testing — Đào tạo & Khảo thí Trực tuyến",
      badge: "EdTech & LMS",
      appUrl: "https://lms.techcorp.info.vn",
      webhookUrl: "https://lms.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phòng thi trực tuyến chống gian lận, ngân hàng đề chuẩn hóa, chấm điểm tự động và cấp Chứng chỉ Năng lực Số QR.",
      apiKeyMasked: "tc_live_lms_...2b08",
      status: "active"
    },
    {
      id: "learn",
      name: "TechCorpLearn — Nền tảng Học Trực tuyến & Khóa học Số",
      badge: "EdTech & LMS",
      appUrl: "https://learn.techcorp.info.vn",
      webhookUrl: "https://learn.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Cổng học tập trực tuyến ('Học để dẫn đầu') cung cấp khóa học video tương tác, lộ trình kỹ năng số, AI & ngoại ngữ thực chiến.",
      apiKeyMasked: "tc_live_lear...2b09",
      status: "active"
    },
    {
      id: "kpi",
      name: "TechCorp BSC-KPI — Quản trị Mục tiêu & Hiệu suất Thông minh",
      badge: "Enterprise & KPI",
      appUrl: "https://kpi.techcorp.info.vn",
      webhookUrl: "https://kpi.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Hệ thống Thẻ điểm cân bằng BSC & quản trị mục tiêu KPI/OKR tự động từ Ban Giám đốc xuống từng phòng ban và nhân sự.",
      apiKeyMasked: "tc_live_kpi_...2b10",
      status: "active"
    },
    {
      id: "erp",
      name: "TechCorp ERP — Quản trị Doanh nghiệp Tổng thể",
      badge: "Enterprise & KPI",
      appUrl: "https://erp.techcorp.info.vn",
      webhookUrl: "https://erp.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Điều hành doanh nghiệp hợp nhất: HRM Nhân sự & Tuyển dụng 1-Click, CRM Khách hàng, Tài chính - Kế toán, Kho vận & Dự án.",
      apiKeyMasked: "tc_live_erp_...2b11",
      status: "active"
    },
    {
      id: "techcorp",
      name: "TechCorp Academy — Giải pháp PMS, ERP, LMS & Đào tạo",
      badge: "Enterprise & KPI",
      appUrl: "https://techcorp.info.vn",
      webhookUrl: "https://techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Cổng thông tin chính thức TechCorp Academy: Cung cấp giải pháp phần mềm quản trị PMS, ERP, LMS và đào tạo chuyển đổi số thực chiến.",
      apiKeyMasked: "tc_live_tech...2b12",
      status: "active"
    },
    {
      id: "qldh",
      name: "TechCorp PMS — Hệ thống Quản lý Khách sạn & Resort",
      badge: "Chuyên ngành",
      appUrl: "https://qldh.techcorp.info.vn",
      webhookUrl: "https://qldh.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phần mềm Quản lý Khách sạn & Resort (PMS): Đặt phòng, Lễ tân (Front Office), Buồng phòng, POS Nhà hàng & kết nối nhân sự du lịch.",
      apiKeyMasked: "tc_live_qldh...2b13",
      status: "active"
    },
    {
      id: "bds",
      name: "Hưng Phát Land — Sàn Giao dịch Bất động sản & Trợ lý AI",
      badge: "Chuyên ngành",
      appUrl: "https://bds.techcorp.info.vn",
      webhookUrl: "https://bds.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Sàn giao dịch Bất động sản cao cấp tích hợp Trợ lý AI tư vấn 24/7, quản lý giỏ hàng dự án, CRM môi giới & pháp lý số.",
      apiKeyMasked: "tc_live_bds_...2b14",
      status: "active"
    },
    {
      id: "noithat",
      name: "TechCorp Interior — Thiết kế, Thi công & Showroom Nội thất",
      badge: "Chuyên ngành",
      appUrl: "https://noithat.techcorp.info.vn",
      webhookUrl: "https://noithat.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Nền tảng Kiến tạo Không gian Hoàn mỹ: Trưng bày sản phẩm nội thất, báo giá dự toán thiết kế - thi công & quản lý công trình.",
      apiKeyMasked: "tc_live_noit...2b15",
      status: "active"
    },
    {
      id: "jobai",
      name: "TechCorp HireMind AI — Sàn Tuyển dụng & Tìm việc AI ATS",
      badge: "Enterprise & KPI",
      appUrl: "https://jobai.techcorp.info.vn/careers.html",
      webhookUrl: "https://jobai.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Sàn Tuyển dụng & Tìm việc thông minh tích hợp AI ATS đa ngôn ngữ: Chấm điểm CV tự động, gợi ý việc làm phù hợp năng lực số và kết nối trực tiếp Doanh nghiệp với Trường ĐH & Trung tâm đào tạo.",
      apiKeyMasked: "tc_live_joba...2b16",
      status: "active"
    }
  ],
  currentHeroSlideIndex: 0,
  heroSliderPaused: false,
  heroSliders: [
    {
      id: "SLIDE-01",
      order: 1,
      badge: "⚡ HỆ SINH THÁI SỐ ĐA CHIỀU • 16 NỀN TẢNG LIVE",
      title: "Kết nối Trường học – Trung tâm Đào tạo – Sàn Việc làm AI & Doanh nghiệp trên Một Trục SSO",
      subtitle:
        "Hệ sinh thái TechCorp liên thông trực tiếp 16 nền tảng phần mềm đang vận hành thực tế trên *.techcorp.info.vn: từ Giáo dục K12, Đại học, Trung tâm Ngoại ngữ - Tin học, Sàn Tuyển dụng AI (JobAI) đến Quản trị Doanh nghiệp ERP, KPI, Khách sạn PMS & BĐS.",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Trục Liên thông 16 Hệ thống Phần mềm Thực tế • hesinhthai.techcorp.info.vn",
      primaryCtaText: "🚀 Khám phá 16 Sản phẩm Thực tế",
      primaryCtaLink: "#sec-products",
      secondaryCtaText: "🔐 Đăng nhập Cổng Quản trị",
      secondaryCtaLink: "login.html",
      accentGradient: "linear-gradient(135deg, #002b7f 0%, #0055e8 55%, #0088ff 100%)",
      highlights: ["16 Hệ thống Live (HTTP 200)", "Định danh tập trung TechCorp ID", "Quà tặng chéo Give-to-Get"]
    },
    {
      id: "SLIDE-02",
      order: 2,
      badge: "🤖 SÀN TUYỂN DỤNG & TÌM VIỆC AI • JOBAI.TECHCORP.INFO.VN",
      title: "TechCorp HireMind AI — Sàn Tuyển dụng Thông minh & Chấm điểm CV bằng AI Đa ngôn ngữ",
      subtitle:
        "Tự động kết nối Hồ sơ Năng lực Số (Talent Passport) của Sinh viên ĐH & Học viên Trung tâm với nhu cầu tuyển dụng thực tế của Doanh nghiệp. AI phân tích độ khớp JD - CV và đẩy ứng viên 1-Click về phân hệ HRM trên ERP.",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "TechCorp HireMind AI — Sàn Tuyển dụng & Tìm việc AI • jobai.techcorp.info.vn",
      primaryCtaText: "🤖 Truy cập Sàn Việc làm JobAI ↗",
      primaryCtaLink: "https://jobai.techcorp.info.vn/careers.html",
      secondaryCtaText: "🏅 Xem Hồ sơ Nhân lực Xác thực",
      secondaryCtaLink: "#sec-talent-lms",
      accentGradient: "linear-gradient(135deg, #003580 0%, #026aa7 55%, #00a8cc 100%)",
      highlights: ["AI ATS Chấm điểm & Xếp hạng CV", "Kết nối Sinh viên ĐH & Doanh nghiệp", "Đồng bộ 1-Click về ERP HRM"]
    },
    {
      id: "SLIDE-03",
      order: 3,
      badge: "🎓 KHỐI GIÁO DỤC MẦM NON – K12 & GDTX • EDUMANAGER PRO",
      title: "Hệ sinh thái Quản trị Trường học Thông minh từ Mầm non, Tiểu học, THCS, THPT đến GDTX",
      subtitle:
        "Bộ 05 nền tảng EduManager Pro chuyên biệt cho từng cấp học: Điểm danh AI, Sổ liên lạc điện tử Phụ huynh, Học bạ số chuẩn Thông tư Bộ GD&ĐT, Hướng nghiệp AI và Cổng gạch nợ Học phí QR động trong 3 giây.",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "05 Nền tảng EduManager Pro (Mầm non, Tiểu học, THCS, THPT, GDTX)",
      primaryCtaText: "🎓 Xem 05 Phần mềm Trường học",
      primaryCtaLink: "#sec-products",
      secondaryCtaText: "🏫 Vào Workspace Hiệu trưởng",
      secondaryCtaLink: "login.html?role=school-principal",
      accentGradient: "linear-gradient(135deg, #0b2559 0%, #1d4ed8 55%, #3b82f6 100%)",
      highlights: ["Học bạ số & Sổ liên lạc Phụ huynh", "Thu học phí QR tự động 3 giây", "Trợ lý AI soạn giảng & hướng nghiệp"]
    },
    {
      id: "SLIDE-04",
      order: 4,
      badge: "🏫 ĐẠI HỌC TC COMPASS, TRUNG TÂM NN-TH & KHẢO THÍ LMS",
      title: "Liên thông Quản trị Đại học Tín chỉ, Trung tâm Ngoại ngữ - Tin học & Phòng Thi Online",
      subtitle:
        "Kết nối liền mạch giữa quản trị học vụ Đại học (qldt.techcorp.info.vn), Trung tâm Ngoại ngữ - Tin học (ttnn), Khảo thí trực tuyến chống gian lận (lms) và Cổng khóa học số TechCorpLearn (learn.techcorp.info.vn).",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "TC COMPASS Đại học • QL Trung tâm NN-TH • LMS Khảo thí & TechCorpLearn",
      primaryCtaText: "📝 Khám phá Khối ĐH & LMS",
      primaryCtaLink: "#sec-products",
      secondaryCtaText: "🏆 Đấu trường Thi Online",
      secondaryCtaLink: "#sec-talent-lms",
      accentGradient: "linear-gradient(135deg, #1e1b4b 0%, #1e40af 55%, #0284c7 100%)",
      highlights: ["Khảo thí IELTS/TOEIC/MOS Online", "Cấp Chứng chỉ Năng lực Số QR", "Tự động đẩy Lead về CRM Trung tâm"]
    },
    {
      id: "SLIDE-05",
      order: 5,
      badge: "🏢 QUẢN TRỊ DOANH NGHIỆP TỔNG THỂ • ERP & BSC-KPI",
      title: "Điều hành Doanh nghiệp Hợp nhất với TechCorp ERP, Thẻ điểm Cân bằng BSC-KPI & Chợ B2B",
      subtitle:
        "Số hóa toàn diện hoạt động doanh nghiệp trên erp.techcorp.info.vn và kpi.techcorp.info.vn: Quản trị mục tiêu chiến lược BSC-KPI, Nhân sự - Tiền lương, CRM Bán hàng, Tài chính - Kế toán và phát hành E-Voucher nội bộ.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "TechCorp ERP (erp.techcorp.info.vn) & Quản trị Hiệu suất BSC-KPI (kpi.techcorp.info.vn)",
      primaryCtaText: "🏢 Mở Giải pháp ERP & KPI",
      primaryCtaLink: "#sec-products",
      secondaryCtaText: "💬 Chợ Giao thương B2B",
      secondaryCtaLink: "#sec-exchange",
      accentGradient: "linear-gradient(135deg, #00296b 0%, #00509d 55%, #0077b6 100%)",
      highlights: ["Bản đồ Chiến lược BSC & KPI/OKR", "HRM, CRM, Tài chính, Kho vận & Dự án", "Ưu đãi chéo B2B giữa các Thành viên"]
    },
    {
      id: "SLIDE-06",
      order: 6,
      badge: "🏨 HỆ SINH THÁI CHUYÊN NGÀNH • KHÁCH SẠN PMS, BĐS AI & NỘI THẤT",
      title: "Giải pháp Chuyên sâu cho Khách sạn & Resort (PMS), Sàn Giao dịch BĐS AI & Thiết kế Nội thất",
      subtitle:
        "Bộ 03 nền tảng chuyên ngành đang vận hành thực tế: Quản lý Khách sạn & Resort (qldh.techcorp.info.vn), Sàn BĐS Hưng Phát Land tích hợp AI (bds.techcorp.info.vn) và Showroom Thiết kế - Thi công Nội thất (noithat.techcorp.info.vn).",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "TechCorp PMS Resort • Sàn BĐS Hưng Phát Land AI • TechCorp Interior Nội thất",
      primaryCtaText: "🏨 Xem Khối PMS, BĐS & Nội thất",
      primaryCtaLink: "#sec-products",
      secondaryCtaText: "💳 Tính Giá Gói Combo",
      secondaryCtaLink: "#sec-pricing",
      accentGradient: "linear-gradient(135deg, #0f172a 0%, #0369a1 55%, #0ea5e9 100%)",
      highlights: ["Quản lý Đặt phòng, Lễ tân & POS Resort", "Sàn BĐS tích hợp Trợ lý AI 24/7", "Báo giá & Quản lý Thi công Nội thất"]
    }
  ],
  users: [
    {
      id: "USR-ADMIN-00",
      personaKey: "super-admin",
      fullName: "Quản trị viên Hệ sinh thái TechCorp",
      email: "admin@techcorp.info.vn",
      phone: "0905.111.999",
      org: "TechCorp Headquarters (Điều hành 16 Hệ thống Live)",
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
        "techcorp",
        "qldh",
        "bds",
        "noithat",
        "jobai"
      ],
      status: "active",
      lastLogin: "Vừa xong",
      ipAddress: "103.170.122.138"
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
      ipAddress: "113.160.214.88"
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
      ipAddress: "14.161.45.120"
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
      ipAddress: "27.68.112.41"
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
      defaultAppId: "jobai",
      assignedApps: ["jobai", "lms", "learn", "qldt", "ttnn"],
      status: "active",
      lastLogin: "2 giờ trước",
      ipAddress: "171.244.19.72"
    }
  ],
  personas: {
    "super-admin": {
      id: "super-admin",
      userId: "USR-ADMIN-00",
      name: "Quản trị viên Hệ sinh thái TechCorp",
      org: "TechCorp Headquarters (Điều hành 16 Hệ thống Live)",
      roleBadge: "🛡️ Super Admin TechCorp"
    },
    "ceo-sme": {
      id: "ceo-sme",
      userId: "USR-NT-001",
      name: "Nguyễn Hải Đăng (CEO Resort & Doanh nghiệp)",
      org: "Nha Trang Bay Resort & Hưng Phát Land (ERP, KPI, JobAI, PMS)",
      roleBadge: "Khối Doanh nghiệp SME"
    },
    "center-dir": {
      id: "center-dir",
      userId: "USR-NT-002",
      name: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
      org: "Ocean English & IT Center Nha Trang (TTNN, LMS, TechCorpLearn)",
      roleBadge: "Khối Đào tạo NN-TH"
    },
    "school-principal": {
      id: "school-principal",
      userId: "USR-NT-003",
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Liên cấp & ĐH Nha Trang (Mầm non - THPT & TC COMPASS)",
      roleBadge: "Khối Cơ sở Giáo dục"
    },
    "student-user": {
      id: "student-user",
      userId: "USR-NT-004",
      name: "Nguyễn Minh Khôi (Sinh viên / Ứng viên)",
      org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821 (JobAI + LMS + TechCorpLearn)",
      roleBadge: "Cộng đồng Học viên / SV"
    }
  },
  forumPosts: [
    {
      id: "POST-101",
      category: "rfq",
      categoryLabel: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
      status: "approved",
      locked: false,
      pinned: true,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Cần tìm đối tác tại Nha Trang] Tìm Trung tâm đào tạo Tiếng Anh & Tiếng Hàn giao tiếp cho 25 nhân sự Lễ tân - Nhà hàng",
      content:
        "Chào các anh/chị trong Cộng đồng Hệ sinh thái TechCorp Khánh Hòa. Chuẩn bị đón đoàn khách quốc tế mùa cao điểm cuối năm, Nha Trang Bay Resort cần tìm 01 Trung tâm Ngoại ngữ uy tín trong hệ sinh thái để đào tạo cấp tốc 8 tuần (học kết hợp trên LMS Thi Online của TechCorp và thực hành tại khách sạn). Ưu tiên các trung tâm đang dùng hệ thống TechCorp để đồng bộ điểm chuyên cần trực tiếp về phân hệ HRM của chúng tôi.",
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
      unitGroup: "training_center",
      unitGroupName: "🏫 Khối Trung tâm Ngoại ngữ - Tin học",
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
      createdAt: "1 giờ trước",
      likes: 34,
      views: 289,
      comments: [
        {
          id: "CMT-3",
          authorName: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
          authorOrg: "Hệ thống Giáo dục Sao Biển Nha Trang",
          roleBadge: "Khối Cơ sở Giáo dục",
          text: "Chương trình rất thiết thực! Trường Sao Biển đăng ký 120 suất kiểm tra tiếng Anh năng khiếu cuối tuần này cho các bé khối Lá và Tiểu học nhé.",
          time: "45 phút trước"
        }
      ]
    },
    {
      id: "POST-1792469740466",
      category: "rfq",
      categoryLabel: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Cam Ranh - Nha Trang] Cần đơn vị thiết kế Website đa ngôn ngữ & cung cấp đồng phục cho 40 nhân sự",
      content:
        "Chúng tôi vừa mở thêm chi nhánh dịch vụ du lịch & lưu trú tại Bãi Dài - Cam Ranh, cần tìm đối tác trong Hệ sinh thái TechCorp thiết kế Website đa ngôn ngữ (Việt - Anh - Hàn - Nga) tích hợp đặt phòng trực tuyến và đơn vị may đồng phục khách sạn cao cấp cho 40 nhân sự mới.",
      memberDeal: "Tặng 10 Voucher nghỉ dưỡng cuối tuần tại Resort cho đối tác ký hợp đồng triển khai trong tháng này.",
      author: {
        name: "Nguyễn Hải Đăng (CEO Resort & Travel)",
        org: "Nha Trang Bay Resort & Travel",
        roleBadge: "Khối Doanh nghiệp SME",
        verifiedApp: "Đang dùng: ERP + Website TechCorp"
      },
      createdAt: "2 giờ trước",
      likes: 19,
      views: 164,
      comments: [
        {
          id: "CMT-1792",
          authorName: "Ông Vũ Đình Khôi (Giám đốc Điều hành)",
          authorOrg: "Công ty CP Thương mại & Dịch vụ SeaTech Khánh Hòa",
          roleBadge: "Khối Doanh nghiệp SME",
          text: "Bên SeaTech có bộ phận cung ứng đồng phục khách sạn chống nhăn cao cấp tại Nha Trang, giảm 15% cho thành viên Hệ sinh thái TechCorp. Em đã gửi mẫu vải qua Zalo nhé anh!",
          time: "1 giờ trước"
        }
      ]
    },
    {
      id: "POST-103",
      category: "comarketing",
      categoryLabel: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "school_uni",
      unitGroupName: "🎓 Khối Trường học Mầm non – K12 & Đại học",
      title: "Mời 05 Doanh nghiệp Du lịch / F&B / Nha khoa tại Nha Trang đồng hành Ngày hội Gia đình & Tuyển sinh Mùa Hè (Quy mô 800 Phụ huynh)",
      content:
        "Tháng tới Hệ thống Giáo dục Sao Biển (KĐT Mỹ Gia & Vĩnh Điềm Trung) tổ chức Ngày hội Trải nghiệm Công nghệ & Kỹ năng cho 800 phụ huynh học sinh. Nhà trường dành tặng 05 gian hàng trưng bày miễn phí và tích hợp phát E-Voucher trên App Sổ liên lạc Điện tử cho các doanh nghiệp cùng thuộc Hệ sinh thái TechCorp.",
      memberDeal: "Miễn phí 100% gian hàng + Đẩy thông báo thương hiệu tài trợ tới 1.200 Phụ huynh trên App Trường.",
      author: {
        name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
        org: "Hệ thống Giáo dục Sao Biển Nha Trang",
        roleBadge: "Khối Cơ sở Giáo dục",
        verifiedApp: "Đang dùng: QL Trường học + LMS"
      },
      createdAt: "3 giờ trước",
      likes: 27,
      views: 195,
      comments: []
    },
    {
      id: "POST-105",
      category: "rfq",
      categoryLabel: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Bãi Dài - Cam Ranh] Tìm nhà cung ứng thực phẩm sạch VietGAP hàng ngày & tiếp nhận 15 Sinh viên Thực tập Quản trị Khách sạn",
      content:
        "Asia Bay Resort & Spa Cam Ranh (quy mô 220 phòng & biệt thự biển) đang mở rộng công suất đón đoàn khách MICE quốc tế. Chúng tôi cần kết nối với đơn vị cung ứng thực phẩm - rau củ - hải sản đạt chuẩn VietGAP tại Khánh Hòa và tiếp nhận 15 sinh viên năm cuối ngành Du lịch - Nhà hàng thực tập có hưởng phụ cấp.",
      memberDeal: "Thanh toán công nợ tự động 7 ngày/lần qua TechCorp ERP + Tài trợ gói Teambuilding bãi biển giảm 35% cho đối tác.",
      author: {
        name: "Ông Trần Quốc Bảo (Tổng Quản lý GM)",
        org: "Asia Bay Resort & Spa Cam Ranh",
        roleBadge: "Khối Doanh nghiệp SME",
        verifiedApp: "Đang dùng: TechCorp PMS + ERP"
      },
      createdAt: "4 giờ trước",
      likes: 23,
      views: 178,
      comments: [
        {
          id: "CMT-105-1",
          authorName: "Bà Nguyễn Thị Thu Thủy (Giám đốc Điều hành)",
          authorOrg: "Công ty CP Thực phẩm & Suất ăn Học đường Biển Xanh Nha Trang",
          roleBadge: "Khối Doanh nghiệp SME",
          text: "Thực phẩm Biển Xanh hiện có xe lạnh giao tuyến Nha Trang - Bãi Dài Cam Ranh lúc 5h30 sáng hàng ngày, đầy đủ chứng nhận VietGAP & ISO 22000. Rất mong được hợp tác cùng Asia Bay Resort!",
          time: "2 giờ trước"
        }
      ]
    },
    {
      id: "POST-106",
      category: "spotlight",
      categoryLabel: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Đặc quyền Học đường] Giảm 12% hợp đồng suất ăn bán trú chuẩn VietGAP & đồng bộ thực đơn dinh dưỡng lên Sổ liên lạc EduManager",
      content:
        "Nhà máy chế biến suất ăn học đường Biển Xanh (KCN Đắc Lộc - Nha Trang) đạt chuẩn ISO 22000 & VietGAP hiện đang cung cấp 6.500 suất ăn/ngày. Chúng tôi tích hợp API đồng bộ thực đơn hàng ngày, hình ảnh mẫu thức ăn lưu nghiệm và định lượng Kcal trực tiếp lên Sổ liên lạc điện tử EduManager Pro để phụ huynh theo dõi minh bạch.",
      memberDeal: "🎁 Giảm ngay 12% giá trị hợp đồng năm học mới + Tài trợ 100% tủ giữ nhiệt inox công nghiệp tại bếp ăn nhà trường.",
      author: {
        name: "Bà Nguyễn Thị Thu Thủy (Giám đốc Điều hành)",
        org: "Công ty CP Thực phẩm & Suất ăn Học đường Biển Xanh Nha Trang",
        roleBadge: "Khối Doanh nghiệp SME",
        verifiedApp: "Đang dùng: ERP Kho vận + Website TechCorp"
      },
      createdAt: "5 giờ trước",
      likes: 31,
      views: 215,
      comments: []
    },
    {
      id: "POST-107",
      category: "spotlight",
      categoryLabel: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "realestate_interior",
      unitGroupName: "🏙️ Khối Bất động sản & Nội thất",
      title: "[Ưu đãi Mở rộng Cơ sở] Giảm 20% gói Thiết kế - Thi công Phòng học Thông minh & Văn phòng Doanh nghiệp tại Nha Trang",
      content:
        "Liên minh Sàn Giao dịch BĐS Hưng Phát Land & Xưởng Nội thất TechCorp 3D cung cấp dịch vụ trọn gói từ tìm kiếm mặt bằng mở trường/trung tâm tại KĐT Mỹ Gia, Hà Quang II, Vĩnh Điềm Trung đến thiết kế 3D và thi công nội thất phòng học chuẩn quốc tế, văn phòng làm việc hiện đại.",
      memberDeal: "🎁 Miễn phí 100% bản vẽ thiết kế 3D phối cảnh + Chiết khấu 20% giá xuất xưởng nội thất cho đơn vị thành viên TechCorp.",
      author: {
        name: "Ban Giám đốc Hưng Phát Land",
        org: "Sàn Giao dịch BĐS Hưng Phát Land & Nội thất 3D",
        roleBadge: "Khối Bất động sản & Nội thất",
        verifiedApp: "Đang dùng: BĐS AI + Nội thất 3D"
      },
      createdAt: "6 giờ trước",
      likes: 29,
      views: 240,
      comments: []
    },
    {
      id: "POST-108",
      category: "comarketing",
      categoryLabel: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "school_uni",
      unitGroupName: "🎓 Khối Trường học Mầm non – K12 & Đại học",
      title: "[Job Fair & Thực tập Doanh nghiệp] Mời 30 Doanh nghiệp SME & Resort tham gia Tuần lễ Tuyển dụng & Phỏng vấn Thực tập sinh Số",
      content:
        "Phối hợp cùng Sàn Tuyển dụng AI (jobai.techcorp.info.vn), Trung tâm Hợp tác Doanh nghiệp tổ chức đợt kết nối 450 sinh viên năm cuối các ngành CNTT, Quản trị Khách sạn, Kế toán, Ngôn ngữ Anh - Hàn - Trung đã có Hồ sơ Năng lực Số xác thực điểm thi LMS với các doanh nghiệp trong Hệ sinh thái TechCorp.",
      memberDeal: "Miễn phí bàn phỏng vấn trực tiếp tại Hội trường + Cấp quyền truy cập sớm 450 CV xác thực trên Sàn JobAI.",
      author: {
        name: "Ban Hợp tác Doanh nghiệp & Việc làm Sinh viên",
        org: "Trường Đại học Nha Trang (NTU)",
        roleBadge: "Khối Cơ sở Giáo dục",
        verifiedApp: "Đang dùng: TC COMPASS + JobAI"
      },
      createdAt: "8 giờ trước",
      likes: 45,
      views: 360,
      comments: []
    },
    {
      id: "POST-109",
      category: "spotlight",
      categoryLabel: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "training_center",
      unitGroupName: "🏫 Khối Trung tâm Ngoại ngữ - Tin học",
      title: "[Đào tạo Ngoại ngữ Doanh nghiệp] Tặng gói đào tạo Tiếng Hàn - Nhật - Trung chuyên ngành Du lịch & F&B giảm 30% học phí",
      content:
        "Đáp ứng làn sóng du khách Hàn Quốc, Nhật Bản và Trung Quốc tăng mạnh tại Nha Trang - Khánh Hòa, Trung tâm Ngoại ngữ Á Châu thiết kế các khóa giao tiếp thực chiến 6 tuần dành riêng cho nhân viên Lễ tân, Buồng phòng, Nhà hàng, Spa với lịch học linh hoạt theo ca.",
      memberDeal: "🎁 Giảm 30% học phí cho doanh nghiệp đăng ký từ 10 nhân sự + Miễn phí kiểm tra đầu vào và cấp chứng chỉ số trên TechCorp LMS.",
      author: {
        name: "Ban Giám đốc Trung tâm Ngoại ngữ Á Châu",
        org: "Á Châu Language Center",
        roleBadge: "Khối Đào tạo NN-TH",
        verifiedApp: "Đang dùng: QL Trung tâm + LMS"
      },
      createdAt: "12 giờ trước",
      likes: 22,
      views: 185,
      comments: []
    },
    {
      id: "POST-104",
      category: "knowledge",
      categoryLabel: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
      status: "approved",
      locked: true,
      pinned: false,
      unitGroup: "school_uni",
      unitGroupName: "🎓 Khối Trường học Mầm non – K12 & Đại học",
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
    },
    {
      id: "POST-110",
      category: "knowledge",
      categoryLabel: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Case Study Thực tế] Cách SeaTech Khánh Hòa áp dụng Thẻ điểm cân bằng BSC-KPI & ERP giúp tăng 38% năng suất đội ngũ kinh doanh",
      content:
        "Sau 3 tháng chuyển đổi từ bảng tính Excel rời rạc sang bộ đôi TechCorp ERP và Quản trị Mục tiêu BSC-KPI (kpi.techcorp.info.vn), toàn bộ 85 nhân sự của SeaTech đã nắm rõ mục tiêu OKR/KPI theo tuần. Hệ thống tự động tính hoa hồng và thưởng hiệu suất minh bạch, giảm 90% tranh chấp cuối kỳ.",
      memberDeal: "Chia sẻ miễn phí bộ thư viện 45 chỉ số KPI mẫu cho bộ phận Sales, Marketing, Nhân sự & Kế toán doanh nghiệp SME.",
      author: {
        name: "Ông Vũ Đình Khôi (Giám đốc Điều hành)",
        org: "Công ty CP Thương mại & Dịch vụ SeaTech Khánh Hòa",
        roleBadge: "Khối Doanh nghiệp SME",
        verifiedApp: "Đang dùng: TechCorp ERP + BSC-KPI"
      },
      createdAt: "1 ngày trước",
      likes: 36,
      views: 274,
      comments: []
    },
    {
      id: "POST-111",
      category: "comarketing",
      categoryLabel: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "training_center",
      unitGroupName: "🏫 Khối Trung tâm Ngoại ngữ - Tin học",
      title: "[Hợp tác CLB Tiếng Anh Học đường] Tài trợ Giáo viên Bản xứ giao lưu Ngoại khóa cuối tuần cho các Trường Tiểu học & THCS",
      content:
        "Hệ thống Anh ngữ Quốc tế Global Star (3 cơ sở tại Nha Trang) triển khai chương trình 'English STEM & Robotics Weekend' dành cho các trường Tiểu học và THCS. Đội ngũ giáo viên bản xứ của Global Star sẽ trực tiếp về trường đồng tổ chức CLB tiếng Anh hoàn toàn miễn phí.",
      memberDeal: "Tài trợ 100% chi phí giáo viên bản xứ + Tặng 50 học bổng bán phần khóa hè cho học sinh xuất sắc của trường.",
      author: {
        name: "Bà Phạm Hoàng Yến (Giám đốc Học vụ)",
        org: "Hệ thống Anh ngữ Quốc tế Global Star",
        roleBadge: "Khối Đào tạo NN-TH",
        verifiedApp: "Đang dùng: QL Trung tâm + TechCorpLearn"
      },
      createdAt: "2 ngày trước",
      likes: 25,
      views: 208,
      comments: []
    },
    {
      id: "POST-112",
      category: "spotlight",
      categoryLabel: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)",
      status: "approved",
      locked: false,
      pinned: false,
      unitGroup: "sme_hospitality",
      unitGroupName: "🏢 Khối Doanh nghiệp SME, Du lịch & Khách sạn",
      title: "[Phúc lợi Y tế Học đường & Doanh nghiệp] Khám răng định kỳ miễn phí tại Trường học & Giảm 30% dịch vụ Nha khoa cho nhân sự TechCorp ID",
      content:
        "Hệ thống Nha khoa & Phòng khám Quốc tế Sài Gòn - Nha Trang triển khai gói chăm sóc sức khỏe răng miệng lưu động tại các trường Mầm non, Tiểu học và tặng gói khám tổng quát miễn phí cho toàn bộ cán bộ nhân viên doanh nghiệp thuộc Hệ sinh thái TechCorp.",
      memberDeal: "🎁 Khám răng định kỳ miễn phí 100% tại trường học + Giảm 30% dịch vụ nha khoa thẩm mỹ cho chủ thẻ TechCorp ID.",
      author: {
        name: "BS. CKII Nguyễn Trọng Nghĩa (Giám đốc Chuyên môn)",
        org: "Hệ thống Nha khoa Quốc tế Sài Gòn - Nha Trang",
        roleBadge: "Khối Doanh nghiệp SME",
        verifiedApp: "Đang dùng: CRM Chăm sóc khách hàng TechCorp"
      },
      createdAt: "2 ngày trước",
      likes: 33,
      views: 256,
      comments: []
    }
  ],
  auditLogs: [
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
      details: "Đã khóa bình luận (Clock/Lock) chủ đề hướng dẫn sau khi chốt tài liệu chuẩn."
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
  ],
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
      eventType: "ERP_JOB_POSTED",
      text: "[ERP -> Trường ĐH/TT] Nha Trang Bay Resort vừa đẩy 05 chỉ tiêu tuyển Lễ tân tiếng Anh/Hàn từ phân hệ HRM lên Cổng Việc làm Sinh viên."
    },
    {
      id: "EVT-1003",
      time: "5 phút trước",
      eventType: "EXAM_CERT_ISSUED",
      text: "[Thi Online -> Talent Passport] Học viên Trần Ngọc Bảo Trâm vừa hoàn thành bài thi IELTS Mock Test đạt 7.0 tại Ocean English Center."
    },
    {
      id: "EVT-1002",
      time: "18 phút trước",
      eventType: "CROSS_SCHOLARSHIP_SENT",
      text: "[Mầm non -> Trung tâm NN] 32 Phụ huynh tại Trường Mầm non Sao Biển (KĐT Mỹ Gia) đã nhận học bổng kiểm tra tiếng Anh thiếu nhi miễn phí."
    },
    {
      id: "EVT-1001",
      time: "40 phút trước",
      eventType: "B2B_QUOTE_REQUEST",
      text: "[B2B Matching] Trường Tiểu học Tư thục tại Vĩnh Điềm Trung vừa gửi yêu cầu báo giá Suất ăn học đường tới DN thực phẩm trong hệ sinh thái."
    }
  ],
  announcements: [
    {
      id: "ANN-MASTER-01",
      sourceType: "master",
      badge: "👑 THÔNG BÁO ĐIỀU HÀNH TỪ HỆ SINH THÁI TECHCORP",
      categoryTag: "Kiến trúc SSO & Liên thông",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
      views: 1480,
      readTime: "3 phút đọc",
      title: "Chính thức Liên thông 16 Nền tảng Phần mềm Thực tế trên *.techcorp.info.vn qua Trục SSO TechCorp ID v6.5",
      summary: "Toàn bộ 16 hệ thống đang chạy thực tế thuộc 6 nhóm sản phẩm gồm: Giáo dục Mầm non – K12 (mamnon, tieuhoc, thcs, thpt), Đại học & GDTX (qldt TC COMPASS, gdtx), Trung tâm NN-TH & LMS (ttnn, lms, learn), Sàn Việc làm AI (jobai, techcorp), Quản trị Doanh nghiệp (erp, kpi) và Chuyên ngành (qldh PMS Khách sạn, bds AI, noithat) đã kết nối tập trung.",
      content: "Ban Điều hành Hệ sinh thái TechCorp trân trọng thông báo: Trục xác thực tập trung TechCorp ID (Single Sign-On JWT v6.5) và Hệ thống Điều phối Sự kiện Liên thông (Central Event Bus) đã hoàn tất kết nối đồng bộ 100% với 16 nền tảng phần mềm chuyên sâu đang vận hành thực tế trên các tên miền *.techcorp.info.vn.\n\nVới kiến trúc hợp nhất này, mỗi đơn vị thành viên (Trường học, Trung tâm Ngoại ngữ - Tin học, Doanh nghiệp SME, Resort - Khách sạn, Sàn BĐS & Nội thất) sở hữu một Không gian Quản trị (Multi-Tenant Workspace) độc lập, bảo mật theo ma trận phân quyền RBAC 9x5, đồng thời có thể chia sẻ dữ liệu hai chiều theo thời gian thực.\n\nCụ thể, kết quả khảo thí và chứng chỉ năng lực số từ TechCorp LMS tự động gắn mã QR xác thực vào Hồ sơ Năng lực Số (Talent Passport) của sinh viên trên Sàn Việc làm HireMind AI (jobai.techcorp.info.vn), giúp các doanh nghiệp thành viên tuyển dụng và đồng bộ nhân sự mới vào phân hệ HRM trên TechCorp ERP chỉ với 1 cú nhấp chuột.",
      highlights: [
        "Đăng nhập 1 lần (SSO TechCorp ID) chuyển đổi mượt mà giữa 16 nền tảng phần mềm thuộc 6 nhóm chuyên ngành",
        "Đồng bộ tự động Chứng chỉ Thi Online QR từ LMS sang Sàn Tuyển dụng HireMind AI và phân hệ Nhân sự ERP",
        "Liên thông Sổ liên lạc điện tử Phụ huynh K-12 với Ví Học bổng & E-Voucher từ các Doanh nghiệp thành viên",
        "Đạt chuẩn an toàn thông tin đa tầng, giám sát truy vết IP theo thời gian thực (Security Audit Logs 24/7)"
      ],
      authorName: "Ban Điều hành Hệ sinh thái TechCorp",
      authorOrg: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
      createdAt: "Hôm nay, 08:00",
      pinned: true,
      actionLabel: "Khám phá 6 Nhóm Sản phẩm",
      actionView: "products"
    },
    {
      id: "ANN-MASTER-02",
      sourceType: "master",
      badge: "📢 CHÍNH SÁCH LIÊN KẾT HẠT NHÂN HỆ SINH THÁI TECHCORP",
      categoryTag: "Chính sách Tài trợ Hạt nhân",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
      views: 1265,
      readTime: "4 phút đọc",
      title: "Tài trợ 100% Phí Khởi tạo & Tặng Website Chuẩn SEO cho 57 Đơn vị Hạt nhân Giai đoạn 1 tại Khánh Hòa",
      summary: "Áp dụng cho 02 Trường ĐH/CĐ, 10 Trung tâm Ngoại ngữ - Tin học, 15 Trường Mầm non/Phổ thông và 30 Doanh nghiệp SME đầu tiên kích hoạt liên thông dữ liệu trên Hệ sinh thái TechCorp.",
      content: "Nhằm thúc đẩy chuyển đổi số toàn diện và xây dựng mạng lưới liên kết Giáo dục – Đào tạo – Tuyển dụng – Quản trị Doanh nghiệp bền vững tại Nha Trang - Khánh Hòa, Hệ sinh thái TechCorp chính thức công bố Gói Tài trợ Hạt nhân Giai đoạn 1 dành cho 57 đơn vị tiên phong.\n\nCác đơn vị tham gia chương trình Hạt nhân không chỉ được miễn 100% chi phí khởi tạo hạ tầng đám mây ban đầu và tặng kèm Website thương hiệu/tuyển sinh chuẩn SEO đa ngôn ngữ, mà còn được kích hoạt đặc quyền giao thương chéo (Give-to-Get) tiếp cận trực tiếp cộng đồng hơn 15.000 phụ huynh, học sinh, sinh viên và nhân sự văn phòng trong hệ sinh thái.\n\nĐội ngũ kỹ sư triển khai của TechCorp tại Nha Trang hỗ trợ trực tiếp tận nơi từ khâu chuẩn hóa dữ liệu, tập huấn cán bộ quản lý/giáo viên/nhân sự đến vận hành thực tế 24/7.",
      highlights: [
        "Miễn 100% phí khởi tạo hệ thống Cloud & Cài đặt cấu hình tên miền riêng cho 57 đơn vị hạt nhân đầu tiên",
        "Tặng miễn phí Website Tuyển sinh / Website Doanh nghiệp đa ngôn ngữ chuẩn SEO (trị giá 8 - 10 triệu VNĐ)",
        "Cấp quyền truy cập Kho 2.920+ Hồ sơ Năng lực Số ứng viên đã xác thực điểm thi ngoại ngữ & tin học",
        "Đặc quyền phát hành E-Voucher & Học bổng chéo tới toàn bộ cộng đồng Phụ huynh và Sinh viên trong hệ sinh thái"
      ],
      authorName: "Hệ sinh thái TechCorp",
      authorOrg: "CÔNG TY TNHH CÔNG NGHỆ VÀ GIÁO DỤC TECHCORP",
      createdAt: "Hôm nay, 09:30",
      pinned: true,
      actionLabel: "Xem Báo giá & Ưu đãi Combo",
      actionView: "pricing"
    },
    {
      id: "ANN-MASTER-03",
      sourceType: "master",
      badge: "🤖 NÂNG CẤP CÔNG NGHỆ • HỆ SINH THÁI TECHCORP",
      categoryTag: "AI Tuyển dụng & Nhân sự",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
      views: 985,
      readTime: "3 phút đọc",
      title: "Ra mắt Cổng đồng bộ 1-Click từ Sàn Tuyển dụng HireMind AI (jobai.techcorp.info.vn) sang Phân hệ HRM trên TechCorp ERP",
      summary: "Các Doanh nghiệp thành viên có thể lọc ứng viên theo Điểm Thi Online thực tế từ LMS và đẩy thẳng hồ sơ trúng tuyển vào Hợp đồng lao động điện tử chỉ với 1 cú nhấp chuột.",
      content: "Trung tâm R&D AI & Cloud thuộc Hệ sinh thái TechCorp vừa phát hành bản nâng cấp lớn cho Sàn Tuyển dụng & Tìm việc Thông minh TechCorp HireMind AI (jobai.techcorp.info.vn), tích hợp trực tiếp công nghệ AI ATS đa ngôn ngữ (Việt – Anh – Hàn – Nhật – Trung).\n\nHệ thống tự động đọc hiểu CV của ứng viên, đối chiếu với yêu cầu công việc (JD) của doanh nghiệp và kết hợp dữ liệu điểm thi thực tế từ nền tảng khảo thí TechCorp LMS để đưa ra Chỉ số Tương thích AI (AI Matching Score) chính xác tới 96%.\n\nĐặc biệt, ngay khi Phòng Nhân sự (HR) hoặc CEO doanh nghiệp bấm 'Chốt tiếp nhận' trên Sàn Nhân lực, toàn bộ hồ sơ cá nhân, bằng cấp xác thực QR và thông tin lương sẽ được đẩy tự động 1-Click sang phân hệ Quản trị Nhân sự (HRM) trên TechCorp ERP mà không cần nhập liệu thủ công.",
      highlights: [
        "Sàng lọc & chấm điểm độ phù hợp CV – JD tự động bằng AI ATS hỗ trợ 7 ngôn ngữ quốc tế",
        "Xác thực 100% chứng chỉ IELTS/TOEIC/MOS và điểm GPA từ các Trường ĐH & Trung tâm thành viên",
        "Đồng bộ 1-Click hồ sơ ứng viên trúng tuyển vào Hợp đồng lao động & Bảng lương trên TechCorp ERP",
        "Tiết kiệm 75% thời gian và chi phí tuyển dụng nhân sự chất lượng cao cho các Resort, Khách sạn & SME"
      ],
      authorName: "Hệ sinh thái TechCorp",
      authorOrg: "Trung tâm R&D AI & Cloud TechCorp",
      createdAt: "Hôm qua, 15:20",
      pinned: false,
      actionLabel: "Xem Sàn Nhân lực & LMS",
      actionView: "forum"
    },
    {
      id: "ANN-MASTER-04",
      sourceType: "master",
      badge: "💳 LIÊN THÔNG THANH TOÁN QR ĐỘNG KHÔNG TIỀN MẶT",
      categoryTag: "Tài chính Số & VietQR",
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
      views: 870,
      readTime: "3 phút đọc",
      title: "Tích hợp Cổng gạch nợ Học phí & Hóa đơn tự động 3 giây cho toàn bộ Khối Trường học K-12 và Trung tâm Ngoại ngữ",
      summary: "Miễn phí 100% phí thiết lập cổng thanh toán VietQR động cho các trường Mầm non, Tiểu học, THCS, THPT, GDTX và Trung tâm đào tạo thuộc Hệ sinh thái TechCorp.",
      content: "Nhằm giải quyết triệt để bài toán đối soát học phí thủ công vào mỗi đầu tháng cho bộ phận kế toán nhà trường và trung tâm đào tạo, Hệ sinh thái TechCorp đã hợp tác cùng các Ngân hàng đối tác tích hợp chuẩn thanh toán VietQR động thế hệ mới trực tiếp vào bộ giải pháp EduManager Pro K-12 và Quản lý Trung tâm NN-TH.\n\nMỗi phiếu báo thu học phí gửi qua Sổ liên lạc điện tử tới Phụ huynh hoặc Học viên sẽ đi kèm một mã QR định danh duy nhất chứa sẵn số tiền và mã học sinh. Ngay khi phụ huynh quét mã thanh toán trên ứng dụng ngân hàng bất kỳ, hệ thống tự động gạch nợ trong 3 giây, phát hành biên lai điện tử tức thì và hạch toán thẳng vào sổ quỹ Tài chính – Kế toán.\n\nNhờ đó, các trường học và trung tâm giảm được hơn 85% thời gian đối soát sao kê ngân hàng và loại bỏ hoàn toàn sai sót nhầm lẫn nội dung chuyển khoản.",
      highlights: [
        "Tự động sinh mã VietQR động định danh theo từng học sinh/học viên trên Sổ liên lạc điện tử",
        "Gạch nợ học phí tự động trong 3 giây và xuất biên lai điện tử ngay sau khi quét mã",
        "Đồng bộ trực tiếp doanh thu học phí về phân hệ Kế toán – Tài chính mà không cần nhập lại",
        "Miễn 100% phí thiết lập cổng kết nối API Ngân hàng cho các cơ sở giáo dục thành viên TechCorp"
      ],
      authorName: "Ban Điều hành Hệ sinh thái TechCorp",
      authorOrg: "Ban Tài chính & Đối tác Ngân hàng TechCorp",
      createdAt: "2 ngày trước",
      pinned: false,
      actionLabel: "Liên hệ Tư vấn & Demo",
      actionView: "contact"
    },
    {
      id: "ANN-MASTER-05",
      sourceType: "master",
      badge: "🛡️ TIÊU CHUẨN CHẤT LƯỢNG • ISO 9001:2015 & ISO 27001",
      categoryTag: "Bảo mật & Ký số Điện tử",
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
      views: 810,
      readTime: "4 phút đọc",
      title: "Chuẩn hóa Quy trình Bảo mật Dữ liệu Đa tầng & Ký số Học bạ Điện tử toàn Hệ sinh thái TechCorp",
      summary: "100% cơ sở giáo dục và doanh nghiệp thành viên được trang bị không gian quản trị riêng biệt theo phân quyền RBAC 9x5, sao lưu tự động MySQL/SQLite thời gian thực và hỗ trợ kỹ thuật 24/7.",
      content: "Đặt an toàn thông tin và tính pháp lý của dữ liệu số lên hàng đầu, Hệ sinh thái TechCorp đã hoàn tất nâng cấp hạ tầng bảo mật đa tầng theo tiêu chuẩn ISO/IEC 27001 kết hợp hệ thống quản lý chất lượng ISO 9001:2015 cho toàn bộ 16 nền tảng phần mềm.\n\nĐối với khối Giáo dục Mầm non – Phổ thông K12 và Đại học, phân hệ Học bạ Số & Bảng điểm Điện tử đã tích hợp đầy đủ chuẩn ký số CA của Ban Cơ yếu Chính phủ và các nhà cung cấp chữ ký số công cộng (Viettel-CA, VNPT-CA, FPT-CA), đáp ứng 100% quy định theo các Thông tư mới nhất của Bộ GD&ĐT.\n\nĐối với khối Doanh nghiệp SME, dữ liệu Nhân sự, Tài chính và Khách hàng được cô lập hoàn toàn theo từng Tenant riêng biệt, mã hóa đầu cuối và sao lưu tự động hàng ngày.",
      highlights: [
        "Cô lập dữ liệu hoàn toàn giữa các đơn vị thành viên theo kiến trúc Multi-Tenant & Ma trận RBAC 9x5",
        "Tích hợp ký số Học bạ Điện tử (XML/PDF) theo đúng chuẩn quy định của Bộ Giáo dục & Đào tạo",
        "Hệ thống Audit Logs ghi vết đầy đủ địa chỉ IP, thời gian và tác nhân của mọi thao tác quan trọng",
        "Cơ chế sao lưu dữ liệu tự động (Auto-Backup) đa vùng và cam kết SLA vận hành ổn định 99.9%"
      ],
      authorName: "Ban Điều hành Hệ sinh thái TechCorp",
      authorOrg: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
      createdAt: "3 ngày trước",
      pinned: false,
      actionLabel: "Đăng ký Tư vấn Bảo mật",
      actionView: "contact"
    },
    {
      id: "ANN-MEM-01",
      sourceType: "member",
      badge: "🏨 TIN TỪ DOANH NGHIỆP THÀNH VIÊN (SME)",
      categoryTag: "Tuyển dụng & Thực tập",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      views: 1150,
      readTime: "3 phút đọc",
      title: "Nha Trang Bay Resort & Travel mở đợt tuyển 25 Thực tập sinh & Nhân sự Lễ tân Tiếng Anh/Hàn học kỳ Hè – Thu",
      summary: "Ưu tiên xét tuyển thẳng (không qua vòng sơ loại CV) đối với Sinh viên ĐH Nha Trang, ĐH Khánh Hòa, CĐ Du lịch có chứng chỉ xác thực trên Nền tảng Thi Online của Hệ sinh thái TechCorp.",
      content: "Chuẩn bị đón các đoàn khách du lịch quốc tế và hội nghị MICE quy mô lớn trong mùa cao điểm Hè – Thu, Nha Trang Bay Resort & Travel chính thức mở đợt tuyển dụng 25 Thực tập sinh có hưởng phụ cấp và Nhân viên chính thức tại các bộ phận: Lễ tân Quốc tế (Front Office), Chăm sóc Khách hàng (Guest Relations), Nhà hàng & Sự kiện (F&B) và Điều hành Tour.\n\nNhờ liên thông trực tiếp với Trục dữ liệu Hệ sinh thái TechCorp, Phòng Nhân sự của Resort áp dụng cơ chế 'Tuyển thẳng không qua sơ loại CV giấy' đối với các bạn sinh viên/học viên đã có Hồ sơ Năng lực Số (Talent Passport) kèm kết quả thi Tiếng Anh (IELTS/TOEIC) hoặc Tiếng Hàn (TOPIK) xác thực trên nền tảng TechCorp LMS.\n\nỨng viên trúng tuyển được đào tạo nghiệp vụ trên hệ thống Quản lý Khách sạn TechCorp PMS, hỗ trợ bữa ăn theo ca, phụ cấp thực tập từ 4.500.000 – 7.000.000 VNĐ/tháng và ký hợp đồng chính thức ngay sau kỳ thực tập.",
      highlights: [
        "Tuyển thẳng ứng viên có Chứng chỉ Ngoại ngữ / Tin học xác thực QR trên nền tảng TechCorp LMS",
        "Mức thu nhập & phụ cấp hấp dẫn: Thực tập sinh 4.5 - 7 triệu/tháng; Nhân viên chính thức 10 - 16 triệu/tháng",
        "Được đào tạo thực chiến trên phần mềm Quản lý Khách sạn 5 Sao TechCorp PMS (qldh.techcorp.info.vn)",
        "Ứng tuyển 1-Click trực tiếp từ Sàn Nhân lực hoặc gửi Hồ sơ số về phân hệ HRM của Resort"
      ],
      authorName: "Nguyễn Hải Đăng (CEO)",
      authorOrg: "Nha Trang Bay Resort & Travel",
      createdAt: "1 giờ trước",
      pinned: true,
      actionLabel: "Xem Sàn Nhân lực",
      actionView: "forum"
    },
    {
      id: "ANN-MEM-02",
      sourceType: "member",
      badge: "🏫 TIN TỪ TRUNG TÂM ĐÀO TẠO THÀNH VIÊN",
      categoryTag: "Học bổng & Khảo thí LMS",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      views: 1020,
      readTime: "3 phút đọc",
      title: "Ocean English & IT Center tài trợ 500 suất Thi thử IELTS/TOEIC & Học bổng 40% cho con em Doanh nghiệp & Trường học",
      summary: "Kết quả thi thử được đồng bộ tự động về Sổ liên lạc điện tử của Phụ huynh và Hồ sơ Năng lực Số của Sinh viên trên toàn Hệ sinh thái TechCorp.",
      content: "Đồng hành cùng phong trào nâng cao năng lực Ngoại ngữ & Tin học chuẩn quốc tế tại Khánh Hòa, Ocean English & IT Center Nha Trang phối hợp cùng nền tảng khảo thí trực tuyến TechCorp LMS chính thức phát động chương trình tài trợ 500 suất Thi thử IELTS, TOEIC (4 kỹ năng) và Tin học văn phòng MOS hoàn toàn miễn phí.\n\nChương trình dành riêng cho học sinh các trường Phổ thông liên kết, sinh viên Đại học/Cao đẳng và con em cán bộ nhân viên đang làm việc tại các Doanh nghiệp thành viên thuộc Hệ sinh thái TechCorp. Bài thi được chấm tự động bằng AI kết hợp đội ngũ giám khảo chuyên môn của Ocean English.\n\nNgay sau khi hoàn thành bài thi, hệ thống cấp Chứng chỉ Đánh giá Năng lực Số kèm mã QR xác thực, đồng thời tặng ngay Học bổng ưu đãi 40% học phí các khóa luyện thi IELTS/TOEIC cam kết đầu ra vào Ví điện tử TechCorp ID của học viên.",
      highlights: [
        "Tài trợ 100% lệ phí thi thử IELTS / TOEIC 4 kỹ năng & Tin học MOS trên nền tảng TechCorp LMS",
        "Tặng Học bổng 40% học phí (trị giá tới 6.000.000 VNĐ/khóa) cho thành viên Hệ sinh thái TechCorp",
        "Tự động đồng bộ bảng điểm phân tích kỹ năng về Sổ liên lạc Phụ huynh và Talent Passport của Sinh viên",
        "Cam kết giới thiệu thực tập & việc làm tại 30 Resort và Doanh nghiệp SME đối tác sau khi đạt chuẩn đầu ra"
      ],
      authorName: "Trần Thanh Tâm (Giám đốc)",
      authorOrg: "Ocean English & IT Center Nha Trang",
      createdAt: "2 giờ trước",
      pinned: true,
      actionLabel: "Xem Đấu trường LMS",
      actionView: "forum"
    },
    {
      id: "ANN-MEM-03",
      sourceType: "member",
      badge: "🎓 TIN TỪ KHỐI TRƯỜNG HỌC THÀNH VIÊN (K-12)",
      categoryTag: "Sự kiện Trường học Số",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
      views: 890,
      readTime: "3 phút đọc",
      title: "Hệ thống Giáo dục Sao Biển Nha Trang tổ chức Ngày hội Trải nghiệm Công nghệ AI & Kỹ năng Số cho 800 Phụ huynh Học sinh",
      summary: "Mời các Doanh nghiệp Du lịch, F&B, Y tế và Trung tâm Ngoại ngữ trong Hệ sinh thái TechCorp đăng ký gian hàng trải nghiệm và phát hành E-Voucher trên Sổ liên lạc điện tử.",
      content: "Nhằm mang đến sân chơi khoa học công nghệ bổ ích cho học sinh và giúp phụ huynh trải nghiệm thực tế mô hình Trường học Thông minh (Smart School), Hệ thống Giáo dục Liên cấp Sao Biển Nha Trang tổ chức 'Ngày hội Trải nghiệm Công nghệ AI, Robotics & Kỹ năng Số 2026' với sự tham gia của hơn 800 phụ huynh và học sinh.\n\nTại sự kiện, phụ huynh được trực tiếp trải nghiệm hệ thống Điểm danh nhận diện khuôn mặt AI đầu giờ, tra cứu thực đơn dinh dưỡng hàng ngày và thanh toán học phí VietQR 3 giây trên ứng dụng EduManager Pro của TechCorp.\n\nBan Giám hiệu nhà trường trân trọng mời các Trung tâm Ngoại ngữ - Tin học, Phòng khám Nha khoa, Doanh nghiệp Du lịch & Thực phẩm sạch trong Hệ sinh thái TechCorp đăng ký gian hàng đồng hành và phát hành E-Voucher ưu đãi trực tiếp vào Sổ liên lạc điện tử của 1.250 phụ huynh toàn trường.",
      highlights: [
        "Quy mô hơn 800 Phụ huynh & Học sinh tham gia trải nghiệm trực tiếp tại khuôn viên KĐT Mỹ Gia - Nha Trang",
        "Trình diễn thực tế hệ thống Điểm danh AI, Học bạ Số & Sổ liên lạc điện tử EduManager Pro K-12",
        "Miễn phí gian hàng trưng bày cho các Trung tâm Đào tạo & Doanh nghiệp thành viên Hệ sinh thái TechCorp",
        "Hỗ trợ bắn thông báo E-Voucher ưu đãi của đơn vị tài trợ tới 100% tài khoản Phụ huynh nhà trường"
      ],
      authorName: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      authorOrg: "Hệ thống Giáo dục Liên cấp Sao Biển Nha Trang",
      createdAt: "4 giờ trước",
      pinned: false,
      actionLabel: "Xem Phần mềm Trường học",
      actionView: "products"
    },
    {
      id: "ANN-MEM-04",
      sourceType: "member",
      badge: "🏙️ TIN TỪ KHỐI BẤT ĐỘNG SẢN & NỘI THẤT THÀNH VIÊN",
      categoryTag: "Ưu đãi B2B Nội bộ",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
      views: 760,
      readTime: "3 phút đọc",
      title: "Hưng Phát Land & TechCorp Interior ra mắt Gói Ưu đãi Chéo B2B giảm 20% Thiết kế Thi công Văn phòng & Trung tâm",
      summary: "Đặc quyền dành riêng cho các Trường tư thục, Trung tâm Ngoại ngữ - Tin học và Doanh nghiệp SME thuộc Hệ sinh thái TechCorp khi mở rộng cơ sở mới tại Khánh Hòa.",
      content: "Nhằm hỗ trợ các cơ sở giáo dục, trung tâm đào tạo và doanh nghiệp SME trong Hệ sinh thái TechCorp tối ưu chi phí khi mở rộng chi nhánh mới tại Nha Trang – Cam Ranh – Ninh Hòa, Liên minh Sàn Giao dịch BĐS Hưng Phát Land (bds.techcorp.info.vn) và Showroom Nội thất TechCorp Interior (noithat.techcorp.info.vn) chính thức triển khai gói đặc quyền B2B nội bộ.\n\nCụ thể, Hưng Phát Land hỗ trợ tìm kiếm mặt bằng thương mại, tòa nhà văn phòng và cơ sở trường học tại các khu đô thị trọng điểm (Mỹ Gia, Hà Quang II, Vĩnh Điềm Trung, An Bình Tân) với chính sách miễn 100% phí môi giới cho thành viên TechCorp.\n\nSong song đó, TechCorp Interior tài trợ 100% chi phí khảo sát & dựng bản vẽ phối cảnh 3D phòng học thông minh / văn phòng hiện đại, đồng thời giảm ngay 20% tổng giá trị hợp đồng sản xuất – thi công nội thất trọn gói tại xưởng.",
      highlights: [
        "Miễn 100% phí tư vấn & tìm kiếm mặt bằng mở Trường học, Trung tâm, Văn phòng tại Nha Trang - Khánh Hòa",
        "Tặng 100% gói Thiết kế phối cảnh 3D & Dự toán BOQ tự động trên nền tảng noithat.techcorp.info.vn",
        "Chiết khấu trực tiếp 20% chi phí sản xuất & thi công nội thất phòng học, bàn ghế, quầy lễ tân tại xưởng",
        "Bảo hành công trình điện tử 36 tháng và hỗ trợ trả chậm linh hoạt cho đơn vị thành viên TechCorp"
      ],
      authorName: "Ban Giám đốc Hưng Phát Land",
      authorOrg: "Sàn Giao dịch BĐS Hưng Phát Land & TechCorp Interior",
      createdAt: "1 ngày trước",
      pinned: false,
      actionLabel: "Xem Chợ Giao thương B2B",
      actionView: "forum"
    },
    {
      id: "ANN-MEM-05",
      sourceType: "member",
      badge: "🎓 TIN TỪ KHỐI ĐẠI HỌC & CAO ĐẲNG THÀNH VIÊN",
      categoryTag: "Liên kết Đại học – Doanh nghiệp",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80",
      views: 940,
      readTime: "4 phút đọc",
      title: "Trường Đại học Nha Trang & Khối Doanh nghiệp SME ký kết Liên thông 450 Hồ sơ Năng lực Số Sinh viên Năm cuối lên Sàn JobAI",
      summary: "Sinh viên các ngành CNTT, Quản trị Khách sạn, Kế toán – Tài chính và Ngôn ngữ được kết nối phỏng vấn trực tiếp với 30 Doanh nghiệp & Resort ngay trên hệ thống TC COMPASS.",
      content: "Thông qua sự kết nối giữa Hệ thống Quản trị Đào tạo Đại học TC COMPASS (qldt.techcorp.info.vn) và Sàn Tuyển dụng Thông minh HireMind AI (jobai.techcorp.info.vn), Trung tâm Hợp tác Doanh nghiệp & Việc làm Sinh viên đã hoàn tất chuẩn hóa và xuất bản 450 Hồ sơ Năng lực Số (Verified Talent Passport) của sinh viên năm cuối đạt GPA từ 3.2/4.0 trở lên.\n\nMỗi hồ sơ số đều được xác thực tự động điểm trung bình tích lũy (GPA), kỹ năng chuyên môn, dự án tốt nghiệp cùng các chứng chỉ Ngoại ngữ (IELTS/TOEIC/TOPIK) và Tin học (MOS/ERP) từ các trung tâm khảo thí trong hệ sinh thái.\n\nCác doanh nghiệp thành viên có thể truy cập trực tiếp danh sách ứng viên theo từng chuyên ngành, đặt lịch phỏng vấn trực tuyến và tiếp nhận sinh viên thực tập/làm việc chính thức chỉ với 1 thao tác trên Cổng Quản trị.",
      highlights: [
        "Công bố 450 Hồ sơ Năng lực Số sinh viên năm cuối đã xác thực GPA & Chứng chỉ kỹ năng nghề nghiệp",
        "Đầy đủ các nhóm ngành trọng điểm: Công nghệ thông tin, Du lịch - Khách sạn, Kế toán ERP, Ngoại ngữ",
        "Doanh nghiệp thành viên được miễn phí 100% quyền truy cập CV và đặt bàn phỏng vấn tại Ngày hội Việc làm",
        "Liên thông trực tiếp từ nền tảng Đại học TC COMPASS sang Sàn Việc làm HireMind AI & TechCorp ERP"
      ],
      authorName: "Ban Hợp tác Doanh nghiệp & Việc làm SV",
      authorOrg: "Trường Đại học Nha Trang (NTU) × TC COMPASS",
      createdAt: "2 ngày trước",
      pinned: false,
      actionLabel: "Mở Sàn Nhân lực Xác thực",
      actionView: "forum"
    }
  ],
  rbacMatrix: {
    super_admin: {
      roleName: "👑 Hệ sinh thái TechCorp (Master Admin)",
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
  demoRequests: [
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
  ],
  previewTenantRole: "ceo_sme"
};

const CLIENT_DEFAULT_FORUM_POSTS = JSON.parse(JSON.stringify(STATE.forumPosts));

const PERSONA_TO_ROLE = {
  "super-admin": "super_admin",
  "ceo-sme": "ceo_sme",
  "center-dir": "center_director",
  "school-principal": "school_principal",
  "student-user": "student_parent"
};

function getCurrentRoleCode() {
  if (PERSONA_TO_ROLE[STATE.currentPersona]) {
    return PERSONA_TO_ROLE[STATE.currentPersona];
  }
  const u = STATE.users.find((x) => x.personaKey === STATE.currentPersona);
  return (u && u.role) || "ceo_sme";
}

function getCurrentUserObject() {
  return (
    STATE.users.find((x) => x.personaKey === STATE.currentPersona) ||
    STATE.users[0]
  );
}

function hasRbacPermission(permKey) {
  const roleCode = getCurrentRoleCode();
  const roleObj = STATE.rbacMatrix[roleCode] || STATE.rbacMatrix.super_admin;
  return Boolean(roleObj && roleObj.permissions && roleObj.permissions[permKey]);
}

const CATEGORY_MAP = {
  rfq: "📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)",
  comarketing: "🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện",
  knowledge: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
  spotlight: "🎁 Quảng bá & Đặc quyền Thành viên (Give-to-Get)"
};

const ROLE_BADGES = {
  super_admin: "🛡️ Super Admin TechCorp",
  ceo_sme: "Khối Doanh nghiệp SME",
  center_director: "Khối Đào tạo NN-TH",
  school_principal: "Khối Cơ sở Giáo dục",
  hr_manager: "Quản trị Nhân sự (HR)",
  student_parent: "Cộng đồng Học viên / SV"
};

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<strong style="color:#0052d4">TechCorp Hub:</strong> ${msg}`;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 4200);
}

function recordLocalAuditLog(action, target, severity, details) {
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["super-admin"];
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  STATE.auditLogs.unshift({
    id: "AUD-" + Date.now(),
    timestamp,
    actorId: persona.userId || "USR-ADMIN-00",
    actorName: persona.name || "Quản trị viên TechCorp",
    actorOrg: persona.org || "TechCorp Hub",
    ipAddress: "103.170.122.138",
    action,
    target,
    severity,
    details
  });
  renderAuditLogsTable();
}

window.activeAdminPanelId = "panel-master-overview";
window.activeMemberSubTab = "overview";

window.activateAdminPanel = function (panelId, memberSubTab) {
  const roleCode = getCurrentRoleCode();
  // Strict RBAC isolation: Only super_admin can access Master Admin panels
  if (roleCode !== "super_admin") {
    panelId = "panel-role-workspace";
    if (!memberSubTab) {
      memberSubTab = window.activeMemberSubTab || "overview";
    }
  }
  if (memberSubTab) {
    window.activeMemberSubTab = memberSubTab;
  }
  window.activeAdminPanelId = panelId;
  const panels = document.querySelectorAll(".tab-panel");
  if (panels.length > 0) {
    panels.forEach((p) => {
      const isMasterPanel = p.id && p.id.indexOf("panel-master-") === 0;
      if (roleCode !== "super_admin" && isMasterPanel) {
        p.classList.remove("active");
        p.style.display = "none";
      } else {
        p.style.display = "";
        p.classList.toggle("active", p.id === panelId);
      }
    });
  }
  document.querySelectorAll("#dynamicRoleSidebarNav .nav-btn").forEach((btn) => {
    const matchPanel = btn.getAttribute("data-panel") === panelId;
    const btnSub = btn.getAttribute("data-subtab") || "";
    const matchSub = !memberSubTab || !btnSub || btnSub === memberSubTab;
    btn.classList.toggle("active", matchPanel && matchSub);
  });
  if (panelId === "panel-role-workspace") {
    renderMemberWorkspace();
  }
};

window.currentPublicPage = "home";

window.switchPublicPage = function (pageKey, updateHistory = true, scrollTargetId = "") {
  const validPages = ["home", "products", "forum", "pricing", "contact"];
  const rawKey = String(pageKey || "home").replace(/^#/, "").trim().toLowerCase();

  const sectionScrollMap = {
    "sec-talent-lms": "sec-talent-lms",
    "view-talent-lms": "sec-talent-lms",
    "sec-exchange": "sec-exchange",
    "view-forum-b2b": "sec-exchange"
  };
  const resolvedScrollId = scrollTargetId || sectionScrollMap[rawKey] || "";

  const aliasMap = {
    "sec-bulletins": "home",
    "sec-products": "products",
    "view-plaza": "products",
    "view-workspace": "pricing",
    "sec-exchange": "forum",
    "view-forum-b2b": "forum",
    "sec-talent-lms": "forum",
    "view-talent-lms": "forum",
    "sec-pricing": "pricing",
    "sec-contact": "contact",
    "view-master-admin": "contact"
  };

  let normalized = rawKey.replace(/^pub-page-/, "");
  if (aliasMap[normalized]) {
    normalized = aliasMap[normalized];
  }
  if (!validPages.includes(normalized)) {
    normalized = "home";
  }

  window.currentPublicPage = normalized;

  const views = document.querySelectorAll(".pub-page-view");
  if (views.length > 0) {
    views.forEach((v) => {
      v.classList.toggle("active", v.id === `pub-page-${normalized}`);
    });
  }

  const navLinks = document.querySelectorAll("#publicMainNav .pub-nav-link[data-pub-page]");
  if (navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-pub-page") === normalized);
    });
  }

  if (updateHistory && window.history && window.history.pushState && document.getElementById("pub-page-home")) {
    const newUrl = normalized === "home" ? "index.html" : `index.html?page=${normalized}`;
    try {
      window.history.pushState({ publicPage: normalized }, "", newUrl);
    } catch (_) {}
  }

  if (resolvedScrollId) {
    setTimeout(() => {
      const targetEl = document.getElementById(resolvedScrollId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

window.handleBulletinAction = function (annId, fallbackView = "", fallbackLabel = "") {
  const item = (STATE.announcements || []).find((a) => a.id === annId);
  const view = (item && item.actionView) || fallbackView || "";
  const label = ((item && item.actionLabel) || fallbackLabel || "").toLowerCase();

  // Nếu đang ở trang Admin (admin.html)
  if (!document.getElementById("pub-page-home")) {
    window.switchToTab(view || "view-workspace");
    return;
  }

  // Nếu đang ở trang Public (index.html), điều hướng chính xác đến trang & phân khu tương ứng
  if (annId === "ANN-MASTER-01" || label.includes("sản phẩm") || label.includes("trường học") || label.includes("sơ đồ")) {
    window.switchPublicPage("products");
    return;
  }
  if (annId === "ANN-MASTER-02" || label.includes("báo giá") || label.includes("combo")) {
    window.switchPublicPage("pricing");
    return;
  }
  if (annId === "ANN-MASTER-04" || label.includes("tư vấn") || label.includes("liên hệ") || label.includes("demo")) {
    window.switchPublicPage("contact");
    return;
  }
  if (
    annId === "ANN-MEM-01" ||
    annId === "ANN-MEM-02" ||
    annId === "ANN-MASTER-03" ||
    label.includes("nhân lực") ||
    label.includes("lms") ||
    label.includes("đấu trường") ||
    view === "view-talent-lms" ||
    view === "sec-talent-lms"
  ) {
    window.switchPublicPage("forum", true, "sec-talent-lms");
    return;
  }
  if (
    annId === "ANN-MEM-03" ||
    annId === "ANN-MEM-04" ||
    label.includes("b2b") ||
    label.includes("hợp tác") ||
    label.includes("ưu đãi") ||
    label.includes("diễn đàn") ||
    label.includes("kết nối")
  ) {
    window.switchPublicPage("forum", true, "sec-exchange");
    return;
  }

  window.switchPublicPage(view || "products");
};

function initPublicPageFromUrl() {
  if (!document.getElementById("pub-page-home")) return;
  try {
    const params = new URLSearchParams(window.location.search);
    const qPage = params.get("page");
    const qBulletin = params.get("bulletin");
    const hash = (window.location.hash || "").replace(/^#/, "");
    if (qPage) {
      window.switchPublicPage(qPage, false);
    } else if (hash) {
      window.switchPublicPage(hash, false);
    } else {
      window.switchPublicPage("home", false);
    }
    if (qBulletin && typeof window.openBulletinDetailModal === "function") {
      setTimeout(() => window.openBulletinDetailModal(qBulletin), 120);
    }
  } catch (_) {}
}

window.switchToTab = function (tabId) {
  // Nếu đang ở Trang Public (index.html), luôn ưu tiên chuyển trang Public
  if (document.getElementById("pub-page-home")) {
    window.switchPublicPage(tabId);
    return;
  }
  // Nếu đang ở Trang Admin (admin.html)
  const panelMap = {
    "view-plaza": "panel-master-overview",
    "pub-page-home": "panel-master-overview",
    "pub-page-products": "panel-master-apps",
    "pub-page-pricing": "panel-role-workspace",
    "pub-page-forum": "panel-master-forum",
    "pub-page-contact": "panel-master-demos",
    "view-workspace": "panel-role-workspace",
    "view-forum-b2b": "panel-master-forum",
    "view-talent-lms": "panel-role-workspace",
    "view-master-admin": "panel-master-rbac"
  };
  const mappedPanel = panelMap[tabId] || tabId;
  if (document.getElementById(mappedPanel)) {
    window.activateAdminPanel(mappedPanel);
  }
};

window.openAdminSubtab = function (subtabId) {
  const map = {
    "admin-rbac": "panel-master-rbac",
    "admin-bulletins": "panel-master-bulletins",
    "admin-apps": "panel-master-apps",
    "admin-demos": "panel-master-demos",
    "admin-forum": "panel-master-forum",
    "admin-users": "panel-master-users",
    "admin-audit": "panel-master-audit"
  };
  const targetPanel = map[subtabId] || "panel-master-rbac";
  if (document.getElementById(targetPanel)) {
    window.activateAdminPanel(targetPanel);
  }
};

function renderPublicHeaderAuthState() {
  const box = document.getElementById("publicHeaderAuthActions");
  if (!box) return;
  try {
    const raw = localStorage.getItem("tc_sso_session");
    if (!raw) {
      box.innerHTML = `
        <a href="login.html" class="btn btn-primary" style="text-decoration:none;padding:9px 18px;white-space:nowrap;">
          🔐 Đăng nhập
        </a>
      `;
      return;
    }
    const sess = JSON.parse(raw);
    if (!sess || !sess.personaKey) {
      box.innerHTML = `
        <a href="login.html" class="btn btn-primary" style="text-decoration:none;padding:9px 18px;white-space:nowrap;">
          🔐 Đăng nhập
        </a>
      `;
      return;
    }
    const isSuper = sess.personaKey === "super-admin" || sess.roleCode === "super_admin";
    box.innerHTML = `
      <a href="admin.html" class="btn btn-outline btn-sm" style="text-decoration:none;white-space:nowrap;">
        ${isSuper ? "👑 Quản trị Hệ sinh thái" : "⚙️ Không gian Quản trị"} (${escapeHtml(sess.name || sess.email)})
      </a>
      <button type="button" class="btn btn-danger btn-sm" style="white-space:nowrap;" onclick="logoutSsoSession()">
        🚪 Đăng xuất
      </button>
    `;
  } catch (_) {}
}

function renderAllViews() {
  renderPublicHeaderAuthState();
  renderPublicHeroSlider();
  renderPublicProductsShowcase();
  renderRoleContextAndSidebar();
  renderCentralBulletins();
  renderMemberWorkspace();
  renderRbacMatrixTable();
  renderAdminHeroSlidersManager();
  renderAdminBulletinsTable();
  renderConnectedApps();
  renderAdminAppsTable();
  renderAdminDemoRequestsTable();
  renderForumPosts();
  renderAdminForumTable();
  renderAdminUsersTable();
  renderAuditLogsTable();
  renderActivityFeed();
  renderTalents();
  renderContests();
  renderB2B();
  renderLighthouseTable();
  updateTotalKPIs();
}

// ==================== 0A. 6-SLIDE CONTINUOUS HERO SLIDER & ADMIN IMAGE MANAGER ====================
let heroSliderIntervalId = null;

function loadCachedHeroSliders() {
  try {
    const raw = localStorage.getItem("tc_hero_sliders_backup");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 6) {
        STATE.heroSliders = parsed;
      }
    }
  } catch (_) {}
}

function saveCachedHeroSliders() {
  try {
    localStorage.setItem("tc_hero_sliders_backup", JSON.stringify(STATE.heroSliders));
  } catch (_) {}
}

window.pauseHeroSliderAutoPlay = function (paused) {
  STATE.heroSliderPaused = Boolean(paused);
};

window.goToHeroSlide = function (idx) {
  const slides = STATE.heroSliders || [];
  if (!slides.length) return;
  STATE.currentHeroSlideIndex = ((idx % slides.length) + slides.length) % slides.length;
  renderPublicHeroSlider();
};

window.nextHeroSlide = function () {
  window.goToHeroSlide((STATE.currentHeroSlideIndex || 0) + 1);
};

window.prevHeroSlide = function () {
  window.goToHeroSlide((STATE.currentHeroSlideIndex || 0) - 1);
};

function startHeroSliderAutoPlay() {
  if (heroSliderIntervalId) {
    clearInterval(heroSliderIntervalId);
  }
  heroSliderIntervalId = setInterval(() => {
    if (!STATE.heroSliderPaused && document.getElementById("publicHeroSliderContainer")) {
      window.nextHeroSlide();
    }
  }, 5000);
}

function renderPublicHeroSlider() {
  const container = document.getElementById("publicHeroSliderContainer");
  if (!container) return;

  const slides = STATE.heroSliders || [];
  if (!slides.length) return;

  const activeIdx = ((STATE.currentHeroSlideIndex || 0) % slides.length + slides.length) % slides.length;
  const slide = slides[activeIdx];
  const bgStyle = slide.accentGradient || "linear-gradient(135deg, #002b7f 0%, #0055e8 55%, #0088ff 100%)";
  const highlights = Array.isArray(slide.highlights)
    ? slide.highlights
    : ["16 Hệ thống Live (HTTP 200)", "Định danh SSO TechCorp ID", "Liên thông dữ liệu thời gian thực"];

  const shortLabels = [
    "1. Hệ sinh thái (16 App)",
    "2. Sàn Việc làm JobAI",
    "3. Giáo dục K12",
    "4. Đại học & LMS",
    "5. ERP & BSC-KPI",
    "6. PMS, BĐS & Nội thất"
  ];

  const primaryLink = slide.primaryCtaLink || "#sec-products";
  const isExternalPrimary = primaryLink.indexOf("http") === 0;
  const primaryClickAttr = isExternalPrimary
    ? 'target="_blank" rel="noopener"'
    : `onclick="switchPublicPage('${escapeHtml(primaryLink)}'); return false;"`;

  container.innerHTML = `
    <div class="hero-slide-card" style="background:${bgStyle};">
      <div class="hero-slide-grid">
        <div>
          <span class="hero-slide-badge">${escapeHtml(slide.badge || "⚡ TECHCORP ECOSYSTEM")}</span>
          <h2 class="hero-slide-title">${escapeHtml(slide.title)}</h2>
          <p class="hero-slide-subtitle">${escapeHtml(slide.subtitle)}</p>

          <div class="hero-slide-highlights">
            ${highlights.map((h) => `<span class="hero-highlight-pill">✔ ${escapeHtml(h)}</span>`).join("")}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            <a
              href="${escapeHtml(primaryLink)}"
              ${primaryClickAttr}
              class="btn"
              style="background:#ffffff;color:#0043b8;padding:12px 20px;font-size:14px;text-decoration:none;"
            >
              ${escapeHtml(slide.primaryCtaText || "🚀 Khám phá 6 Nhóm Sản phẩm")}
            </a>
            <a
              href="https://jobai.techcorp.info.vn/careers.html"
              target="_blank"
              rel="noopener"
              class="btn"
              style="background:#ff6b00;color:#ffffff;padding:12px 20px;font-size:14px;text-decoration:none;"
            >
              🤖 Sàn Tuyển dụng & Tìm việc AI (jobai.techcorp.info.vn) ↗
            </a>
            <a
              href="index.html?page=pricing"
              onclick="switchPublicPage('pricing'); return false;"
              class="btn"
              style="background:rgba(255,255,255,0.18);color:#ffffff;border:1px solid rgba(255,255,255,0.45);padding:12px 18px;font-size:13.5px;text-decoration:none;"
            >
              💳 Báo giá Gói Combo
            </a>
          </div>
        </div>

        <div class="hero-slide-visual">
          <img
            src="${escapeHtml(slide.imageUrl)}"
            alt="${escapeHtml(slide.title)}"
            onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'"
          />
          <div class="hero-slide-visual-caption">
            <span>📸 ${escapeHtml((slide.imageCaption || slide.title || "").replace(/^Slide\s*\d+\/\d+\s*:\s*/i, ""))}</span>
          </div>
        </div>
      </div>

      <div class="hero-slider-controls">
        <div class="hero-slider-dots">
          ${slides
            .map(
              (s, idx) => `
              <button
                type="button"
                class="hero-dot-btn ${idx === activeIdx ? "active" : ""}"
                onclick="goToHeroSlide(${idx})"
              >
                ${escapeHtml(shortLabels[idx] || `Slide ${idx + 1}`)}
              </button>
            `
            )
            .join("")}
        </div>

        <div class="hero-arrow-group">
          <button type="button" class="hero-arrow-btn" onclick="prevHeroSlide()">◀ Trước</button>
          <button type="button" class="hero-arrow-btn" onclick="nextHeroSlide()">Tiếp ▶</button>
        </div>
      </div>
    </div>
  `;
}

function renderAdminHeroSlidersManager() {
  const tbody = document.getElementById("adminHeroSlidersTableBody");
  if (!tbody) return;

  const slides = STATE.heroSliders || [];
  const currentEditId = document.getElementById("editHeroSlideId")?.value || "SLIDE-01";

  tbody.innerHTML = slides
    .map(
      (s, idx) => `
      <tr style="${s.id === currentEditId ? "background:#eff6ff;" : ""}">
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img
              src="${escapeHtml(s.imageUrl)}"
              alt="${escapeHtml(s.id)}"
              class="admin-slider-thumb"
              onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'"
            />
            <div>
              <span class="badge badge-blue">Slide #${idx + 1} (${escapeHtml(s.id)})</span>
              <div style="font-size:11px;color:#64748b;margin-top:4px;">${escapeHtml((s.imageCaption || "").slice(0, 42))}...</div>
            </div>
          </div>
        </td>
        <td>
          <strong style="color:#0b2559;font-size:13px;">${escapeHtml(s.title)}</strong>
          <div style="font-size:11.5px;color:#0052d4;margin-top:3px;">
            🔗 CTA: <code>${escapeHtml(s.primaryCtaText)}</code> → <code>${escapeHtml(s.primaryCtaLink)}</code>
          </div>
        </td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="selectHeroSliderForEdit('${escapeHtml(s.id)}')">
            🖼️ Đổi Ảnh & Sửa
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  // Populate form on initial render if empty
  const titleInput = document.getElementById("editHeroTitle");
  if (titleInput && !titleInput.value && slides.length > 0) {
    window.selectHeroSliderForEdit(currentEditId);
  }
}

window.selectHeroSliderForEdit = function (slideId) {
  const slide = (STATE.heroSliders || []).find((s) => s.id === slideId) || STATE.heroSliders[0];
  if (!slide) return;

  const idEl = document.getElementById("editHeroSlideId");
  const headerEl = document.getElementById("heroSliderFormTitle");
  const badgePill = document.getElementById("heroSliderActiveBadge");
  const previewImg = document.getElementById("editHeroImagePreview");
  const urlInput = document.getElementById("editHeroImageUrl");
  const badgeInput = document.getElementById("editHeroBadge");
  const captionInput = document.getElementById("editHeroCaption");
  const titleInput = document.getElementById("editHeroTitle");
  const subtitleInput = document.getElementById("editHeroSubtitle");
  const primaryTextInput = document.getElementById("editHeroPrimaryText");
  const primaryLinkInput = document.getElementById("editHeroPrimaryLink");
  const fileInput = document.getElementById("editHeroImageFileInput");

  if (idEl) idEl.value = slide.id;
  if (headerEl) headerEl.textContent = `🖼️ Chỉnh sửa & Đổi Hình ảnh: Slide #${slide.order || 1} (${slide.id})`;
  if (badgePill) badgePill.textContent = `Đang chọn: ${slide.id}`;
  if (previewImg) previewImg.src = slide.imageUrl || "";
  if (urlInput) urlInput.value = slide.imageUrl || "";
  if (badgeInput) badgeInput.value = slide.badge || "";
  if (captionInput) captionInput.value = slide.imageCaption || "";
  if (titleInput) titleInput.value = slide.title || "";
  if (subtitleInput) subtitleInput.value = slide.subtitle || "";
  if (primaryTextInput) primaryTextInput.value = slide.primaryCtaText || "";
  if (primaryLinkInput) primaryLinkInput.value = slide.primaryCtaLink || "";
  if (fileInput) fileInput.value = "";

  renderAdminHeroSlidersManager();
};

window.previewHeroImageUrlInput = function (url) {
  const previewImg = document.getElementById("editHeroImagePreview");
  if (previewImg && url && url.trim()) {
    previewImg.src = url.trim();
  }
};

window.handleHeroImageUpload = function (event) {
  const file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (loadEvt) {
    const rawDataUrl = loadEvt.target.result;
    const img = new Image();
    img.onload = function () {
      const maxW = 1280;
      const maxH = 720;
      let w = img.width;
      let h = img.height;
      if (w > maxW) {
        h = Math.round((h * maxW) / w);
        w = maxW;
      }
      if (h > maxH) {
        w = Math.round((w * maxH) / h);
        h = maxH;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, w, h);
      const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.86);

      const previewImg = document.getElementById("editHeroImagePreview");
      const urlInput = document.getElementById("editHeroImageUrl");
      if (previewImg) previewImg.src = optimizedDataUrl;
      if (urlInput) urlInput.value = optimizedDataUrl;

      showToast(
        `📸 Đã nạp ảnh mới từ máy tính (${w}x${h}px)! Bấm <b>"Lưu Hình ảnh & Cập nhật Slide"</b> để áp dụng ra Trang chủ.`
      );
    };
    img.src = rawDataUrl;
  };
  reader.readAsDataURL(file);
};

window.saveHeroSliderConfig = async function () {
  const slideId = document.getElementById("editHeroSlideId")?.value || "SLIDE-01";
  const imageUrl = document.getElementById("editHeroImageUrl")?.value.trim();
  const badge = document.getElementById("editHeroBadge")?.value.trim();
  const imageCaption = document.getElementById("editHeroCaption")?.value.trim();
  const title = document.getElementById("editHeroTitle")?.value.trim();
  const subtitle = document.getElementById("editHeroSubtitle")?.value.trim();
  const primaryCtaText = document.getElementById("editHeroPrimaryText")?.value.trim();
  const primaryCtaLink = document.getElementById("editHeroPrimaryLink")?.value.trim();

  if (!imageUrl || !title) {
    showToast(`<span style="color:#d97706">Vui lòng chọn Hình ảnh (Upload hoặc URL) và nhập Tiêu đề cho Slide!</span>`);
    return;
  }

  const idx = (STATE.heroSliders || []).findIndex((s) => s.id === slideId);
  if (idx !== -1) {
    STATE.heroSliders[idx] = {
      ...STATE.heroSliders[idx],
      imageUrl,
      badge: badge || STATE.heroSliders[idx].badge,
      imageCaption: imageCaption || STATE.heroSliders[idx].imageCaption,
      title,
      subtitle: subtitle || STATE.heroSliders[idx].subtitle,
      primaryCtaText: primaryCtaText || STATE.heroSliders[idx].primaryCtaText,
      primaryCtaLink: primaryCtaLink || STATE.heroSliders[idx].primaryCtaLink
    };
  }
  saveCachedHeroSliders();

  try {
    const res = await fetch(`/api/v1/hero-sliders/${encodeURIComponent(slideId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl,
        badge,
        imageCaption,
        title,
        subtitle,
        primaryCtaText,
        primaryCtaLink,
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.heroSliders)) {
      STATE.heroSliders = data.heroSliders;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      saveCachedHeroSliders();
    }
  } catch (_) {
    recordLocalAuditLog(
      "HERO_SLIDER_UPDATE",
      `${slideId} (${title.slice(0, 32)})`,
      "INFO",
      `Cập nhật hình ảnh & nội dung Hero Slider ${slideId} trên Trang chủ.`
    );
  }

  renderAllViews();
  showToast(`🖼️ Đã lưu hình ảnh & nội dung mới cho <b>${escapeHtml(slideId)}</b> lên Trang chủ Hệ sinh thái!`);
};

window.resetDefaultHeroSliders = async function () {
  try {
    localStorage.removeItem("tc_hero_sliders_backup");
  } catch (_) {}

  try {
    const res = await fetch("/api/v1/hero-sliders/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.heroSliders)) {
      STATE.heroSliders = data.heroSliders;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      saveCachedHeroSliders();
      window.selectHeroSliderForEdit("SLIDE-01");
      renderAllViews();
      showToast("🔄 Đã khôi phục 6 Hero Slider mặc định trên Trang chủ!");
      return;
    }
  } catch (_) {}

  window.location.reload();
};

// ==================== 0B. PUBLIC PRODUCTS SHOWCASE (6 NHÓM SẢN PHẨM - 16 HỆ THỐNG LIVE) ====================
const PRODUCT_GROUPS_6 = [
  {
    groupId: "GROUP-1",
    groupNumber: "NHÓM SẢN PHẨM 01 / 06",
    title: "🎓 Khối Giáo dục Mầm non & Phổ thông K-12 (EduManager Pro)",
    subtitle: "Hệ thống quản trị nhà trường thông minh chuyên biệt cho Mầm non, Tiểu học, THCS và THPT tích hợp AI, Học bạ số & Thu học phí VietQR",
    badgeClass: "badge-blue",
    accentColor: "#2563eb",
    appIds: ["mamnon", "tieuhoc", "thcs", "thpt"]
  },
  {
    groupId: "GROUP-2",
    groupNumber: "NHÓM SẢN PHẨM 02 / 06",
    title: "🧭 Khối Đại học, Cao đẳng & Giáo dục Thường xuyên (TC COMPASS & GDTX)",
    subtitle: "Quản trị đào tạo tín chỉ Đại học/Cao đẳng, đánh giá hiệu suất KPI giảng viên, quản lý học viên GDTX và liên kết doanh nghiệp",
    badgeClass: "badge-purple",
    accentColor: "#7c3aed",
    appIds: ["qldt", "gdtx"]
  },
  {
    groupId: "GROUP-3",
    groupNumber: "NHÓM SẢN PHẨM 03 / 06",
    title: "🏫 Khối Trung tâm Ngoại ngữ - Tin học & Đào tạo Khảo thí Số (LMS & E-Testing)",
    subtitle: "CRM tuyển sinh đa kênh, quản lý trung tâm NN-TH, phòng thi trực tuyến chống gian lận AI và cổng khóa học số TechCorpLearn",
    badgeClass: "badge-amber",
    accentColor: "#d97706",
    appIds: ["ttnn", "lms", "learn"]
  },
  {
    groupId: "GROUP-4",
    groupNumber: "NHÓM SẢN PHẨM 04 / 06",
    title: "🤖 Khối Sàn Tuyển dụng & Tìm việc AI (HireMind AI) & Cổng Giải pháp Số",
    subtitle: "Sàn việc làm thông minh tích hợp AI ATS chấm điểm CV đa ngôn ngữ và Cổng điều phối giải pháp chuyển đổi số TechCorp Academy",
    badgeClass: "badge-green",
    accentColor: "#059669",
    appIds: ["jobai", "techcorp"]
  },
  {
    groupId: "GROUP-5",
    groupNumber: "NHÓM SẢN PHẨM 05 / 06",
    title: "🏢 Khối Quản trị Doanh nghiệp Tổng thể (TechCorp ERP & BSC-KPI)",
    subtitle: "Điều hành doanh nghiệp hợp nhất (HRM, CRM, Tài chính - Kế toán, Kho vận) và Quản trị chiến lược Thẻ điểm cân bằng BSC-KPI/OKR",
    badgeClass: "badge-blue",
    accentColor: "#0284c7",
    appIds: ["erp", "kpi"]
  },
  {
    groupId: "GROUP-6",
    groupNumber: "NHÓM SẢN PHẨM 06 / 06",
    title: "🏨 Khối Phần mềm Chuyên ngành: Khách sạn & Resort (PMS), BĐS AI & Nội thất",
    subtitle: "Bộ giải pháp chuyên sâu vận hành Khách sạn 3-5 Sao & Resort (PMS), Sàn giao dịch Bất động sản AI và Thiết kế - Thi công Nội thất",
    badgeClass: "badge-green",
    accentColor: "#0d9488",
    appIds: ["qldh", "bds", "noithat"]
  }
];

const PRODUCT_SHOWCASE_META = {
  jobai: {
    icon: "🤖",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
    imageTag: "Sàn Việc làm AI ATS Đa ngôn ngữ",
    targetAudience: "Doanh nghiệp Tuyển dụng, HR Manager, Sinh viên Đại học & Ứng viên Tìm việc",
    highlights: [
      "Sàn Tuyển dụng & Tìm việc thông minh tích hợp AI ATS Đa ngôn ngữ (TechCorp HireMind AI)",
      "Tự động phân tích CV, chấm điểm độ phù hợp (AI Matching Score) và gợi ý việc làm tức thì",
      "Kết nối trực tiếp Hồ sơ Năng lực Số từ Trường Đại học & Trung tâm NN-TH về phân hệ HRM trên ERP"
    ],
    ecoFlow: "🔄 Liên thông: Nhận Hồ sơ Năng lực Số QR từ LMS/Đại học & Đẩy ứng viên trúng tuyển 1-Click về TechCorp ERP"
  },
  mamnon: {
    icon: "🧸",
    imageUrl: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80",
    imageTag: "Điểm danh AI & Thực đơn Dinh dưỡng",
    targetAudience: "Trường Mầm non Tư thục, Quốc tế & Nhóm trẻ Chất lượng cao",
    highlights: [
      "Điểm danh AI nhận diện khuôn mặt, quản lý hồ sơ sức khỏe & cân đo định kỳ",
      "Quản lý thực đơn dinh dưỡng chuẩn Viện Dinh dưỡng & Sổ liên lạc Phụ huynh",
      "Gạch nợ học phí tự động bằng mã QR động 3 giây, xuất biên lai điện tử"
    ],
    ecoFlow: "🔄 Liên thông: Nhận học bổng tiếng Anh thiếu nhi từ Trung tâm NN & E-Voucher gia đình từ Doanh nghiệp"
  },
  tieuhoc: {
    icon: "🎒",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    imageTag: "Học bạ Số & Đánh giá Thông tư 27",
    targetAudience: "Trường Tiểu học Công lập, Tư thục & Liên cấp Quốc tế",
    highlights: [
      "Quản lý học vụ Tiểu học, đánh giá phẩm chất & năng lực theo Thông tư Bộ GD&ĐT",
      "Học bạ số ký số điện tử, Sổ liên lạc đa chiều giữa Giáo viên chủ nhiệm & Phụ huynh",
      "Tích hợp cổng thanh toán học phí, tiền ăn bán trú & xe đưa đón không tiền mặt"
    ],
    ecoFlow: "🔄 Liên thông: Kết nối kỳ thi đánh giá tư duy/tiếng Anh trên LMS & Nhà cung ứng suất ăn học đường B2B"
  },
  thcs: {
    icon: "📘",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
    imageTag: "Sổ điểm Điện tử TT22 & Trợ lý AI",
    targetAudience: "Trường Trung học Cơ sở (THCS) & Trường Phổ thông Liên cấp",
    highlights: [
      "EduManager Pro K12: Phân công chuyên môn, thời khóa biểu & sổ điểm điện tử",
      "Tích hợp Trợ lý AI hỗ trợ giáo viên soạn giảng và phân tích kết quả học tập",
      "Tổ chức kiểm tra 15 phút, 1 tiết và thi học kỳ trực tuyến chống gian lận"
    ],
    ecoFlow: "🔄 Liên thông: Đồng bộ ngân hàng đề và kết quả khảo thí trực tiếp với nền tảng TechCorp LMS"
  },
  thpt: {
    icon: "🎓",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
    imageTag: "Tổ hợp GDPT 2018 & Hướng nghiệp AI",
    targetAudience: "Trường Trung học Phổ thông (THPT) & Trường Chuyên",
    highlights: [
      "Quản lý đăng ký tổ hợp môn tự chọn theo Chương trình GDPT 2018 & xếp lớp thông minh",
      "Trợ lý AI tư vấn hướng nghiệp, phân tích năng lực học sinh & ôn thi Tốt nghiệp THPT",
      "Quản lý toàn diện hồ sơ học sinh, kỷ luật tích cực, học bạ số và thu học phí QR"
    ],
    ecoFlow: "🔄 Liên thông: Kết nối trực tiếp Đấu trường Thi thử IELTS/TOEIC & Cổng Tuyển sinh Đại học TC COMPASS"
  },
  gdtx: {
    icon: "🏛️",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    imageTag: "Song bằng Văn hóa GDTX & Đào tạo Nghề",
    targetAudience: "Trung tâm Giáo dục Nghề nghiệp - Giáo dục Thường xuyên (GDNN - GDTX)",
    highlights: [
      "Quản lý học viên hệ GDTX cấp THPT kết hợp đào tạo trung cấp nghề song song",
      "Theo dõi chuyên cần, quản lý kỳ thi sát hạch kỹ năng nghề & cấp chứng chỉ",
      "Kết nối doanh nghiệp địa phương nhận học viên thực hành và tuyển dụng ngay"
    ],
    ecoFlow: "🔄 Liên thông: Đẩy hồ sơ học viên tốt nghiệp nghề sang Sàn Tuyển dụng JobAI & TechCorp ERP"
  },
  qldt: {
    icon: "🧭",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
    imageTag: "Quản trị Đại học Tín chỉ & KPI Giảng viên",
    targetAudience: "Trường Đại học, Học viện & Trường Cao đẳng (TC COMPASS v1.0)",
    highlights: [
      "Quản trị đào tạo tín chỉ toàn diện: Chương trình khung, đăng ký học phần, xét tốt nghiệp",
      "Đánh giá hiệu suất làm việc (KPI) giảng viên, quản lý nghiên cứu khoa học & kiểm định",
      "Cổng Thực tập & Việc làm Sinh viên kết nối trực tiếp với Sàn Tuyển dụng JobAI & Doanh nghiệp"
    ],
    ecoFlow: "🔄 Liên thông: Tự động xuất Hồ sơ Năng lực Số (Talent Passport) của SV năm cuối sang Sàn Việc làm JobAI"
  },
  ttnn: {
    icon: "🌐",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    imageTag: "CRM Ngoại ngữ - Tin học & Phòng thi",
    targetAudience: "Trung tâm Ngoại ngữ (IELTS/TOEIC/Giao tiếp), Tin học & Kỹ năng",
    highlights: [
      "CRM Tuyển sinh đa kênh, quản lý kiểm tra đầu vào (Placement Test) & xếp lớp tự động",
      "Quản lý lịch dạy giáo viên bản xứ/trợ giảng, điểm danh bù buổi & nhắc học phí tự động",
      "Đồng tổ chức các kỳ thi thử IELTS/TOEIC/MOS trực tuyến toàn tỉnh để thu hút học viên"
    ],
    ecoFlow: "🔄 Liên thông: Nhận Lead thí sinh tự động từ TechCorp LMS & Đề cử học viên xuất sắc lên JobAI"
  },
  lms: {
    icon: "📝",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    imageTag: "Khảo thí Trực tuyến Anti-Cheat & QR",
    targetAudience: "Trường học K12, Đại học, Trung tâm Đào tạo & Doanh nghiệp Sát hạch Nội bộ",
    highlights: [
      "Hệ thống Đào tạo & Khảo thí Trực tuyến (E-Testing) chịu tải cao, chống gian lận AI",
      "Ngân hàng câu hỏi chuẩn hóa theo ma trận đề, chấm điểm tự động & phân tích phổ điểm",
      "Cấp Chứng chỉ Năng lực Số kèm mã QR xác thực chống giả mạo trên toàn hệ sinh thái"
    ],
    ecoFlow: "🔄 Liên thông: Tự động đính kèm Chứng chỉ QR vào Hồ sơ Ứng viên trên JobAI & TechCorp ERP"
  },
  learn: {
    icon: "💻",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    imageTag: "Cổng Khóa học Video HD & AI Mentor",
    targetAudience: "Sinh viên, Học viên, Người đi làm & Doanh nghiệp Đào tạo Nội bộ (L&D)",
    highlights: [
      "Nền tảng TechCorpLearn ('Học để dẫn đầu'): Kho khóa học Video HD, SCORM & Live Class",
      "Lộ trình học tập cá nhân hóa về Công nghệ, Quản trị, AI, Ngoại ngữ & Kỹ năng mềm",
      "Tích hợp bài tập thực hành, thảo luận trực tuyến và cấp chứng nhận hoàn thành khóa học"
    ],
    ecoFlow: "🔄 Liên thông: Đồng bộ tiến độ tự học của nhân sự về hệ thống đánh giá năng lực BSC-KPI & ERP"
  },
  kpi: {
    icon: "📊",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    imageTag: "Thẻ điểm Cân bằng BSC & Quản trị OKR",
    targetAudience: "Ban Giám đốc, CEO, Giám đốc Nhân sự (CHRO) & Trưởng bộ phận Doanh nghiệp",
    highlights: [
      "Hệ thống quản trị chiến lược theo Thẻ điểm cân bằng (BSC) & phân rã mục tiêu KPI/OKR",
      "Theo dõi tiến độ hoàn thành chỉ tiêu theo thời gian thực với biểu đồ trực quan đa chiều",
      "Tự động tính điểm hiệu suất làm việc hàng tháng/quý làm cơ sở tính lương thưởng"
    ],
    ecoFlow: "🔄 Liên thông: Kết nối hai chiều với phân hệ HRM/Payroll trên TechCorp ERP & Hệ thống Đại học TC COMPASS"
  },
  erp: {
    icon: "🏢",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    imageTag: "Quản trị Doanh nghiệp Hợp nhất All-in-One",
    targetAudience: "Doanh nghiệp SME, Tập đoàn Dịch vụ, Thương mại, Sản xuất & Phân phối",
    highlights: [
      "Quản trị Doanh nghiệp hợp nhất: Nhân sự (HRM), Khách hàng (CRM), Tài chính - Kế toán, Kho vận",
      "Tuyển dụng 1-Click: Nhập trực tiếp hồ sơ ứng viên từ Sàn Việc làm JobAI & Đại học vào HRM",
      "Phát hành chiến dịch E-Voucher khuyến mãi chéo tới hàng chục ngàn Phụ huynh & Sinh viên"
    ],
    ecoFlow: "🔄 Liên thông: Trục trung tâm kết nối Nhân sự, Sàn Tuyển dụng JobAI, Tài chính và Giao thương B2B"
  },
  techcorp: {
    icon: "🚀",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    imageTag: "Cổng Giải pháp Số & Đào tạo Thực chiến",
    targetAudience: "Doanh nghiệp, Tổ chức Giáo dục & Học viên Thực chiến tại Khánh Hòa & Toàn quốc",
    highlights: [
      "Cổng chính thức TechCorp Academy: Cung cấp giải pháp PMS, ERP, LMS & Tư vấn Chuyển đổi số",
      "Đào tạo nhân sự công nghệ và quản trị vận hành phần mềm thực chiến cho doanh nghiệp",
      "Trung tâm điều phối triển khai, bảo hành và hỗ trợ kỹ thuật 24/7 cho toàn hệ sinh thái"
    ],
    ecoFlow: "🔄 Liên thông: Cổng tư vấn giải pháp Combo và kết nối đối tác chiến lược toàn Hệ sinh thái TechCorp"
  },
  qldh: {
    icon: "🏨",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    imageTag: "Quản lý Khách sạn 3-5 Sao & Resort PMS",
    targetAudience: "Khách sạn 3-5 Sao, Resort Nghỉ dưỡng, Villa & Chuỗi Lưu trú Du lịch",
    highlights: [
      "Hệ thống Quản lý Khách sạn (TechCorp PMS): Đặt phòng (Booking), Lễ tân (Front Desk), Buồng phòng",
      "Quản lý điểm bán hàng POS Nhà hàng, Spa, Dịch vụ giải trí và đối soát công nợ đoàn/OTA",
      "Báo cáo doanh thu, công suất phòng (Occupancy Rate) & RevPAR theo thời gian thực"
    ],
    ecoFlow: "🔄 Liên thông: Tuyển thẳng nhân sự Lễ tân/F&B giỏi ngoại ngữ qua Sàn Việc làm JobAI & Trung tâm NN-TH"
  },
  bds: {
    icon: "🏙️",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
    imageTag: "Sàn Giao dịch BĐS & Trợ lý AI 24/7",
    targetAudience: "Sàn Giao dịch Bất động sản, Chủ đầu tư Dự án & Chuyên viên Môi giới",
    highlights: [
      "Sàn Giao dịch BĐS Cao cấp tích hợp Trợ lý AI tư vấn dự án, phong thủy & dòng tiền 24/7",
      "Quản lý bảng hàng trực quan, giỏ hàng độc quyền, đặt cọc giữ chỗ & CRM chăm sóc khách đầu tư",
      "Tích hợp bản đồ vị trí, thông tin quy hoạch và công cụ tính lãi suất vay ngân hàng"
    ],
    ecoFlow: "🔄 Liên thông: Kết nối chéo với nền tảng Thiết kế Nội thất (noithat.techcorp.info.vn) & Quản trị ERP"
  },
  noithat: {
    icon: "🛋️",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    imageTag: "Showroom Nội thất 3D & Dự toán BOQ",
    targetAudience: "Công ty Thiết kế - Thi công Nội thất, Kiến trúc & Showroom Nội thất Cao cấp",
    highlights: [
      "Nền tảng 'Kiến tạo Không gian Hoàn mỹ': Trưng bày Portfolio dự án & Danh mục sản phẩm 3D",
      "Công cụ nhận yêu cầu tư vấn thiết kế, lập dự toán báo giá thi công nội thất tự động",
      "Quản lý tiến độ sản xuất xưởng, lắp đặt công trình và bảo hành điện tử cho khách hàng"
    ],
    ecoFlow: "🔄 Liên thông: Nhận khách hàng mua căn hộ/biệt thự từ Sàn BĐS AI & Cung ứng nội thất cho Resort/Trường học"
  }
};

window.filterPublicProducts = function (categoryBadge) {
  STATE.selectedProductCategory = categoryBadge || "all";
  const bar = document.getElementById("productCategoryFilterBar");
  if (bar) {
    bar.querySelectorAll(".forum-cat-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-prod-cat") === STATE.selectedProductCategory);
    });
  }
  renderPublicProductsShowcase();
};

function renderSinglePublicProductCard(app, groupTitle) {
  const meta = PRODUCT_SHOWCASE_META[app.id] || {
    icon: "🚀",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    imageTag: "Nền tảng Thành viên Hệ sinh thái",
    targetAudience: "Đơn vị Thành viên Hệ sinh thái TechCorp",
    highlights: [
      app.desc || "Nền tảng thành viên kết nối trực tiếp vào Trục dữ liệu SSO TechCorp ID",
      "Tích hợp sẵn thanh điều hướng Ecosystem Topbar và xác thực tập trung JWT",
      "Chia sẻ dữ liệu liên thông hai chiều qua REST API & Webhook thời gian thực"
    ],
    ecoFlow: "🔄 Liên thông: Kết nối SSO TechCorp ID & Đồng bộ dữ liệu tự động qua Event Bus"
  };

  const coverImg = app.imageUrl || meta.imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80";

  const bulletsHtml = meta.highlights
    .map((h) => `<div style="font-size:12.5px;color:#334155;margin-top:4px;">✔ ${escapeHtml(h)}</div>`)
    .join("");

  const detailUrl = `product.html?id=${encodeURIComponent(app.id)}`;
  const demoUrl = `product.html?id=${encodeURIComponent(app.id)}#demo-form`;

  return `
    <div class="pub-product-card">
      <div>
        <a href="${detailUrl}" class="pub-prod-media" title="Xem chi tiết ${escapeHtml(app.name)}">
          <img
            src="${escapeHtml(coverImg)}"
            alt="${escapeHtml(app.name)}"
            class="pub-prod-thumb-img"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80'"
          />
          <div class="pub-prod-media-top">
            <span class="badge badge-green">● HTTP 200 Live</span>
            <span class="badge badge-blue">${escapeHtml(groupTitle || app.badge || "TechCorp Cloud")}</span>
          </div>
          <div class="pub-prod-media-bottom">
            <span class="pub-prod-icon">${meta.icon}</span>
            <span class="pub-prod-media-tag">${escapeHtml(meta.imageTag || app.badge || "TechCorp Cloud")}</span>
          </div>
        </a>
        <h3>
          <a href="${detailUrl}" style="color:inherit;text-decoration:none;">
            ${escapeHtml(app.name)}
          </a>
        </h3>
        <div style="font-size:12px;font-weight:700;color:#0052d4;margin-bottom:6px;">
          🎯 Đối tượng: ${escapeHtml(meta.targetAudience)}
        </div>
        <p>${escapeHtml(app.desc)}</p>
        <div style="margin:8px 0;padding:10px 12px;background:#f8fbff;border-radius:10px;border:1px solid #dbeafe;">
          ${bulletsHtml}
        </div>
        <div class="pub-prod-flow">
          ${escapeHtml(meta.ecoFlow)}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;padding-top:10px;border-top:1px solid #e2e8f0;">
        <div class="pub-prod-links-row">
          <a href="${escapeHtml(app.appUrl)}" target="_blank" rel="noopener" style="font-size:11.5px;color:#0052d4;font-weight:800;text-decoration:none;white-space:nowrap;">
            🌐 ${escapeHtml(app.appUrl.replace("https://", ""))} ↗
          </a>
          <a href="${detailUrl}" style="font-size:11.5px;color:#059669;font-weight:800;text-decoration:none;white-space:nowrap;">
            📖 Xem 6 Phân hệ Chức năng →
          </a>
        </div>
        <div class="pub-prod-actions-row">
          <a href="${detailUrl}" class="btn btn-outline btn-sm pub-prod-action-btn">
            📖 Chi tiết Sản phẩm
          </a>
          <a href="${escapeHtml(app.appUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm pub-prod-action-btn">
            🚀 Xem &amp; Dùng thử ↗
          </a>
          <a href="${demoUrl}" class="btn btn-emerald btn-sm pub-prod-action-btn">
            📝 Đăng ký Demo
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderPublicProductsShowcase() {
  const gridEl = document.getElementById("publicProductsShowcaseGrid");
  const statEl = document.getElementById("pubStatApps");
  const activeApps = STATE.apps.filter((a) => a.status !== "locked");
  if (statEl) {
    statEl.textContent = `${activeApps.length} Hệ thống`;
  }
  if (!gridEl) return;

  const selectedCat = STATE.selectedProductCategory || "all";
  const allGroupedIds = new Set();
  PRODUCT_GROUPS_6.forEach((g) => g.appIds.forEach((id) => allGroupedIds.add(id)));
  const extraApps = activeApps.filter((a) => !allGroupedIds.has(a.id));

  const groupsToRender =
    selectedCat === "all"
      ? PRODUCT_GROUPS_6
      : PRODUCT_GROUPS_6.filter((g) => g.groupId === selectedCat || g.title.toLowerCase().includes(selectedCat.toLowerCase()));

  gridEl.innerHTML = groupsToRender
    .map((group, idx) => {
      const groupApps = group.appIds
        .map((id) => activeApps.find((a) => a.id === id))
        .filter(Boolean);
      if (idx === groupsToRender.length - 1 && selectedCat === "all" && extraApps.length > 0) {
        groupApps.push(...extraApps);
      }
      if (groupApps.length === 0) return "";

      return `
        <div class="prod-group-section" style="border-top: 4px solid ${group.accentColor};">
          <div class="prod-group-header">
            <div class="prod-group-title-box">
              <span class="badge ${group.badgeClass}">${escapeHtml(group.groupNumber)} • ${groupApps.length} SẢN PHẨM LIVE</span>
              <h4>${escapeHtml(group.title)}</h4>
              <p>${escapeHtml(group.subtitle)}</p>
            </div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button type="button" class="btn btn-outline btn-sm" onclick="switchPublicPage('pricing')">
                💳 Báo giá Combo Nhóm này
              </button>
              <button type="button" class="btn btn-emerald btn-sm" onclick="switchPublicPage('contact')">
                📞 Đăng ký Tư vấn
              </button>
            </div>
          </div>
          <div class="pub-product-grid">
            ${groupApps.map((app) => renderSinglePublicProductCard(app, group.groupNumber)).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

// ==================== 1. CONNECTED APPS & ROLE-BASED APP LAUNCHER ====================
function renderConnectedApps() {
  const listEl = document.getElementById("connectedAppsList");
  const kpiEl = document.getElementById("kpiConnectedAppsCount");
  if (kpiEl) {
    kpiEl.textContent = `${STATE.apps.length} Ứng dụng`;
  }
  if (!listEl) return;

  const currentUser = getCurrentUserObject();
  const assignedApps = (currentUser && currentUser.assignedApps) || [];
  const isMaster = getCurrentRoleCode() === "super_admin";

  listEl.innerHTML = STATE.apps
    .map((app, i) => {
      const isAuthorized = isMaster || assignedApps.includes(app.id);
      const statusBadge =
        app.status === "locked"
          ? `<span class="badge badge-red">🔴 Tạm khóa</span>`
          : isAuthorized
          ? `<span class="badge badge-green">✔ Đã cấp quyền SSO</span>`
          : `<span class="badge badge-amber">🔒 Chưa mở quyền cho Vai trò này</span>`;
      return `
        <div class="product-item" style="${!isAuthorized ? "opacity:0.75;border-left-color:#94a3b8;background:#f8fafc;" : ""}">
          <div class="product-info">
            <h4>${i + 1}. ${escapeHtml(app.name)} <code style="font-size:11.5px;color:#0052d4;margin-left:6px;">[${escapeHtml(app.id)}]</code></h4>
            <p>${escapeHtml(app.desc || "")}</p>
            <div style="font-size:11.5px;color:#64748b;margin-top:4px;">
              🌐 URL: <span style="color:#475569;">${escapeHtml(app.appUrl || "")}</span>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
            <span class="badge badge-blue">${escapeHtml(app.badge || "App")}</span>
            ${statusBadge}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderAdminAppsTable() {
  const tbody = document.getElementById("adminAppsTableBody");
  if (!tbody) return;

  tbody.innerHTML = STATE.apps
    .map((app) => {
      const stBadge =
        app.status === "locked"
          ? `<span class="badge badge-red">🔴 Đã khóa</span>`
          : app.status === "maintenance"
          ? `<span class="badge badge-amber">🟡 Bảo trì</span>`
          : `<span class="badge badge-green">🟢 Hoạt động</span>`;

      return `
        <tr>
          <td>
            <strong>${escapeHtml(app.name)}</strong>
            <div style="font-size:11.5px;color:#0052d4;">ID: <code>${escapeHtml(app.id)}</code> • Nhãn: ${escapeHtml(app.badge || "App")}</div>
            <div style="font-size:11.5px;color:#475569;">${escapeHtml(app.desc || "")}</div>
          </td>
          <td>
            <div style="font-size:12px;color:#0f172a;">🌐 ${escapeHtml(app.appUrl || "")}</div>
            <div style="font-size:11.5px;color:#d97706;margin-top:3px;">🔑 <code>${escapeHtml(app.apiKeyMasked || "tc_live_...")}</code></div>
          </td>
          <td>${stBadge}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-outline btn-sm" onclick="editEcosystemApp('${escapeHtml(app.id)}')">✏️ Sửa</button>
              <button class="btn btn-warning btn-sm" onclick="toggleAppLock('${escapeHtml(app.id)}')">
                ${app.status === "locked" ? "🔓 Mở" : "🔒 Khóa"}
              </button>
              <button class="btn btn-outline btn-sm" onclick="rotateAppApiKey('${escapeHtml(app.id)}')">🔄 Đổi Key</button>
              <button class="btn btn-danger btn-sm" onclick="deleteEcosystemApp('${escapeHtml(app.id)}')">🗑️ Xoá</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

window.resetAppForm = function () {
  document.getElementById("editAppMode").value = "create";
  document.getElementById("appFormTitle").textContent = "➕ Bổ sung Ứng dụng Mới vào Hệ sinh thái";
  const idInput = document.getElementById("newAppId");
  idInput.disabled = false;
  idInput.value = "";
  document.getElementById("newAppBadge").value = "BizTech";
  document.getElementById("newAppName").value = "";
  document.getElementById("newAppStatus").value = "active";
  document.getElementById("newAppUrl").value = "https://";
  document.getElementById("newAppWebhook").value = "https://";
  document.getElementById("newAppDesc").value = "";
};

window.editEcosystemApp = function (appId) {
  const app = STATE.apps.find((a) => a.id === appId);
  if (!app) return;
  document.getElementById("editAppMode").value = "edit";
  document.getElementById("appFormTitle").textContent = `✏️ Cập nhật Ứng dụng: ${app.name}`;
  const idInput = document.getElementById("newAppId");
  idInput.value = app.id;
  idInput.disabled = true;
  document.getElementById("newAppBadge").value = app.badge || "App";
  document.getElementById("newAppName").value = app.name || "";
  document.getElementById("newAppStatus").value = app.status || "active";
  document.getElementById("newAppUrl").value = app.appUrl || "";
  document.getElementById("newAppWebhook").value = app.webhookUrl || "";
  document.getElementById("newAppDesc").value = app.desc || "";
  showToast(`Đang nạp cấu hình ứng dụng <b>${escapeHtml(app.name)}</b> để chỉnh sửa.`);
};

window.saveEcosystemApp = async function () {
  const mode = document.getElementById("editAppMode")?.value || "create";
  const id = document.getElementById("newAppId")?.value.trim();
  const name = document.getElementById("newAppName")?.value.trim();
  const badge = document.getElementById("newAppBadge")?.value.trim() || "New App";
  const status = document.getElementById("newAppStatus")?.value || "active";
  const appUrl = document.getElementById("newAppUrl")?.value.trim();
  const webhookUrl = document.getElementById("newAppWebhook")?.value.trim();
  const desc = document.getElementById("newAppDesc")?.value.trim();

  if (!id || !name) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Mã định danh (App ID) và Tên ứng dụng!</span>`);
    return;
  }

  if (mode === "edit") {
    try {
      const res = await fetch(`/api/v1/apps/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          badge,
          status,
          appUrl,
          webhookUrl,
          desc,
          actorKey: STATE.currentPersona
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        STATE.apps = data.apps;
        STATE.auditLogs = data.auditLogs || STATE.auditLogs;
        renderAllViews();
        if (typeof window.refreshTechCorpTopbar === "function") {
          window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
        }
        showToast(`Đã cập nhật ứng dụng <b>${escapeHtml(name)}</b> và lưu vào Audit Logs!`);
        return;
      }
    } catch (_) {}

    const app = STATE.apps.find((a) => a.id === id);
    if (app) {
      app.name = name;
      app.badge = badge;
      app.status = status;
      app.appUrl = appUrl;
      app.webhookUrl = webhookUrl;
      app.desc = desc;
      recordLocalAuditLog("APP_UPDATE", `${name} (${id})`, "INFO", `Cập nhật cấu hình ứng dụng (${appUrl}), trạng thái: ${status}.`);
      renderAllViews();
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }
      showToast(`Đã cập nhật ứng dụng <b>${escapeHtml(name)}</b>!`);
    }
    return;
  }

  // Create mode
  try {
    const res = await fetch("/api/v1/apps/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        badge,
        status,
        appUrl,
        webhookUrl,
        desc,
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.apps = data.apps;
      STATE.activityLogs = data.activityLogs || STATE.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();

      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }

      const outEl = document.getElementById("integrationGuideOutput");
      if (outEl && data.integration) {
        outEl.innerHTML = `
          <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);padding:12px;border-radius:10px;margin-bottom:10px;">
            <div style="color:#059669;font-weight:700;font-size:13px;">✅ Đã tích hợp "${escapeHtml(data.app.name)}" & Ghi Audit Log!</div>
            <div style="font-size:12px;color:#0f172a;margin-top:4px;">🔑 <strong>API Key:</strong> <code style="color:#d97706">${escapeHtml(data.app.apiKey)}</code></div>
          </div>
          <p style="font-size:12px;color:#475569;margin-bottom:4px;"><strong>Mã nhúng Thanh Liên thông:</strong></p>
          <div class="code-box">${escapeHtml(data.integration.widgetSnippet)}</div>
        `;
      }

      showToast(`Đã bổ sung ứng dụng <b>${escapeHtml(data.app.name)}</b> vào hệ sinh thái!`);
      return;
    } else if (data && data.error) {
      showToast(`<span style="color:#d97706">${escapeHtml(data.error)}</span>`);
      return;
    }
  } catch (_) {}

  const fakeKey = "tc_live_" + id.replace(/[^a-z0-9]/g, "") + "_9988aabb";
  STATE.apps.push({
    id,
    name,
    badge,
    status,
    appUrl,
    webhookUrl,
    desc,
    apiKeyMasked: `${fakeKey.slice(0, 12)}...aabb`
  });
  recordLocalAuditLog("APP_CREATE", `${name} (${id})`, "INFO", `Tích hợp ứng dụng mới (${appUrl}) vào hệ sinh thái.`);
  renderAllViews();
  if (typeof window.refreshTechCorpTopbar === "function") {
    window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
  }
  showToast(`Đã bổ sung ứng dụng <b>${escapeHtml(name)}</b> vào hệ sinh thái!`);
};

window.toggleAppLock = async function (appId) {
  const app = STATE.apps.find((a) => a.id === appId);
  if (!app) return;
  const nextStatus = app.status === "locked" ? "active" : "locked";

  try {
    const res = await fetch(`/api/v1/apps/${encodeURIComponent(appId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.apps = data.apps;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }
      showToast(`Đã chuyển trạng thái ứng dụng <b>${escapeHtml(app.name)}</b> sang: <b>${nextStatus}</b>`);
      return;
    }
  } catch (_) {}

  app.status = nextStatus;
  recordLocalAuditLog("APP_STATUS_CHANGE", `${app.name} (${appId})`, "WARNING", `Đổi trạng thái ứng dụng sang: ${nextStatus}.`);
  renderAllViews();
  if (typeof window.refreshTechCorpTopbar === "function") {
    window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
  }
  showToast(`Đã chuyển trạng thái ứng dụng <b>${escapeHtml(app.name)}</b> sang: <b>${nextStatus}</b>`);
};

window.rotateAppApiKey = async function (appId) {
  const app = STATE.apps.find((a) => a.id === appId);
  if (!app) return;
  try {
    const res = await fetch(`/api/v1/apps/${encodeURIComponent(appId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regenerateApiKey: true, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.apps = data.apps;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`Đã cấp lại API Key mới cho <b>${escapeHtml(app.name)}</b>!`);
      return;
    }
  } catch (_) {}

  const rnd = Math.floor(1000 + Math.random() * 9000);
  app.apiKeyMasked = `tc_live_rot...${rnd}`;
  recordLocalAuditLog("APP_ROTATE_KEY", `${app.name} (${appId})`, "WARNING", "Cấp lại khóa bảo mật API Key mới.");
  renderAllViews();
  showToast(`Đã cấp lại API Key mới cho <b>${escapeHtml(app.name)}</b>!`);
};

window.deleteEcosystemApp = async function (appId) {
  const app = STATE.apps.find((a) => a.id === appId);
  if (!app) return;
  if (!confirm(`Bạn có chắc chắn muốn XOÁ ứng dụng "${app.name}" (${appId}) khỏi Hệ sinh thái TechCorp?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/apps/${encodeURIComponent(appId)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.apps = data.apps;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }
      showToast(`Đã xoá ứng dụng <b>${escapeHtml(app.name)}</b> và lưu vết Audit Log!`);
      return;
    }
  } catch (_) {}

  STATE.apps = STATE.apps.filter((a) => a.id !== appId);
  recordLocalAuditLog("APP_DELETE", `${app.name} (${appId})`, "CRITICAL", `Xoá ứng dụng ${app.name} khỏi hệ sinh thái.`);
  renderAllViews();
  if (typeof window.refreshTechCorpTopbar === "function") {
    window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
  }
  showToast(`Đã xoá ứng dụng <b>${escapeHtml(app.name)}</b>!`);
};

// ==================== 2. FORUM FEED (SPLIT-PANE TREE VIEW) & ADMIN FORUM MODERATION ====================
const FORUM_UNIT_GROUPS_CONFIG = [
  {
    key: "sme_hospitality",
    title: "🏢 Khối Doanh nghiệp SME & Du lịch",
    shortTitle: "Khối Doanh nghiệp SME & Du lịch"
  },
  {
    key: "school_uni",
    title: "🎓 Khối Trường học K-12 & Đại học",
    shortTitle: "Khối Trường học K-12 & Đại học"
  },
  {
    key: "training_center",
    title: "🏫 Khối Trung tâm Ngoại ngữ - Tin học",
    shortTitle: "Khối Trung tâm Ngoại ngữ - Tin học"
  },
  {
    key: "realestate_interior",
    title: "🏙️ Khối Bất động sản & Nội thất",
    shortTitle: "Khối Bất động sản & Nội thất"
  }
];

function resolveForumPostUnitInfo(post) {
  const rawOrg = String(post?.author?.org || "Đơn vị Thành viên TechCorp").trim();
  const cleanOrg = rawOrg.replace(/\s*\(Đang dùng:.*$/i, "").trim();
  const lower = (cleanOrg + " " + (post?.author?.roleBadge || "")).toLowerCase();

  let groupKey = post.unitGroup || "";
  if (!groupKey) {
    if (lower.includes("bđs") || lower.includes("bất động sản") || lower.includes("hưng phát") || lower.includes("nội thất")) {
      groupKey = "realestate_interior";
    } else if (lower.includes("trung tâm") || lower.includes("english") || lower.includes("language") || lower.includes("nn-th") || lower.includes("global star") || lower.includes("á châu")) {
      groupKey = "training_center";
    } else if (lower.includes("trường") || lower.includes("đại học") || lower.includes("cao đẳng") || lower.includes("giáo dục") || lower.includes("sao biển") || lower.includes("ntu")) {
      groupKey = "school_uni";
    } else {
      groupKey = "sme_hospitality";
    }
  }

  let icon = "🏢";
  if (cleanOrg.toLowerCase().includes("resort") || cleanOrg.toLowerCase().includes("khách sạn")) icon = "🏨";
  else if (cleanOrg.toLowerCase().includes("thực phẩm") || cleanOrg.toLowerCase().includes("biển xanh")) icon = "🍱";
  else if (cleanOrg.toLowerCase().includes("nha khoa") || cleanOrg.toLowerCase().includes("phòng khám")) icon = "🦷";
  else if (cleanOrg.toLowerCase().includes("seatech")) icon = "⚙️";
  else if (cleanOrg.toLowerCase().includes("hưng phát") || cleanOrg.toLowerCase().includes("nội thất")) icon = "🛋️";
  else if (cleanOrg.toLowerCase().includes("đại học") || cleanOrg.toLowerCase().includes("cao đẳng")) icon = "🏛️";
  else if (cleanOrg.toLowerCase().includes("sao biển") || cleanOrg.toLowerCase().includes("trường")) icon = "🏫";
  else if (cleanOrg.toLowerCase().includes("ocean")) icon = "🇬🇧";
  else if (cleanOrg.toLowerCase().includes("á châu")) icon = "🇰🇷";
  else if (cleanOrg.toLowerCase().includes("global star")) icon = "🌟";

  // Short display name for tree leaf
  let shortOrg = cleanOrg
    .replace(/^Công ty CP Thực phẩm & Suất ăn Học đường\s+/i, "Thực phẩm Học đường ")
    .replace(/^Công ty CP Thương mại & Dịch vụ\s+/i, "Công ty TM&DV ")
    .replace(/^Hệ thống Nha khoa Quốc tế\s+/i, "Nha khoa Quốc tế ")
    .replace(/^Sàn Giao dịch BĐS\s+/i, "BĐS ")
    .replace(/^Hệ thống Anh ngữ Quốc tế\s+/i, "Anh ngữ Quốc tế ");

  return {
    cleanOrg,
    shortOrg,
    groupKey,
    icon
  };
}

if (!STATE.selectedForumTreeFilter) {
  STATE.selectedForumTreeFilter = { type: "all", value: "all", label: "Tất cả Đơn vị Thành viên" };
}
if (!STATE.forumDisplayMode) {
  STATE.forumDisplayMode = "split";
}
if (!STATE.collapsedTreeGroups) {
  STATE.collapsedTreeGroups = {};
}

window.selectForumTreeNode = function (filterType, filterValue, filterLabel) {
  STATE.selectedForumTreeFilter = {
    type: filterType || "all",
    value: filterValue || "all",
    label: filterLabel || "Tất cả Đơn vị Thành viên"
  };
  STATE.selectedForumPostId = null; // Auto-select first post in the filtered node
  renderForumPosts();
};

window.toggleForumTreeGroup = function (groupKey, event) {
  if (event) {
    event.stopPropagation();
  }
  STATE.collapsedTreeGroups[groupKey] = !Boolean(STATE.collapsedTreeGroups[groupKey]);
  renderForumPosts();
};

window.toggleAllForumTreeGroups = function () {
  const anyCollapsed = FORUM_UNIT_GROUPS_CONFIG.some((g) => Boolean(STATE.collapsedTreeGroups[g.key]));
  FORUM_UNIT_GROUPS_CONFIG.forEach((g) => {
    STATE.collapsedTreeGroups[g.key] = !anyCollapsed;
  });
  renderForumPosts();
};

window.handleForumTreeSearch = function (val) {
  STATE.forumTreeSearchQuery = String(val || "").trim();
  renderForumPosts();
};

window.selectForumPostToRead = function (postId, scrollReader = false) {
  STATE.selectedForumPostId = postId;
  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (post) {
    post.views = (post.views || 1) + 1;
  }
  renderForumPosts();
  if (scrollReader) {
    setTimeout(() => {
      const readerEl = document.getElementById("forumActiveReaderPane");
      if (readerEl) {
        readerEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 40);
  }
};

window.navigateForumPostReader = function (step) {
  const list = window._lastFilteredForumPosts || [];
  if (list.length === 0) return;
  const currentIdx = list.findIndex((p) => p.id === STATE.selectedForumPostId);
  const nextIdx = (currentIdx + step + list.length) % list.length;
  window.selectForumPostToRead(list[nextIdx].id, false);
};

window.toggleForumDisplayMode = function () {
  STATE.forumDisplayMode = STATE.forumDisplayMode === "split" ? "expanded" : "split";
  const btn = document.getElementById("forumViewModeBtn");
  if (btn) {
    btn.innerHTML =
      STATE.forumDisplayMode === "split"
        ? "📰 Chuyển sang Xem Mở rộng Tất cả"
        : "🌳 Chuyển về Chế độ Đọc Tách Khung";
  }
  renderForumPosts();
};

function renderForumUnitTreeSidebar(approvedPosts) {
  const treeEl = document.getElementById("forumUnitTreeContainer");
  if (!treeEl) return;

  const activeFilter = STATE.selectedForumTreeFilter || { type: "all", value: "all" };
  const activeCat = STATE.selectedForumCategory || "all";

  // Filter by category & search query when computing counts or show total approved counts per unit
  const groupsMap = new Map();
  FORUM_UNIT_GROUPS_CONFIG.forEach((g) => {
    groupsMap.set(g.key, {
      ...g,
      totalCount: 0,
      unitsMap: new Map()
    });
  });

  approvedPosts.forEach((p) => {
    const info = resolveForumPostUnitInfo(p);
    const grp = groupsMap.get(info.groupKey) || groupsMap.get("sme_hospitality");
    grp.totalCount += 1;
    if (!grp.unitsMap.has(info.cleanOrg)) {
      grp.unitsMap.set(info.cleanOrg, {
        cleanOrg: info.cleanOrg,
        shortOrg: info.shortOrg,
        icon: info.icon,
        count: 0
      });
    }
    grp.unitsMap.get(info.cleanOrg).count += 1;
  });

  const isAllActive = activeFilter.type === "all";

  const groupsHtml = Array.from(groupsMap.values())
    .map((grp) => {
      const isCollapsed = Boolean(STATE.collapsedTreeGroups[grp.key]);
      const isGroupActive = activeFilter.type === "group" && activeFilter.value === grp.key;
      const units = Array.from(grp.unitsMap.values());

      const leavesHtml = units
        .map((u) => {
          const isLeafActive = activeFilter.type === "org" && activeFilter.value === u.cleanOrg;
          const safeOrgParam = escapeHtml(u.cleanOrg).replace(/'/g, "\\'");
          return `
            <div
              class="tree-unit-leaf ${isLeafActive ? "active" : ""}"
              onclick="selectForumTreeNode('org', '${safeOrgParam}', '${safeOrgParam}')"
              title="${escapeHtml(u.cleanOrg)} (${u.count} bài viết)"
            >
              <span class="tree-unit-leaf-name">
                <span>${u.icon}</span>
                <span style="overflow:hidden;text-overflow:ellipsis;">${escapeHtml(u.shortOrg)}</span>
              </span>
              <span class="tree-count-badge">${u.count}</span>
            </div>
          `;
        })
        .join("");

      const safeGrpTitle = escapeHtml(grp.shortTitle).replace(/'/g, "\\'");

      return `
        <div class="tree-group-block ${isCollapsed ? "collapsed" : ""}">
          <div
            class="tree-group-header ${isGroupActive ? "active" : ""}"
            onclick="selectForumTreeNode('group', '${grp.key}', '${safeGrpTitle}')"
          >
            <div class="tree-group-left">
              <span
                class="tree-caret"
                onclick="toggleForumTreeGroup('${grp.key}', event)"
                title="Thu gọn / Mở rộng nhánh này"
              >▾</span>
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(grp.title)}</span>
            </div>
            <span class="tree-count-badge">${grp.totalCount}</span>
          </div>
          <div class="tree-group-children">
            ${leavesHtml}
          </div>
        </div>
      `;
    })
    .join("");

  // Category counts for quick tree navigation
  const catCounts = {
    rfq: approvedPosts.filter((p) => p.category === "rfq").length,
    spotlight: approvedPosts.filter((p) => p.category === "spotlight").length,
    comarketing: approvedPosts.filter((p) => p.category === "comarketing").length,
    knowledge: approvedPosts.filter((p) => p.category === "knowledge").length
  };

  treeEl.innerHTML = `
    <div
      class="tree-root-node ${isAllActive ? "active" : ""}"
      onclick="selectForumTreeNode('all', 'all', 'Tất cả Đơn vị Thành viên')"
    >
      <span>🌐 Toàn Hệ sinh thái TechCorp</span>
      <span class="tree-count-badge">${approvedPosts.length} bài</span>
    </div>

    <div style="font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin:8px 4px 6px;">
      📂 Phân nhánh theo Khối & Đơn vị
    </div>
    ${groupsHtml}

    <div style="font-size:10.5px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;margin:12px 4px 6px;padding-top:8px;border-top:1px dashed #cbd5e1;">
      🏷️ Nhánh Chuyên mục Giao thương
    </div>
    <div class="tree-group-children" style="margin-left:6px;">
      <div class="tree-unit-leaf ${activeCat === "rfq" ? "active" : ""}" onclick="selectForumCategoryFromTree('rfq')">
        <span class="tree-unit-leaf-name">📢 Cần Mua / Tìm Đối tác (RFQ)</span>
        <span class="tree-count-badge">${catCounts.rfq}</span>
      </div>
      <div class="tree-unit-leaf ${activeCat === "spotlight" ? "active" : ""}" onclick="selectForumCategoryFromTree('spotlight')">
        <span class="tree-unit-leaf-name">🎁 Đặc quyền Give-to-Get</span>
        <span class="tree-count-badge">${catCounts.spotlight}</span>
      </div>
      <div class="tree-unit-leaf ${activeCat === "comarketing" ? "active" : ""}" onclick="selectForumCategoryFromTree('comarketing')">
        <span class="tree-unit-leaf-name">🤝 Hợp tác Sự kiện & Tuyển sinh</span>
        <span class="tree-count-badge">${catCounts.comarketing}</span>
      </div>
      <div class="tree-unit-leaf ${activeCat === "knowledge" ? "active" : ""}" onclick="selectForumCategoryFromTree('knowledge')">
        <span class="tree-unit-leaf-name">💡 Chia sẻ Quản trị & HR</span>
        <span class="tree-count-badge">${catCounts.knowledge}</span>
      </div>
    </div>
  `;
}

window.selectForumCategoryFromTree = function (catKey) {
  const nextCat = STATE.selectedForumCategory === catKey ? "all" : catKey;
  STATE.selectedForumCategory = nextCat;
  const bar = document.getElementById("forumCategoryBar");
  if (bar) {
    bar.querySelectorAll(".forum-cat-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-cat") === nextCat);
    });
  }
  renderForumPosts();
};

function renderSingleForumPostDetailHtml(post, isLoggedIn, activeIdx, totalCount, isReaderMode = true) {
  const isLocked = Boolean(post.locked);
  const info = resolveForumPostUnitInfo(post);

  const navHeaderHtml = isReaderMode
    ? `
      <div class="forum-reader-top-nav">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span class="badge badge-blue">📖 NỘI DUNG CHI TIẾT TIN BÀI (${activeIdx + 1}/${totalCount})</span>
          <span class="badge ${post.pinned ? "badge-amber" : "badge-green"}">
            ${post.pinned ? "📌 GHIM VIP • " : "✔ Đã xác thực SSO • "}${escapeHtml(post.categoryLabel)}
          </span>
          ${isLocked ? `<span class="badge badge-red">🔒 Đã đóng bình luận</span>` : ""}
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" class="btn btn-outline btn-sm" onclick="navigateForumPostReader(-1)">◀ Tin trước</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="navigateForumPostReader(1)">Tin tiếp ▶</button>
        </div>
      </div>
    `
    : `
      <div class="forum-author-bar">
        <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
          <span class="badge ${post.pinned ? "badge-amber" : "badge-blue"}">
            ${post.pinned ? "📌 GHIM VIP • " : ""}${escapeHtml(post.categoryLabel)}
          </span>
          <span class="badge badge-green">✔ Đã thẩm định & Xác thực SSO</span>
          ${isLocked ? `<span class="badge badge-red">🔒 Đã đóng bình luận</span>` : ""}
        </div>
        <span style="font-size:11.5px;color:#475569;">🕒 ${escapeHtml(post.createdAt)} • 👁️ ${post.views || 1} lượt xem</span>
      </div>
    `;

  return `
    <div class="${isReaderMode ? "forum-reader-pane" : `forum-post-card ${post.pinned ? "pinned" : ""}`}" ${isReaderMode ? 'id="forumActiveReaderPane"' : ""}>
      ${navHeaderHtml}

      <h3 class="forum-reader-title">
        ${escapeHtml(post.title)}
      </h3>

      <div class="forum-reader-author-card">
        <div>
          <div style="color:#0b2559;font-weight:800;font-size:13.5px;">
            ${info.icon} Đơn vị: <span style="color:#0052d4;">${escapeHtml(info.cleanOrg)}</span>
          </div>
          <div style="color:#334155;font-size:12px;margin-top:2px;">
            👤 Người đăng: <strong>${escapeHtml(post.author?.name)}</strong> • <span style="color:#059669;font-weight:700;">${escapeHtml(post.author?.verifiedApp || post.author?.roleBadge)}</span>
          </div>
        </div>
        <div style="text-align:right;font-size:12px;color:#475569;">
          <div>🕒 Đăng lúc: <strong>${escapeHtml(post.createdAt)}</strong></div>
          <div style="margin-top:2px;">👁️ <strong>${post.views || 1}</strong> lượt xem • 👍 <strong>${post.likes || 0}</strong> quan tâm</div>
        </div>
      </div>

      <div class="forum-reader-body">
        ${escapeHtml(post.content)}
      </div>

      ${
        post.memberDeal
          ? `<div class="forum-deal-box" style="margin-top:14px;padding:12px 15px;font-size:13px;">
              <strong>🎁 Quyền lợi / Đặc quyền Nội bộ (Give-to-Get):</strong> ${escapeHtml(post.memberDeal)}
            </div>`
          : ""
      }

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;flex-wrap:wrap;gap:10px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="likeForumPost('${post.id}')">
            👍 Quan tâm (${post.likes || 0})
          </button>
          <button class="btn btn-emerald btn-sm" onclick="connectB2B('${escapeHtml(info.cleanOrg)}')">
            🤝 Kết nối Giao thương / Nhận Ưu đãi cùng ${escapeHtml(info.shortOrg)}
          </button>
          <button class="btn btn-outline btn-sm" onclick="selectForumTreeNode('org', '${escapeHtml(info.cleanOrg).replace(/'/g, "\\'")}', '${escapeHtml(info.cleanOrg).replace(/'/g, "\\'")}')">
            📂 Xem tất cả bài của Đơn vị này
          </button>
        </div>
        <span style="font-size:12.5px;font-weight:700;color:#0b2559;">💬 ${(post.comments || []).length} phản hồi giao thương</span>
      </div>

      <div class="forum-comments-wrap">
        ${(post.comments || [])
          .map(
            (c) => `
            <div class="forum-comment-item">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px;flex-wrap:wrap;gap:6px;">
                <strong style="color:#0052d4;">✔ ${escapeHtml(c.authorName)} — <span style="color:#0f172a;">${escapeHtml(c.authorOrg || "")}</span> <span style="color:#475569;font-weight:400;">(${escapeHtml(c.roleBadge)})</span></strong>
                <span style="font-size:11px;color:#64748b;">🕒 ${escapeHtml(c.time)}</span>
              </div>
              <div style="color:#1e293b;line-height:1.5;">${escapeHtml(c.text)}</div>
            </div>
          `
          )
          .join("")}

        ${
          isLocked
            ? `<div style="background:#fff1f2;border:1px solid #fda4af;color:#be123c;padding:9px 12px;border-radius:8px;font-size:12.5px;margin-top:8px;">
                🔒 <strong>Chủ đề đã đóng phản hồi:</strong> Quản trị viên đã khóa bình luận cho chủ đề này.
              </div>`
            : isLoggedIn
            ? `<div style="display:flex;gap:8px;margin-top:10px;">
                <input
                  type="text"
                  id="cmtInput_${post.id}"
                  class="input-control"
                  style="flex:1;padding:8px 12px;font-size:12.5px;"
                  placeholder="Gửi báo giá / phản hồi trực tiếp với tư cách TechCorp ID đã đăng nhập..."
                />
                <button class="btn btn-primary btn-sm" onclick="submitForumComment('${post.id}')">
                  📨 Gửi phản hồi
                </button>
              </div>`
            : `<div style="margin-top:10px;font-size:12.5px;color:#475569;background:#f8fafc;padding:9px 12px;border-radius:8px;border:1px solid #e2e8f0;">
                <a href="login.html" style="color:#0052d4;font-weight:800;text-decoration:none;">🔐 Đăng nhập TechCorp ID</a> để gửi báo giá trực tiếp hoặc phản hồi giao thương với <strong>${escapeHtml(info.shortOrg)}</strong>.
              </div>`
        }
      </div>
    </div>
  `;
}

function renderForumPosts() {
  const container = document.getElementById("forumPostsContainer");
  const kpiEl = document.getElementById("kpiForumPostsCount");
  const pendingBadge = document.getElementById("kpiPendingForumBadge");

  const pendingCount = STATE.forumPosts.filter((p) => p.status === "pending").length;
  if (kpiEl) {
    kpiEl.textContent = `${STATE.forumPosts.length} Chủ đề`;
  }
  if (pendingBadge) {
    pendingBadge.textContent = pendingCount > 0 ? `⏳ ${pendingCount} Chờ thẩm định` : `✅ Đã duyệt 100%`;
    pendingBadge.className = pendingCount > 0 ? "badge badge-amber" : "badge badge-green";
  }

  const approvedPosts = STATE.forumPosts.filter((p) => p.status === "approved");
  renderForumUnitTreeSidebar(approvedPosts);

  if (!container) return;

  let isLoggedIn = false;
  try {
    const raw = localStorage.getItem("tc_sso_session");
    if (raw && JSON.parse(raw).personaKey) {
      isLoggedIn = true;
    }
  } catch (_) {}

  const cat = STATE.selectedForumCategory || "all";
  const treeFilter = STATE.selectedForumTreeFilter || { type: "all", value: "all", label: "Tất cả Đơn vị Thành viên" };
  const kw = (STATE.forumTreeSearchQuery || "").toLowerCase();

  const filtered = approvedPosts.filter((p) => {
    const info = resolveForumPostUnitInfo(p);
    const matchCat = cat === "all" || p.category === cat;
    const matchTree =
      treeFilter.type === "all" ||
      (treeFilter.type === "group" && info.groupKey === treeFilter.value) ||
      (treeFilter.type === "org" && info.cleanOrg === treeFilter.value);
    const matchKw =
      !kw ||
      (p.title || "").toLowerCase().includes(kw) ||
      (p.content || "").toLowerCase().includes(kw) ||
      (p.memberDeal || "").toLowerCase().includes(kw) ||
      info.cleanOrg.toLowerCase().includes(kw) ||
      (p.author?.name || "").toLowerCase().includes(kw);
    return matchCat && matchTree && matchKw;
  });

  window._lastFilteredForumPosts = filtered;

  // Update Breadcrumb
  const breadcrumbEl = document.getElementById("forumTreeBreadcrumb");
  if (breadcrumbEl) {
    const resetFilterBtn =
      treeFilter.type !== "all" || cat !== "all" || kw
        ? `<button type="button" class="btn btn-outline btn-sm" style="padding:3px 8px;font-size:11px;margin-left:6px;" onclick="selectForumTreeNode('all','all','Tất cả Đơn vị Thành viên'); selectForumCategoryFromTree('all');">🔄 Xem tất cả (${approvedPosts.length})</button>`
        : "";
    breadcrumbEl.innerHTML = `
      <span class="crumb-root" style="cursor:pointer;" onclick="selectForumTreeNode('all','all','Tất cả Đơn vị Thành viên')">🌐 Hệ sinh thái TechCorp</span>
      <span class="crumb-sep">›</span>
      <strong class="crumb-current">${escapeHtml(treeFilter.label || "Tất cả Đơn vị Thành viên")}</strong>
      <span class="badge badge-blue" style="margin-left:4px;">${filtered.length} bài viết</span>
      ${resetFilterBtn}
    `;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding:32px 20px;text-align:center;color:#475569;background:#f8fbff;border:1.5px dashed #bfd7fa;border-radius:14px;">
        <div style="font-size:28px;margin-bottom:8px;">🌳</div>
        <div style="font-weight:800;color:#0b2559;font-size:15px;">Chưa có bài viết nào khớp với bộ lọc nhánh cây hiện tại</div>
        <p style="font-size:12.5px;margin-top:4px;margin-bottom:12px;">Hãy chọn nhánh Đơn vị khác ở cây bên trái hoặc bấm nút khôi phục bộ lọc.</p>
        <button type="button" class="btn btn-primary btn-sm" onclick="selectForumTreeNode('all','all','Tất cả Đơn vị Thành viên'); selectForumCategoryFromTree('all');">
          🌐 Hiển thị Toàn bộ ${approvedPosts.length} Bài viết Hệ sinh thái
        </button>
      </div>
    `;
    return;
  }

  // Ensure a valid post is selected for the Reader Pane
  if (!STATE.selectedForumPostId || !filtered.some((p) => p.id === STATE.selectedForumPostId)) {
    STATE.selectedForumPostId = filtered[0].id;
  }
  const activeIdx = filtered.findIndex((p) => p.id === STATE.selectedForumPostId);
  const activePost = filtered[activeIdx] || filtered[0];

  if (STATE.forumDisplayMode === "expanded") {
    container.innerHTML = filtered
      .map((post, idx) => renderSingleForumPostDetailHtml(post, isLoggedIn, idx, filtered.length, false))
      .join("");
    return;
  }

  const SHORT_CAT_BADGE = {
    rfq: { label: "📢 RFQ Cần Mua", cls: "badge-blue" },
    spotlight: { label: "🎁 Give-to-Get", cls: "badge-amber" },
    comarketing: { label: "🤝 Hợp tác Sự kiện", cls: "badge-purple" },
    knowledge: { label: "💡 Kinh nghiệm Số", cls: "badge-green" }
  };

  const compactRowsHtml = filtered
    .map((p) => {
      const isSelected = p.id === activePost.id;
      const info = resolveForumPostUnitInfo(p);
      const catMeta = SHORT_CAT_BADGE[p.category] || SHORT_CAT_BADGE.rfq;
      return `
        <div
          class="forum-compact-row ${isSelected ? "active" : ""}"
          onclick="selectForumPostToRead('${escapeHtml(p.id)}', true)"
        >
          <div class="forum-compact-row-main">
            <div class="forum-compact-title-line">
              ${p.pinned ? `<span class="badge badge-amber" style="padding:2px 7px;font-size:10px;">📌 Ghim</span>` : ""}
              <span class="badge ${catMeta.cls}" style="padding:2px 8px;font-size:10.5px;">${catMeta.label}</span>
              <span class="forum-compact-title">${escapeHtml(p.title)}</span>
            </div>
            <div class="forum-compact-subline">
              <span class="forum-compact-org">${info.icon} ${escapeHtml(info.cleanOrg)}</span>
              <span>• 👤 ${escapeHtml(p.author?.name)}</span>
              ${p.memberDeal ? `<span style="color:#059669;font-weight:700;">• 🎁 Có Ưu đãi Thành viên</span>` : ""}
            </div>
          </div>

          <div class="forum-compact-metrics">
            <span>🕒 ${escapeHtml(p.createdAt)}</span>
            <span>👁️ ${p.views || 1}</span>
            <span>💬 ${(p.comments || []).length}</span>
            ${
              isSelected
                ? `<span class="badge badge-blue" style="font-size:10.5px;">👁️ Đang đọc</span>`
                : `<span class="badge" style="background:#f1f5f9;color:#334155;font-size:10.5px;">Đọc tin →</span>`
            }
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = `
    <div class="forum-master-detail-wrap">
      <!-- DANH SÁCH TIÊU ĐỀ MẬT ĐỘ CAO (HIỂN THỊ NHIỀU BÀI CÙNG LÚC) -->
      <div class="forum-compact-list-box">
        <div class="forum-compact-list-head">
          <span>📋 DANH SÁCH BÀI VIẾT TRONG NHÁNH ĐANG CHỌN (${filtered.length} BÀI VIẾT)</span>
          <span style="font-weight:600;color:#0052d4;font-size:11.5px;">💡 Bấm vào bài viết bất kỳ để xem toàn bộ nội dung bên dưới</span>
        </div>
        <div class="forum-compact-scroll">
          ${compactRowsHtml}
        </div>
      </div>

      <!-- VÙNG ĐỌC NỘI DUNG CHI TIẾT CỦA TIN BÀI ĐANG CHỌN -->
      ${renderSingleForumPostDetailHtml(activePost, isLoggedIn, activeIdx, filtered.length, true)}
    </div>
  `;
}

window.renderAdminForumTable = function () {
  const tbody = document.getElementById("adminForumTableBody");
  if (!tbody) return;

  const statusFilter = document.getElementById("adminForumStatusFilter")?.value || "all";
  const kw = (document.getElementById("adminForumSearchInput")?.value || "").toLowerCase();

  const filtered = STATE.forumPosts.filter((p) => {
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "locked" ? Boolean(p.locked) : p.status === statusFilter);
    const matchKw =
      !kw ||
      p.title.toLowerCase().includes(kw) ||
      (p.author?.name || "").toLowerCase().includes(kw) ||
      (p.author?.org || "").toLowerCase().includes(kw) ||
      p.id.toLowerCase().includes(kw);
    return matchStatus && matchKw;
  });

  tbody.innerHTML = filtered
    .map((p) => {
      const stBadge =
        p.status === "pending"
          ? `<span class="badge badge-amber">⏳ Chờ thẩm định</span>`
          : p.status === "rejected"
          ? `<span class="badge badge-red">🚫 Đã từ chối</span>`
          : `<span class="badge badge-green">✅ Đã duyệt</span>`;

      const lockBadge = p.locked
        ? `<span class="badge badge-red">🔒 Đã khóa (Clocked)</span>`
        : `<span class="badge badge-blue">🔓 Mở bình luận</span>`;

      return `
        <tr>
          <td>
            <div style="font-size:11.5px;color:#0052d4;">
              <code>${escapeHtml(p.id)}</code> • ${escapeHtml(p.categoryLabel)}
              ${p.pinned ? `<span class="badge badge-amber" style="margin-left:4px;">📌 Ghim VIP</span>` : ""}
            </div>
            <strong style="font-size:13.5px;color:#0f172a;">${escapeHtml(p.title)}</strong>
            <div style="font-size:11.5px;color:#64748b;margin-top:2px;">💬 ${(p.comments || []).length} bình luận • 👍 ${p.likes || 0} quan tâm</div>
          </td>
          <td>
            <div style="font-weight:600;color:#1e293b;">${escapeHtml(p.author?.name)}</div>
            <div style="font-size:11.5px;color:#475569;">${escapeHtml(p.author?.org)}</div>
            <div style="font-size:11.5px;color:#059669;margin-top:3px;">🎁 ${escapeHtml((p.memberDeal || "").slice(0, 65))}...</div>
          </td>
          <td>${stBadge}</td>
          <td>${lockBadge}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-emerald btn-sm" onclick="moderateForumStatus('${p.id}', 'approved')" title="Duyệt hiển thị">
                ✅ Duyệt
              </button>
              <button class="btn btn-warning btn-sm" onclick="moderateForumStatus('${p.id}', 'rejected')" title="Từ chối / Ẩn bài">
                🚫 Từ chối
              </button>
              <button class="btn btn-outline btn-sm" onclick="toggleForumLock('${p.id}')" title="Khóa / Mở khóa bình luận">
                ${p.locked ? "🔓 Mở Lock" : "🔒 Clock/Lock"}
              </button>
              <button class="btn btn-outline btn-sm" onclick="toggleForumPin('${p.id}')" title="Ghim VIP đầu trang">
                ${p.pinned ? "Bỏ ghim" : "📌 Ghim"}
              </button>
              <button class="btn btn-outline btn-sm" onclick="openAdminForumModal('${p.id}')">
                👁️ Xem/Sửa
              </button>
              <button class="btn btn-danger btn-sm" onclick="deleteForumPostAdmin('${p.id}')">
                🗑️ Xoá
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

window.moderateForumStatus = async function (postId, newStatus) {
  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`Đã cập nhật trạng thái thẩm định bài viết <b>${postId}</b> sang: <b>${newStatus.toUpperCase()}</b>!`);
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (post) {
    post.status = newStatus;
    recordLocalAuditLog(
      "FORUM_MODERATE",
      `${post.id}: ${post.title}`,
      newStatus === "rejected" ? "WARNING" : "INFO",
      `Thẩm định bài viết -> ${newStatus.toUpperCase()}`
    );
    renderAllViews();
    showToast(`Đã cập nhật trạng thái thẩm định bài viết <b>${postId}</b> sang: <b>${newStatus.toUpperCase()}</b>!`);
  }
};

window.toggleForumLock = async function (postId) {
  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (!post) return;
  const nextLocked = !Boolean(post.locked);

  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: nextLocked, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(
        nextLocked
          ? `🔒 Đã KHÓA bình luận (Clocked) chủ đề <b>${postId}</b>!`
          : `🔓 Đã MỞ KHÓA bình luận chủ đề <b>${postId}</b>!`
      );
      return;
    }
  } catch (_) {}

  post.locked = nextLocked;
  recordLocalAuditLog(
    "FORUM_LOCK_TOGGLE",
    `${post.id}: ${post.title}`,
    nextLocked ? "WARNING" : "INFO",
    nextLocked ? "Khóa bình luận (Clocked) chủ đề." : "Mở khóa bình luận chủ đề."
  );
  renderAllViews();
  showToast(
    nextLocked
      ? `🔒 Đã KHÓA bình luận (Clocked) chủ đề <b>${postId}</b>!`
      : `🔓 Đã MỞ KHÓA bình luận chủ đề <b>${postId}</b>!`
  );
};

window.toggleForumPin = async function (postId) {
  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (!post) return;
  const nextPinned = !Boolean(post.pinned);

  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: nextPinned, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(nextPinned ? `📌 Đã Ghim VIP bài viết <b>${postId}</b>!` : `Đã bỏ ghim bài viết <b>${postId}</b>!`);
      return;
    }
  } catch (_) {}

  post.pinned = nextPinned;
  STATE.forumPosts.sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  recordLocalAuditLog("FORUM_PIN_TOGGLE", `${post.id}: ${post.title}`, "INFO", `Ghim VIP: ${nextPinned}`);
  renderAllViews();
  showToast(nextPinned ? `📌 Đã Ghim VIP bài viết <b>${postId}</b>!` : `Đã bỏ ghim bài viết <b>${postId}</b>!`);
};

window.openAdminForumModal = function (postId) {
  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (!post) return;
  const modal = document.getElementById("adminForumEditModal");
  if (!modal) return;
  document.getElementById("adminEditPostId").value = post.id;
  document.getElementById("adminEditPostTitle").value = post.title || "";
  document.getElementById("adminEditPostDeal").value = post.memberDeal || "";
  document.getElementById("adminEditPostContent").value = post.content || "";
  document.getElementById("adminForumModalHeader").textContent = `👁️ Xem & Chỉnh sửa Bài viết: ${post.id} (${post.author?.name})`;
  modal.style.display = "block";
};

window.closeAdminForumModal = function () {
  const modal = document.getElementById("adminForumEditModal");
  if (modal) modal.style.display = "none";
};

window.saveAdminForumEdit = async function () {
  const postId = document.getElementById("adminEditPostId")?.value;
  const title = document.getElementById("adminEditPostTitle")?.value.trim();
  const memberDeal = document.getElementById("adminEditPostDeal")?.value.trim();
  const content = document.getElementById("adminEditPostContent")?.value.trim();
  if (!postId || !title || !content) return;

  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        memberDeal,
        content,
        status: "approved",
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      closeAdminForumModal();
      renderAllViews();
      showToast(`Đã lưu chỉnh sửa và duyệt hiển thị bài viết <b>${postId}</b>!`);
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (post) {
    post.title = title;
    post.memberDeal = memberDeal;
    post.content = content;
    post.status = "approved";
    recordLocalAuditLog("FORUM_EDIT_APPROVE", `${post.id}: ${title}`, "INFO", "Chỉnh sửa nội dung và duyệt hiển thị.");
    closeAdminForumModal();
    renderAllViews();
    showToast(`Đã lưu chỉnh sửa và duyệt hiển thị bài viết <b>${postId}</b>!`);
  }
};

window.deleteForumPostAdmin = async function (postId) {
  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (!post) return;
  if (!confirm(`Bạn có chắc chắn muốn XOÁ bài viết "${post.title}" (${postId}) khỏi Diễn đàn?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`🗑️ Đã xoá bài viết <b>${postId}</b> và lưu Audit Log!`);
      return;
    }
  } catch (_) {}

  STATE.forumPosts = STATE.forumPosts.filter((p) => p.id !== postId);
  recordLocalAuditLog("FORUM_DELETE", `${post.id}: ${post.title}`, "CRITICAL", `Xoá vĩnh viễn bài viết của ${post.author?.name}.`);
  renderAllViews();
  showToast(`🗑️ Đã xoá bài viết <b>${postId}</b>!`);
};

window.submitNewForumPost = async function () {
  const category = document.getElementById("forumPostCategory")?.value || "rfq";
  const title = document.getElementById("forumPostTitle")?.value.trim() || "";
  const content = document.getElementById("forumPostContent")?.value.trim() || "";
  const memberDeal = document.getElementById("forumPostDeal")?.value.trim() || "";
  const pinned = Boolean(document.getElementById("forumPostPinned")?.checked);
  const isPending = Boolean(document.getElementById("forumPostPending")?.checked);
  const status = isPending ? "pending" : "approved";

  if (!title || !content) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết!</span>`);
    return;
  }

  if ((category === "spotlight" || category === "comarketing") && !memberDeal) {
    showToast(
      `<span style="color:#d97706">Quy tắc chống spam Give-to-Get: Vui lòng nhập Đặc quyền / Ưu đãi dành cho thành viên TechCorp!</span>`
    );
    return;
  }

  try {
    const res = await fetch("/api/v1/forum/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        content,
        memberDeal,
        pinned,
        status,
        personaKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.activityLogs = data.activityLogs || STATE.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
    } else if (data && data.error) {
      showToast(`<span style="color:#d97706">${escapeHtml(data.error)}</span>`);
      return;
    }
  } catch (_) {
    const persona = STATE.personas[STATE.currentPersona] || STATE.personas["super-admin"];
    const newId = "POST-" + Date.now();
    STATE.forumPosts.unshift({
      id: newId,
      category,
      categoryLabel: CATEGORY_MAP[category] || CATEGORY_MAP.rfq,
      status,
      locked: false,
      pinned,
      title,
      content,
      memberDeal: memberDeal || "Ưu tiên hợp tác cho các đơn vị có TechCorp ID tại Khánh Hòa.",
      author: {
        name: persona.name,
        org: persona.org,
        roleBadge: persona.roleBadge,
        verifiedApp: "Xác thực SSO TechCorp ID"
      },
      createdAt: "Vừa xong",
      likes: 1,
      views: 1,
      comments: []
    });
    recordLocalAuditLog("FORUM_CREATE", `${newId}: ${title}`, "INFO", `Tạo chủ đề thảo luận mới (${status}).`);
  }

  renderAllViews();

  const ticker = document.getElementById("tcEcoForumTicker");
  if (ticker) {
    ticker.textContent = `💬 Diễn đàn: ${title}`;
  }

  document.getElementById("forumPostTitle").value = "";
  document.getElementById("forumPostContent").value = "";
  document.getElementById("forumPostDeal").value = "";
  document.getElementById("forumPostPinned").checked = false;
  if (document.getElementById("forumPostPending")) {
    document.getElementById("forumPostPending").checked = false;
  }

  showToast(`Đã đăng bài lên Diễn đàn Cộng đồng và ghi nhận vào Audit Logs!`);
};

window.submitForumComment = async function (postId) {
  const postCheck = STATE.forumPosts.find((p) => p.id === postId);
  if (postCheck && postCheck.locked) {
    showToast(`<span style="color:#fb7185">🔒 Chủ đề này đã bị khóa bình luận (Clocked)!</span>`);
    return;
  }

  const inputEl = document.getElementById(`cmtInput_${postId}`);
  const text = inputEl?.value.trim() || "";
  if (!text) {
    showToast("Vui lòng nhập nội dung phản hồi hoặc báo giá!");
    return;
  }

  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        personaKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.activityLogs = data.activityLogs || STATE.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast("Đã gửi phản hồi xác thực TechCorp ID lên chủ đề thảo luận!");
      return;
    } else if (data && data.error) {
      showToast(`<span style="color:#fb7185">${escapeHtml(data.error)}</span>`);
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["super-admin"];
  if (post) {
    post.comments.push({
      id: "CMT-" + Date.now(),
      authorName: persona.name,
      authorOrg: persona.org,
      roleBadge: persona.roleBadge,
      text,
      time: "Vừa xong"
    });
    recordLocalAuditLog("FORUM_COMMENT", `${post.id}: ${post.title}`, "INFO", `Bình luận: "${text.slice(0, 60)}"`);
    renderAllViews();
    showToast("Đã gửi phản hồi xác thực TechCorp ID lên chủ đề thảo luận!");
  }
};

window.likeForumPost = async function (postId) {
  try {
    const res = await fetch(`/api/v1/forum/posts/${encodeURIComponent(postId)}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      renderAllViews();
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    renderAllViews();
  }
};

// ==================== 3. USER ACCOUNT MANAGEMENT CRUD (TECHCORP ID) ====================
window.renderAdminUsersTable = function () {
  const tbody = document.getElementById("adminUsersTableBody");
  const kpiUsers = document.getElementById("kpiUsersCount");
  if (kpiUsers) {
    kpiUsers.textContent = `${STATE.users.length} Tài khoản`;
  }
  if (!tbody) return;

  const kw = (document.getElementById("adminUserSearchInput")?.value || "").toLowerCase();
  const roleFilter = document.getElementById("adminUserRoleFilter")?.value || "all";

  const filtered = STATE.users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchKw =
      !kw ||
      (u.fullName || "").toLowerCase().includes(kw) ||
      (u.email || "").toLowerCase().includes(kw) ||
      (u.org || "").toLowerCase().includes(kw) ||
      (u.id || "").toLowerCase().includes(kw);
    return matchRole && matchKw;
  });

  tbody.innerHTML = filtered
    .map((u) => {
      const stBadge =
        u.status === "locked"
          ? `<span class="badge badge-red">🔴 Đã khóa</span>`
          : `<span class="badge badge-green">🟢 Active</span>`;

      const appsList = (u.assignedApps || [])
        .map((a) => `<code style="font-size:11px;color:#0052d4;margin-right:4px;">${escapeHtml(a)}</code>`)
        .join("");

      return `
        <tr>
          <td>
            <strong>${escapeHtml(u.fullName)}</strong>
            <div style="font-size:11.5px;color:#0052d4;">ID: <code>${escapeHtml(u.id)}</code></div>
            <div style="font-size:11.5px;color:#475569;">✉️ ${escapeHtml(u.email)} • 📞 ${escapeHtml(u.phone || "")}</div>
          </td>
          <td>
            <div style="font-size:12.5px;color:#0f172a;">🏢 ${escapeHtml(u.org)}</div>
            <span class="badge badge-purple" style="margin-top:4px;">${escapeHtml(u.roleBadge || u.role)}</span>
          </td>
          <td>
            <div>${appsList || "Toàn quyền"}</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">🌐 IP: ${escapeHtml(u.ipAddress || "103.170.122.138")} (${escapeHtml(u.lastLogin || "Mới")})</div>
          </td>
          <td>${stBadge}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-outline btn-sm" onclick="editEcosystemUser('${escapeHtml(u.id)}')">✏️ Sửa</button>
              <button class="btn btn-warning btn-sm" onclick="toggleUserLock('${escapeHtml(u.id)}')">
                ${u.status === "locked" ? "🔓 Mở" : "🔒 Khóa"}
              </button>
              ${
                u.id !== "USR-ADMIN-00"
                  ? `<button class="btn btn-danger btn-sm" onclick="deleteEcosystemUser('${escapeHtml(u.id)}')">🗑️ Xoá</button>`
                  : ""
              }
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

window.resetUserForm = function () {
  document.getElementById("editUserId").value = "";
  document.getElementById("userFormTitle").textContent = "➕ Tạo mới Tài khoản Người dùng (TechCorp ID)";
  document.getElementById("userFullName").value = "";
  document.getElementById("userPhone").value = "";
  document.getElementById("userEmail").value = "";
  document.getElementById("userStatus").value = "active";
  document.getElementById("userOrg").value = "";
  document.getElementById("userRole").value = "ceo_sme";
  document.querySelectorAll(".user-app-cb").forEach((cb) => {
    cb.checked = ["lms-exam", "biz-web", "biz-erp"].includes(cb.value);
  });
};

window.editEcosystemUser = function (userId) {
  const u = STATE.users.find((x) => x.id === userId);
  if (!u) return;
  document.getElementById("editUserId").value = u.id;
  document.getElementById("userFormTitle").textContent = `✏️ Chỉnh sửa Tài khoản: ${u.fullName} (${u.id})`;
  document.getElementById("userFullName").value = u.fullName || "";
  document.getElementById("userPhone").value = u.phone || "";
  document.getElementById("userEmail").value = u.email || "";
  document.getElementById("userStatus").value = u.status || "active";
  document.getElementById("userOrg").value = u.org || "";
  document.getElementById("userRole").value = u.role || "ceo_sme";
  const assigned = u.assignedApps || [];
  document.querySelectorAll(".user-app-cb").forEach((cb) => {
    cb.checked = assigned.includes(cb.value);
  });
  showToast(`Đang nạp thông tin tài khoản <b>${escapeHtml(u.fullName)}</b> để chỉnh sửa.`);
};

function syncPersonaDropdown() {
  const select = document.getElementById("personaSelect");
  if (!select) return;
  const currentVal = select.value;
  const entries = Object.entries(STATE.personas);
  select.innerHTML = entries
    .map(
      ([key, p], idx) =>
        `<option value="${escapeHtml(key)}">${idx}. ${escapeHtml(p.name)} (${escapeHtml(p.roleBadge)})</option>`
    )
    .join("");
  if (STATE.personas[currentVal]) {
    select.value = currentVal;
  }
}

window.saveEcosystemUser = async function () {
  const editId = document.getElementById("editUserId")?.value.trim();
  const fullName = document.getElementById("userFullName")?.value.trim();
  const phone = document.getElementById("userPhone")?.value.trim();
  const email = document.getElementById("userEmail")?.value.trim();
  const status = document.getElementById("userStatus")?.value || "active";
  const org = document.getElementById("userOrg")?.value.trim();
  const role = document.getElementById("userRole")?.value || "ceo_sme";

  const assignedApps = [];
  document.querySelectorAll(".user-app-cb:checked").forEach((cb) => {
    assignedApps.push(cb.value);
  });

  if (!fullName || !email || !org) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Họ tên, Email và Đơn vị/Tổ chức!</span>`);
    return;
  }

  if (editId) {
    // Update existing user
    try {
      const res = await fetch(`/api/v1/users/${encodeURIComponent(editId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          status,
          org,
          role,
          assignedApps,
          actorKey: STATE.currentPersona
        })
      });
      const data = await res.json();
      if (data && data.ok) {
        STATE.users = data.users;
        STATE.personas = data.personas || STATE.personas;
        STATE.auditLogs = data.auditLogs || STATE.auditLogs;
        syncPersonaDropdown();
        renderAllViews();
        resetUserForm();
        showToast(`Đã cập nhật tài khoản <b>${escapeHtml(fullName)}</b> và ghi Audit Log!`);
        return;
      }
    } catch (_) {}

    const u = STATE.users.find((x) => x.id === editId);
    if (u) {
      u.fullName = fullName;
      u.phone = phone;
      u.email = email;
      u.status = status;
      u.org = org;
      u.role = role;
      u.roleBadge = ROLE_BADGES[role] || "SSO Member";
      u.assignedApps = assignedApps;
      recordLocalAuditLog("USER_UPDATE", `${fullName} (${editId})`, "INFO", `Cập nhật thông tin tài khoản (${org}).`);
      renderAllViews();
      resetUserForm();
      showToast(`Đã cập nhật tài khoản <b>${escapeHtml(fullName)}</b>!`);
    }
    return;
  }

  // Create new user
  try {
    const res = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        status,
        org,
        role,
        assignedApps,
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.users = data.users;
      STATE.personas = data.personas || STATE.personas;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncPersonaDropdown();
      renderAllViews();
      resetUserForm();
      showToast(`Đã tạo tài khoản TechCorp ID cho <b>${escapeHtml(fullName)}</b>!`);
      return;
    } else if (data && data.error) {
      showToast(`<span style="color:#d97706">${escapeHtml(data.error)}</span>`);
      return;
    }
  } catch (_) {}

  const newId = "USR-NT-" + Math.floor(100 + Math.random() * 899);
  const newUser = {
    id: newId,
    personaKey: newId.toLowerCase(),
    fullName,
    phone: phone || "0905.000.000",
    email,
    org,
    role,
    roleBadge: ROLE_BADGES[role] || "SSO Member",
    assignedApps: assignedApps.length ? assignedApps : ["biz-erp"],
    status,
    lastLogin: "Chưa đăng nhập",
    ipAddress: "103.170.122.138"
  };
  STATE.users.unshift(newUser);
  STATE.personas[newUser.personaKey] = {
    id: newUser.personaKey,
    userId: newId,
    name: fullName,
    org,
    roleBadge: newUser.roleBadge
  };
  syncPersonaDropdown();
  recordLocalAuditLog("USER_CREATE", `${fullName} (${newId})`, "INFO", `Tạo mới tài khoản thuộc đơn vị "${org}".`);
  renderAllViews();
  resetUserForm();
  showToast(`Đã tạo tài khoản TechCorp ID cho <b>${escapeHtml(fullName)}</b>!`);
};

window.toggleUserLock = async function (userId) {
  const u = STATE.users.find((x) => x.id === userId);
  if (!u) return;
  if (userId === "USR-ADMIN-00") {
    showToast(`<span style="color:#d97706">Không thể khóa tài khoản Super Admin gốc!</span>`);
    return;
  }
  const nextStatus = u.status === "locked" ? "active" : "locked";

  try {
    const res = await fetch(`/api/v1/users/${encodeURIComponent(userId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.users = data.users;
      STATE.personas = data.personas || STATE.personas;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncPersonaDropdown();
      renderAllViews();
      showToast(
        nextStatus === "locked"
          ? `🔒 Đã KHÓA tài khoản <b>${escapeHtml(u.fullName)}</b>!`
          : `🔓 Đã MỞ KHÓA tài khoản <b>${escapeHtml(u.fullName)}</b>!`
      );
      return;
    }
  } catch (_) {}

  u.status = nextStatus;
  recordLocalAuditLog(
    nextStatus === "locked" ? "USER_LOCK" : "USER_UNLOCK",
    `${u.fullName} (${u.id})`,
    nextStatus === "locked" ? "WARNING" : "INFO",
    `Chuyển trạng thái tài khoản sang: ${nextStatus}`
  );
  renderAllViews();
  showToast(
    nextStatus === "locked"
      ? `🔒 Đã KHÓA tài khoản <b>${escapeHtml(u.fullName)}</b>!`
      : `🔓 Đã MỞ KHÓA tài khoản <b>${escapeHtml(u.fullName)}</b>!`
  );
};

window.deleteEcosystemUser = async function (userId) {
  const u = STATE.users.find((x) => x.id === userId);
  if (!u) return;
  if (!confirm(`Bạn có chắc chắn muốn XOÁ tài khoản "${u.fullName}" (${userId}) khỏi hệ thống?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/v1/users/${encodeURIComponent(userId)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.users = data.users;
      STATE.personas = data.personas || STATE.personas;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncPersonaDropdown();
      renderAllViews();
      showToast(`🗑️ Đã xoá tài khoản <b>${escapeHtml(u.fullName)}</b> và lưu Audit Log!`);
      return;
    }
  } catch (_) {}

  STATE.users = STATE.users.filter((x) => x.id !== userId);
  recordLocalAuditLog("USER_DELETE", `${u.fullName} (${u.id})`, "CRITICAL", `Xoá vĩnh viễn tài khoản khỏi hệ thống.`);
  renderAllViews();
  showToast(`🗑️ Đã xoá tài khoản <b>${escapeHtml(u.fullName)}</b>!`);
};

// ==================== 4. USER TRACEABILITY & AUDIT LOGS ====================
window.renderAuditLogsTable = function () {
  const tbody = document.getElementById("auditLogsTableBody");
  const badgeEl = document.getElementById("kpiAuditCountBadge");
  if (badgeEl) {
    badgeEl.textContent = `${STATE.auditLogs.length} Bản ghi truy vết`;
  }
  if (!tbody) return;

  const kw = (document.getElementById("auditSearchInput")?.value || "").toLowerCase();
  const sevFilter = document.getElementById("auditSeverityFilter")?.value || "all";

  const filtered = STATE.auditLogs.filter((log) => {
    const matchSev = sevFilter === "all" || log.severity === sevFilter;
    const matchKw =
      !kw ||
      (log.actorName || "").toLowerCase().includes(kw) ||
      (log.actorOrg || "").toLowerCase().includes(kw) ||
      (log.ipAddress || "").toLowerCase().includes(kw) ||
      (log.action || "").toLowerCase().includes(kw) ||
      (log.target || "").toLowerCase().includes(kw) ||
      (log.details || "").toLowerCase().includes(kw);
    return matchSev && matchKw;
  });

  tbody.innerHTML = filtered
    .map((log) => {
      const sevBadge =
        log.severity === "CRITICAL"
          ? `<span class="badge badge-red">🔴 CRITICAL</span>`
          : log.severity === "WARNING"
          ? `<span class="badge badge-amber">🟡 WARNING</span>`
          : `<span class="badge badge-green">🟢 INFO</span>`;

      return `
        <tr>
          <td>
            <code style="font-size:11.5px;color:#0052d4;">${escapeHtml(log.id)}</code>
            <div style="font-size:11.5px;color:#475569;margin-top:2px;">🕒 ${escapeHtml(log.timestamp)}</div>
          </td>
          <td>
            <strong style="font-size:13px;color:#0f172a;">${escapeHtml(log.actorName)}</strong>
            <div style="font-size:11.5px;color:#475569;">${escapeHtml(log.actorOrg)} (${escapeHtml(log.actorId)})</div>
          </td>
          <td>
            <code style="font-size:12px;color:#d97706;">${escapeHtml(log.ipAddress)}</code>
          </td>
          <td>
            <div><code style="font-weight:700;color:#0052d4;">${escapeHtml(log.action)}</code></div>
            <div style="margin-top:4px;">${sevBadge}</div>
          </td>
          <td style="font-weight:600;color:#1e293b;">${escapeHtml(log.target)}</td>
          <td style="font-size:12.5px;color:#334155;max-width:340px;">${escapeHtml(log.details)}</td>
        </tr>
      `;
    })
    .join("");
};

window.exportAuditLogsCsv = function () {
  const headers = ["ID", "Timestamp", "ActorID", "ActorName", "Organization", "IPAddress", "Action", "Severity", "Target", "Details"];
  const rows = STATE.auditLogs.map((l) => [
    l.id,
    l.timestamp,
    l.actorId,
    `"${(l.actorName || "").replace(/"/g, '""')}"`,
    `"${(l.actorOrg || "").replace(/"/g, '""')}"`,
    l.ipAddress,
    l.action,
    l.severity,
    `"${(l.target || "").replace(/"/g, '""')}"`,
    `"${(l.details || "").replace(/"/g, '""')}"`
  ]);
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TechCorp_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("📥 Đã xuất file báo cáo Truy vết Người dùng (Audit Logs CSV) thành công!");
};

// ==================== 5. ACTIVITY FEED, TALENTS, CONTESTS, B2B, LIGHTHOUSE ====================
function renderActivityFeed() {
  const feedEl = document.getElementById("liveFeedList");
  if (!feedEl) return;
  feedEl.innerHTML = STATE.activityLogs
    .map(
      (item) => `
      <div class="feed-item">
        <span class="time">${escapeHtml(item.time)} ${item.eventType ? `• <code style="color:#0052d4">${escapeHtml(item.eventType)}</code>` : ""}</span>
        <div>${escapeHtml(item.text)}</div>
      </div>
    `
    )
    .join("");
}

function renderTalents() {
  const domainFilter = document.getElementById("talentDomainFilter")?.value || "all";
  const keyword = (document.getElementById("talentSearchInput")?.value || "").toLowerCase();
  const listEl = document.getElementById("talentGrid");
  if (!listEl) return;

  const filtered = STATE.talents.filter((t) => {
    const matchDomain = domainFilter === "all" || t.domain === domainFilter;
    const matchKw =
      !keyword ||
      t.name.toLowerCase().includes(keyword) ||
      t.school.toLowerCase().includes(keyword) ||
      t.certs.join(" ").toLowerCase().includes(keyword) ||
      t.targetRole.toLowerCase().includes(keyword);
    return matchDomain && matchKw;
  });

  listEl.innerHTML = filtered
    .map(
      (t) => `
      <div class="item-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <h4>${escapeHtml(t.name)} <span style="font-size:12px;color:#0052d4;">(${escapeHtml(t.id)})</span></h4>
            <span class="badge badge-green">Đã xác thực Thi Online</span>
          </div>
          <p style="font-size:12.5px;color:#475569;margin-top:4px;">🎓 <strong>Trường:</strong> ${escapeHtml(t.school)}</p>
          <p style="font-size:12.5px;color:#475569;">🏫 <strong>Đào tạo thêm:</strong> ${escapeHtml(t.center)}</p>
          <p style="font-size:13px;color:#0f172a;margin-top:6px;">🎯 <strong>Vị trí mong muốn:</strong> ${escapeHtml(t.targetRole)} (GPA: ${escapeHtml(t.gpa)})</p>
          <div class="skill-tags">
            ${t.certs.map((c) => `<span class="badge badge-blue">${escapeHtml(c)}</span>`).join("")}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
          <span style="font-size:12px;color:#059669;">● ${escapeHtml(t.status)} ${t.syncedToErpCount ? `(Đã đồng bộ ${t.syncedToErpCount} DN)` : ""}</span>
          <a href="https://jobai.techcorp.info.vn/careers.html" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="text-decoration:none;">
            🤖 Xem Hồ sơ trên JobAI ↗
          </a>
        </div>
      </div>
    `
    )
    .join("");
}

window.importCandidateToERP = async function (id, name) {
  try {
    const res = await fetch(`/api/v1/talents/${encodeURIComponent(id)}/push-erp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.ok) {
      STATE.activityLogs = data.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      const idx = STATE.talents.findIndex((t) => t.id === id);
      if (idx !== -1 && data.talent) STATE.talents[idx] = data.talent;
      renderAllViews();
      showToast(`Đã gọi API đẩy hồ sơ của <b>${name}</b> vào phân hệ HRM trên ERP & ghi Audit Log!`);
      return;
    }
  } catch (_) {}

  STATE.activityLogs.unshift({
    time: "Vừa xong",
    eventType: "HRM_CANDIDATE_IMPORTED",
    text: `[1-Click HRM Sync] Hồ sơ năng lực số của ${name} (${id}) đã được đồng bộ thẳng vào Phân hệ Tuyển dụng HRM trên ERP Doanh nghiệp.`
  });
  recordLocalAuditLog("HRM_CANDIDATE_IMPORT", `${name} (${id})`, "INFO", "Đồng bộ Hồ sơ Năng lực Số vào phân hệ HRM.");
  renderAllViews();
  showToast(`Đã đẩy hồ sơ xác thực của <b>${name}</b> vào phân hệ HRM trên ERP!`);
};

window.simulateCrossSync = async function (presetType) {
  try {
    const res = await fetch("/api/v1/events/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presetType, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data.ok) {
      STATE.activityLogs = data.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast("Đã thực thi API đồng bộ dữ liệu liên thông và lưu vào Audit Logs!");
      return;
    }
  } catch (_) {}

  let logText = "";
  if (presetType === "erp-job") {
    logText =
      '[ERP -> Cổng Trường & Trung tâm] Tin tuyển dụng "Chuyên viên Kinh doanh & Điều hành Tour tiếng Anh" vừa được phát tự động tới 2 Trường ĐH và 10 Trung tâm NN-TH tại Nha Trang.';
  } else if (presetType === "exam-cert") {
    logText =
      "[Thi Online -> Hồ sơ Năng lực Số] 45 thí sinh tại Nha Trang vừa hoàn thành bài thi thử TOEIC/Tin học, hệ thống đã tự động cấp QR Chứng chỉ số và gợi ý khóa học cho Trung tâm.";
  } else {
    logText =
      "[Doanh nghiệp SME -> Sổ liên lạc Phụ huynh] Chiến dịch E-Voucher ưu đãi 20% dịch vụ Gia đình & Khóa học Hè đã gửi tới 3.500 Phụ huynh Mầm non - Phổ thông tại Nha Trang.";
  }
  STATE.activityLogs.unshift({
    time: "Vừa xong",
    eventType: "LIVE_SYNC",
    text: logText
  });
  recordLocalAuditLog("CROSS_PLATFORM_SYNC", presetType, "INFO", logText);
  renderAllViews();
  showToast("Đã kích hoạt đồng bộ dữ liệu liên thông thành công!");
};

function renderContests() {
  const el = document.getElementById("contestList");
  if (!el) return;
  el.innerHTML = STATE.contests
    .map(
      (c) => `
      <div class="item-card">
        <div>
          <span class="badge badge-purple" style="margin-bottom:8px;">Phễu Thu hút Học viên & Sinh viên</span>
          <h4>${escapeHtml(c.title)}</h4>
          <p style="font-size:12.5px;color:#475569;margin-top:6px;">🤝 <strong>Đơn vị đồng hành:</strong> ${escapeHtml(c.organizer)}</p>
          <p style="font-size:12.5px;color:#475569;margin-top:4px;">👥 <strong>Đối tượng:</strong> ${escapeHtml(c.targetGroup)}</p>
          <p style="font-size:12.5px;color:#059669;margin-top:4px;">🎁 <strong>Quyền lợi:</strong> ${escapeHtml(c.reward)}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
          <div>
            <span style="font-size:13px;font-weight:700;color:#0052d4;">${c.participants.toLocaleString()} thí sinh</span>
            <span style="font-size:12px;color:#d97706;margin-left:8px;">(${c.leadsGenerated} Học viên quan tâm)</span>
          </div>
          <a href="https://lms.techcorp.info.vn" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="text-decoration:none;">
            📝 Tham gia Thi trên LMS ↗
          </a>
        </div>
      </div>
    `
    )
    .join("");
}

window.pushLeadsToCenter = async function (contestId, title) {
  try {
    const res = await fetch(`/api/v1/contests/${encodeURIComponent(contestId)}/sync-leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.ok) {
      STATE.contests = data.contests;
      STATE.activityLogs = data.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`Đã gọi API đồng bộ <b>${data.contest.leadsGenerated} data học viên</b> vào CRM Trung tâm!`);
      return;
    }
  } catch (_) {}
  recordLocalAuditLog("LMS_LEAD_SYNC", title, "INFO", "Phân bổ data thí sinh về CRM Trung tâm.");
  showToast(`Đã phân bổ data học viên từ "${title}" vào CRM Trung tâm!`);
};

function renderB2B() {
  const el = document.getElementById("b2bGrid");
  if (!el) return;
  el.innerHTML = STATE.b2bOffers
    .map(
      (b) => `
      <div class="item-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span class="badge badge-amber">${escapeHtml(b.category)}</span>
            <span style="font-size:11.5px;color:#475569;">${escapeHtml(b.usingTech)}</span>
          </div>
          <h4>${escapeHtml(b.company)}</h4>
          <p style="font-size:13px;color:#0f172a;margin-top:8px;">${escapeHtml(b.offer)}</p>
          <p style="font-size:12px;color:#0052d4;margin-top:8px;">🎯 Áp dụng cho: ${escapeHtml(b.target)}</p>
        </div>
        <div style="display:flex;justify-content:flex-end;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
          <button class="btn btn-emerald" onclick="connectB2B('${b.company}')">
            Kết nối Giao thương / Nhận ưu đãi
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

window.connectB2B = async function (company) {
  try {
    const res = await fetch("/api/v1/b2b/connect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data.ok) {
      STATE.activityLogs = data.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`Đã lưu yêu cầu kết nối B2B tới <b>${company}</b> và ghi Audit Log!`);
      return;
    }
  } catch (_) {}
  recordLocalAuditLog("B2B_CONNECT", company, "INFO", `Gửi yêu cầu kết nối giao thương tới ${company}.`);
  showToast(`Đã gửi yêu cầu kết nối B2B trực tiếp tới <b>${company}</b>!`);
};

function renderLighthouseTable() {
  const tbody = document.getElementById("lighthouseTableBody");
  if (!tbody) return;
  tbody.innerHTML = STATE.lighthouseTargets
    .map((item, idx) => {
      const pct = Math.min(100, Math.round((item.currentSigned / item.targetCount) * 100));
      return `
        <tr>
          <td><strong>${escapeHtml(item.segment)}</strong><div style="font-size:12px;color:#475569;">📍 ${escapeHtml(item.focusArea)}</div></td>
          <td><span class="badge badge-blue">${escapeHtml(item.comboPackage)}</span></td>
          <td>
            <div style="font-weight:700;">${item.currentSigned} / ${item.targetCount} đơn vị (${pct}%)</div>
            <div style="font-size:11.5px;color:#d97706;">Đang đàm phán: ${item.inPipeline} đơn vị</div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          </td>
          <td style="font-size:12.5px;color:#334155;">${escapeHtml(item.notes)}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="incrementSigned(${idx})">+1 Chốt mới</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

window.incrementSigned = async function (idx) {
  try {
    const res = await fetch(`/api/v1/lighthouse/${idx}/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (data.ok) {
      STATE.lighthouseTargets = data.lighthouseTargets;
      STATE.activityLogs = data.activityLogs;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast(`Đã lưu tiến độ chốt khách hàng hạt nhân Nha Trang vào Database!`);
      return;
    }
  } catch (_) {}

  const item = STATE.lighthouseTargets[idx];
  if (item) {
    item.currentSigned += 1;
    if (item.inPipeline > 0) item.inPipeline -= 1;
    recordLocalAuditLog("CRM_LIGHTHOUSE_CLOSE", item.segment, "INFO", `Tăng số lượng chốt lên ${item.currentSigned}/${item.targetCount}.`);
    renderAllViews();
    showToast(`Đã cập nhật tiến độ chốt khách hàng hạt nhân Nha Trang!`);
  }
};

function updateTotalKPIs() {
  const totalSigned = STATE.lighthouseTargets.reduce((acc, x) => acc + x.currentSigned, 0);
  const totalTarget = STATE.lighthouseTargets.reduce((acc, x) => acc + x.targetCount, 0);
  const el = document.getElementById("kpiLighthouseCount");
  if (el && totalTarget > 0) {
    el.textContent = `${totalSigned} / ${totalTarget}`;
  }
}

window.calculateComboPrice = function () {
  const type = document.getElementById("calcCustomerType")?.value || "sme";
  const scale = parseInt(document.getElementById("calcScaleInput")?.value || "25", 10);
  const period = document.getElementById("calcPeriod")?.value || "12";
  const resultBox = document.getElementById("calcResultBox");
  if (!resultBox) return;

  let monthlyFee = 0;
  let bonusGift = "";
  let ecoBenefit = "";

  if (type === "kindergarten") {
    monthlyFee = Math.max(2500000, scale * 15000);
    bonusGift = "Miễn phí 100% phí khởi tạo + Cổng gạch nợ học phí QR tự động";
    ecoBenefit = "Tặng gói Test Năng lực Tiếng Anh thiếu nhi & E-Voucher gia đình cho toàn bộ Phụ huynh";
  } else if (type === "center") {
    monthlyFee = scale <= 200 ? 1800000 : 2800000;
    bonusGift = period === "12" ? "Tặng miễn phí Website Tuyển sinh Chuẩn SEO (Trị giá 8.000.000đ)" : "Giảm 50% chi phí thiết kế Website Trung tâm";
    ecoBenefit = "Được đồng tổ chức Kỳ thi Thử IELTS/TOEIC/Tin học toàn tỉnh Khánh Hòa để nhận Lead học viên";
  } else {
    monthlyFee = scale <= 30 ? 2200000 : 3500000;
    bonusGift = period === "12" ? "Tặng 100% Website Doanh nghiệp Đa ngôn ngữ (Trị giá 10.000.000đ)" : "Tặng gói chuẩn hóa CRM & HRM ban đầu";
    ecoBenefit = "Truy cập kho CV Thực tập sinh & Nhân sự đã xác thực Ngoại ngữ/Tin học tại Nha Trang + Phát Voucher tới >10.000 Phụ huynh/SV";
  }

  const months = parseInt(period, 10);
  const total = monthlyFee * months;

  resultBox.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(148,163,184,0.16);padding-bottom:10px;margin-bottom:10px;">
      <span style="color:#475569;font-size:13px;">Chi phí thuê bao Combo hàng tháng:</span>
      <strong style="font-size:20px;color:#0052d4;">${monthlyFee.toLocaleString("vi-VN")} VNĐ / tháng</strong>
    </div>
    <p style="font-size:13px;margin-bottom:6px;">💳 <strong>Tổng thanh toán (${months} tháng):</strong> <span style="color:#059669;font-weight:700;">${total.toLocaleString("vi-VN")} VNĐ</span></p>
    <p style="font-size:13px;margin-bottom:6px;">🎁 <strong>Ưu đãi Giai đoạn 1 tại Nha Trang:</strong> ${bonusGift}</p>
    <p style="font-size:13px;color:#d97706;">🚀 <strong>Đặc quyền Hệ sinh thái đi kèm:</strong> ${ecoBenefit}</p>
  `;
};

const RBAC_PERMISSION_LABELS = [
  { key: "viewPlaza", label: "1. Xem Cổng Chung & Bảng tin Hệ sinh thái", desc: "Truy cập màn hình chính, đọc thông báo điều hành & sơ đồ liên thông" },
  { key: "postMemberNews", label: "2. Đăng Tin Tiêu điểm Đơn vị Thành viên", desc: "Đăng thông báo tuyển sinh, tuyển dụng, sự kiện của đơn vị lên Cổng Chung" },
  { key: "manageOwnOrg", label: "3. Quản trị Không gian Riêng của Đơn vị (Workspace)", desc: "Mở bảng điều khiển riêng dành cho Chủ DN / GĐ Trung tâm / Hiệu trưởng / SV" },
  { key: "postForumB2B", label: "4. Đăng bài Diễn đàn & Chợ Giao thương B2B", desc: "Tạo chủ đề RFQ tìm đối tác, đăng ưu đãi Give-to-Get và phản hồi báo giá" },
  { key: "accessTalentPool", label: "5. Truy cập Sàn Nhân lực & Đẩy CV vào ERP HRM", desc: "Xem hồ sơ năng lực số của sinh viên và đồng bộ 1-Click về phần mềm nhân sự" },
  { key: "manageLmsContests", label: "6. Tổ chức Đấu trường Thi Online & Nhận Lead CRM", desc: "Tạo kỳ thi thử IELTS/TOEIC/Tin học và nhận danh sách học viên tiềm năng" },
  { key: "publishMasterBulletin", label: "7. Phát Thông báo Điều hành Toàn Hệ sinh thái", desc: "Quyền của Hệ sinh thái TechCorp ghim thông báo chính sách lên đầu Cổng Chung" },
  { key: "manageAppsUsersRbac", label: "8. Quản trị Ứng dụng, Thành viên & Cấu hình RBAC", desc: "Thêm/xoá ứng dụng vệ tinh, cấp API Key, tạo/khóa tài khoản & sửa phân quyền" },
  { key: "moderateForumAudit", label: "9. Thẩm định/Khóa Diễn đàn & Xem Truy vết Audit Logs", desc: "Duyệt/từ chối bài viết, khóa bình luận (Clock) và xuất báo cáo kiểm toán IP" }
];

function renderRoleContextAndSidebar() {
  const roleCode = getCurrentRoleCode();
  const roleConfig = STATE.rbacMatrix[roleCode] || STATE.rbacMatrix.super_admin;
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["super-admin"];
  const userObj = getCurrentUserObject();
  const perms = (roleConfig && roleConfig.permissions) || {};
  const assignedApps = (userObj && userObj.assignedApps) || [];

  // 1. Update Clean White Enterprise Header in admin.html to match strictly the logged-in role
  const portalTitles = {
    super_admin: {
      title: "Cổng Quản trị Tối cao Hệ sinh thái",
      pill: "👑 Super Admin (Toàn quyền)",
      avatar: "👑"
    },
    ceo_sme: {
      title: "Workspace Quản trị Doanh nghiệp SME",
      pill: "🏢 Chủ Doanh nghiệp Thành viên",
      avatar: "🏢"
    },
    center_director: {
      title: "Workspace Quản trị Trung tâm Đào tạo",
      pill: "🏫 Giám đốc Trung tâm NN-TH",
      avatar: "🏫"
    },
    school_principal: {
      title: "Workspace Quản trị Trường học & ĐH",
      pill: "🎓 Hiệu trưởng / Ban Giám hiệu",
      avatar: "🎓"
    },
    student_parent: {
      title: "Cổng Công dân Số TechCorp ID",
      pill: "👨‍🎓 Học viên / Sinh viên / Phụ huynh",
      avatar: "👨‍🎓"
    }
  };
  const headerMeta = portalTitles[roleCode] || portalTitles.super_admin;

  const titleEl = document.getElementById("adminPortalTitle");
  const pillEl = document.getElementById("adminPortalRolePill");
  const descEl = document.getElementById("currentPersonaDesc");
  const avatarEl = document.getElementById("adminHeaderAvatar");
  const nameEl = document.getElementById("adminHeaderName");
  const orgEl = document.getElementById("adminHeaderOrg");

  if (titleEl) titleEl.textContent = headerMeta.title;
  if (pillEl) pillEl.textContent = headerMeta.pill;
  if (descEl) descEl.textContent = `${persona.org} • Tài khoản: ${(userObj && userObj.email) || "admin@techcorp.info.vn"}`;
  if (avatarEl) avatarEl.textContent = headerMeta.avatar;
  if (nameEl) nameEl.textContent = persona.name;
  if (orgEl) orgEl.textContent = persona.org;

  // 2. Dynamically Render Role-Specific Left Sidebar (#dynamicRoleSidebarNav in admin.html)
  const sidebarNavEl = document.getElementById("dynamicRoleSidebarNav");
  if (sidebarNavEl) {
    const pendingForumCount = STATE.forumPosts.filter((p) => p.status === "pending").length;
    const totalBulletinsCount = (STATE.announcements || []).length;

    if (roleCode === "super_admin") {
      const demoLeadsCount = (STATE.demoRequests || []).length;
      sidebarNavEl.innerHTML = `
        <div class="sidebar-section-label">👑 QUẢN TRỊ TỐI CAO (SUPER ADMIN)</div>
        <button class="nav-btn" data-panel="panel-master-overview" onclick="activateAdminPanel('panel-master-overview')">
          <span>📊 1. Tổng quan & Event Bus</span>
          <span class="nav-badge">${STATE.apps.length} App</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-apps" onclick="activateAdminPanel('panel-master-apps')">
          <span>🚀 2. Quản trị 16 Sản phẩm & App</span>
          <span class="nav-badge">API Key</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-demos" onclick="activateAdminPanel('panel-master-demos')">
          <span>📋 3. Khách hàng Đăng ký Demo</span>
          <span class="nav-badge" style="background:#059669;color:#fff;">${demoLeadsCount} Lead</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-bulletins" onclick="activateAdminPanel('panel-master-bulletins')">
          <span>🖼️ 4. Quản trị 6 Slider & Bản tin</span>
          <span class="nav-badge">6 Slide</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-forum" onclick="activateAdminPanel('panel-master-forum')">
          <span>🛡️ 5. Kiểm duyệt Diễn đàn</span>
          <span class="nav-badge">${pendingForumCount} Chờ</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-users" onclick="activateAdminPanel('panel-master-users')">
          <span>👥 6. Quản lý Thành viên & SSO</span>
          <span class="nav-badge">${STATE.users.length} User</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-rbac" onclick="activateAdminPanel('panel-master-rbac')">
          <span>🔐 7. Cấu hình Phân quyền RBAC</span>
          <span class="nav-badge">9 Quyền</span>
        </button>
        <button class="nav-btn" data-panel="panel-master-audit" onclick="activateAdminPanel('panel-master-audit')">
          <span>🔍 8. Audit Logs & 57 Hạt nhân</span>
          <span class="nav-badge">An ninh</span>
        </button>
        <div class="sidebar-section-label" style="margin-top:10px;">🏢 GIÁM SÁT WORKSPACE ĐƠN VỊ</div>
        <button class="nav-btn" data-panel="panel-role-workspace" onclick="activateAdminPanel('panel-role-workspace', 'overview')">
          <span>🏢 9. Giám sát Workspace 4 Khối</span>
          <span class="nav-badge">4 Vai trò</span>
        </button>
      `;
    } else {
      // Non-superadmin roles ONLY see functions strictly belonging to their role
      const roleMenus = {
        ceo_sme: {
          sectionTitle: "🏢 CHỨC NĂNG CHỦ DOANH NGHIỆP",
          items: [
            { label: "🏢 1. Tổng quan Doanh nghiệp", subtab: "overview", badge: "Dashboard" },
            { label: "🚀 2. Phần mềm Đã cấp phép", subtab: "apps", badge: `${assignedApps.length} Hệ thống` },
            { label: "👨‍💼 3. Tuyển dụng Liên thông & CV", subtab: "recruitment", badge: `${STATE.talents.length} CV` },
            { label: "🎁 4. Chiến dịch E-Voucher & B2B", subtab: "b2b", badge: "Give-to-Get" }
          ]
        },
        center_director: {
          sectionTitle: "🏫 CHỨC NĂNG GIÁM ĐỐC TRUNG TÂM",
          items: [
            { label: "🏫 1. Tổng quan Trung tâm", subtab: "overview", badge: "Dashboard" },
            { label: "🚀 2. Phần mềm Đã cấp phép", subtab: "apps", badge: `${assignedApps.length} Hệ thống` },
            { label: "🏆 3. Đấu trường Thi Online & Lead", subtab: "contests", badge: "385 Lead" },
            { label: "🤝 4. Hợp đồng Đào tạo DN (RFQ)", subtab: "b2b", badge: "04 HĐ" }
          ]
        },
        school_principal: {
          sectionTitle: "🎓 CHỨC NĂNG HIỆU TRƯỞNG TRƯỜNG",
          items: [
            { label: "🎓 1. Tổng quan Học vụ & QR", subtab: "overview", badge: "96.4% QR" },
            { label: "🚀 2. Phần mềm Đã cấp phép", subtab: "apps", badge: `${assignedApps.length} Hệ thống` },
            { label: "🎁 3. Duyệt Học bổng & Phúc lợi PH", subtab: "scholarships", badge: "500 Suất" },
            { label: "🍱 4. Nhà cung ứng Học đường B2B", subtab: "b2b", badge: "06 ĐV" }
          ]
        },
        student_parent: {
          sectionTitle: "👨‍🎓 CHỨC NĂNG HỌC VIÊN / PHỤ HUYNH",
          items: [
            { label: "🏅 1. Hồ sơ Năng lực Số (Passport)", subtab: "overview", badge: "Verified" },
            { label: "🚀 2. Nền tảng Học & Thi Trực tuyến", subtab: "apps", badge: `${assignedApps.length} Hệ thống` },
            { label: "💼 3. Ứng tuyển Thực tập 1-Click", subtab: "jobs", badge: "30 DN" },
            { label: "🎁 4. Ví Học bổng & E-Voucher", subtab: "vouchers", badge: "05 Ưu đãi" }
          ]
        }
      };

      const cfg = roleMenus[roleCode] || roleMenus.ceo_sme;
      const roleMenuButtons = cfg.items
        .map(
          (item) => `
          <button class="nav-btn" data-panel="panel-role-workspace" data-subtab="${item.subtab}" onclick="activateAdminPanel('panel-role-workspace', '${item.subtab}')">
            <span>${item.label}</span>
            <span class="nav-badge">${item.badge}</span>
          </button>
        `
        )
        .join("");

      const postNewsBtn = perms.postMemberNews
        ? `
          <button class="nav-btn" data-panel="panel-role-workspace" data-subtab="news" onclick="activateAdminPanel('panel-role-workspace', 'news')">
            <span>📢 5. Đăng Tin Đơn vị lên Public</span>
            <span class="nav-badge">✔ Mở</span>
          </button>
        `
        : "";

      sidebarNavEl.innerHTML = `
        <div class="sidebar-section-label">${cfg.sectionTitle}</div>
        ${roleMenuButtons}
        ${postNewsBtn}
        <div class="sidebar-section-label" style="margin-top:10px;">🔗 ĐIỀU HƯỚNG PHIÊN LÀM VIỆC</div>
        <a href="index.html" class="nav-btn" style="text-decoration:none;">
          <span>🌍 Xem Trang Public Hệ sinh thái</span>
          <span class="nav-badge">↗</span>
        </a>
        <button type="button" onclick="logoutSsoSession()" class="nav-btn" style="width:100%;text-align:left;color:#dc2626;">
          <span>🚪 Đăng xuất khỏi Hệ thống</span>
          <span class="nav-badge" style="background:#fee2e2;color:#b91c1c;">Thoát</span>
        </button>
      `;
    }

    // Highlight currently active button
    document.querySelectorAll("#dynamicRoleSidebarNav .nav-btn").forEach((btn) => {
      const matchPanel = btn.getAttribute("data-panel") === window.activeAdminPanelId;
      const btnSub = btn.getAttribute("data-subtab") || "";
      const matchSub = !btnSub || btnSub === window.activeMemberSubTab;
      btn.classList.toggle("active", matchPanel && matchSub);
    });
  }

  // 3. Dynamically Render Role-Specific Top 4 KPI Cards (#dynamicRoleKpiGrid in admin.html)
  const kpiGridEl = document.getElementById("dynamicRoleKpiGrid");
  if (kpiGridEl) {
    const totalSigned = STATE.lighthouseTargets.reduce((acc, x) => acc + x.currentSigned, 0);
    const totalTarget = STATE.lighthouseTargets.reduce((acc, x) => acc + x.targetCount, 0);
    const totalBulletinsAndPosts = (STATE.announcements || []).length + STATE.forumPosts.length;

    const kpiByRole = {
      super_admin: [
        {
          label: "SẢN PHẨM TRONG HỆ SINH THÁI",
          badge: "TechCorp Cloud",
          badgeClass: "badge-blue",
          value: `${STATE.apps.length} Ứng dụng`,
          sub: "● 100% Kết nối SSO & Webhook"
        },
        {
          label: "BẢN TIN & CHỦ ĐỀ PUBLIC",
          badge: "Cổng Public",
          badgeClass: "badge-green",
          value: `${totalBulletinsAndPosts} Bản tin`,
          sub: "● Tin điều hành & Giao thương thành viên"
        },
        {
          label: "ĐỊNH DANH SSO TECHCORP ID",
          badge: "Multi-Tenant",
          badgeClass: "badge-purple",
          value: `${STATE.users.length} Tài khoản`,
          sub: "● Phân quyền 5 nhóm vai trò RBAC"
        },
        {
          label: "MỤC TIÊU HẠT NHÂN NHA TRANG",
          badge: "Phase 1",
          badgeClass: "badge-amber",
          value: `${totalSigned} / ${totalTarget}`,
          sub: "● 2 ĐH/CĐ + 10 TT + 15 Trường + 30 DN"
        }
      ],
      ceo_sme: [
        {
          label: "HỆ THỐNG ĐƯỢC CẤP PHÉP",
          badge: "SME Active",
          badgeClass: "badge-green",
          value: `${assignedApps.length} Nền tảng`,
          sub: "● ERP, BSC-KPI, PMS Khách sạn, BĐS, Nội thất"
        },
        {
          label: "HỒ SƠ ỨNG VIÊN ĐÃ NHẬN",
          badge: "Từ ĐH & TT",
          badgeClass: "badge-blue",
          value: "14 Ứng viên",
          sub: "● Đồng bộ 1-Click từ LMS về HRM"
        },
        {
          label: "CHIẾN DỊCH E-VOUCHER B2B",
          badge: "Give-to-Get",
          badgeClass: "badge-amber",
          value: "420 Lượt nhận",
          sub: "● Từ Phụ huynh 15 Trường liên kết"
        },
        {
          label: "ĐỐI TÁC ĐÀO TẠO NỘI BỘ",
          badge: "MOU Liên kết",
          badgeClass: "badge-purple",
          value: "03 Đơn vị",
          sub: "● Ocean English, ĐH Nha Trang, CĐ Du lịch"
        }
      ],
      center_director: [
        {
          label: "THÍ SINH DỰ THI TRÊN LMS",
          badge: "IELTS/TOEIC/MOS",
          badgeClass: "badge-blue",
          value: "1.420 Thí sinh",
          sub: "● Từ 15 Trường học liên kết tại Nha Trang"
        },
        {
          label: "LEAD HỌC VIÊN MỚI VỀ CRM",
          badge: "Tự động phân bổ",
          badgeClass: "badge-green",
          value: "385 Học viên",
          sub: "● Tỷ lệ chuyển đổi nhập học đạt 28.5%"
        },
        {
          label: "HỌC VIÊN ĐƯỢC DN TUYỂN DỤNG",
          badge: "Đầu ra đảm bảo",
          badgeClass: "badge-purple",
          value: "42 Học viên",
          sub: "● Được các Resort & SME Nha Trang nhận"
        },
        {
          label: "HỢP ĐỒNG ĐÀO TẠO B2B",
          badge: "Doanh nghiệp đặt",
          badgeClass: "badge-amber",
          value: "04 Hợp đồng",
          sub: "● Đào tạo ngoại ngữ cho nhân sự Resort"
        }
      ],
      school_principal: [
        {
          label: "QUY MÔ HỌC SINH / SINH VIÊN",
          badge: "Sổ liên lạc Số",
          badgeClass: "badge-green",
          value: "1.250 Học sinh",
          sub: "● 100% Phụ huynh cài App Sổ liên lạc"
        },
        {
          label: "THU HỌC PHÍ QR KHÔNG TIỀN MẶT",
          badge: "Gạch nợ 3 giây",
          badgeClass: "badge-blue",
          value: "96.4% Hoàn tất",
          sub: "● Giảm 80% thời gian đối soát kế toán"
        },
        {
          label: "HỌC BỔNG NHẬN TỪ HỆ SINH THÁI",
          badge: "Từ 10 Trung tâm",
          badgeClass: "badge-amber",
          value: "500 Suất",
          sub: "● Kiểm tra Tiếng Anh & Kỹ năng miễn phí"
        },
        {
          label: "NHÀ CUNG ỨNG HỌC ĐƯỜNG B2B",
          badge: "Ưu đãi Nội bộ",
          badgeClass: "badge-purple",
          value: "06 Doanh nghiệp",
          sub: "● Suất ăn VietGAP, Nha khoa, Dã ngoại"
        }
      ],
      student_parent: [
        {
          label: "CHỨNG CHỈ NĂNG LỰC XÁC THỰC",
          badge: "Talent Passport",
          badgeClass: "badge-blue",
          value: "03 Chứng chỉ",
          sub: "● TOEIC 750, ERP Admin, GPA 3.5/4.0"
        },
        {
          label: "DOANH NGHIỆP ĐANG XEM HỒ SƠ",
          badge: "Sàn Nhân lực",
          badgeClass: "badge-green",
          value: "30 Doanh nghiệp",
          sub: "● Resort, Khách sạn & SME Nha Trang"
        },
        {
          label: "HỌC BỔNG & E-VOUCHER TRONG VÍ",
          badge: "Đặc quyền ID",
          badgeClass: "badge-amber",
          value: "05 Ưu đãi",
          sub: "● Giảm 40% IELTS & 30% Nha khoa"
        },
        {
          label: "TRẠNG THÁI ỨNG TUYỂN 1-CLICK",
          badge: "ERP HRM Sync",
          badgeClass: "badge-purple",
          value: "Sẵn sàng",
          sub: "● Liên thông trực tiếp phân hệ Tuyển dụng"
        }
      ]
    };

    const cards = kpiByRole[roleCode] || kpiByRole.super_admin;
    kpiGridEl.innerHTML = cards
      .map(
        (c) => `
        <div class="kpi-card">
          <div class="kpi-top">
            <span>${escapeHtml(c.label)}</span>
            <span class="badge ${c.badgeClass}">${escapeHtml(c.badge)}</span>
          </div>
          <div class="kpi-value">${escapeHtml(c.value)}</div>
          <div class="kpi-sub">${escapeHtml(c.sub)}</div>
        </div>
      `
      )
      .join("");
  }

  // 4. Update Sidebar Role Summary Box
  const sidebarBox = document.getElementById("sidebarRoleSummaryBox");
  if (sidebarBox && roleConfig) {
    sidebarBox.innerHTML = `
      <h5>🎭 Phiên Đăng nhập Hiện tại</h5>
      <div style="font-weight:800;color:#0f172a;font-size:13px;">${escapeHtml(persona.name)}</div>
      <div style="color:#475569;font-size:11.5px;margin-top:2px;">🏢 ${escapeHtml(persona.org)}</div>
      <div class="sidebar-perm-list">
        <div class="sidebar-perm-item">${perms.manageOwnOrg ? "✅" : "🔒"} Quản trị Workspace Đơn vị</div>
        <div class="sidebar-perm-item">${perms.postMemberNews ? "✅" : "🔒"} Đăng tin lên Trang Public</div>
        <div class="sidebar-perm-item">${perms.postForumB2B ? "✅" : "🔒"} Đăng Diễn đàn & B2B</div>
        <div class="sidebar-perm-item">${perms.accessTalentPool ? "✅" : "🔒"} Tuyển dụng Sàn Nhân lực</div>
        <div class="sidebar-perm-item">${roleCode === "super_admin" ? "✅ Toàn quyền Super Admin" : "🔒 Quản trị Hệ thống (Chỉ SuperAdmin)"}</div>
      </div>
    `;
  }

  // 5. Update Main Role Context Banner
  const bannerEl = document.getElementById("roleContextBanner");
  if (bannerEl && roleConfig) {
    const actionButtonsHtml =
      roleCode === "super_admin"
        ? `
          <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-master-overview')">👑 Tổng quan Hệ sinh thái</button>
          <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-master-rbac')">🔐 Cấu hình Phân quyền RBAC</button>
          <button class="btn btn-danger btn-sm" onclick="logoutSsoSession()">🚪 Đăng xuất</button>
        `
        : `
          <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'overview')">🏢 Tổng quan Workspace</button>
          <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'apps')">🚀 Mở ${assignedApps.length} Hệ thống Được cấp phép</button>
          <button class="btn btn-danger btn-sm" onclick="logoutSsoSession()">🚪 Đăng xuất</button>
        `;

    bannerEl.innerHTML = `
      <div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;">
          <span class="badge badge-blue">${escapeHtml(roleConfig.roleName)}</span>
          <span class="badge badge-green">🔑 TechCorp ID: ${escapeHtml((userObj && userObj.id) || "USR-ADMIN-00")}</span>
          <span class="badge badge-purple">Hệ thống được cấp quyền: ${assignedApps.length} / ${STATE.apps.length} Nền tảng</span>
        </div>
        <div style="font-size:15px;font-weight:800;color:#0b2559;">
          Phiên làm việc: <span style="color:#0052d4;">${escapeHtml(persona.name)}</span> — ${escapeHtml(persona.org)}
        </div>
        <div style="font-size:12.5px;color:#334155;margin-top:2px;">
          📌 <strong>Phạm vi hiển thị:</strong> ${
            roleCode === "super_admin"
              ? "Toàn quyền điều hành cả 8 phân hệ Quản trị Hệ sinh thái & Giám sát 4 Khối thành viên."
              : "Giao diện được cô lập theo đúng vai trò đăng nhập — chỉ hiển thị các chức năng và phần mềm thuộc phạm vi đơn vị của bạn."
          }
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${actionButtonsHtml}
      </div>
    `;
  }

  // 6. Enforce RBAC on Forum Composer
  const forumFormWrap = document.getElementById("forumComposerFormWrap");
  if (forumFormWrap) {
    if (!hasRbacPermission("postForumB2B")) {
      forumFormWrap.style.opacity = "0.55";
      forumFormWrap.style.pointerEvents = "none";
    } else {
      forumFormWrap.style.opacity = "1";
      forumFormWrap.style.pointerEvents = "auto";
    }
  }
}

// ==================== CENTRAL ECOSYSTEM BULLETINS (MASTER & MEMBER NEWS - MAIN PUBLIC VIEW) ====================
window.selectedBulletinFilter = "all";
window.bulletinLayoutMode = "columns"; // 'columns' | 'magazine'
window.currentReadingBulletinId = null;

const BULLETIN_RICH_LOOKUP = {
  "ANN-MASTER-01": {
    categoryTag: "Kiến trúc SSO & Liên thông",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
    views: 1480,
    readTime: "3 phút đọc",
    content:
      "Ban Điều hành Hệ sinh thái TechCorp trân trọng thông báo: Trục xác thực tập trung TechCorp ID (Single Sign-On JWT v6.5) và Hệ thống Điều phối Sự kiện Liên thông (Central Event Bus) đã hoàn tất kết nối đồng bộ 100% với 16 nền tảng phần mềm chuyên sâu đang vận hành thực tế trên các tên miền *.techcorp.info.vn.\n\nVới kiến trúc hợp nhất này, mỗi đơn vị thành viên (Trường học, Trung tâm Ngoại ngữ - Tin học, Doanh nghiệp SME, Resort - Khách sạn, Sàn BĐS & Nội thất) sở hữu một Không gian Quản trị (Multi-Tenant Workspace) độc lập, bảo mật theo ma trận phân quyền RBAC 9x5, đồng thời có thể chia sẻ dữ liệu hai chiều theo thời gian thực.\n\nCụ thể, kết quả khảo thí và chứng chỉ năng lực số từ TechCorp LMS tự động gắn mã QR xác thực vào Hồ sơ Năng lực Số (Talent Passport) của sinh viên trên Sàn Việc làm HireMind AI (jobai.techcorp.info.vn), giúp các doanh nghiệp thành viên tuyển dụng và đồng bộ nhân sự mới vào phân hệ HRM trên TechCorp ERP chỉ với 1 cú nhấp chuột.",
    highlights: [
      "Đăng nhập 1 lần (SSO TechCorp ID) chuyển đổi mượt mà giữa 16 nền tảng phần mềm thuộc 6 nhóm chuyên ngành",
      "Đồng bộ tự động Chứng chỉ Thi Online QR từ LMS sang Sàn Tuyển dụng HireMind AI và phân hệ Nhân sự ERP",
      "Liên thông Sổ liên lạc điện tử Phụ huynh K-12 với Ví Học bổng & E-Voucher từ các Doanh nghiệp thành viên",
      "Đạt chuẩn an toàn thông tin đa tầng, giám sát truy vết IP theo thời gian thực (Security Audit Logs 24/7)"
    ]
  },
  "ANN-MASTER-02": {
    categoryTag: "Chính sách Tài trợ Hạt nhân",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
    views: 1265,
    readTime: "4 phút đọc",
    content:
      "Nhằm thúc đẩy chuyển đổi số toàn diện và xây dựng mạng lưới liên kết Giáo dục – Đào tạo – Tuyển dụng – Quản trị Doanh nghiệp bền vững tại Nha Trang - Khánh Hòa, Hệ sinh thái TechCorp chính thức công bố Gói Tài trợ Hạt nhân Giai đoạn 1 dành cho 57 đơn vị tiên phong.\n\nCác đơn vị tham gia chương trình Hạt nhân không chỉ được miễn 100% chi phí khởi tạo hạ tầng đám mây ban đầu và tặng kèm Website thương hiệu/tuyển sinh chuẩn SEO đa ngôn ngữ, mà còn được kích hoạt đặc quyền giao thương chéo (Give-to-Get) tiếp cận trực tiếp cộng đồng hơn 15.000 phụ huynh, học sinh, sinh viên và nhân sự văn phòng trong hệ sinh thái.\n\nĐội ngũ kỹ sư triển khai của TechCorp tại Nha Trang hỗ trợ trực tiếp tận nơi từ khâu chuẩn hóa dữ liệu, tập huấn cán bộ quản lý/giáo viên/nhân sự đến vận hành thực tế 24/7.",
    highlights: [
      "Miễn 100% phí khởi tạo hệ thống Cloud & Cài đặt cấu hình tên miền riêng cho 57 đơn vị hạt nhân đầu tiên",
      "Tặng miễn phí Website Tuyển sinh / Website Doanh nghiệp đa ngôn ngữ chuẩn SEO (trị giá 8 - 10 triệu VNĐ)",
      "Cấp quyền truy cập Kho 2.920+ Hồ sơ Năng lực Số ứng viên đã xác thực điểm thi ngoại ngữ & tin học",
      "Đặc quyền phát hành E-Voucher & Học bổng chéo tới toàn bộ cộng đồng Phụ huynh và Sinh viên trong hệ sinh thái"
    ]
  },
  "ANN-MASTER-03": {
    categoryTag: "AI Tuyển dụng & Nhân sự",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
    views: 985,
    readTime: "3 phút đọc",
    content:
      "Trung tâm R&D AI & Cloud thuộc Hệ sinh thái TechCorp vừa phát hành bản nâng cấp lớn cho Sàn Tuyển dụng & Tìm việc Thông minh TechCorp HireMind AI (jobai.techcorp.info.vn), tích hợp trực tiếp công nghệ AI ATS đa ngôn ngữ (Việt – Anh – Hàn – Nhật – Trung).\n\nHệ thống tự động đọc hiểu CV của ứng viên, đối chiếu với yêu cầu công việc (JD) của doanh nghiệp và kết hợp dữ liệu điểm thi thực tế từ nền tảng khảo thí TechCorp LMS để đưa ra Chỉ số Tương thích AI (AI Matching Score) chính xác tới 96%.\n\nĐặc biệt, ngay khi Phòng Nhân sự (HR) hoặc CEO doanh nghiệp bấm 'Chốt tiếp nhận' trên Sàn Nhân lực, toàn bộ hồ sơ cá nhân, bằng cấp xác thực QR và thông tin lương sẽ được đẩy tự động 1-Click sang phân hệ Quản trị Nhân sự (HRM) trên TechCorp ERP mà không cần nhập liệu thủ công.",
    highlights: [
      "Sàng lọc & chấm điểm độ phù hợp CV – JD tự động bằng AI ATS hỗ trợ 7 ngôn ngữ quốc tế",
      "Xác thực 100% chứng chỉ IELTS/TOEIC/MOS và điểm GPA từ các Trường ĐH & Trung tâm thành viên",
      "Đồng bộ 1-Click hồ sơ ứng viên trúng tuyển vào Hợp đồng lao động & Bảng lương trên TechCorp ERP",
      "Tiết kiệm 75% thời gian và chi phí tuyển dụng nhân sự chất lượng cao cho các Resort, Khách sạn & SME"
    ]
  },
  "ANN-MASTER-04": {
    categoryTag: "Tài chính Số & VietQR",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80",
    views: 870,
    readTime: "3 phút đọc",
    content:
      "Nhằm giải quyết triệt để bài toán đối soát học phí thủ công vào mỗi đầu tháng cho bộ phận kế toán nhà trường và trung tâm đào tạo, Hệ sinh thái TechCorp đã hợp tác cùng các Ngân hàng đối tác tích hợp chuẩn thanh toán VietQR động thế hệ mới trực tiếp vào bộ giải pháp EduManager Pro K-12 và Quản lý Trung tâm NN-TH.\n\nMỗi phiếu báo thu học phí gửi qua Sổ liên lạc điện tử tới Phụ huynh hoặc Học viên sẽ đi kèm một mã QR định danh duy nhất chứa sẵn số tiền và mã học sinh. Ngay khi phụ huynh quét mã thanh toán trên ứng dụng ngân hàng bất kỳ, hệ thống tự động gạch nợ trong 3 giây, phát hành biên lai điện tử tức thì và hạch toán thẳng vào sổ quỹ Tài chính – Kế toán.\n\nNhờ đó, các trường học và trung tâm giảm được hơn 85% thời gian đối soát sao kê ngân hàng và loại bỏ hoàn toàn sai sót nhầm lẫn nội dung chuyển khoản.",
    highlights: [
      "Tự động sinh mã VietQR động định danh theo từng học sinh/học viên trên Sổ liên lạc điện tử",
      "Gạch nợ học phí tự động trong 3 giây và xuất biên lai điện tử ngay sau khi quét mã",
      "Đồng bộ trực tiếp doanh thu học phí về phân hệ Kế toán – Tài chính mà không cần nhập lại",
      "Miễn 100% phí thiết lập cổng kết nối API Ngân hàng cho các cơ sở giáo dục thành viên TechCorp"
    ]
  },
  "ANN-MASTER-05": {
    categoryTag: "Bảo mật & Ký số Điện tử",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
    views: 810,
    readTime: "4 phút đọc",
    content:
      "Đặt an toàn thông tin và tính pháp lý của dữ liệu số lên hàng đầu, Hệ sinh thái TechCorp đã hoàn tất nâng cấp hạ tầng bảo mật đa tầng theo tiêu chuẩn ISO/IEC 27001 kết hợp hệ thống quản lý chất lượng ISO 9001:2015 cho toàn bộ 16 nền tảng phần mềm.\n\nĐối với khối Giáo dục Mầm non – Phổ thông K12 và Đại học, phân hệ Học bạ Số & Bảng điểm Điện tử đã tích hợp đầy đủ chuẩn ký số CA của Ban Cơ yếu Chính phủ và các nhà cung cấp chữ ký số công cộng (Viettel-CA, VNPT-CA, FPT-CA), đáp ứng 100% quy định theo các Thông tư mới nhất của Bộ GD&ĐT.\n\nĐối với khối Doanh nghiệp SME, dữ liệu Nhân sự, Tài chính và Khách hàng được cô lập hoàn toàn theo từng Tenant riêng biệt, mã hóa đầu cuối và sao lưu tự động hàng ngày.",
    highlights: [
      "Cô lập dữ liệu hoàn toàn giữa các đơn vị thành viên theo kiến trúc Multi-Tenant & Ma trận RBAC 9x5",
      "Tích hợp ký số Học bạ Điện tử (XML/PDF) theo đúng chuẩn quy định của Bộ Giáo dục & Đào tạo",
      "Hệ thống Audit Logs ghi vết đầy đủ địa chỉ IP, thời gian và tác nhân của mọi thao tác quan trọng",
      "Cơ chế sao lưu dữ liệu tự động (Auto-Backup) đa vùng và cam kết SLA vận hành ổn định 99.9%"
    ]
  },
  "ANN-MEM-01": {
    categoryTag: "Tuyển dụng & Thực tập",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
    views: 1150,
    readTime: "3 phút đọc",
    content:
      "Chuẩn bị đón các đoàn khách du lịch quốc tế và hội nghị MICE quy mô lớn trong mùa cao điểm Hè – Thu, Nha Trang Bay Resort & Travel chính thức mở đợt tuyển dụng 25 Thực tập sinh có hưởng phụ cấp và Nhân viên chính thức tại các bộ phận: Lễ tân Quốc tế (Front Office), Chăm sóc Khách hàng (Guest Relations), Nhà hàng & Sự kiện (F&B) và Điều hành Tour.\n\nNhờ liên thông trực tiếp với Trục dữ liệu Hệ sinh thái TechCorp, Phòng Nhân sự của Resort áp dụng cơ chế 'Tuyển thẳng không qua sơ loại CV giấy' đối với các bạn sinh viên/học viên đã có Hồ sơ Năng lực Số (Talent Passport) kèm kết quả thi Tiếng Anh (IELTS/TOEIC) hoặc Tiếng Hàn (TOPIK) xác thực trên nền tảng TechCorp LMS.\n\nỨng viên trúng tuyển được đào tạo nghiệp vụ trên hệ thống Quản lý Khách sạn TechCorp PMS, hỗ trợ bữa ăn theo ca, phụ cấp thực tập từ 4.500.000 – 7.000.000 VNĐ/tháng và ký hợp đồng chính thức ngay sau kỳ thực tập.",
    highlights: [
      "Tuyển thẳng ứng viên có Chứng chỉ Ngoại ngữ / Tin học xác thực QR trên nền tảng TechCorp LMS",
      "Mức thu nhập & phụ cấp hấp dẫn: Thực tập sinh 4.5 - 7 triệu/tháng; Nhân viên chính thức 10 - 16 triệu/tháng",
      "Được đào tạo thực chiến trên phần mềm Quản lý Khách sạn 5 Sao TechCorp PMS (qldh.techcorp.info.vn)",
      "Ứng tuyển 1-Click trực tiếp từ Sàn Nhân lực hoặc gửi Hồ sơ số về phân hệ HRM của Resort"
    ]
  },
  "ANN-MEM-02": {
    categoryTag: "Học bổng & Khảo thí LMS",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    views: 1020,
    readTime: "3 phút đọc",
    content:
      "Đồng hành cùng phong trào nâng cao năng lực Ngoại ngữ & Tin học chuẩn quốc tế tại Khánh Hòa, Ocean English & IT Center Nha Trang phối hợp cùng nền tảng khảo thí trực tuyến TechCorp LMS chính thức phát động chương trình tài trợ 500 suất Thi thử IELTS, TOEIC (4 kỹ năng) và Tin học văn phòng MOS hoàn toàn miễn phí.\n\nChương trình dành riêng cho học sinh các trường Phổ thông liên kết, sinh viên Đại học/Cao đẳng và con em cán bộ nhân viên đang làm việc tại các Doanh nghiệp thành viên thuộc Hệ sinh thái TechCorp. Bài thi được chấm tự động bằng AI kết hợp đội ngũ giám khảo chuyên môn của Ocean English.\n\nNgay sau khi hoàn thành bài thi, hệ thống cấp Chứng chỉ Đánh giá Năng lực Số kèm mã QR xác thực, đồng thời tặng ngay Học bổng ưu đãi 40% học phí các khóa luyện thi IELTS/TOEIC cam kết đầu ra vào Ví điện tử TechCorp ID của học viên.",
    highlights: [
      "Tài trợ 100% lệ phí thi thử IELTS / TOEIC 4 kỹ năng & Tin học MOS trên nền tảng TechCorp LMS",
      "Tặng Học bổng 40% học phí (trị giá tới 6.000.000 VNĐ/khóa) cho thành viên Hệ sinh thái TechCorp",
      "Tự động đồng bộ bảng điểm phân tích kỹ năng về Sổ liên lạc Phụ huynh và Talent Passport của Sinh viên",
      "Cam kết giới thiệu thực tập & việc làm tại 30 Resort và Doanh nghiệp SME đối tác sau khi đạt chuẩn đầu ra"
    ]
  },
  "ANN-MEM-03": {
    categoryTag: "Sự kiện Trường học Số",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    views: 890,
    readTime: "3 phút đọc",
    content:
      "Nhằm mang đến sân chơi khoa học công nghệ bổ ích cho học sinh và giúp phụ huynh trải nghiệm thực tế mô hình Trường học Thông minh (Smart School), Hệ thống Giáo dục Liên cấp Sao Biển Nha Trang tổ chức 'Ngày hội Trải nghiệm Công nghệ AI, Robotics & Kỹ năng Số 2026' với sự tham gia của hơn 800 phụ huynh và học sinh.\n\nTại sự kiện, phụ huynh được trực tiếp trải nghiệm hệ thống Điểm danh nhận diện khuôn mặt AI đầu giờ, tra cứu thực đơn dinh dưỡng hàng ngày và thanh toán học phí VietQR 3 giây trên ứng dụng EduManager Pro của TechCorp.\n\nBan Giám hiệu nhà trường trân trọng mời các Trung tâm Ngoại ngữ - Tin học, Phòng khám Nha khoa, Doanh nghiệp Du lịch & Thực phẩm sạch trong Hệ sinh thái TechCorp đăng ký gian hàng đồng hành và phát hành E-Voucher ưu đãi trực tiếp vào Sổ liên lạc điện tử của 1.250 phụ huynh toàn trường.",
    highlights: [
      "Quy mô hơn 800 Phụ huynh & Học sinh tham gia trải nghiệm trực tiếp tại khuôn viên KĐT Mỹ Gia - Nha Trang",
      "Trình diễn thực tế hệ thống Điểm danh AI, Học bạ Số & Sổ liên lạc điện tử EduManager Pro K-12",
      "Miễn phí gian hàng trưng bày cho các Trung tâm Đào tạo & Doanh nghiệp thành viên Hệ sinh thái TechCorp",
      "Hỗ trợ bắn thông báo E-Voucher ưu đãi của đơn vị tài trợ tới 100% tài khoản Phụ huynh nhà trường"
    ]
  },
  "ANN-MEM-04": {
    categoryTag: "Ưu đãi B2B Nội bộ",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    views: 760,
    readTime: "3 phút đọc",
    content:
      "Nhằm hỗ trợ các cơ sở giáo dục, trung tâm đào tạo và doanh nghiệp SME trong Hệ sinh thái TechCorp tối ưu chi phí khi mở rộng chi nhánh mới tại Nha Trang – Cam Ranh – Ninh Hòa, Liên minh Sàn Giao dịch BĐS Hưng Phát Land (bds.techcorp.info.vn) và Showroom Nội thất TechCorp Interior (noithat.techcorp.info.vn) chính thức triển khai gói đặc quyền B2B nội bộ.\n\nCụ thể, Hưng Phát Land hỗ trợ tìm kiếm mặt bằng thương mại, tòa nhà văn phòng và cơ sở trường học tại các khu đô thị trọng điểm (Mỹ Gia, Hà Quang II, Vĩnh Điềm Trung, An Bình Tân) với chính sách miễn 100% phí môi giới cho thành viên TechCorp.\n\nSong song đó, TechCorp Interior tài trợ 100% chi phí khảo sát & dựng bản vẽ phối cảnh 3D phòng học thông minh / văn phòng hiện đại, đồng thời giảm ngay 20% tổng giá trị hợp đồng sản xuất – thi công nội thất trọn gói tại xưởng.",
    highlights: [
      "Miễn 100% phí tư vấn & tìm kiếm mặt bằng mở Trường học, Trung tâm, Văn phòng tại Nha Trang - Khánh Hòa",
      "Tặng 100% gói Thiết kế phối cảnh 3D & Dự toán BOQ tự động trên nền tảng noithat.techcorp.info.vn",
      "Chiết khấu trực tiếp 20% chi phí sản xuất & thi công nội thất phòng học, bàn ghế, quầy lễ tân tại xưởng",
      "Bảo hành công trình điện tử 36 tháng và hỗ trợ trả chậm linh hoạt cho đơn vị thành viên TechCorp"
    ]
  },
  "ANN-MEM-05": {
    categoryTag: "Liên kết Đại học – Doanh nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80",
    views: 940,
    readTime: "4 phút đọc",
    content:
      "Thông qua sự kết nối giữa Hệ thống Quản trị Đào tạo Đại học TC COMPASS (qldt.techcorp.info.vn) và Sàn Tuyển dụng Thông minh HireMind AI (jobai.techcorp.info.vn), Trung tâm Hợp tác Doanh nghiệp & Việc làm Sinh viên đã hoàn tất chuẩn hóa và xuất bản 450 Hồ sơ Năng lực Số (Verified Talent Passport) của sinh viên năm cuối đạt GPA từ 3.2/4.0 trở lên.\n\nMỗi hồ sơ số đều được xác thực tự động điểm trung bình tích lũy (GPA), kỹ năng chuyên môn, dự án tốt nghiệp cùng các chứng chỉ Ngoại ngữ (IELTS/TOEIC/TOPIK) và Tin học (MOS/ERP) từ các trung tâm khảo thí trong hệ sinh thái.\n\nCác doanh nghiệp thành viên có thể truy cập trực tiếp danh sách ứng viên theo từng chuyên ngành, đặt lịch phỏng vấn trực tuyến và tiếp nhận sinh viên thực tập/làm việc chính thức chỉ với 1 thao tác trên Cổng Quản trị.",
    highlights: [
      "Công bố 450 Hồ sơ Năng lực Số sinh viên năm cuối đã xác thực GPA & Chứng chỉ kỹ năng nghề nghiệp",
      "Đầy đủ các nhóm ngành trọng điểm: Công nghệ thông tin, Du lịch - Khách sạn, Kế toán ERP, Ngoại ngữ",
      "Doanh nghiệp thành viên được miễn phí 100% quyền truy cập CV và đặt bàn phỏng vấn tại Ngày hội Việc làm",
      "Liên thông trực tiếp từ nền tảng Đại học TC COMPASS sang Sàn Việc làm HireMind AI & TechCorp ERP"
    ]
  }
};

function enrichSingleAnnouncementItem(raw) {
  const meta = BULLETIN_RICH_LOOKUP[raw.id] || {};
  const isMaster = raw.sourceType === "master";
  const defaultImg = isMaster
    ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"
    : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80";

  return {
    ...raw,
    badge: normalizeTermText(raw.badge),
    title: normalizeTermText(raw.title),
    summary: normalizeTermText(raw.summary),
    authorName: normalizeTermText(raw.authorName),
    authorOrg: normalizeTermText(raw.authorOrg),
    categoryTag: raw.categoryTag || meta.categoryTag || (isMaster ? "Bản tin Điều hành" : "Tin Đơn vị Thành viên"),
    imageUrl: raw.imageUrl || meta.imageUrl || defaultImg,
    views: Number(raw.views || meta.views || (isMaster ? 680 : 420)),
    readTime: raw.readTime || meta.readTime || "3 phút đọc",
    content:
      raw.content ||
      meta.content ||
      `${raw.summary || ""}\n\nBản tin được kiểm duyệt và phát hành chính thức qua Trục Liên thông Dữ liệu Hệ sinh thái TechCorp (hesinhthai.techcorp.info.vn). Các đơn vị thành viên gồm Trường học, Trung tâm Ngoại ngữ - Tin học, Doanh nghiệp SME và Cộng đồng Sinh viên/Phụ huynh có thể kết nối trực tiếp để nhận ưu đãi hoặc đăng ký tham gia chương trình.\n\nMọi thông tin hỗ trợ kỹ thuật, kích hoạt đặc quyền hoặc đăng ký tư vấn triển khai vui lòng liên hệ Ban Điều phối Hệ sinh thái TechCorp qua Hotline/Zalo: 0392.091.068.`,
    highlights:
      Array.isArray(raw.highlights) && raw.highlights.length > 0
        ? raw.highlights
        : meta.highlights || [
            "Thông tin chính thức đã được xác thực định danh SSO trên Hệ sinh thái TechCorp",
            "Áp dụng trực tiếp cho các Trường học, Trung tâm Đào tạo, Doanh nghiệp SME & Học viên thành viên",
            "Hỗ trợ kết nối nhanh 24/7 qua Hotline / Zalo Ban Điều phối: 0392.091.068"
          ]
  };
}

window.filterPublicBulletins = function (filterKey) {
  window.selectedBulletinFilter = filterKey || "all";
  const bar = document.getElementById("publicBulletinFilterBar");
  if (bar) {
    bar.querySelectorAll(".forum-cat-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-bfilter") === window.selectedBulletinFilter);
    });
  }
  renderCentralBulletins();
};

window.toggleBulletinLayoutMode = function () {
  window.bulletinLayoutMode = window.bulletinLayoutMode === "columns" ? "magazine" : "columns";
  const btn = document.getElementById("btnToggleBulletinLayout");
  if (btn) {
    btn.innerHTML =
      window.bulletinLayoutMode === "columns"
        ? "📰 Chế độ: 2 Cột Chuyên mục"
        : "🗂️ Chế độ: Lưới Báo Điện tử";
  }
  renderCentralBulletins();
};

function normalizeTermText(str) {
  return String(str || "")
    .replace(/CHỦ HỆ SINH THÁI TECHCORP/g, "HỆ SINH THÁI TECHCORP")
    .replace(/Chủ Hệ sinh thái TechCorp/gi, "Hệ sinh thái TechCorp")
    .replace(/CHỦ HỆ SINH THÁI/g, "HỆ SINH THÁI TECHCORP")
    .replace(/(?<!Trang\s)Chủ Hệ sinh thái/g, "Hệ sinh thái TechCorp")
    .replace(/(?<!Trang\s)Chủ hệ sinh thái/g, "Hệ sinh thái TechCorp");
}

function renderSingleBulletinMediaCardHtml(item, isMaster) {
  const defaultActionView = isMaster ? "products" : "forum";
  const defaultActionLabel = isMaster ? "Xem Sản phẩm" : "Kết nối ngay";
  return `
    <article class="bulletin-media-card ${isMaster ? "master-bulletin" : ""}">
      <div class="bulletin-media-thumb" onclick="openBulletinDetailModal('${escapeHtml(item.id)}')" title="Nhấn để xem chi tiết: ${escapeHtml(item.title)}">
        <img
          src="${escapeHtml(item.imageUrl)}"
          alt="${escapeHtml(item.title)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80'"
        />
        <span class="bulletin-thumb-tag">${escapeHtml(item.categoryTag)}</span>
        <div class="bulletin-thumb-views">
          <span>👁️ ${Number(item.views || 350).toLocaleString("vi-VN")}</span>
          <span>📖 ${escapeHtml(item.readTime || "3 phút")}</span>
        </div>
      </div>
      <div class="bulletin-media-content">
        <div>
          <div class="bulletin-top">
            <span class="badge ${isMaster ? "badge-amber" : "badge-blue"}">${escapeHtml(item.badge)}</span>
            <span style="font-size:11px;color:#64748b;font-weight:600;">🕒 ${escapeHtml(item.createdAt)}</span>
          </div>
          <h4 class="bulletin-media-title" onclick="openBulletinDetailModal('${escapeHtml(item.id)}')">
            ${escapeHtml(item.title)}
          </h4>
          <p class="bulletin-media-summary">${escapeHtml(item.summary)}</p>
        </div>
        <div class="bulletin-media-footer">
          <span style="max-width:58%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(item.authorOrg)} (${escapeHtml(item.authorName)})">
            ${isMaster ? "👤 Ban hành:" : "🏢 Đơn vị:"} <strong>${escapeHtml(isMaster ? item.authorName : item.authorOrg)}</strong>
          </span>
          <div class="bulletin-action-btns">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              onclick="openBulletinDetailModal('${escapeHtml(item.id)}')"
            >
              📖 Xem chi tiết
            </button>
            <button
              type="button"
              class="btn btn-outline btn-sm"
              onclick="handleBulletinAction('${escapeHtml(item.id)}', '${escapeHtml(item.actionView || defaultActionView)}', '${escapeHtml(item.actionLabel || defaultActionLabel)}')"
            >
              ${escapeHtml(item.actionLabel || defaultActionLabel)} →
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderCentralBulletins() {
  const masterEl = document.getElementById("masterBulletinsList");
  const memberEl = document.getElementById("memberBulletinsList");
  const masterColCard = document.getElementById("masterBulletinsColCard");
  const memberColCard = document.getElementById("memberBulletinsColCard");
  const twoColGrid = document.getElementById("publicBulletinsTwoColGrid");
  const featuredWrap = document.getElementById("publicFeaturedBulletinsWrap");
  const featuredGrid = document.getElementById("publicFeaturedBulletinsGrid");
  const masterBadgeEl = document.getElementById("masterColCountBadge");
  const memberBadgeEl = document.getElementById("memberColCountBadge");
  const navBadge = document.getElementById("navBadgeBulletins");
  const kpiTotal = document.getElementById("kpiTotalBulletinsAndPosts");
  const statMasterEl = document.getElementById("pubStatMasterBulletins");
  const statMemberEl = document.getElementById("pubStatMemberBulletins");
  const searchKeyword = (document.getElementById("publicBulletinSearchInput")?.value || "").trim().toLowerCase();
  const activeFilter = window.selectedBulletinFilter || "all";

  const list = (STATE.announcements || []).map(enrichSingleAnnouncementItem);

  if (navBadge) navBadge.textContent = `${list.length} Tin`;
  if (kpiTotal) kpiTotal.textContent = `${list.length + STATE.forumPosts.length} Bản tin`;

  const allMasters = list.filter((a) => a.sourceType === "master");
  const allMembers = list.filter((a) => a.sourceType !== "master");
  if (statMasterEl) statMasterEl.textContent = `${String(allMasters.length).padStart(2, "0")} Bản tin`;
  if (statMemberEl) statMemberEl.textContent = `${String(allMembers.length).padStart(2, "0")} Tin mới`;
  if (masterBadgeEl) masterBadgeEl.textContent = `${allMasters.length} Bản tin Điều hành`;
  if (memberBadgeEl) memberBadgeEl.textContent = `${allMembers.length} Tin Thành viên`;

  const matchSearch = (item) => {
    if (!searchKeyword) return true;
    const blob = `${item.badge || ""} ${item.categoryTag || ""} ${item.title || ""} ${item.summary || ""} ${item.content || ""} ${item.authorName || ""} ${item.authorOrg || ""}`.toLowerCase();
    return blob.includes(searchKeyword);
  };

  const masterList = allMasters.filter(matchSearch);
  const memberList = allMembers.filter(matchSearch);

  // Render Featured Spotlight (Top Master + Top Member) when no search keyword is active
  if (featuredWrap && featuredGrid) {
    let featuredItems = [];
    if (activeFilter === "master") {
      featuredItems = masterList.slice(0, 2);
    } else if (activeFilter === "member") {
      featuredItems = memberList.slice(0, 2);
    } else {
      if (masterList[0]) featuredItems.push(masterList[0]);
      if (memberList[0]) featuredItems.push(memberList[0]);
    }

    if (searchKeyword || featuredItems.length === 0) {
      featuredWrap.style.display = "none";
    } else {
      featuredWrap.style.display = "block";
      featuredGrid.innerHTML = featuredItems
        .map((fItem) => {
          const isMaster = fItem.sourceType === "master";
          const defaultView = isMaster ? "products" : "forum";
          const defaultLabel = isMaster ? "Khám phá Sản phẩm" : "Kết nối ngay";
          return `
            <article class="bulletin-featured-card ${isMaster ? "master-featured" : "member-featured"}">
              <div>
                <div class="bulletin-featured-media" onclick="openBulletinDetailModal('${escapeHtml(fItem.id)}')">
                  <img
                    src="${escapeHtml(fItem.imageUrl)}"
                    alt="${escapeHtml(fItem.title)}"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'"
                  />
                  <div class="bulletin-featured-overlay-top">
                    <span class="badge ${isMaster ? "badge-amber" : "badge-blue"}">
                      ${isMaster ? "👑 TIÊU ĐIỂM HỆ SINH THÁI" : "🌟 TIÊU ĐIỂM ĐƠN VỊ THÀNH VIÊN"}
                    </span>
                    <span class="badge badge-green">📌 Tin Ghim Nổi bật</span>
                  </div>
                  <div class="bulletin-featured-overlay-bottom">
                    <span>🏷️ ${escapeHtml(fItem.categoryTag)}</span>
                    <span>🕒 ${escapeHtml(fItem.createdAt)} • 👁️ ${Number(fItem.views).toLocaleString("vi-VN")} lượt xem</span>
                  </div>
                </div>
                <div class="bulletin-featured-body">
                  <div>
                    <h3 class="bulletin-featured-title" onclick="openBulletinDetailModal('${escapeHtml(fItem.id)}')">
                      ${escapeHtml(fItem.title)}
                    </h3>
                    <p class="bulletin-featured-summary" style="margin-top:6px;">
                      ${escapeHtml(fItem.summary)}
                    </p>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-top:10px;border-top:1px solid #e2e8f0;margin-top:6px;">
                    <div style="font-size:12px;color:#334155;">
                      ${isMaster ? "👤 Ban hành:" : "🏢 Đơn vị:"} <strong style="color:#0b2559;">${escapeHtml(fItem.authorOrg)}</strong>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        onclick="openBulletinDetailModal('${escapeHtml(fItem.id)}')"
                      >
                        📖 Xem tin chi tiết
                      </button>
                      <button
                        type="button"
                        class="btn btn-outline btn-sm"
                        onclick="handleBulletinAction('${escapeHtml(fItem.id)}', '${escapeHtml(fItem.actionView || defaultView)}', '${escapeHtml(fItem.actionLabel || defaultLabel)}')"
                      >
                        ${escapeHtml(fItem.actionLabel || defaultLabel)} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
    }
  }

  const isMagazine = window.bulletinLayoutMode === "magazine" || activeFilter !== "all";
  if (masterEl) masterEl.classList.toggle("magazine-grid-mode", isMagazine);
  if (memberEl) memberEl.classList.toggle("magazine-grid-mode", isMagazine);

  if (masterColCard && memberColCard && twoColGrid) {
    if (activeFilter === "master") {
      masterColCard.style.display = "";
      memberColCard.style.display = "none";
      twoColGrid.style.gridTemplateColumns = "1fr";
    } else if (activeFilter === "member") {
      masterColCard.style.display = "none";
      memberColCard.style.display = "";
      twoColGrid.style.gridTemplateColumns = "1fr";
    } else if (window.bulletinLayoutMode === "magazine") {
      masterColCard.style.display = "";
      memberColCard.style.display = "";
      twoColGrid.style.gridTemplateColumns = "1fr";
    } else {
      masterColCard.style.display = "";
      memberColCard.style.display = "";
      twoColGrid.style.gridTemplateColumns = "";
    }
  }

  if (masterEl) {
    masterEl.innerHTML =
      masterList.length === 0
        ? `<div style="padding:18px;text-align:center;color:#64748b;font-size:13px;">Không tìm thấy bản tin phù hợp với từ khóa tìm kiếm.</div>`
        : masterList.map((item) => renderSingleBulletinMediaCardHtml(item, true)).join("");
  }

  if (memberEl) {
    memberEl.innerHTML =
      memberList.length === 0
        ? `<div style="padding:18px;text-align:center;color:#64748b;font-size:13px;">Không tìm thấy tin tức đơn vị thành viên phù hợp.</div>`
        : memberList.map((item) => renderSingleBulletinMediaCardHtml(item, false)).join("");
  }

  const homeStreamEl = document.getElementById("publicHomeActivityStream");
  if (homeStreamEl) {
    const events = (STATE.activityLogs || []).slice(0, 4);
    homeStreamEl.innerHTML = events
      .map(
        (ev) => `
        <div style="padding:10px 12px;background:#f8fbff;border-radius:10px;border-left:3.5px solid #2563eb;font-size:12.5px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span class="badge badge-blue" style="font-size:10px;">${escapeHtml(ev.eventType || "SSO_SYNC")}</span>
            <span style="font-size:11px;color:#64748b;">🕒 ${escapeHtml(ev.time || "Vừa xong")}</span>
          </div>
          <div style="color:#1e293b;line-height:1.45;">${escapeHtml(ev.text)}</div>
        </div>
      `
      )
      .join("");
  }
}

window.openBulletinDetailModal = function (annId) {
  const list = (STATE.announcements || []).map(enrichSingleAnnouncementItem);
  const idx = list.findIndex((a) => a.id === annId);
  const item = idx !== -1 ? list[idx] : list[0];
  if (!item) return;

  window.currentReadingBulletinId = item.id;

  // Increment view count in memory
  const rawItem = (STATE.announcements || []).find((a) => a.id === item.id);
  if (rawItem) {
    rawItem.views = Number(rawItem.views || item.views || 350) + 1;
    item.views = rawItem.views;
  }

  let modal = document.getElementById("bulletinDetailModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "bulletinDetailModal";
    modal.className = "bulletin-detail-modal-backdrop";
    modal.style.display = "none";
    modal.onclick = function (e) {
      if (e.target === modal) window.closeBulletinDetailModal();
    };
    modal.innerHTML = `<div class="bulletin-detail-modal-dialog" role="dialog" aria-modal="true"><div id="bulletinDetailModalBody"></div></div>`;
    document.body.appendChild(modal);
  }

  const bodyEl = document.getElementById("bulletinDetailModalBody");
  if (!bodyEl) return;

  const isMaster = item.sourceType === "master";
  const prevItem = idx > 0 ? list[idx - 1] : null;
  const nextItem = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const relatedList = list.filter((a) => a.id !== item.id).slice(0, 3);

  const paragraphsHtml = String(item.content || item.summary || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  const highlightsHtml = (item.highlights || [])
    .map(
      (h) => `
      <div style="display:flex;align-items:flex-start;gap:8px;font-size:13.5px;color:#0f172a;margin-top:7px;line-height:1.5;">
        <span style="color:#059669;font-weight:800;">✔</span>
        <span>${escapeHtml(h)}</span>
      </div>
    `
    )
    .join("");

  const relatedHtml = relatedList
    .map(
      (rel) => `
      <div class="bulletin-related-item" onclick="openBulletinDetailModal('${escapeHtml(rel.id)}')">
        <img
          src="${escapeHtml(rel.imageUrl)}"
          alt="${escapeHtml(rel.title)}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'"
        />
        <div class="bulletin-related-item-body">
          <span style="font-size:10.5px;font-weight:700;color:#0052d4;">${escapeHtml(rel.categoryTag)}</span>
          <strong style="font-size:12.5px;color:#0f172a;line-height:1.38;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${escapeHtml(rel.title)}
          </strong>
          <span style="font-size:11px;color:#64748b;margin-top:2px;">🕒 ${escapeHtml(rel.createdAt)} • 👁️ ${Number(rel.views).toLocaleString("vi-VN")}</span>
        </div>
      </div>
    `
    )
    .join("");

  const defaultView = isMaster ? "products" : "forum";
  const defaultLabel = isMaster ? "Khám phá 6 Nhóm Sản phẩm" : "Mở Chuyên trang Liên kết";

  bodyEl.innerHTML = `
    <div class="bulletin-modal-topbar">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="badge ${isMaster ? "badge-amber" : "badge-blue"}">${escapeHtml(item.badge)}</span>
        <span class="badge badge-green">🏷️ ${escapeHtml(item.categoryTag)}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button type="button" class="btn btn-outline btn-sm" onclick="copyBulletinShareLink('${escapeHtml(item.id)}')">
          🔗 Sao chép Link Tin
        </button>
        <button type="button" class="btn btn-danger btn-sm" onclick="closeBulletinDetailModal()">
          ✕ Đóng (ESC)
        </button>
      </div>
    </div>

    <div class="bulletin-modal-hero">
      <img
        src="${escapeHtml(item.imageUrl)}"
        alt="${escapeHtml(item.title)}"
        onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'"
      />
      <div class="bulletin-modal-hero-caption">
        <div>
          <span style="background:rgba(0,82,212,0.88);padding:4px 10px;border-radius:6px;font-weight:700;font-size:11px;">
            📸 Hình ảnh minh họa Bản tin • ${escapeHtml(item.authorOrg)}
          </span>
        </div>
        <div>
          🕒 Đăng lúc: <strong>${escapeHtml(item.createdAt)}</strong> • 📖 ${escapeHtml(item.readTime)} • 👁️ <strong>${Number(item.views).toLocaleString("vi-VN")} lượt xem</strong>
        </div>
      </div>
    </div>

    <div class="bulletin-modal-content-wrap">
      <h2 class="bulletin-modal-title" id="bulletinModalTitle">${escapeHtml(item.title)}</h2>

      <div class="bulletin-modal-meta-bar">
        <div>
          <div style="font-weight:800;color:#0b2559;font-size:13.5px;">
            ${isMaster ? "👑 Cơ quan ban hành:" : "🏢 Đơn vị thành viên:"} <span style="color:#0052d4;">${escapeHtml(item.authorOrg)}</span>
          </div>
          <div style="font-size:12px;color:#475569;margin-top:2px;">
            👤 Người phụ trách / Đại diện: <strong>${escapeHtml(item.authorName)}</strong> • Mã bản tin: <code>${escapeHtml(item.id)}</code>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge badge-green">✔ Đã xác thực SSO TechCorp ID</span>
        </div>
      </div>

      <div class="bulletin-modal-lead">
        📌 <strong>Tóm tắt trọng tâm:</strong> ${escapeHtml(item.summary)}
      </div>

      <div class="bulletin-modal-article-body">
        ${paragraphsHtml}
      </div>

      <div class="bulletin-modal-highlights">
        <h5>🌟 Điểm nhấn &amp; Quyền lợi Dành cho Thành viên Hệ sinh thái TechCorp:</h5>
        ${highlightsHtml}
      </div>

      <!-- Hộp Hành động & Liên hệ nhanh -->
      <div style="background:#f8fbff;border:1.5px solid #93c5fd;border-radius:14px;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-top:18px;">
        <div>
          <strong style="font-size:13.5px;color:#0b2559;display:block;">
            🚀 Kết nối &amp; Triển khai ngay cùng Hệ sinh thái TechCorp
          </strong>
          <span style="font-size:12px;color:#475569;">
            Hotline / Zalo tư vấn trực tiếp 24/7: <strong style="color:#0052d4;">0392.091.068</strong> • Email: <strong>info@techcorp.info.vn</strong>
          </span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <a
            href="https://zalo.me/0392091068"
            target="_blank"
            rel="noopener"
            class="btn btn-emerald btn-sm"
            style="text-decoration:none;"
          >
            💬 Chat Zalo (0392.091.068) ↗
          </a>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            onclick="closeBulletinDetailModal(); handleBulletinAction('${escapeHtml(item.id)}', '${escapeHtml(item.actionView || defaultView)}', '${escapeHtml(item.actionLabel || defaultLabel)}')"
          >
            🚀 ${escapeHtml(item.actionLabel || defaultLabel)} →
          </button>
        </div>
      </div>

      <!-- Thanh Điều hướng Tin Trước / Tin Tiếp theo -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid #e2e8f0;flex-wrap:wrap;">
        <button
          type="button"
          class="btn btn-outline btn-sm"
          ${prevItem ? `onclick="openBulletinDetailModal('${escapeHtml(prevItem.id)}')"` : "disabled style='opacity:0.45;cursor:not-allowed;'"}
        >
          ⬅ Bản tin trước
        </button>
        <span style="font-size:12px;color:#64748b;font-weight:700;">
          Đang xem bản tin ${idx + 1} / ${list.length}
        </span>
        <button
          type="button"
          class="btn btn-outline btn-sm"
          ${nextItem ? `onclick="openBulletinDetailModal('${escapeHtml(nextItem.id)}')"` : "disabled style='opacity:0.45;cursor:not-allowed;'"}
        >
          Bản tin tiếp theo ➡
        </button>
      </div>

      <!-- Các Bản tin Liên quan có Hình ảnh đại diện -->
      <div style="margin-top:22px;padding-top:16px;border-top:2px solid #edf4ff;">
        <h4 style="font-size:14.5px;font-weight:800;color:#0b2559;margin-bottom:4px;">
          📰 Các Bản tin Khác trong Hệ sinh thái TechCorp
        </h4>
        <div class="bulletin-modal-related-grid">
          ${relatedHtml}
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
  const dialog = modal.querySelector(".bulletin-detail-modal-dialog");
  if (dialog) dialog.scrollTop = 0;
  renderCentralBulletins();
};

window.closeBulletinDetailModal = function () {
  const modal = document.getElementById("bulletinDetailModal");
  if (modal) modal.style.display = "none";
};

window.copyBulletinShareLink = function (annId) {
  const url = `${window.location.origin}${window.location.pathname}?page=home&bulletin=${encodeURIComponent(annId)}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).catch(() => {});
  }
  showToast(`🔗 Đã sao chép đường dẫn chia sẻ Bản tin mã <b>${escapeHtml(annId)}</b>!`);
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("bulletinDetailModal");
    if (modal && modal.style.display !== "none") {
      window.closeBulletinDetailModal();
    }
  }
});

window.openBulletinModal = function (sourceType) {
  if (sourceType === "master") {
    if (!hasRbacPermission("publishMasterBulletin")) {
      showToast(`<span style="color:#d97706">🔒 Theo phân quyền RBAC, chỉ Hệ sinh thái TechCorp mới được phát Thông báo Điều hành!</span>`);
      return;
    }
    window.activateAdminPanel("panel-master-bulletins");
    return;
  }
  if (!hasRbacPermission("postMemberNews")) {
    showToast(`<span style="color:#d97706">🔒 Vai trò hiện tại chưa được bật quyền "Đăng Tin Tiêu điểm Thành viên" trong Ma trận RBAC!</span>`);
    return;
  }
  window.activateAdminPanel("panel-role-workspace", "news");
};

window.closeBulletinModal = function () {
  const modal = document.getElementById("quickBulletinModal");
  if (modal) modal.style.display = "none";
};

window.submitNewAnnouncement = async function () {
  const sourceType = document.getElementById("newBulletinSourceType")?.value || "member";
  const badge = document.getElementById("newBulletinBadge")?.value.trim();
  const title = document.getElementById("newBulletinTitle")?.value.trim();
  const imageUrl = document.getElementById("newBulletinImageUrl")?.value.trim();
  const summary = document.getElementById("newBulletinSummary")?.value.trim();
  const content = document.getElementById("newBulletinContent")?.value.trim() || summary;
  if (!title || !summary) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Tiêu đề và Nội dung thông báo!</span>`);
    return;
  }
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["super-admin"];
  const defaultImg =
    sourceType === "master"
      ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80"
      : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80";

  try {
    const res = await fetch("/api/v1/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceType,
        badge,
        title,
        imageUrl: imageUrl || defaultImg,
        summary,
        content,
        authorName: persona.name,
        authorOrg: persona.org,
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.announcements = data.announcements;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      closeBulletinModal();
      if (document.getElementById("newBulletinTitle")) document.getElementById("newBulletinTitle").value = "";
      if (document.getElementById("newBulletinImageUrl")) document.getElementById("newBulletinImageUrl").value = "";
      if (document.getElementById("newBulletinSummary")) document.getElementById("newBulletinSummary").value = "";
      if (document.getElementById("newBulletinContent")) document.getElementById("newBulletinContent").value = "";
      renderAllViews();
      showToast("📢 Đã phát hành Bản tin kèm hình ảnh đại diện lên Trang Public Hệ sinh thái thành công!");
      return;
    }
  } catch (_) {}

  STATE.announcements.unshift({
    id: "ANN-" + Date.now(),
    sourceType,
    badge,
    imageUrl: imageUrl || defaultImg,
    title,
    summary,
    content,
    views: 120,
    readTime: "3 phút đọc",
    authorName: persona.name,
    authorOrg: persona.org,
    createdAt: "Vừa xong",
    pinned: true,
    actionLabel: "Xem chi tiết",
    actionView: "products"
  });
  recordLocalAuditLog("ANNOUNCEMENT_PUBLISH", title, "INFO", `Đăng bản tin mới lên Cổng Chung (${badge}).`);
  closeBulletinModal();
  renderAllViews();
  showToast("📢 Đã phát hành Bản tin lên Trang Public Hệ sinh thái!");
};

window.submitWorkspaceMemberNews = async function () {
  const badge = document.getElementById("wsBulletinBadge")?.value.trim() || "🌟 TIN TỪ ĐƠN VỊ THÀNH VIÊN";
  const title = document.getElementById("wsBulletinTitle")?.value.trim();
  const imageUrl = document.getElementById("wsBulletinImageUrl")?.value.trim();
  const summary = document.getElementById("wsBulletinSummary")?.value.trim();
  const content = document.getElementById("wsBulletinContent")?.value.trim() || summary;
  if (!title || !summary) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Tiêu đề và Nội dung bản tin của đơn vị!</span>`);
    return;
  }
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["ceo-sme"];
  const resolvedImg =
    imageUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80";

  try {
    const res = await fetch("/api/v1/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceType: "member",
        badge,
        imageUrl: resolvedImg,
        title,
        summary,
        content,
        authorName: persona.name,
        authorOrg: persona.org,
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.announcements = data.announcements;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast("📢 Đã đăng tải Bản tin của Đơn vị kèm ảnh đại diện lên Trang Public thành công!");
      return;
    }
  } catch (_) {}

  STATE.announcements.unshift({
    id: "ANN-" + Date.now(),
    sourceType: "member",
    badge,
    imageUrl: resolvedImg,
    title,
    summary,
    content,
    views: 95,
    readTime: "3 phút đọc",
    authorName: persona.name,
    authorOrg: persona.org,
    createdAt: "Vừa xong",
    pinned: false,
    actionLabel: "Kết nối ngay",
    actionView: "forum"
  });
  recordLocalAuditLog("ANNOUNCEMENT_PUBLISH", title, "INFO", `Đơn vị thành viên đăng bản tin mới (${badge}).`);
  renderAllViews();
  showToast("📢 Đã đăng tải Bản tin của Đơn vị lên Trang Public thành công!");
};

window.submitWorkspaceForumPost = async function () {
  const category = document.getElementById("wsForumCategory")?.value || "rfq";
  const title = document.getElementById("wsForumTitle")?.value.trim();
  const content = document.getElementById("wsForumContent")?.value.trim();
  const memberDeal = document.getElementById("wsForumDeal")?.value.trim();

  if (!title || !content) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Tiêu đề và Nội dung tin Giao thương B2B!</span>`);
    return;
  }

  try {
    const res = await fetch("/api/v1/forum/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category,
        title,
        content,
        memberDeal,
        personaKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      STATE.activityLogs = data.activityLogs || STATE.activityLogs;
      renderAllViews();
      showToast("🚀 Đã gửi bài viết Giao thương B2B từ trang Quản trị (Sẵn sàng hiển thị trên Public sau khi duyệt)!");
      return;
    }
  } catch (_) {}

  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["ceo-sme"];
  STATE.forumPosts.unshift({
    id: "POST-" + Date.now(),
    category,
    categoryLabel: CATEGORY_MAP[category] || CATEGORY_MAP.rfq,
    pinned: false,
    status: STATE.currentPersona === "super-admin" ? "approved" : "pending",
    locked: false,
    title,
    content,
    memberDeal: memberDeal || "Ưu đãi nội bộ dành cho thành viên Hệ sinh thái TechCorp",
    author: {
      personaKey: STATE.currentPersona,
      name: persona.name,
      org: persona.org,
      roleBadge: persona.roleBadge,
      verifiedApp: "TechCorp SSO"
    },
    createdAt: "Vừa xong",
    likes: 1,
    views: 1,
    comments: []
  });
  recordLocalAuditLog("FORUM_POST_CREATE", title, "INFO", "Đăng bài Giao thương B2B từ Không gian Quản trị.");
  renderAllViews();
  showToast("🚀 Đã gửi bài viết Giao thương B2B từ trang Quản trị!");
};

function renderAdminBulletinsTable() {
  const tbody = document.getElementById("adminBulletinsTableBody");
  if (!tbody) return;
  const enrichedList = (STATE.announcements || []).map(enrichSingleAnnouncementItem);
  tbody.innerHTML = enrichedList
    .map(
      (a) => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img
              src="${escapeHtml(a.imageUrl)}"
              alt="${escapeHtml(a.title)}"
              style="width:76px;height:52px;object-fit:cover;border-radius:8px;border:1px solid #cbd5e1;flex-shrink:0;cursor:pointer;"
              onclick="openBulletinDetailModal('${escapeHtml(a.id)}')"
              onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'"
            />
            <div>
              <span class="badge ${a.sourceType === "master" ? "badge-amber" : "badge-blue"}">${escapeHtml(a.badge)}</span>
              <div style="font-size:11px;color:#64748b;margin-top:3px;">🏷️ ${escapeHtml(a.categoryTag)}</div>
            </div>
          </div>
        </td>
        <td>
          <strong style="color:#0f172a;cursor:pointer;" onclick="openBulletinDetailModal('${escapeHtml(a.id)}')">${escapeHtml(a.title)}</strong>
          <div style="font-size:12px;color:#475569;margin-top:3px;">${escapeHtml(a.summary)}</div>
        </td>
        <td>
          <div style="font-weight:700;color:#1e293b;">${escapeHtml(a.authorOrg)}</div>
          <div style="font-size:11.5px;color:#64748b;">${escapeHtml(a.authorName)}</div>
        </td>
        <td style="font-size:12px;color:#475569;">
          <div>🕒 ${escapeHtml(a.createdAt)}</div>
          <div style="font-size:11px;color:#0052d4;font-weight:700;margin-top:2px;">👁️ ${Number(a.views).toLocaleString("vi-VN")} lượt xem</div>
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="openBulletinDetailModal('${escapeHtml(a.id)}')">📖 Xem</button>
            <button class="btn btn-danger btn-sm" onclick="deleteAnnouncementAdmin('${escapeHtml(a.id)}')">🗑️ Xoá</button>
          </div>
        </td>
      </tr>
    `
    )
    .join("");
}

window.deleteAnnouncementAdmin = async function (annId) {
  try {
    const res = await fetch(`/api/v1/announcements/${encodeURIComponent(annId)}`, { method: "DELETE" });
    const data = await res.json();
    if (data && data.ok) {
      STATE.announcements = data.announcements;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      renderAllViews();
      showToast("Đã xoá thông báo khỏi Cổng Chung!");
      return;
    }
  } catch (_) {}
  STATE.announcements = (STATE.announcements || []).filter((a) => a.id !== annId);
  renderAllViews();
  showToast("Đã xoá thông báo khỏi Cổng Chung!");
};

// ==================== DEDICATED MEMBER ORGANIZATION WORKSPACES (VIEW-WORKSPACE) ====================
window.setPreviewTenantRole = function (roleCode) {
  STATE.previewTenantRole = roleCode;
  window.activeMemberSubTab = "overview";
  renderMemberWorkspace();
};

function renderMemberWorkspace() {
  const container = document.getElementById("memberWorkspaceDynamicContainer");
  if (!container) return;

  const actualRole = getCurrentRoleCode();
  const activeRole = actualRole === "super_admin" ? STATE.previewTenantRole || "ceo_sme" : actualRole;
  const subTab = window.activeMemberSubTab || "overview";

  // Find user matching activeRole so we only show the apps assigned to that role
  const roleUser =
    STATE.users.find((u) => u.role === activeRole) ||
    getCurrentUserObject();
  const allowedAppIds = (roleUser && roleUser.assignedApps) || [];
  const allowedAppsList = STATE.apps.filter((a) => allowedAppIds.includes(a.id));

  const roleTabsMap = {
    ceo_sme: [
      { id: "overview", label: "🏢 1. Tổng quan Doanh nghiệp" },
      { id: "apps", label: `🚀 2. Phần mềm Đã cấp phép (${allowedAppsList.length})` },
      { id: "recruitment", label: `👨‍💼 3. Tuyển dụng Liên thông & CV (${STATE.talents.length})` },
      { id: "b2b", label: "🎁 4. Chiến dịch E-Voucher & B2B" },
      { id: "news", label: "📢 5. Đăng Tin Đơn vị lên Public" }
    ],
    center_director: [
      { id: "overview", label: "🏫 1. Tổng quan Trung tâm" },
      { id: "apps", label: `🚀 2. Phần mềm Đã cấp phép (${allowedAppsList.length})` },
      { id: "contests", label: `🏆 3. Đấu trường Thi Online & Lead (${STATE.contests.length})` },
      { id: "b2b", label: "🤝 4. Hợp đồng Đào tạo DN (RFQ)" },
      { id: "news", label: "📢 5. Đăng Tin Đơn vị lên Public" }
    ],
    school_principal: [
      { id: "overview", label: "🎓 1. Tổng quan Học vụ & QR" },
      { id: "apps", label: `🚀 2. Phần mềm Đã cấp phép (${allowedAppsList.length})` },
      { id: "scholarships", label: "🎁 3. Duyệt Học bổng & Phúc lợi PH" },
      { id: "b2b", label: "🍱 4. Nhà cung ứng Học đường B2B" },
      { id: "news", label: "📢 5. Đăng Tin Đơn vị lên Public" }
    ],
    student_parent: [
      { id: "overview", label: "🏅 1. Hồ sơ Năng lực Số (Passport)" },
      { id: "apps", label: `🚀 2. Nền tảng Học & Thi Trực tuyến (${allowedAppsList.length})` },
      { id: "jobs", label: "💼 3. Ứng tuyển Thực tập 1-Click" },
      { id: "vouchers", label: "🎁 4. Ví Học bổng & E-Voucher" }
    ]
  };

  const tabsForRole = roleTabsMap[activeRole] || roleTabsMap.ceo_sme;
  const subTabNavHtml = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px;padding:10px 12px;background:#ffffff;border:1.5px solid #dbe6f5;border-radius:14px;">
      ${tabsForRole
        .map(
          (t) => `
          <button
            type="button"
            class="btn ${subTab === t.id ? "btn-primary" : "btn-outline"} btn-sm"
            onclick="activateAdminPanel('panel-role-workspace', '${t.id}')"
          >
            ${escapeHtml(t.label)}
          </button>
        `
        )
        .join("")}
    </div>
  `;

  const roleAppsHtml = `
    <div class="card" style="border:2px solid #0052d4;box-shadow:0 12px 28px rgba(0,82,212,0.12);">
      <div class="card-header">
        <div>
          <span class="badge badge-green">🚀 HỆ THỐNG PHẦN MỀM ĐƯỢC CẤP QUYỀN SSO CHO VAI TRÒ NÀY (${allowedAppsList.length} NỀN TẢNG LIVE)</span>
          <h3 class="card-title" style="margin-top:6px;">Danh sách các Ứng dụng Thực tế thuộc Phạm vi Quản trị của: ${escapeHtml((roleUser && roleUser.org) || "Đơn vị Thành viên")}</h3>
          <p class="card-subtitle">
            Tài khoản của vai trò <strong>${escapeHtml((roleUser && roleUser.roleBadge) || activeRole)}</strong> chỉ nhìn thấy và truy cập trực tiếp các hệ thống phần mềm được cấp phép dưới đây (các ứng dụng ngoài phạm vi vai trò được ẩn hoàn toàn):
          </p>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
        ${allowedAppsList
          .map((app) => {
            const meta = PRODUCT_SHOWCASE_META[app.id] || { icon: "🚀" };
            return `
              <div style="background:#f8fbff;border:1.5px solid #cfe2ff;border-radius:14px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:10px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                    <span style="font-size:20px;">${meta.icon}</span>
                    <span class="badge badge-green">● SSO Authorized</span>
                  </div>
                  <strong style="font-size:13.5px;color:#071936;display:block;">${escapeHtml(app.name)}</strong>
                  <p style="font-size:12px;color:#475569;margin-top:4px;line-height:1.45;">${escapeHtml(app.desc || "")}</p>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #dbeafe;">
                  <code style="font-size:11px;color:#0052d4;font-weight:700;">${escapeHtml(app.appUrl.replace("https://", ""))}</code>
                  <div style="display:flex;gap:6px;">
                    <a href="product.html?id=${encodeURIComponent(app.id)}" class="btn btn-outline btn-sm" style="text-decoration:none;">
                      Chi tiết
                    </a>
                    <a href="${escapeHtml(app.appUrl)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="text-decoration:none;">
                      Mở Hệ thống ↗
                    </a>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;

  const masterInspectorBar =
    actualRole === "super_admin"
      ? `
      <div class="card" style="background:linear-gradient(90deg,#fffdf5,#ffffff);border:2px solid #f59e0b;margin-bottom:18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <span class="badge badge-amber">👑 CHẾ ĐỘ GIÁM SÁT CỦA SUPER ADMIN</span>
            <h4 style="font-size:15px;font-weight:800;color:#0f172a;margin-top:4px;">
              Kiểm tra Giao diện Quản trị Cô lập của từng Vai trò Thành viên trong Hệ sinh thái:
            </h4>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn ${activeRole === "ceo_sme" ? "btn-primary" : "btn-outline"} btn-sm" onclick="setPreviewTenantRole('ceo_sme')">
              🏢 1. Workspace Chủ Doanh nghiệp SME
            </button>
            <button class="btn ${activeRole === "center_director" ? "btn-primary" : "btn-outline"} btn-sm" onclick="setPreviewTenantRole('center_director')">
              🏫 2. Workspace Giám đốc Trung tâm
            </button>
            <button class="btn ${activeRole === "school_principal" ? "btn-primary" : "btn-outline"} btn-sm" onclick="setPreviewTenantRole('school_principal')">
              🎓 3. Workspace Hiệu trưởng Trường
            </button>
            <button class="btn ${activeRole === "student_parent" ? "btn-primary" : "btn-outline"} btn-sm" onclick="setPreviewTenantRole('student_parent')">
              👨‍🎓 4. Cổng Học viên / Phụ huynh
            </button>
          </div>
        </div>
      </div>
    `
      : "";

  // TAB 2: PHẦN MỀM ĐÃ CẤP PHÉP (CHO TẤT CẢ CÁC VAI TRÒ)
  if (subTab === "apps") {
    container.innerHTML = `${masterInspectorBar}${subTabNavHtml}${roleAppsHtml}`;
    return;
  }

  // TAB 5: ĐĂNG BẢN TIN ĐƠN VỊ THÀNH VIÊN LÊN TRANG PUBLIC (CHO DOANH NGHIỆP, TRUNG TÂM, TRƯỜNG HỌC)
  if (subTab === "news") {
    const memberBulletins = (STATE.announcements || []).filter((a) => a.sourceType !== "master").map(enrichSingleAnnouncementItem);
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="grid-2">
        <div class="card" style="border:2px solid #0052d4;">
          <div class="card-header">
            <div>
              <span class="badge badge-blue">📢 PHÁT HÀNH NỘI DUNG TỪ ADMIN RA TRANG PUBLIC</span>
              <h3 class="card-title" style="margin-top:6px;">Đăng Bản tin / Sự kiện / Tuyển dụng của Đơn vị lên Trang Public</h3>
              <p class="card-subtitle">
                Đơn vị: <strong>${escapeHtml((roleUser && roleUser.org) || "Đơn vị Thành viên")}</strong> — Nội dung đăng từ đây sẽ hiển thị kèm hình ảnh đại diện và khung xem chi tiết trên Trang chủ Public.
              </p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Nhãn Chuyên mục / Đơn vị:</label>
              <input type="text" id="wsBulletinBadge" class="input-control" style="width:100%;" value="🌟 TIN TỪ ${escapeHtml(((roleUser && roleUser.org) || "ĐƠN VỊ THÀNH VIÊN").toUpperCase())}" />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Tiêu đề Bản tin / Sự kiện / Chương trình Ưu đãi:</label>
              <input type="text" id="wsBulletinTitle" class="input-control" style="width:100%;" placeholder="VD: Khai giảng khóa học mới / Tuyển dụng nhân sự / Ưu đãi nội bộ..." />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">🖼️ Đường dẫn Hình ảnh đại diện (URL ảnh hoặc để trống tự động chọn ảnh):</label>
              <input type="text" id="wsBulletinImageUrl" class="input-control" style="width:100%;" placeholder="https://images.unsplash.com/..." />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Nội dung tóm tắt (Hiển thị trên thẻ tin):</label>
              <textarea id="wsBulletinSummary" class="input-control" style="width:100%;min-height:66px;" placeholder="Nhập đoạn tóm tắt ngắn gọn..."></textarea>
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Nội dung bài viết chi tiết (Hiển thị khi bấm Xem tin chi tiết):</label>
              <textarea id="wsBulletinContent" class="input-control" style="width:100%;min-height:95px;" placeholder="Nhập toàn văn nội dung chương trình, thời gian áp dụng và quyền lợi dành cho thành viên hệ sinh thái..."></textarea>
            </div>
            <button type="button" class="btn btn-primary" onclick="submitWorkspaceMemberNews()" style="justify-content:center;padding:12px;">
              🚀 Phát hành Bản tin lên Trang Public Hệ sinh thái
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <span class="badge badge-green">📋 DANH SÁCH BẢN TIN ĐƠN VỊ ĐANG HIỂN THỊ TRÊN PUBLIC (${memberBulletins.length})</span>
              <h3 class="card-title" style="margin-top:6px;">Các Bản tin Thành viên Đã Đăng tải</h3>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${memberBulletins
              .map(
                (item) => `
                <div style="background:#f8fbff;border:1px solid #dbeafe;border-radius:12px;padding:12px;display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:center;">
                  <img
                    src="${escapeHtml(item.imageUrl)}"
                    alt="${escapeHtml(item.title)}"
                    style="width:110px;height:82px;object-fit:cover;border-radius:8px;cursor:pointer;"
                    onclick="openBulletinDetailModal('${escapeHtml(item.id)}')"
                  />
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
                      <span class="badge badge-blue">${escapeHtml(item.badge)}</span>
                      <span style="font-size:11px;color:#64748b;">🕒 ${escapeHtml(item.createdAt)}</span>
                    </div>
                    <strong style="font-size:13px;color:#0f172a;display:block;cursor:pointer;" onclick="openBulletinDetailModal('${escapeHtml(item.id)}')">${escapeHtml(item.title)}</strong>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                      <span style="font-size:11.5px;color:#0052d4;font-weight:700;">🏢 ${escapeHtml(item.authorOrg)}</span>
                      <button type="button" class="btn btn-outline btn-sm" onclick="openBulletinDetailModal('${escapeHtml(item.id)}')">📖 Xem chi tiết</button>
                    </div>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    return;
  }

  // TAB 4: GIAO THƯƠNG B2B & ĐĂNG TIN DIỄN ĐÀN TỪ ADMIN WORKSPACE (CHO DOANH NGHIỆP, TRUNG TÂM, TRƯỜNG HỌC)
  if (subTab === "b2b" && activeRole !== "student_parent") {
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="grid-2">
        <div class="card" style="border:2px solid #059669;">
          <div class="card-header">
            <div>
              <span class="badge badge-green">✍️ ĐĂNG TIN GIAO THƯƠNG B2B TỪ TRANG QUẢN TRỊ</span>
              <h3 class="card-title" style="margin-top:6px;">Tạo Chủ đề Hợp tác (RFQ) / Ưu đãi Chéo (Give-to-Get)</h3>
              <p class="card-subtitle">
                Đơn vị đăng: <strong>${escapeHtml((roleUser && roleUser.fullName) || "")} — ${escapeHtml((roleUser && roleUser.org) || "")}</strong>. Bài viết được gửi từ trang Quản trị và sau khi Super Admin duyệt sẽ hiển thị công khai trên Trang Public.
              </p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Chuyên mục Giao thương B2B:</label>
              <select id="wsForumCategory" class="select-control" style="width:100%;">
                <option value="rfq">📢 Cần Mua / Tìm Đối tác Nội bộ (RFQ)</option>
                <option value="spotlight">🎁 Quảng bá Sản phẩm & Đặc quyền Thành viên (Give-to-Get)</option>
                <option value="comarketing">🤝 Hợp tác Chéo & Đồng tổ chức Sự kiện</option>
                <option value="knowledge">💡 Chia sẻ Kinh nghiệm Quản trị & Chuyển đổi số</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Tiêu đề Tin Giao thương / Hợp tác:</label>
              <input type="text" id="wsForumTitle" class="input-control" style="width:100%;" placeholder="VD: [Nha Trang] Cần tìm đối tác đào tạo ngoại ngữ / Cung ứng dịch vụ..." />
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Nội dung chi tiết nhu cầu hoặc gói hợp tác:</label>
              <textarea id="wsForumContent" class="input-control" style="width:100%;min-height:85px;" placeholder="Mô tả chi tiết yêu cầu hợp tác giữa các đơn vị thành viên..."></textarea>
            </div>
            <div>
              <label style="font-size:12px;font-weight:700;color:#059669;display:block;margin-bottom:4px;">🎁 Ưu đãi cam kết dành cho Thành viên cùng Hệ sinh thái (Give-to-Get):</label>
              <input type="text" id="wsForumDeal" class="input-control" style="width:100%;border-color:#6ee7b7;background:#f0fdf4;" placeholder="VD: Giảm 25% chi phí dịch vụ cho các đơn vị thành viên TechCorp..." />
            </div>
            <button type="button" class="btn btn-emerald" onclick="submitWorkspaceForumPost()" style="justify-content:center;padding:12px;">
              🚀 Gửi Bài viết lên Diễn đàn Giao thương Hệ sinh thái
            </button>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <span class="badge badge-amber">🎁 ĐẶC QUYỀN & GÓI ƯU ĐÃI B2B ĐANG MỞ (${STATE.b2bOffers.length})</span>
              <h3 class="card-title" style="margin-top:6px;">Kết nối Giao thương Nội bộ Giữa Các Đơn vị Thành viên</h3>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${STATE.b2bOffers
              .map(
                (b) => `
                <div class="item-card">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                      <span class="badge badge-amber">${escapeHtml(b.category)}</span>
                      <span style="font-size:11.5px;color:#475569;">${escapeHtml(b.usingTech)}</span>
                    </div>
                    <h4>${escapeHtml(b.company)}</h4>
                    <p style="font-size:12.5px;color:#0f172a;margin-top:6px;">${escapeHtml(b.offer)}</p>
                    <p style="font-size:12px;color:#0052d4;margin-top:4px;">🎯 Áp dụng: ${escapeHtml(b.target)}</p>
                  </div>
                  <div style="display:flex;justify-content:flex-end;padding-top:8px;border-top:1px solid #e2e8f0;">
                    <button class="btn btn-primary btn-sm" onclick="connectB2B('${escapeHtml(b.company)}')">
                      🤝 Nhận Ưu đãi / Kết nối B2B
                    </button>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
    return;
  }

  // ==================== VAI TRÒ 2: CHỦ DOANH NGHIỆP SME (CEO_SME) ====================
  if (activeRole === "ceo_sme") {
    if (subTab === "recruitment") {
      container.innerHTML = `
        ${masterInspectorBar}
        ${subTabNavHtml}
        <div class="card" style="border:2px solid #0052d4;">
          <div class="card-header">
            <div>
              <span class="badge badge-blue">👨‍💼 TUYỂN DỤNG LIÊN THÔNG TỪ SÀN JOBAI & ĐẠI HỌC VỀ ERP HRM</span>
              <h3 class="card-title" style="margin-top:6px;">Kho Hồ sơ Ứng viên & Thực tập sinh Đã Xác thực Điểm Thi Online (${STATE.talents.length} Hồ sơ)</h3>
              <p class="card-subtitle">
                Chủ Doanh nghiệp & HR duyệt trực tiếp hồ sơ ứng viên từ Đại học Nha Trang, CĐ Du lịch và các Trung tâm Ngoại ngữ để đẩy 1-Click vào phân hệ Nhân sự (TechCorp ERP).
              </p>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="simulateCrossSync('erp-job')">
                📡 Phát Tin Tuyển dụng từ ERP sang Trường ĐH & Trung tâm
              </button>
              <a href="https://jobai.techcorp.info.vn/careers.html" target="_blank" rel="noopener" class="btn btn-emerald btn-sm" style="text-decoration:none;">
                🤖 Mở Sàn Việc làm JobAI ↗
              </a>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px;">
            ${STATE.talents
              .map(
                (t) => `
                <div class="item-card">
                  <div>
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                      <h4>${escapeHtml(t.name)} <code style="font-size:11.5px;color:#0052d4;">(${escapeHtml(t.id)})</code></h4>
                      <span class="badge badge-green">✔ Verified QR</span>
                    </div>
                    <p style="font-size:12.5px;color:#475569;margin-top:6px;">🎓 <strong>Trường:</strong> ${escapeHtml(t.school)}</p>
                    <p style="font-size:12.5px;color:#475569;">🏫 <strong>Trung tâm:</strong> ${escapeHtml(t.center)}</p>
                    <p style="font-size:13px;color:#0f172a;margin-top:6px;">🎯 <strong>Vị trí ứng tuyển:</strong> ${escapeHtml(t.targetRole)} (GPA: ${escapeHtml(t.gpa)})</p>
                    <div class="skill-tags" style="margin-top:8px;">
                      ${t.certs.map((c) => `<span class="badge badge-blue">${escapeHtml(c)}</span>`).join("")}
                    </div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #e2e8f0;">
                    <span style="font-size:12px;color:#059669;font-weight:700;">● ${escapeHtml(t.status)}</span>
                    <button class="btn btn-primary btn-sm" onclick="importCandidateToERP('${t.id}', '${escapeHtml(t.name)}')">
                      📥 Đẩy Hồ sơ vào HRM (ERP)
                    </button>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      `;
      return;
    }

    // Default subTab === 'overview' for ceo_sme
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="card">
        <div class="card-header">
          <div>
            <span class="badge badge-blue">🏢 WORKSPACE QUẢN TRỊ DOANH NGHIỆP THÀNH VIÊN (SME TENANT PORTAL)</span>
            <h3 class="card-title" style="margin-top:6px;">Đơn vị: Nha Trang Bay Resort & Hưng Phát Land — Quản trị bởi: Nguyễn Hải Đăng (CEO)</h3>
            <p class="card-subtitle">
              Giao diện dành riêng cho Chủ Doanh nghiệp quản lý gói phần mềm ERP/KPI/PMS/BĐS, tuyển dụng nhân sự từ các Trường ĐH/Trung tâm và phát hành ưu đãi B2B.
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'recruitment')">
              👨‍💼 Mở Sàn Tuyển dụng & CV (${STATE.talents.length})
            </button>
            <button class="btn btn-emerald btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'news')">
              📢 Đăng Thông báo Doanh nghiệp lên Public
            </button>
          </div>
        </div>

        <div class="grid-2-equal">
          <div class="item-card">
            <div>
              <h4>👨‍💼 1. Quản trị Tuyển dụng Liên thông (ERP HRM ↔ Trường học & Trung tâm)</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Danh sách ứng viên nổi bật đã xác thực chứng chỉ Ngoại ngữ & Tin học sẵn sàng nhận việc tại Doanh nghiệp:
              </p>
              <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">
                ${STATE.talents
                  .slice(0, 3)
                  .map(
                    (t) => `
                  <div style="background:#f5f9ff;border:1px solid #cfe2ff;padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong style="color:#0f172a;font-size:13px;">${escapeHtml(t.name)}</strong>
                      <div style="font-size:11.5px;color:#475569;">${escapeHtml(t.school)} • <span style="color:#0052d4;font-weight:700;">${escapeHtml(t.certs[0])}</span></div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="importCandidateToERP('${t.id}', '${escapeHtml(t.name)}')">Nhập vào HRM</button>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'recruitment')">Xem toàn bộ Hồ sơ Ứng viên →</button>
          </div>

          <div class="item-card">
            <div>
              <h4>🎁 2. Quản trị Chiến dịch Quảng bá & E-Voucher Nội bộ của Doanh nghiệp</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Phát hành ưu đãi độc quyền của Doanh nghiệp tới cộng đồng Phụ huynh, Giáo viên và các Doanh nghiệp khác trong hệ sinh thái:
              </p>
              <div style="background:#ecfdf5;border:1px solid #6ee7b7;padding:12px;border-radius:10px;margin-top:10px;font-size:12.5px;color:#065f46;">
                <strong>Đang chạy:</strong> Ưu đãi 25% gói Tour Dã ngoại Học sinh / Teambuilding Doanh nghiệp & Tặng E-Voucher nghỉ dưỡng cho Phụ huynh dùng Sổ liên lạc TechCorp.
              </div>
              <div style="margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;padding:10px 12px;border-radius:10px;font-size:12px;">
                <strong>🔑 Phân quyền nhân sự nội bộ Doanh nghiệp:</strong>
                <div style="color:#475569;margin-top:4px;">• Trưởng phòng Nhân sự (HR): Được quyền duyệt CV & đẩy tin tuyển dụng</div>
                <div style="color:#475569;">• Kế toán trưởng: Được quyền truy cập ERP Tài chính & đối soát công nợ B2B</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-emerald btn-sm" onclick="simulateCrossSync('parent-voucher')">🚀 Bắn E-Voucher sang App Phụ huynh</button>
              <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'b2b')">✍️ Đăng Tin B2B Mới →</button>
            </div>
          </div>
        </div>
      </div>
      ${roleAppsHtml}
    `;
    return;
  }

  // ==================== VAI TRÒ 3: GIÁM ĐỐC TRUNG TÂM NN-TH (CENTER_DIRECTOR) ====================
  if (activeRole === "center_director") {
    if (subTab === "contests") {
      container.innerHTML = `
        ${masterInspectorBar}
        ${subTabNavHtml}
        <div class="card" style="border:2px solid #0052d4;">
          <div class="card-header">
            <div>
              <span class="badge badge-blue">🏆 QUẢN LÝ ĐẤU TRƯỜNG THI THỬ TRỰC TUYẾN & ĐỒNG BỘ LEAD VỀ CRM TRUNG TÂM</span>
              <h3 class="card-title" style="margin-top:6px;">Danh sách Kỳ thi Năng lực Ngoại ngữ & Tin học trên TechCorp LMS (${STATE.contests.length} Kỳ thi)</h3>
              <p class="card-subtitle">
                Giám đốc Trung tâm điều phối các kỳ thi thử IELTS, TOEIC, MOS trực tuyến cho học sinh/sinh viên toàn tỉnh và kéo danh sách thí sinh tiềm năng (Lead) về CRM Tuyển sinh.
              </p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="simulateCrossSync('exam-cert')">
              ⚡ Phát Chứng chỉ Số QR & Chia Lead Tự động
            </button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px;">
            ${STATE.contests
              .map(
                (c) => `
                <div class="item-card">
                  <div>
                    <span class="badge badge-purple" style="margin-bottom:8px;">Phễu Tuyển sinh LMS</span>
                    <h4>${escapeHtml(c.title)}</h4>
                    <p style="font-size:12.5px;color:#475569;margin-top:6px;">🤝 <strong>Đơn vị tổ chức:</strong> ${escapeHtml(c.organizer)}</p>
                    <p style="font-size:12.5px;color:#475569;margin-top:4px;">👥 <strong>Đối tượng dự thi:</strong> ${escapeHtml(c.targetGroup)}</p>
                    <p style="font-size:12.5px;color:#059669;margin-top:4px;">🎁 <strong>Học bổng tài trợ:</strong> ${escapeHtml(c.reward)}</p>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #e2e8f0;">
                    <div>
                      <strong style="color:#0052d4;font-size:13px;">${c.participants.toLocaleString()} thí sinh</strong>
                      <div style="font-size:11.5px;color:#d97706;font-weight:700;">+${c.leadsGenerated} Lead học viên mới</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="pushLeadsToCenter('${c.id}', '${escapeHtml(c.title)}')">
                      📥 Đồng bộ Lead về CRM Trung tâm
                    </button>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      `;
      return;
    }

    // Default subTab === 'overview' for center_director
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="card">
        <div class="card-header">
          <div>
            <span class="badge badge-blue">🏫 WORKSPACE QUẢN TRỊ TRUNG TÂM ĐÀO TẠO (EDTECH CENTER PORTAL)</span>
            <h3 class="card-title" style="margin-top:6px;">Đơn vị: Ocean English & IT Center Nha Trang — Giám đốc: Trần Thanh Tâm</h3>
            <p class="card-subtitle">
              Giao diện dành riêng cho Giám đốc Trung tâm Ngoại ngữ - Tin học quản lý kỳ thi thử trên LMS, nhận Lead học viên từ Trường học và đề cử học viên giỏi sang Doanh nghiệp.
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'contests')">
              🏆 Quản lý Đấu trường Thi & Lead CRM
            </button>
            <button class="btn btn-emerald btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'news')">
              📢 Đăng Chương trình Học bổng lên Public
            </button>
          </div>
        </div>

        <div class="grid-2-equal">
          <div class="item-card">
            <div>
              <h4>🎯 1. Quản lý Phễu Thi Thử Trực tuyến & Đồng bộ Lead về CRM Trung tâm</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Các kỳ thi năng lực do Trung tâm tài trợ đề thi trên nền tảng Thi Online TechCorp:
              </p>
              <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">
                ${STATE.contests
                  .map(
                    (c) => `
                  <div style="background:#f5f9ff;border:1px solid #cfe2ff;padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong style="color:#0f172a;font-size:12.5px;">${escapeHtml(c.title)}</strong>
                      <div style="font-size:11.5px;color:#059669;font-weight:700;">+${c.leadsGenerated} Lead học viên mới chờ tư vấn</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="pushLeadsToCenter('${c.id}', '${escapeHtml(c.title)}')">Kéo Lead về CRM</button>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'contests')">Mở Chi tiết Đấu trường Thi Online →</button>
          </div>

          <div class="item-card">
            <div>
              <h4>🤝 2. Yêu cầu Đào tạo Nhân sự từ các Doanh nghiệp trong Hệ sinh thái (B2B RFQ)</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Các Doanh nghiệp SME đang tìm kiếm Trung tâm Ngoại ngữ - Tin học đào tạo nhân sự:
              </p>
              <div style="background:#fffbeb;border:1px solid #fcd34d;padding:12px;border-radius:10px;margin-top:10px;font-size:12.5px;color:#92400e;">
                <strong>🔥 Đang cần gấp:</strong> Nha Trang Bay Resort cần tìm Trung tâm đào tạo Tiếng Anh & Tiếng Hàn giao tiếp cho 25 nhân sự Lễ tân - Nhà hàng (Hợp đồng 12 tháng).
              </div>
            </div>
            <button class="btn btn-emerald btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'b2b')">💬 Gửi Báo giá Đào tạo trên Chợ B2B →</button>
          </div>
        </div>
      </div>
      ${roleAppsHtml}
    `;
    return;
  }

  // ==================== VAI TRÒ 4: HIỆU TRƯỞNG TRƯỜNG HỌC (SCHOOL_PRINCIPAL) ====================
  if (activeRole === "school_principal") {
    if (subTab === "scholarships") {
      container.innerHTML = `
        ${masterInspectorBar}
        ${subTabNavHtml}
        <div class="card" style="border:2px solid #0052d4;">
          <div class="card-header">
            <div>
              <span class="badge badge-blue">🎁 PHÊ DUYỆT HỌC BỔNG & PHÚC LỢI GỬI TỚI PHỤ HUYNH NHÀ TRƯỜNG</span>
              <h3 class="card-title" style="margin-top:6px;">Quản lý Gói Tài trợ Học bổng & Kiểm tra Năng lực Miễn phí cho Học sinh / Sinh viên</h3>
              <p class="card-subtitle">
                Ban Giám hiệu kiểm duyệt các chương trình học bổng từ Trung tâm Ngoại ngữ - Tin học & Doanh nghiệp thành viên trước khi phát hành thông báo qua Sổ liên lạc Điện tử tới Phụ huynh.
              </p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="background:#f5f9ff;border:1.5px solid #cfe2ff;padding:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
              <div>
                <span class="badge badge-green">✔ Đã xác thực Đối tác Giáo dục</span>
                <h4 style="font-size:15px;color:#0f172a;margin-top:6px;">1. Ocean English & IT Center: Tài trợ 120 suất Test Tiếng Anh chuẩn Cambridge & Học bổng 40%</h4>
                <p style="font-size:12.5px;color:#475569;margin-top:4px;">Áp dụng cho học sinh khối Tiểu học, THCS & THPT đạt điểm chuyên cần tốt trên hệ thống EduManager Pro.</p>
              </div>
              <button class="btn btn-emerald btn-sm" onclick="showToast('✅ Đã phê duyệt gửi 120 suất Học bổng Tiếng Anh tới Sổ liên lạc Điện tử của Phụ huynh!')">
                ✔ Phê duyệt Gửi Phụ huynh
              </button>
            </div>

            <div style="background:#f5f9ff;border:1.5px solid #cfe2ff;padding:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
              <div>
                <span class="badge badge-blue">✔ Đối tác Y tế Học đường</span>
                <h4 style="font-size:15px;color:#0f172a;margin-top:6px;">2. Hệ thống Nha khoa Quốc tế Sài Gòn - Nha Trang: Khám răng học đường miễn phí 100%</h4>
                <p style="font-size:12.5px;color:#475569;margin-top:4px;">Tài trợ toàn bộ chi phí khám & tư vấn chăm sóc răng miệng định kỳ học kỳ I cho 1.250 học sinh.</p>
              </div>
              <button class="btn btn-emerald btn-sm" onclick="showToast('✅ Đã xác nhận lịch phối hợp khám nha khoa học đường và thông báo cho Giáo viên chủ nhiệm!')">
                ✔ Duyệt Lịch Y tế Học đường
              </button>
            </div>

            <div style="background:#f5f9ff;border:1.5px solid #cfe2ff;padding:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
              <div>
                <span class="badge badge-amber">✔ Liên kết Trải nghiệm Hướng nghiệp</span>
                <h4 style="font-size:15px;color:#0f172a;margin-top:6px;">3. Nha Trang Bay Resort: Chương trình Tham quan Hướng nghiệp & Thực tập Sinh viên Năm cuối</h4>
                <p style="font-size:12.5px;color:#475569;margin-top:4px;">Tiếp nhận 35 sinh viên khối Du lịch - Nhà hàng - CNTT thực tập có hưởng phụ cấp và xét tuyển thẳng.</p>
              </div>
              <button class="btn btn-primary btn-sm" onclick="showToast('✅ Đã mở cổng đăng ký thực tập doanh nghiệp cho sinh viên năm cuối trên TC COMPASS!')">
                ✔ Mở Đăng ký Thực tập
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Default subTab === 'overview' for school_principal
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="card">
        <div class="card-header">
          <div>
            <span class="badge badge-blue">🎓 WORKSPACE QUẢN TRỊ TRƯỜNG HỌC THÀNH VIÊN (SCHOOL PORTAL)</span>
            <h3 class="card-title" style="margin-top:6px;">Đơn vị: Hệ thống Giáo dục Liên cấp & ĐH Nha Trang — Hiệu trưởng: ThS. Lê Thị Minh Hương</h3>
            <p class="card-subtitle">
              Giao diện dành riêng cho Ban Giám hiệu Nhà trường quản lý học vụ, thu học phí QR không tiền mặt, Sổ liên lạc Phụ huynh và phê duyệt gói tài trợ/thực tập từ Doanh nghiệp & Trung tâm.
            </p>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'scholarships')">
              🎁 Duyệt Học bổng & Phúc lợi PH
            </button>
            <button class="btn btn-emerald btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'news')">
              📢 Đăng Thông báo Sự kiện Nhà trường
            </button>
          </div>
        </div>

        <div class="grid-2-equal">
          <div class="item-card">
            <div>
              <h4>🎁 1. Phê duyệt Chương trình Học bổng & Phúc lợi gửi tới Phụ huynh Nhà trường</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Ban Giám hiệu kiểm duyệt các chương trình tài trợ từ Trung tâm Ngoại ngữ & Doanh nghiệp trước khi hiển thị trên Sổ liên lạc Điện tử của Phụ huynh:
              </p>
              <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">
                <div style="background:#f5f9ff;border:1px solid #cfe2ff;padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <strong style="font-size:12.5px;color:#0f172a;">Ocean English Center: Tặng 120 suất Test Tiếng Anh thiếu nhi</strong>
                    <div style="font-size:11.5px;color:#059669;">✔ Kèm học bổng 40% cho học sinh Trường Sao Biển</div>
                  </div>
                  <button class="btn btn-emerald btn-sm" onclick="showToast('Đã phê duyệt gửi thông báo học bổng tới Phụ huynh khối Tiểu học & Mầm non!')">✔ Duyệt gửi PH</button>
                </div>
                <div style="background:#f5f9ff;border:1px solid #cfe2ff;padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <strong style="font-size:12.5px;color:#0f172a;">Nha khoa Quốc tế Sài Gòn - Nha Trang: Khám răng miễn phí</strong>
                    <div style="font-size:11.5px;color:#059669;">✔ Tài trợ 100% cho Ngày hội Gia đình của Trường</div>
                  </div>
                  <button class="btn btn-emerald btn-sm" onclick="showToast('Đã xác nhận lịch phối hợp khám răng định kỳ tại trường!')">✔ Duyệt lịch</button>
                </div>
              </div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'scholarships')">Xem toàn bộ Danh sách Học bổng →</button>
          </div>

          <div class="item-card">
            <div>
              <h4>🍱 2. Kết nối Nhà cung ứng Học đường Chuẩn Xác thực trong Hệ sinh thái</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">
                Đặt dịch vụ Suất ăn bán trú, Xe đưa đón, Tour dã ngoại học sinh với mức chiết khấu nội bộ dành riêng cho Trường thành viên TechCorp:
              </p>
              <div style="background:#ecfdf5;border:1px solid #6ee7b7;padding:12px;border-radius:10px;margin-top:10px;font-size:12.5px;color:#065f46;">
                <strong>Ưu đãi đang mở:</strong> Giảm 12% hợp đồng suất ăn bán trú chuẩn VietGAP (Công ty Thực phẩm Biển Xanh Nha Trang) & Miễn 100% phí gạch nợ QR học phí từ Ngân hàng đối tác.
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'b2b')">🤝 Mở Chợ Giao thương B2B Học đường →</button>
          </div>
        </div>
      </div>
      ${roleAppsHtml}
    `;
    return;
  }

  // ==================== VAI TRÒ 5: HỌC VIÊN / SINH VIÊN / PHỤ HUYNH (STUDENT_PARENT) ====================
  if (subTab === "jobs") {
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="card" style="border:2px solid #0052d4;">
        <div class="card-header">
          <div>
            <span class="badge badge-blue">💼 ỨNG TUYỂN THỰC TẬP & VIỆC LÀM 1-CLICK TRÊN SÀN JOBAI</span>
            <h3 class="card-title" style="margin-top:6px;">Các Vị trí Thực tập & Tuyển dụng Đang Mở cho Hồ sơ Năng lực Số #TC-KH-8821</h3>
            <p class="card-subtitle">
              Hệ thống AI Matching tự động gợi ý các vị trí phù hợp với chứng chỉ TOEIC 750 & Quản trị ERP của bạn tại 30 Doanh nghiệp thành viên TechCorp.
            </p>
          </div>
          <a href="https://jobai.techcorp.info.vn/careers.html" target="_blank" rel="noopener" class="btn btn-primary btn-sm" style="text-decoration:none;">
            🤖 Mở Sàn Việc làm JobAI ↗
          </a>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:#f8fbff;border:1.5px solid #cfe2ff;padding:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <div>
              <span class="badge badge-green">Độ tương thích AI: 96%</span>
              <h4 style="font-size:15px;color:#0f172a;margin-top:6px;">1. Chuyên viên Quản trị Hệ thống ERP & Chuyển đổi số (Full-time / Thực tập)</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">🏢 <strong>Đơn vị:</strong> Nha Trang Bay Resort & Travel • 💰 Thu nhập: 10 - 15 triệu VNĐ/tháng</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="showToast('🚀 Đã gửi Hồ sơ Năng lực Số QR (#TC-KH-8821) tới Phòng Nhân sự Nha Trang Bay Resort!')">
              🚀 Ứng tuyển 1-Click
            </button>
          </div>

          <div style="background:#f8fbff;border:1.5px solid #cfe2ff;padding:16px;border-radius:14px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <div>
              <span class="badge badge-blue">Độ tương thích AI: 92%</span>
              <h4 style="font-size:15px;color:#0f172a;margin-top:6px;">2. Trợ lý Điều hành Dự án & Phân tích Dữ liệu Kinh doanh</h4>
              <p style="font-size:12.5px;color:#475569;margin-top:4px;">🏢 <strong>Đơn vị:</strong> Sàn Giao dịch BĐS Hưng Phát Land • 💰 Thu nhập: 12 - 18 triệu VNĐ/tháng</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="showToast('🚀 Đã gửi Hồ sơ Năng lực Số QR (#TC-KH-8821) tới Phòng Nhân sự Hưng Phát Land!')">
              🚀 Ứng tuyển 1-Click
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (subTab === "vouchers") {
    container.innerHTML = `
      ${masterInspectorBar}
      ${subTabNavHtml}
      <div class="card" style="border:2px solid #059669;">
        <div class="card-header">
          <div>
            <span class="badge badge-green">🎁 VÍ HỌC BỔNG & E-VOUCHER CÁ NHÂN (TECHCORP CITIZEN WALLET)</span>
            <h3 class="card-title" style="margin-top:6px;">Danh sách 05 Đặc quyền Học bổng & Ưu đãi Dịch vụ trong Ví TechCorp ID của Bạn</h3>
            <p class="card-subtitle">
              Sử dụng mã QR định danh cá nhân để kích hoạt học bổng và chiết khấu trực tiếp tại các Trung tâm Đào tạo & Doanh nghiệp thành viên.
            </p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;">
          <div style="background:#ecfdf5;border:1.5px solid #6ee7b7;padding:16px;border-radius:14px;">
            <span class="badge badge-green">Mã Voucher: TC-IELTS40</span>
            <h4 style="font-size:15px;color:#065f46;margin-top:8px;">🎁 Học bổng 40% Khóa Luyện thi IELTS / TOEIC Quốc tế</h4>
            <p style="font-size:12.5px;color:#047857;margin-top:6px;">Đơn vị tài trợ: Ocean English & IT Center Nha Trang</p>
            <button class="btn btn-emerald btn-sm" style="margin-top:10px;" onclick="showToast('✅ Đã kích hoạt mã Học bổng TC-IELTS40 cho tài khoản Nguyễn Minh Khôi!')">
              Sử dụng Học bổng
            </button>
          </div>

          <div style="background:#fffbeb;border:1.5px solid #fcd34d;padding:16px;border-radius:14px;">
            <span class="badge badge-amber">Mã Voucher: TC-DENTAL30</span>
            <h4 style="font-size:15px;color:#92400e;margin-top:8px;">🦷 Giảm 30% Dịch vụ Chăm sóc & Thẩm mỹ Nha khoa</h4>
            <p style="font-size:12.5px;color:#b45309;margin-top:6px;">Đơn vị tài trợ: Hệ thống Nha khoa Quốc tế Sài Gòn - Nha Trang</p>
            <button class="btn btn-primary btn-sm" style="margin-top:10px;" onclick="showToast('✅ Đã lấy mã QR ưu đãi Nha khoa TC-DENTAL30!')">
              Nhận Mã QR Ưu đãi
            </button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // Default subTab === 'overview' for student_parent
  container.innerHTML = `
    ${masterInspectorBar}
    ${subTabNavHtml}
    <div class="card">
      <div class="card-header">
        <div>
          <span class="badge badge-green">👨‍🎓 CỔNG CÔNG DÂN SỐ TECHCORP ID (SINH VIÊN / HỌC VIÊN / PHỤ HUYNH)</span>
          <h3 class="card-title" style="margin-top:6px;">Hồ sơ Năng lực Số: Nguyễn Minh Khôi — Sinh viên Năm cuối ĐH Nha Trang (#TC-KH-8821)</h3>
          <p class="card-subtitle">
            Giao diện dành riêng cho Học viên, Sinh viên và Phụ huynh theo dõi kết quả học tập, Chứng chỉ Thi Online QR, ứng tuyển thực tập/việc làm 1-Click và nhận E-Voucher ưu đãi.
          </p>
        </div>
      </div>

      <div class="grid-2-equal">
        <div class="item-card">
          <div>
            <h4>🏅 1. Hồ sơ Năng lực Số & Chứng chỉ Xác thực (Verified Talent Passport)</h4>
            <p style="font-size:12.5px;color:#475569;margin-top:4px;">
              Điểm thi và chứng chỉ của bạn được xác thực tự động từ Trường Đại học & Trung tâm Ngoại ngữ - Tin học:
            </p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
              <span class="badge badge-blue">✔ TOEIC 750 (Xác thực Thi Online)</span>
              <span class="badge badge-blue">✔ Quản trị Hệ thống TechCorp ERP</span>
              <span class="badge badge-green">✔ GPA: 3.5 / 4.0 (ĐH Nha Trang)</span>
            </div>
            <div style="margin-top:12px;background:#f5f9ff;border:1px solid #cfe2ff;padding:12px;border-radius:10px;font-size:12.5px;">
              <strong>Trạng thái Hồ sơ:</strong> Đã mở hiển thị cho <strong>30 Doanh nghiệp SME & Resort tại Nha Trang</strong> trên Sàn Nhân lực.
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'jobs')">
            💼 Xem Vị trí Thực tập & Ứng tuyển 1-Click →
          </button>
        </div>

        <div class="item-card">
          <div>
            <h4>🎁 2. Ví Học bổng & E-Voucher Đặc quyền Thành viên TechCorp ID</h4>
            <p style="font-size:12.5px;color:#475569;margin-top:4px;">
              Các ưu đãi giảm học phí và dịch vụ dành riêng cho tài khoản TechCorp ID của bạn:
            </p>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">
              <div style="background:#ecfdf5;border:1px solid #6ee7b7;padding:10px 12px;border-radius:10px;font-size:12px;color:#065f46;">
                🎁 <strong>Học bổng 40% Khóa IELTS/TOEIC</strong> tại Ocean English & IT Center Nha Trang
              </div>
              <div style="background:#fffbeb;border:1px solid #fcd34d;padding:10px 12px;border-radius:10px;font-size:12px;color:#92400e;">
                🦷 <strong>Giảm 30% Dịch vụ Nha khoa</strong> tại Hệ thống Nha khoa Quốc tế Sài Gòn - Nha Trang
              </div>
            </div>
          </div>
          <button class="btn btn-emerald btn-sm" onclick="activateAdminPanel('panel-role-workspace', 'vouchers')">🎁 Mở Ví Học bổng & E-Voucher →</button>
        </div>
      </div>
    </div>
    ${roleAppsHtml}
  `;
}

// ==================== INTERACTIVE RBAC PERMISSION MATRIX (SUB-PANEL 5.1) ====================
function renderRbacMatrixTable() {
  const tbody = document.getElementById("rbacMatrixTableBody");
  if (!tbody) return;

  const roleOrder = ["super_admin", "ceo_sme", "center_director", "school_principal", "student_parent"];

  tbody.innerHTML = RBAC_PERMISSION_LABELS.map((row) => {
    const cells = roleOrder
      .map((rCode) => {
        const rObj = STATE.rbacMatrix[rCode] || {};
        const checked = Boolean(rObj.permissions && rObj.permissions[row.key]);
        const isSuperLock = rCode === "super_admin" && row.key === "manageAppsUsersRbac";
        return `
          <td>
            <input
              type="checkbox"
              class="rbac-cb"
              ${checked ? "checked" : ""}
              ${isSuperLock ? "disabled title='Hệ sinh thái TechCorp luôn giữ quyền quản trị RBAC tối cao'" : ""}
              onchange="toggleRbacPermission('${rCode}', '${row.key}', this.checked)"
            />
          </td>
        `;
      })
      .join("");

    return `
      <tr>
        <td>
          <strong style="color:#0b2559;font-size:13px;">${escapeHtml(row.label)}</strong>
          <div style="font-size:11.5px;color:#64748b;">${escapeHtml(row.desc)}</div>
        </td>
        ${cells}
      </tr>
    `;
  }).join("");
}

window.toggleRbacPermission = async function (roleCode, permKey, value) {
  if (STATE.rbacMatrix[roleCode] && STATE.rbacMatrix[roleCode].permissions) {
    STATE.rbacMatrix[roleCode].permissions[permKey] = Boolean(value);
  }

  try {
    const res = await fetch("/api/v1/rbac", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleCode,
        permKey,
        value: Boolean(value),
        actorKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.rbacMatrix = data.rbacMatrix;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
    }
  } catch (_) {
    recordLocalAuditLog(
      "RBAC_PERMISSION_UPDATE",
      `${roleCode} -> ${permKey}`,
      "WARNING",
      `Cập nhật phân quyền RBAC: ${permKey} = ${value ? "ALLOW" : "DENY"}`
    );
  }

  renderAllViews();
  const rName = (STATE.rbacMatrix[roleCode] && STATE.rbacMatrix[roleCode].roleName) || roleCode;
  showToast(
    `🔐 Đã cập nhật phân quyền RBAC cho <b>${escapeHtml(rName)}</b>: <code>${escapeHtml(permKey)} = ${
      value ? "CHO PHÉP" : "KHÓA"
    }</code>!`
  );
};

// ==================== TABS, ROLE SWITCHER & SERVER BOOTSTRAP ====================
function setupTabs() {
  const buttons = document.querySelectorAll(".nav-btn, .tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      if (!target) return;
      buttons.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });

  const subBtns = document.querySelectorAll(".admin-subbtn");
  const subPanels = document.querySelectorAll(".admin-subpanel");
  subBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-subtab");
      subBtns.forEach((b) => b.classList.remove("active"));
      subPanels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(target)?.classList.add("active");
    });
  });
}

function setupForumCategoryFilter() {
  const bar = document.getElementById("forumCategoryBar");
  if (!bar) return;
  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".forum-cat-btn");
    if (!btn) return;
    STATE.selectedForumCategory = btn.getAttribute("data-cat") || "all";
    bar.querySelectorAll(".forum-cat-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderForumPosts();
  });
}

window.logoutSsoSession = async function () {
  try {
    const raw = localStorage.getItem("tc_sso_session");
    const sess = raw ? JSON.parse(raw) : {};
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaKey: sess.personaKey, email: sess.email })
    }).catch(() => {});
  } catch (_) {}
  try {
    localStorage.removeItem("tc_sso_session");
  } catch (_) {}
  const isAdminPage = Boolean(document.getElementById("dynamicRoleSidebarNav"));
  if (isAdminPage) {
    window.location.replace("login.html");
  } else {
    window.location.reload();
  }
};

function persistRoleSessionToStorage(personaKey) {
  try {
    const p = STATE.personas[personaKey];
    const u = STATE.users.find((x) => x.personaKey === personaKey);
    if (p) {
      localStorage.setItem(
        "tc_sso_session",
        JSON.stringify({
          personaKey,
          roleCode: PERSONA_TO_ROLE[personaKey] || "super_admin",
          email: (u && u.email) || "admin@techcorp.info.vn",
          name: p.name,
          org: p.org,
          roleBadge: p.roleBadge,
          loginAt: new Date().toISOString()
        })
      );
    }
  } catch (_) {}
}

window.selectPersonaRole = async function (val) {
  STATE.currentPersona = val;
  persistRoleSessionToStorage(val);

  const select = document.getElementById("personaSelect");
  if (select && select.value !== val) {
    select.value = val;
  }

  // Dynamically switch the active Admin Portal Workspace to match the selected Role
  if (val === "super-admin") {
    window.activeAdminPanelId = "panel-master-overview";
  } else {
    window.activeAdminPanelId = "panel-role-workspace";
    window.activeMemberSubTab = "overview";
  }

  const infoEl = document.getElementById("currentPersonaDesc");
  const tokenBox = document.getElementById("currentSsoTokenBox");
  const forumIdEl = document.getElementById("forumComposerIdentity");

  try {
    const res = await fetch("/api/v1/sso/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personaKey: val })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.ssoToken = data.token;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      if (tokenBox) tokenBox.textContent = data.token;
    }
  } catch (_) {
    recordLocalAuditLog("SSO_SWITCH", val, "INFO", `Chuyển đổi phiên làm việc SSO sang ${val}.`);
  }

  const p = STATE.personas[val];
  if (p) {
    if (infoEl) infoEl.textContent = `${p.org} • [${p.roleBadge}]`;
    if (forumIdEl) forumIdEl.textContent = `${p.name} • ${p.org}`;
    const ssoBadge = document.getElementById("tcEcoSsoStatus");
    if (ssoBadge) {
      ssoBadge.textContent = `🔐 ${p.name} (${p.roleBadge})`;
    }
    showToast(`🎭 Đang mở Cổng Quản trị theo vai trò: <b>${escapeHtml(p.name)}</b>`);
  }

  renderAllViews();
  window.activateAdminPanel(window.activeAdminPanelId, window.activeMemberSubTab);
};

function setupPersonaSwitcher() {
  const select = document.getElementById("personaSelect");
  if (!select) return;
  select.addEventListener("change", () => {
    window.selectPersonaRole(select.value);
  });
}

function mergeLocalDemoRequests() {
  try {
    const raw = localStorage.getItem("tc_hub_demo_requests_v1");
    if (!raw) return;
    const localList = JSON.parse(raw);
    if (!Array.isArray(localList)) return;
    if (!Array.isArray(STATE.demoRequests)) {
      STATE.demoRequests = [];
    }
    localList.forEach((item) => {
      if (item && item.id && !STATE.demoRequests.some((x) => x.id === item.id)) {
        STATE.demoRequests.unshift(item);
      }
    });
  } catch (_) {}
}

function syncDemoRequestsToLocal() {
  try {
    localStorage.setItem("tc_hub_demo_requests_v1", JSON.stringify(STATE.demoRequests || []));
  } catch (_) {}
}

window.renderAdminDemoRequestsTable = function () {
  mergeLocalDemoRequests();
  const tbody = document.getElementById("adminDemoRequestsTableBody");
  const kpiRow = document.getElementById("adminDemoKpiRow");
  const list = STATE.demoRequests || [];

  if (kpiRow) {
    const countNew = list.filter((x) => x.status === "new").length;
    const countContacted = list.filter((x) => x.status === "contacted").length;
    const countScheduled = list.filter((x) => x.status === "scheduled").length;
    const countCompleted = list.filter((x) => x.status === "completed").length;

    kpiRow.innerHTML = `
      <div class="kpi-card">
        <span class="label">📋 Tổng Yêu cầu Đăng ký Demo</span>
        <div class="value" style="color:#0052d4;">${list.length} Khách hàng</div>
        <div class="sub">Từ 16 trang giới thiệu sản phẩm</div>
      </div>
      <div class="kpi-card">
        <span class="label">🆕 Mới đăng ký (Cần gọi ngay)</span>
        <div class="value" style="color:#dc2626;">${countNew}</div>
        <div class="sub">SLA phản hồi trong 15 phút</div>
      </div>
      <div class="kpi-card">
        <span class="label">📅 Đã liên hệ &amp; Hẹn lịch Demo</span>
        <div class="value" style="color:#d97706;">${countContacted + countScheduled}</div>
        <div class="sub">${countScheduled} lịch hẹn Demo 1-1</div>
      </div>
      <div class="kpi-card">
        <span class="label">✅ Đã Cấp Demo &amp; Chốt Triển khai</span>
        <div class="value" style="color:#059669;">${countCompleted}</div>
        <div class="sub">Chuyển đổi thành Đơn vị Thành viên</div>
      </div>
    `;
  }

  if (!tbody) return;

  const statusFilter = (document.getElementById("adminDemoStatusFilter") || {}).value || "all";
  const kw = (((document.getElementById("adminDemoSearchInput") || {}).value) || "").toLowerCase().trim();

  const filtered = list.filter((item) => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    const matchKw =
      !kw ||
      (item.id || "").toLowerCase().includes(kw) ||
      (item.fullName || "").toLowerCase().includes(kw) ||
      (item.phone || "").toLowerCase().includes(kw) ||
      (item.email || "").toLowerCase().includes(kw) ||
      (item.orgName || "").toLowerCase().includes(kw) ||
      (item.productName || "").toLowerCase().includes(kw) ||
      (item.notes || "").toLowerCase().includes(kw);
    return matchStatus && matchKw;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:24px;color:#64748b;">
          Không tìm thấy yêu cầu đăng ký Demo nào phù hợp với bộ lọc hiện tại.
        </td>
      </tr>
    `;
    return;
  }

  const STATUS_META = {
    new: { badgeClass: "badge-red", label: "🆕 Mới đăng ký" },
    contacted: { badgeClass: "badge-blue", label: "📞 Đã liên hệ" },
    scheduled: { badgeClass: "badge-amber", label: "📅 Đã hẹn lịch Demo" },
    completed: { badgeClass: "badge-green", label: "✅ Đã cấp Demo / Chốt" }
  };

  tbody.innerHTML = filtered
    .map((item) => {
      const st = STATUS_META[item.status] || STATUS_META.new;
      return `
        <tr>
          <td>
            <code style="font-size:12px;font-weight:800;color:#0052d4;">${escapeHtml(item.id)}</code>
            <div style="font-size:11.5px;color:#475569;margin-top:3px;">🕒 ${escapeHtml(item.createdAt || "Vừa xong")}</div>
            <div style="font-size:11px;color:#94a3b8;margin-top:2px;">IP: ${escapeHtml(item.ipAddress || "103.170.122.138")}</div>
          </td>
          <td>
            <strong style="font-size:13.5px;color:#0f172a;">${escapeHtml(item.fullName)}</strong>
            <div style="font-size:12px;font-weight:700;color:#0284c7;margin-top:2px;">🏢 ${escapeHtml(item.orgName)}</div>
            <div style="font-size:11.5px;color:#334155;margin-top:3px;">
              📞 <strong>${escapeHtml(item.phone)}</strong> • ✉️ ${escapeHtml(item.email || "Chưa cung cấp")}
            </div>
            <div style="font-size:11px;color:#64748b;margin-top:2px;">Quy mô: ${escapeHtml(item.orgScale || "50 - 200 nhân sự")}</div>
          </td>
          <td>
            <span class="badge badge-blue" style="margin-bottom:4px;display:inline-block;">Mã: ${escapeHtml((item.productId || "erp").toUpperCase())}</span>
            <div style="font-weight:700;font-size:12.5px;color:#0f172a;">${escapeHtml(item.productName)}</div>
            <div style="margin-top:4px;display:flex;gap:8px;flex-wrap:wrap;">
              <a href="product.html?id=${encodeURIComponent(item.productId || "erp")}" target="_blank" style="font-size:11.5px;color:#059669;font-weight:700;text-decoration:none;">📖 Trang Giới thiệu ↗</a>
              <a href="${escapeHtml(item.appUrl || "https://hesinhthai.techcorp.info.vn")}" target="_blank" style="font-size:11.5px;color:#0052d4;font-weight:700;text-decoration:none;">🚀 Hệ thống Live ↗</a>
            </div>
          </td>
          <td style="max-width:270px;">
            <div style="font-size:12px;font-weight:700;color:#d97706;">🗓️ Hẹn: ${escapeHtml(item.preferredTime || "Trong giờ hành chính")}</div>
            <div style="font-size:12px;color:#334155;margin-top:4px;line-height:1.45;">💬 "${escapeHtml(item.notes || "")}"</div>
          </td>
          <td style="min-width:220px;">
            <div style="margin-bottom:6px;"><span class="badge ${st.badgeClass}">${st.label}</span></div>
            <select
              class="select-control"
              style="width:100%;font-size:12px;padding:5px 8px;margin-bottom:6px;"
              onchange="updateDemoLeadStatus('${escapeHtml(item.id)}', this.value)"
            >
              <option value="new" ${item.status === "new" ? "selected" : ""}>🆕 Mới đăng ký</option>
              <option value="contacted" ${item.status === "contacted" ? "selected" : ""}>📞 Đã liên hệ / Gửi TK</option>
              <option value="scheduled" ${item.status === "scheduled" ? "selected" : ""}>📅 Đã hẹn lịch Demo</option>
              <option value="completed" ${item.status === "completed" ? "selected" : ""}>✅ Đã cấp Demo / Chốt</option>
            </select>
            <div style="display:flex;gap:4px;">
              <input
                type="text"
                id="demoNoteInput-${escapeHtml(item.id)}"
                class="input-control"
                style="font-size:11.5px;padding:5px 8px;flex:1;"
                placeholder="Ghi chú chăm sóc khách hàng..."
                value="${escapeHtml(item.adminNote || "")}"
              />
              <button class="btn btn-outline btn-sm" onclick="saveDemoLeadAdminNote('${escapeHtml(item.id)}')" title="Lưu ghi chú">💾</button>
            </div>
          </td>
          <td>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <a href="tel:${escapeHtml((item.phone || "").replace(/[^0-9+]/g, ""))}" class="btn btn-primary btn-sm" style="text-decoration:none;text-align:center;">
                📞 Gọi / Zalo
              </a>
              <button class="btn btn-danger btn-sm" onclick="deleteDemoLead('${escapeHtml(item.id)}')">
                🗑️ Xoá
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

window.updateDemoLeadStatus = async function (leadId, newStatus) {
  const lead = (STATE.demoRequests || []).find((x) => x.id === leadId);
  if (!lead) return;
  lead.status = newStatus;
  syncDemoRequestsToLocal();

  try {
    const res = await fetch(`/api/v1/demo-requests/${encodeURIComponent(leadId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.demoRequests)) {
      STATE.demoRequests = data.demoRequests;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncDemoRequestsToLocal();
    }
  } catch (_) {
    recordLocalAuditLog(
      "DEMO_REQUEST_UPDATE",
      `${lead.id}: ${lead.fullName}`,
      "INFO",
      `Cập nhật trạng thái chăm sóc khách hàng Demo sang: ${newStatus}`
    );
  }

  renderAllViews();
  showToast(`✅ Đã cập nhật trạng thái chăm sóc khách hàng <b>${escapeHtml(lead.fullName)}</b>!`);
};

window.saveDemoLeadAdminNote = async function (leadId) {
  const lead = (STATE.demoRequests || []).find((x) => x.id === leadId);
  if (!lead) return;
  const noteInput = document.getElementById(`demoNoteInput-${leadId}`);
  const adminNote = noteInput ? noteInput.value.trim() : "";
  lead.adminNote = adminNote;
  syncDemoRequestsToLocal();

  try {
    const res = await fetch(`/api/v1/demo-requests/${encodeURIComponent(leadId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNote, actorKey: STATE.currentPersona })
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.demoRequests)) {
      STATE.demoRequests = data.demoRequests;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncDemoRequestsToLocal();
    }
  } catch (_) {
    recordLocalAuditLog("DEMO_REQUEST_NOTE", `${lead.id}: ${lead.fullName}`, "INFO", `Ghi chú Admin: ${adminNote}`);
  }

  renderAllViews();
  showToast(`💾 Đã lưu ghi chú chăm sóc cho khách hàng <b>${escapeHtml(lead.fullName)}</b>!`);
};

window.deleteDemoLead = async function (leadId) {
  const lead = (STATE.demoRequests || []).find((x) => x.id === leadId);
  if (!lead) return;
  if (!confirm(`Bạn có chắc chắn muốn xoá yêu cầu đăng ký Demo của "${lead.fullName}" (${lead.orgName})?`)) {
    return;
  }

  STATE.demoRequests = (STATE.demoRequests || []).filter((x) => x.id !== leadId);
  syncDemoRequestsToLocal();

  try {
    const res = await fetch(`/api/v1/demo-requests/${encodeURIComponent(leadId)}`, {
      method: "DELETE"
    });
    const data = await res.json();
    if (data && data.ok && Array.isArray(data.demoRequests)) {
      STATE.demoRequests = data.demoRequests;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      syncDemoRequestsToLocal();
    }
  } catch (_) {
    recordLocalAuditLog("DEMO_REQUEST_DELETE", `${lead.id}: ${lead.fullName}`, "WARNING", "Xoá yêu cầu đăng ký Demo.");
  }

  renderAllViews();
  showToast(`🗑️ Đã xoá yêu cầu đăng ký Demo mã <b>${escapeHtml(leadId)}</b>!`);
};

window.exportDemoLeadsCsv = function () {
  const list = STATE.demoRequests || [];
  const headers = [
    "MaPhieu",
    "ThoiGianDangKy",
    "HoTenKhachHang",
    "SoDienThoai",
    "Email",
    "DonViToChuc",
    "QuyMo",
    "MaSanPham",
    "TenSanPham",
    "LichHenDemo",
    "YeuCauChiTiet",
    "TrangThai",
    "GhiChuAdmin"
  ];
  const rows = list.map((x) => [
    x.id,
    `"${(x.createdAt || "").replace(/"/g, '""')}"`,
    `"${(x.fullName || "").replace(/"/g, '""')}"`,
    `"${(x.phone || "").replace(/"/g, '""')}"`,
    `"${(x.email || "").replace(/"/g, '""')}"`,
    `"${(x.orgName || "").replace(/"/g, '""')}"`,
    `"${(x.orgScale || "").replace(/"/g, '""')}"`,
    x.productId || "",
    `"${(x.productName || "").replace(/"/g, '""')}"`,
    `"${(x.preferredTime || "").replace(/"/g, '""')}"`,
    `"${(x.notes || "").replace(/"/g, '""')}"`,
    x.status || "new",
    `"${(x.adminNote || "").replace(/"/g, '""')}"`
  ]);
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `TechCorp_KhachHang_DangKy_Demo_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("📥 Đã xuất danh sách Khách hàng Đăng ký Demo (CSV) thành công!");
};

window.selectPricingPreset = function (customerType, scaleVal) {
  const typeSelect = document.getElementById("calcCustomerType");
  const scaleInput = document.getElementById("calcScaleInput");
  if (typeSelect) typeSelect.value = customerType || "sme";
  if (scaleInput) scaleInput.value = String(scaleVal || 30);
  if (typeof window.calculateComboPrice === "function") {
    window.calculateComboPrice();
  }
  const resultBox = document.getElementById("calcResultBox");
  if (resultBox) {
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  showToast("💳 Đã áp dụng cấu hình gói mẫu vào Công cụ Tính Giá Combo!");
};

window.submitPublicContactForm = async function (event) {
  if (event) event.preventDefault();

  const fullName = document.getElementById("contactFullName")?.value.trim() || "";
  const phone = document.getElementById("contactPhone")?.value.trim() || "";
  const email = document.getElementById("contactEmail")?.value.trim() || "";
  const orgScale = document.getElementById("contactOrgScale")?.value || "50 - 200 nhân sự / học sinh";
  const orgName = document.getElementById("contactOrgName")?.value.trim() || "";
  const productId = document.getElementById("contactProductId")?.value || "erp";
  const preferredTime = document.getElementById("contactPreferredTime")?.value.trim() || "Trong giờ hành chính";
  const notes = document.getElementById("contactNotes")?.value.trim() || "Liên hệ tư vấn giải pháp & nhận tài khoản Demo từ Trang Liên hệ.";

  if (!fullName || !phone || !orgName) {
    showToast(`<span style="color:#d97706">Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Tên đơn vị!</span>`);
    return;
  }

  const matchedApp = (STATE.apps || []).find((a) => a.id === productId);
  const productName = matchedApp ? matchedApp.name : "Tư vấn Giải pháp Combo Hệ sinh thái TechCorp";
  const appUrl = matchedApp ? matchedApp.appUrl : "https://hesinhthai.techcorp.info.vn";

  const btn = document.getElementById("contactSubmitBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "⏳ Đang gửi thông tin liên hệ...";
  }

  let createdLead = null;
  try {
    const res = await fetch("/api/v1/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        phone,
        email,
        orgName,
        orgScale,
        productId,
        productName,
        appUrl,
        preferredTime,
        notes
      })
    });
    const data = await res.json();
    if (data && data.ok && data.lead) {
      createdLead = data.lead;
      if (Array.isArray(data.demoRequests)) {
        STATE.demoRequests = data.demoRequests;
        syncDemoRequestsToLocal();
      }
    }
  } catch (_) {}

  if (!createdLead) {
    createdLead = {
      id: "DEMO-" + String(Date.now()).slice(-6),
      fullName,
      phone,
      email,
      orgName,
      orgScale,
      productId,
      productName,
      appUrl,
      preferredTime,
      notes,
      status: "new",
      adminNote: "",
      ipAddress: "103.170.122.138",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19)
    };
    STATE.demoRequests.unshift(createdLead);
    syncDemoRequestsToLocal();
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = "📨 Gửi Thông tin Liên hệ & Đăng ký Tư vấn Ngay";
  }

  const successBox = document.getElementById("publicContactSuccessBox");
  const codeEl = document.getElementById("publicContactSuccessCode");
  if (codeEl && createdLead.id) {
    codeEl.textContent = `Mã phiếu: ${createdLead.id}`;
  }
  if (successBox) {
    successBox.style.display = "block";
  }

  const formEl = document.getElementById("publicContactDemoForm");
  if (formEl) formEl.reset();

  renderAllViews();
  showToast(`✅ Đã gửi thông tin liên hệ của <b>${escapeHtml(fullName)}</b> về Hệ sinh thái TechCorp!`);
};

function sanitizeStateTerminology() {
  if (Array.isArray(STATE.announcements)) {
    const defaultExtras = [
      {
        id: "ANN-MASTER-03",
        sourceType: "master",
        badge: "🤖 NÂNG CẤP CÔNG NGHỆ • HỆ SINH THÁI TECHCORP",
        title: "Ra mắt Cổng đồng bộ 1-Click từ Sàn Tuyển dụng HireMind AI (jobai.techcorp.info.vn) sang Phân hệ HRM trên TechCorp ERP",
        summary: "Tích hợp công nghệ AI ATS đa ngôn ngữ tự động phân tích độ khớp CV – JD, xác thực điểm thi trực tuyến từ TechCorp LMS và đẩy hồ sơ ứng viên 1-Click về phân hệ HRM trên TechCorp ERP.",
        authorName: "Hệ sinh thái TechCorp",
        authorOrg: "Trung tâm R&D AI & Cloud TechCorp",
        createdAt: "Hôm qua, 15:20",
        pinned: false,
        actionLabel: "Xem Sàn Nhân lực & LMS",
        actionView: "forum"
      },
      {
        id: "ANN-MASTER-04",
        sourceType: "master",
        badge: "💳 LIÊN THÔNG THANH TOÁN QR ĐỘNG KHÔNG TIỀN MẶT",
        title: "Tích hợp Cổng gạch nợ Học phí & Hóa đơn tự động 3 giây cho toàn bộ Khối Trường học K-12 và Trung tâm Ngoại ngữ",
        summary: "Miễn phí 100% phí thiết lập cổng thanh toán VietQR động cho các trường Mầm non, Tiểu học, THCS, THPT, GDTX và Trung tâm đào tạo thuộc Hệ sinh thái TechCorp.",
        authorName: "Ban Điều hành Hệ sinh thái TechCorp",
        authorOrg: "Ban Tài chính & Đối tác Ngân hàng TechCorp",
        createdAt: "2 ngày trước",
        pinned: false,
        actionLabel: "Liên hệ Tư vấn & Demo",
        actionView: "contact"
      },
      {
        id: "ANN-MASTER-05",
        sourceType: "master",
        badge: "🛡️ TIÊU CHUẨN CHẤT LƯỢNG • ISO 9001:2015 & ISO 27001",
        title: "Chuẩn hóa Quy trình Bảo mật Dữ liệu Đa tầng & Ký số Học bạ Điện tử toàn Hệ sinh thái TechCorp",
        summary: "100% cơ sở giáo dục và doanh nghiệp thành viên được trang bị không gian quản trị riêng biệt theo phân quyền RBAC 9x5, sao lưu tự động MySQL/SQLite thời gian thực và hỗ trợ kỹ thuật 24/7.",
        authorName: "Ban Điều hành Hệ sinh thái TechCorp",
        authorOrg: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
        createdAt: "3 ngày trước",
        pinned: false,
        actionLabel: "Đăng ký Tư vấn Bảo mật",
        actionView: "contact"
      },
      {
        id: "ANN-MEM-03",
        sourceType: "member",
        badge: "🎓 TIN TỪ KHỐI TRƯỜNG HỌC THÀNH VIÊN (K-12)",
        title: "Hệ thống Giáo dục Sao Biển Nha Trang tổ chức Ngày hội Trải nghiệm Công nghệ AI & Kỹ năng Số cho 800 Phụ huynh Học sinh",
        summary: "Mời các Doanh nghiệp Du lịch, F&B, Y tế và Trung tâm Ngoại ngữ trong Hệ sinh thái TechCorp đăng ký gian hàng trải nghiệm và phát hành E-Voucher trên Sổ liên lạc điện tử.",
        authorName: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
        authorOrg: "Hệ thống Giáo dục Liên cấp Sao Biển Nha Trang",
        createdAt: "4 giờ trước",
        pinned: false,
        actionLabel: "Xem Phần mềm Trường học",
        actionView: "products"
      },
      {
        id: "ANN-MEM-04",
        sourceType: "member",
        badge: "🏙️ TIN TỪ KHỐI BẤT ĐỘNG SẢN & NỘI THẤT THÀNH VIÊN",
        title: "Hưng Phát Land & TechCorp Interior ra mắt Gói Ưu đãi Chéo B2B giảm 20% Thiết kế Thi công Văn phòng & Trung tâm",
        summary: "Đặc quyền dành riêng cho các Trường tư thục, Trung tâm Ngoại ngữ - Tin học và Doanh nghiệp SME thuộc Hệ sinh thái TechCorp khi mở rộng cơ sở mới tại Khánh Hòa.",
        authorName: "Ban Giám đốc Hưng Phát Land",
        authorOrg: "Sàn Giao dịch BĐS Hưng Phát Land & TechCorp Interior",
        createdAt: "1 ngày trước",
        pinned: false,
        actionLabel: "Xem Chợ Giao thương B2B",
        actionView: "forum"
      },
      {
        id: "ANN-MEM-05",
        sourceType: "member",
        badge: "🎓 TIN TỪ KHỐI ĐẠI HỌC & CAO ĐẲNG THÀNH VIÊN",
        title: "Trường Đại học Nha Trang & Khối Doanh nghiệp SME ký kết Liên thông 450 Hồ sơ Năng lực Số Sinh viên Năm cuối lên Sàn JobAI",
        summary: "Sinh viên các ngành CNTT, Quản trị Khách sạn, Kế toán – Tài chính và Ngôn ngữ được kết nối phỏng vấn trực tiếp với 30 Doanh nghiệp & Resort ngay trên hệ thống TC COMPASS.",
        authorName: "Ban Hợp tác Doanh nghiệp & Việc làm SV",
        authorOrg: "Trường Đại học Nha Trang (NTU) × TC COMPASS",
        createdAt: "2 ngày trước",
        pinned: false,
        actionLabel: "Mở Sàn Nhân lực Xác thực",
        actionView: "forum"
      }
    ];

    defaultExtras.forEach((extra) => {
      if (!STATE.announcements.some((a) => a.id === extra.id)) {
        STATE.announcements.push(extra);
      }
    });

    STATE.announcements = STATE.announcements.map(enrichSingleAnnouncementItem);
  }

  if (Array.isArray(STATE.apps)) {
    STATE.apps = STATE.apps.map((app) => {
      if (app.id === "jobai" && (!app.appUrl || app.appUrl === "https://jobai.techcorp.info.vn" || app.appUrl === "https://jobai.techcorp.info.vn/")) {
        return { ...app, appUrl: "https://jobai.techcorp.info.vn/careers.html" };
      }
      return app;
    });
  }

  if (Array.isArray(STATE.heroSliders)) {
    STATE.heroSliders = STATE.heroSliders.map((s) => {
      if (s.primaryCtaLink === "https://jobai.techcorp.info.vn" || s.primaryCtaLink === "https://jobai.techcorp.info.vn/") {
        return { ...s, primaryCtaLink: "https://jobai.techcorp.info.vn/careers.html" };
      }
      return s;
    });
  }

  if (STATE.rbacMatrix && STATE.rbacMatrix.super_admin) {
    STATE.rbacMatrix.super_admin.roleName = normalizeTermText(STATE.rbacMatrix.super_admin.roleName);
  }

  if (Array.isArray(STATE.forumPosts)) {
    const defaultMap = new Map(CLIENT_DEFAULT_FORUM_POSTS.map((p) => [p.id, p]));
    STATE.forumPosts = STATE.forumPosts.map((p) => {
      const defMatch = defaultMap.get(p.id);
      if (
        p.id === "POST-1792469740466" ||
        (typeof p.title === "string" && p.title.includes("??")) ||
        (typeof p.content === "string" && p.content.includes("??"))
      ) {
        if (defMatch) {
          return JSON.parse(JSON.stringify(defMatch));
        }
      }
      if (defMatch) {
        if (!p.unitGroup && defMatch.unitGroup) {
          p.unitGroup = defMatch.unitGroup;
          p.unitGroupName = defMatch.unitGroupName;
        }
        if (p.id === "POST-103" && p.status === "pending") {
          p.status = "approved";
          p.title = defMatch.title;
        }
      }
      return p;
    });

    CLIENT_DEFAULT_FORUM_POSTS.forEach((defPost) => {
      if (!STATE.forumPosts.some((existing) => existing.id === defPost.id)) {
        STATE.forumPosts.push(JSON.parse(JSON.stringify(defPost)));
      }
    });
  }

  if (Array.isArray(STATE.activityLogs)) {
    STATE.activityLogs = STATE.activityLogs.map((ev) => {
      if (ev.id === "EVT-1792469740467" || (typeof ev.text === "string" && ev.text.includes("??"))) {
        return {
          ...ev,
          text: '[Diễn đàn Cộng đồng] CEO Khách sạn & Lữ hành Biển Nha Trang vừa đăng bài mới: "[Cam Ranh - Nha Trang] Cần đơn vị thiết kế Website đa ngôn ngữ & cung cấp đồng phục cho 40 nhân sự"'
        };
      }
      return ev;
    });
  }
}

async function bootstrapFromServer() {
  const badgeEl = document.getElementById("apiStatusBadge");
  const tokenBox = document.getElementById("currentSsoTokenBox");
  if (tokenBox) tokenBox.textContent = STATE.ssoToken;

  try {
    const res = await fetch("/api/v1/bootstrap");
    const data = await res.json();
    if (data && data.ok) {
      STATE.apiOnline = true;
      STATE.apps = data.apps || STATE.apps;
      if (Array.isArray(data.heroSliders) && data.heroSliders.length > 0) {
        STATE.heroSliders = data.heroSliders;
        saveCachedHeroSliders();
      }
      if (Array.isArray(data.demoRequests) && data.demoRequests.length > 0) {
        STATE.demoRequests = data.demoRequests;
      }
      mergeLocalDemoRequests();
      STATE.users = data.users || STATE.users;
      STATE.personas = data.personas || STATE.personas;
      STATE.announcements = data.announcements || STATE.announcements;
      STATE.rbacMatrix = data.rbacMatrix || STATE.rbacMatrix;
      STATE.forumPosts = data.forumPosts || STATE.forumPosts;
      STATE.auditLogs = data.auditLogs || STATE.auditLogs;
      STATE.talents = data.talents || STATE.talents;
      STATE.contests = data.contests || STATE.contests;
      STATE.b2bOffers = data.b2bOffers || STATE.b2bOffers;
      STATE.lighthouseTargets = data.lighthouseTargets || STATE.lighthouseTargets;
      STATE.activityLogs = data.activityLogs || STATE.activityLogs;
      if (data.sso && data.sso.token) {
        STATE.ssoToken = data.sso.token;
        if (tokenBox) tokenBox.textContent = data.sso.token;
      }
      if (badgeEl) {
        badgeEl.textContent = "● 17/17 Hệ thống *.techcorp.info.vn Online (HTTP 200)";
        badgeEl.className = "badge badge-green";
      }
      syncPersonaDropdown();
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }
    }
  } catch (err) {
    mergeLocalDemoRequests();
    if (badgeEl) {
      badgeEl.textContent = "● Portal Ready";
      badgeEl.className = "badge badge-green";
    }
  }

  sanitizeStateTerminology();
  renderAllViews();
  window.activateAdminPanel(window.activeAdminPanelId, window.activeMemberSubTab);
}

document.addEventListener("DOMContentLoaded", () => {
  loadCachedHeroSliders();
  startHeroSliderAutoPlay();
  initPublicPageFromUrl();
  window.addEventListener("popstate", () => {
    initPublicPageFromUrl();
  });

  const isAdminPage = Boolean(document.getElementById("dynamicRoleSidebarNav"));
  let resolvedRole = null;

  try {
    const savedRaw = localStorage.getItem("tc_sso_session");
    if (savedRaw) {
      const savedObj = JSON.parse(savedRaw);
      if (savedObj && savedObj.personaKey && PERSONA_TO_ROLE[savedObj.personaKey]) {
        resolvedRole = savedObj.personaKey;
      }
    }
  } catch (_) {}

  // If user opens admin.html directly without logging in, redirect to login.html
  if (isAdminPage && !resolvedRole) {
    window.location.replace("login.html");
    return;
  }

  if (resolvedRole) {
    STATE.currentPersona = resolvedRole;
    if (resolvedRole === "super-admin") {
      window.activeAdminPanelId = "panel-master-overview";
    } else {
      window.activeAdminPanelId = "panel-role-workspace";
      window.activeMemberSubTab = "overview";
    }
    const select = document.getElementById("personaSelect");
    if (select) select.value = resolvedRole;
  }

  setupTabs();
  setupPersonaSwitcher();
  setupForumCategoryFilter();
  calculateComboPrice();
  bootstrapFromServer();

  document.getElementById("talentDomainFilter")?.addEventListener("change", renderTalents);
  document.getElementById("talentSearchInput")?.addEventListener("input", renderTalents);
  document.getElementById("calcCustomerType")?.addEventListener("change", calculateComboPrice);
  document.getElementById("calcScaleInput")?.addEventListener("input", calculateComboPrice);
  document.getElementById("calcPeriod")?.addEventListener("change", calculateComboPrice);
});

