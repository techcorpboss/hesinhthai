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
  apps: [
    {
      id: "edu-school",
      name: "QL Trường học (Mầm non - ĐH)",
      badge: "EdTech",
      appUrl: "https://truonghoc.techcorp.info.vn",
      webhookUrl: "https://truonghoc.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Học vụ, Sổ liên lạc điện tử, Thu học phí QR",
      apiKeyMasked: "tc_live_edus...2b1c",
      status: "active"
    },
    {
      id: "edu-center",
      name: "QL Trung tâm Ngoại ngữ - Tin học",
      badge: "EdTech",
      appUrl: "https://trungtam.techcorp.info.vn",
      webhookUrl: "https://trungtam.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "CRM Tuyển sinh, Lớp học, Học viên, Học phí",
      apiKeyMasked: "tc_live_educ...8877",
      status: "active"
    },
    {
      id: "lms-exam",
      name: "Học & Thi Online (LMS)",
      badge: "Core Funnel",
      appUrl: "https://thionline.techcorp.info.vn",
      webhookUrl: "https://thionline.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Phòng thi trực tuyến, Cấp chứng chỉ số QR, Ngân hàng đề",
      apiKeyMasked: "tc_live_lmse...ccdd",
      status: "active"
    },
    {
      id: "biz-web",
      name: "Website Doanh nghiệp Số",
      badge: "BizTech",
      appUrl: "https://web.techcorp.info.vn",
      webhookUrl: "https://web.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "Thương hiệu số, SEO đa ngôn ngữ, Cổng tuyển dụng nhúng",
      apiKeyMasked: "tc_live_bizw...2211",
      status: "active"
    },
    {
      id: "biz-erp",
      name: "Quản trị Doanh nghiệp (ERP)",
      badge: "BizTech",
      appUrl: "https://erp.techcorp.info.vn",
      webhookUrl: "https://erp.techcorp.info.vn/api/webhooks/techcorp-hub",
      desc: "HRM Nhân sự, CRM Khách hàng, Tài chính, Kho vận, Công việc",
      apiKeyMasked: "tc_live_bize...8899",
      status: "active"
    }
  ],
  users: [
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
      ipAddress: "103.170.122.138"
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
      defaultAppId: "edu-center",
      assignedApps: ["edu-center", "lms-exam", "biz-web"],
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
      org: "Hệ thống Giáo dục Sao Biển Nha Trang",
      role: "school_principal",
      roleBadge: "Khối Cơ sở Giáo dục",
      defaultAppId: "edu-school",
      assignedApps: ["edu-school", "lms-exam"],
      status: "active",
      lastLogin: "1 giờ trước",
      ipAddress: "27.68.112.41"
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
      ipAddress: "171.244.19.72"
    }
  ],
  personas: {
    "super-admin": {
      id: "super-admin",
      userId: "USR-ADMIN-00",
      name: "Quản trị viên Hệ sinh thái TechCorp",
      org: "TechCorp Headquarters (Nha Trang - Khánh Hòa)",
      roleBadge: "🛡️ Super Admin TechCorp"
    },
    "ceo-sme": {
      id: "ceo-sme",
      userId: "USR-NT-001",
      name: "Nguyễn Hải Đăng (CEO Resort & Travel)",
      org: "Nha Trang Bay Resort & Travel (Đang dùng: ERP + Website)",
      roleBadge: "Khối Doanh nghiệp SME"
    },
    "center-dir": {
      id: "center-dir",
      userId: "USR-NT-002",
      name: "Trần Thanh Tâm (Giám đốc Trung tâm NN-TH)",
      org: "Ocean English & IT Center Nha Trang (Đang dùng: QL Trung tâm + Thi Online)",
      roleBadge: "Khối Đào tạo NN-TH"
    },
    "school-principal": {
      id: "school-principal",
      userId: "USR-NT-003",
      name: "ThS. Lê Thị Minh Hương (Hiệu trưởng)",
      org: "Hệ thống Giáo dục Sao Biển Nha Trang (Đang dùng: QL Trường học + LMS)",
      roleBadge: "Khối Cơ sở Giáo dục"
    },
    "student-user": {
      id: "student-user",
      userId: "USR-NT-004",
      name: "Nguyễn Minh Khôi (Sinh viên Năm cuối)",
      org: "Đại học Nha Trang • Hồ sơ số #TC-KH-8821",
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
  ]
};

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
  el.innerHTML = `<strong style="color:#38bdf8">TechCorp Hub:</strong> ${msg}`;
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

window.switchToTab = function (tabId) {
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.click();
};

window.openAdminSubtab = function (subtabId) {
  window.switchToTab("tab-admin");
  const btn = document.querySelector(`.admin-subbtn[data-subtab="${subtabId}"]`);
  if (btn) btn.click();
};

function renderAllViews() {
  renderConnectedApps();
  renderAdminAppsTable();
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

// ==================== 1. CONNECTED APPS & ADMIN APP REGISTRY CRUD ====================
function renderConnectedApps() {
  const listEl = document.getElementById("connectedAppsList");
  const kpiEl = document.getElementById("kpiConnectedAppsCount");
  if (kpiEl) {
    kpiEl.textContent = `${STATE.apps.length} Ứng dụng`;
  }
  if (!listEl) return;

  listEl.innerHTML = STATE.apps
    .map((app, i) => {
      const statusBadge =
        app.status === "locked"
          ? `<span class="badge badge-red">🔴 Tạm khóa</span>`
          : app.status === "maintenance"
          ? `<span class="badge badge-amber">🟡 Bảo trì</span>`
          : `<span class="badge badge-green">🟢 Active</span>`;
      return `
        <div class="product-item">
          <div class="product-info">
            <h4>${i + 1}. ${escapeHtml(app.name)} <code style="font-size:11.5px;color:#38bdf8;margin-left:6px;">[${escapeHtml(app.id)}]</code></h4>
            <p>${escapeHtml(app.desc || "")}</p>
            <div style="font-size:11.5px;color:#64748b;margin-top:4px;">
              🌐 URL: <span style="color:#94a3b8;">${escapeHtml(app.appUrl || "")}</span>
              ${app.apiKeyMasked ? ` • 🔑 API Key: <code>${escapeHtml(app.apiKeyMasked)}</code>` : ""}
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
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
            <div style="font-size:11.5px;color:#38bdf8;">ID: <code>${escapeHtml(app.id)}</code> • Nhãn: ${escapeHtml(app.badge || "App")}</div>
            <div style="font-size:11.5px;color:#94a3b8;">${escapeHtml(app.desc || "")}</div>
          </td>
          <td>
            <div style="font-size:12px;color:#f8fafc;">🌐 ${escapeHtml(app.appUrl || "")}</div>
            <div style="font-size:11.5px;color:#fbbf24;margin-top:3px;">🔑 <code>${escapeHtml(app.apiKeyMasked || "tc_live_...")}</code></div>
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
    showToast(`<span style="color:#fbbf24">Vui lòng nhập đầy đủ Mã định danh (App ID) và Tên ứng dụng!</span>`);
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
            <div style="color:#34d399;font-weight:700;font-size:13px;">✅ Đã tích hợp "${escapeHtml(data.app.name)}" & Ghi Audit Log!</div>
            <div style="font-size:12px;color:#f8fafc;margin-top:4px;">🔑 <strong>API Key:</strong> <code style="color:#fbbf24">${escapeHtml(data.app.apiKey)}</code></div>
          </div>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:4px;"><strong>Mã nhúng Thanh Liên thông:</strong></p>
          <div class="code-box">${escapeHtml(data.integration.widgetSnippet)}</div>
        `;
      }

      showToast(`Đã bổ sung ứng dụng <b>${escapeHtml(data.app.name)}</b> vào hệ sinh thái!`);
      return;
    } else if (data && data.error) {
      showToast(`<span style="color:#fbbf24">${escapeHtml(data.error)}</span>`);
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

// ==================== 2. FORUM FEED & ADMIN FORUM MODERATION ====================
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

  if (!container) return;

  const cat = STATE.selectedForumCategory || "all";
  // Hiển thị các bài đã duyệt (approved) hoặc bài đang chờ thẩm định (kèm nút Duyệt nhanh)
  const filtered = STATE.forumPosts.filter(
    (p) => p.status !== "rejected" && (cat === "all" || p.category === cat)
  );

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:24px;text-align:center;color:#94a3b8;">Chưa có bài thảo luận nào trong chuyên mục này.</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((post) => {
      const isPending = post.status === "pending";
      const isLocked = Boolean(post.locked);
      return `
        <div class="forum-post-card ${post.pinned ? "pinned" : ""}">
          <div class="forum-author-bar">
            <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
              <span class="badge ${post.pinned ? "badge-amber" : "badge-blue"}">
                ${post.pinned ? "📌 GHIM VIP • " : ""}${escapeHtml(post.categoryLabel)}
              </span>
              ${
                isPending
                  ? `<span class="badge badge-amber">⏳ Chờ Quản trị viên thẩm định</span>`
                  : `<span class="badge badge-green">✔ Đã thẩm định & Xác thực SSO</span>`
              }
              ${isLocked ? `<span class="badge badge-red">🔒 Đã khóa bình luận (Clocked)</span>` : ""}
            </div>
            <span style="font-size:11.5px;color:#94a3b8;">🕒 ${escapeHtml(post.createdAt)} • 👁️ ${post.views || 1} lượt xem</span>
          </div>

          <h4 style="font-size:16px;font-weight:700;color:#f8fafc;margin-bottom:6px;">
            ${escapeHtml(post.title)}
          </h4>

          <div style="font-size:12.5px;color:#38bdf8;margin-bottom:10px;">
            👤 <strong>${escapeHtml(post.author?.name)}</strong> — ${escapeHtml(post.author?.org)}
            <span style="color:#94a3b8;">(${escapeHtml(post.author?.verifiedApp || post.author?.roleBadge)})</span>
          </div>

          <p style="font-size:13.5px;color:#e2e8f0;line-height:1.6;">
            ${escapeHtml(post.content)}
          </p>

          ${
            post.memberDeal
              ? `<div class="forum-deal-box">
                  <strong>🎁 Quyền lợi / Đặc quyền Nội bộ (Give-to-Get):</strong> ${escapeHtml(post.memberDeal)}
                </div>`
              : ""
          }

          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;flex-wrap:wrap;gap:10px;">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
              <button class="btn btn-outline btn-sm" onclick="likeForumPost('${post.id}')">
                👍 Quan tâm (${post.likes || 0})
              </button>
              <button class="btn btn-emerald btn-sm" onclick="connectB2B('${escapeHtml(post.author?.org || post.author?.name)}')">
                🤝 Kết nối Giao thương / Nhận Ưu đãi
              </button>
              ${
                isPending
                  ? `<button class="btn btn-primary btn-sm" onclick="moderateForumStatus('${post.id}', 'approved')">✅ Thẩm định Duyệt ngay</button>`
                  : ""
              }
              <button class="btn btn-warning btn-sm" onclick="toggleForumLock('${post.id}')">
                ${isLocked ? "🔓 Mở khóa (Unlock)" : "🔒 Clock / Khóa bình luận"}
              </button>
            </div>
            <span style="font-size:12px;color:#94a3b8;">💬 ${(post.comments || []).length} phản hồi</span>
          </div>

          <div class="forum-comments-wrap">
            ${(post.comments || [])
              .map(
                (c) => `
                <div class="forum-comment-item">
                  <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                    <strong style="color:#38bdf8;">✔ ${escapeHtml(c.authorName)} <span style="color:#94a3b8;font-weight:400;">(${escapeHtml(c.roleBadge)})</span></strong>
                    <span style="font-size:11px;color:#64748b;">${escapeHtml(c.time)}</span>
                  </div>
                  <div style="color:#f1f5f9;">${escapeHtml(c.text)}</div>
                </div>
              `
              )
              .join("")}

            ${
              isLocked
                ? `<div style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.35);color:#fda4af;padding:9px 12px;border-radius:8px;font-size:12.5px;margin-top:8px;">
                    🔒 <strong>Chủ đề đã bị khóa bình luận (Clocked):</strong> Quản trị viên đã đóng chức năng gửi phản hồi mới cho bài viết này.
                  </div>`
                : `<div style="display:flex;gap:8px;margin-top:8px;">
                    <input
                      type="text"
                      id="cmtInput_${post.id}"
                      class="input-control"
                      style="flex:1;padding:7px 11px;font-size:12.5px;"
                      placeholder="Gửi báo giá / phản hồi trực tiếp với tư cách TechCorp ID của bạn..."
                    />
                    <button class="btn btn-primary btn-sm" onclick="submitForumComment('${post.id}')">
                      Gửi phản hồi
                    </button>
                  </div>`
            }
          </div>
        </div>
      `;
    })
    .join("");
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
            <div style="font-size:11.5px;color:#38bdf8;">
              <code>${escapeHtml(p.id)}</code> • ${escapeHtml(p.categoryLabel)}
              ${p.pinned ? `<span class="badge badge-amber" style="margin-left:4px;">📌 Ghim VIP</span>` : ""}
            </div>
            <strong style="font-size:13.5px;color:#f8fafc;">${escapeHtml(p.title)}</strong>
            <div style="font-size:11.5px;color:#64748b;margin-top:2px;">💬 ${(p.comments || []).length} bình luận • 👍 ${p.likes || 0} quan tâm</div>
          </td>
          <td>
            <div style="font-weight:600;color:#e2e8f0;">${escapeHtml(p.author?.name)}</div>
            <div style="font-size:11.5px;color:#94a3b8;">${escapeHtml(p.author?.org)}</div>
            <div style="font-size:11.5px;color:#34d399;margin-top:3px;">🎁 ${escapeHtml((p.memberDeal || "").slice(0, 65))}...</div>
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
    showToast(`<span style="color:#fbbf24">Vui lòng nhập đầy đủ Tiêu đề và Nội dung bài viết!</span>`);
    return;
  }

  if ((category === "spotlight" || category === "comarketing") && !memberDeal) {
    showToast(
      `<span style="color:#fbbf24">Quy tắc chống spam Give-to-Get: Vui lòng nhập Đặc quyền / Ưu đãi dành cho thành viên TechCorp!</span>`
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
      showToast(`<span style="color:#fbbf24">${escapeHtml(data.error)}</span>`);
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
        .map((a) => `<code style="font-size:11px;color:#38bdf8;margin-right:4px;">${escapeHtml(a)}</code>`)
        .join("");

      return `
        <tr>
          <td>
            <strong>${escapeHtml(u.fullName)}</strong>
            <div style="font-size:11.5px;color:#38bdf8;">ID: <code>${escapeHtml(u.id)}</code></div>
            <div style="font-size:11.5px;color:#94a3b8;">✉️ ${escapeHtml(u.email)} • 📞 ${escapeHtml(u.phone || "")}</div>
          </td>
          <td>
            <div style="font-size:12.5px;color:#f8fafc;">🏢 ${escapeHtml(u.org)}</div>
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
    showToast(`<span style="color:#fbbf24">Vui lòng nhập đầy đủ Họ tên, Email và Đơn vị/Tổ chức!</span>`);
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
      showToast(`<span style="color:#fbbf24">${escapeHtml(data.error)}</span>`);
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
    showToast(`<span style="color:#fbbf24">Không thể khóa tài khoản Super Admin gốc!</span>`);
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
            <code style="font-size:11.5px;color:#38bdf8;">${escapeHtml(log.id)}</code>
            <div style="font-size:11.5px;color:#94a3b8;margin-top:2px;">🕒 ${escapeHtml(log.timestamp)}</div>
          </td>
          <td>
            <strong style="font-size:13px;color:#f8fafc;">${escapeHtml(log.actorName)}</strong>
            <div style="font-size:11.5px;color:#94a3b8;">${escapeHtml(log.actorOrg)} (${escapeHtml(log.actorId)})</div>
          </td>
          <td>
            <code style="font-size:12px;color:#fbbf24;">${escapeHtml(log.ipAddress)}</code>
          </td>
          <td>
            <div><code style="font-weight:700;color:#38bdf8;">${escapeHtml(log.action)}</code></div>
            <div style="margin-top:4px;">${sevBadge}</div>
          </td>
          <td style="font-weight:600;color:#e2e8f0;">${escapeHtml(log.target)}</td>
          <td style="font-size:12.5px;color:#cbd5e1;max-width:340px;">${escapeHtml(log.details)}</td>
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
        <span class="time">${escapeHtml(item.time)} ${item.eventType ? `• <code style="color:#38bdf8">${escapeHtml(item.eventType)}</code>` : ""}</span>
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
            <h4>${escapeHtml(t.name)} <span style="font-size:12px;color:#38bdf8;">(${escapeHtml(t.id)})</span></h4>
            <span class="badge badge-green">Đã xác thực Thi Online</span>
          </div>
          <p style="font-size:12.5px;color:#94a3b8;margin-top:4px;">🎓 <strong>Trường:</strong> ${escapeHtml(t.school)}</p>
          <p style="font-size:12.5px;color:#94a3b8;">🏫 <strong>Đào tạo thêm:</strong> ${escapeHtml(t.center)}</p>
          <p style="font-size:13px;color:#f8fafc;margin-top:6px;">🎯 <strong>Vị trí mong muốn:</strong> ${escapeHtml(t.targetRole)} (GPA: ${escapeHtml(t.gpa)})</p>
          <div class="skill-tags">
            ${t.certs.map((c) => `<span class="badge badge-blue">${escapeHtml(c)}</span>`).join("")}
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
          <span style="font-size:12px;color:#34d399;">● ${escapeHtml(t.status)} ${t.syncedToErpCount ? `(Đã đồng bộ ${t.syncedToErpCount} DN)` : ""}</span>
          <button class="btn btn-primary" onclick="importCandidateToERP('${t.id}', '${t.name}')">
            Đẩy hồ sơ vào HRM (ERP)
          </button>
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
          <p style="font-size:12.5px;color:#94a3b8;margin-top:6px;">🤝 <strong>Đơn vị đồng hành:</strong> ${escapeHtml(c.organizer)}</p>
          <p style="font-size:12.5px;color:#94a3b8;margin-top:4px;">👥 <strong>Đối tượng:</strong> ${escapeHtml(c.targetGroup)}</p>
          <p style="font-size:12.5px;color:#34d399;margin-top:4px;">🎁 <strong>Quyền lợi:</strong> ${escapeHtml(c.reward)}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid rgba(148,163,184,0.14);">
          <div>
            <span style="font-size:13px;font-weight:700;color:#38bdf8;">${c.participants.toLocaleString()} thí sinh</span>
            <span style="font-size:12px;color:#fbbf24;margin-left:8px;">(${c.leadsGenerated} Lead học viên mới)</span>
          </div>
          <button class="btn btn-outline" onclick="pushLeadsToCenter('${c.id}', '${c.title}')">
            Đồng bộ Lead về CRM Trung tâm
          </button>
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
            <span style="font-size:11.5px;color:#94a3b8;">${escapeHtml(b.usingTech)}</span>
          </div>
          <h4>${escapeHtml(b.company)}</h4>
          <p style="font-size:13px;color:#f8fafc;margin-top:8px;">${escapeHtml(b.offer)}</p>
          <p style="font-size:12px;color:#38bdf8;margin-top:8px;">🎯 Áp dụng cho: ${escapeHtml(b.target)}</p>
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
          <td><strong>${escapeHtml(item.segment)}</strong><div style="font-size:12px;color:#94a3b8;">📍 ${escapeHtml(item.focusArea)}</div></td>
          <td><span class="badge badge-blue">${escapeHtml(item.comboPackage)}</span></td>
          <td>
            <div style="font-weight:700;">${item.currentSigned} / ${item.targetCount} đơn vị (${pct}%)</div>
            <div style="font-size:11.5px;color:#fbbf24;">Đang đàm phán: ${item.inPipeline} đơn vị</div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          </td>
          <td style="font-size:12.5px;color:#cbd5e1;">${escapeHtml(item.notes)}</td>
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
      <span style="color:#94a3b8;font-size:13px;">Chi phí thuê bao Combo hàng tháng:</span>
      <strong style="font-size:20px;color:#38bdf8;">${monthlyFee.toLocaleString("vi-VN")} VNĐ / tháng</strong>
    </div>
    <p style="font-size:13px;margin-bottom:6px;">💳 <strong>Tổng thanh toán (${months} tháng):</strong> <span style="color:#34d399;font-weight:700;">${total.toLocaleString("vi-VN")} VNĐ</span></p>
    <p style="font-size:13px;margin-bottom:6px;">🎁 <strong>Ưu đãi Giai đoạn 1 tại Nha Trang:</strong> ${bonusGift}</p>
    <p style="font-size:13px;color:#fbbf24;">🚀 <strong>Đặc quyền Hệ sinh thái đi kèm:</strong> ${ecoBenefit}</p>
  `;
};

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
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

function setupPersonaSwitcher() {
  const select = document.getElementById("personaSelect");
  const infoEl = document.getElementById("currentPersonaDesc");
  const tokenBox = document.getElementById("currentSsoTokenBox");
  const forumIdEl = document.getElementById("forumComposerIdentity");
  if (!select) return;

  select.addEventListener("change", async () => {
    const val = select.value;
    STATE.currentPersona = val;
    try {
      const res = await fetch("/api/v1/sso/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaKey: val })
      });
      const data = await res.json();
      if (data.ok) {
        STATE.ssoToken = data.token;
        STATE.auditLogs = data.auditLogs || STATE.auditLogs;
        if (tokenBox) tokenBox.textContent = data.token;
        renderAuditLogsTable();
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
        ssoBadge.textContent = `SSO: ${p.name} (${p.roleBadge})`;
      }
      showToast(`Đã chuyển định danh TechCorp ID (SSO) sang: <b>${escapeHtml(p.name)}</b>`);
    }
  });
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
      STATE.users = data.users || STATE.users;
      STATE.personas = data.personas || STATE.personas;
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
        badgeEl.textContent = "● API & SQLite Online";
        badgeEl.className = "badge badge-green";
      }
      syncPersonaDropdown();
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps.filter((a) => a.status !== "locked"));
      }
    }
  } catch (err) {
    if (badgeEl) {
      badgeEl.textContent = "● Portal Ready";
      badgeEl.className = "badge badge-green";
    }
  }

  renderAllViews();
}

document.addEventListener("DOMContentLoaded", () => {
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
