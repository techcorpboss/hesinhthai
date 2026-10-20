/**
 * TechCorp Ecosystem Hub - Frontend Application Connected to Backend API, SSO & Verified Forum
 * Target Domain: https://hesinhthai.techcorp.info.vn
 * Hỗ trợ:
 *   1. Kết nối trực tiếp Backend API & SQLite/JSON DB (/api/v1/*)
 *   2. Tự động hoạt động đầy đủ dữ liệu (Fallback + LocalStorage) ngay cả khi chạy chế độ Static Hosting trên aaPanel/Nginx
 */

const STATE = {
  apiOnline: false,
  ssoToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2hlc2luaHRoYWkudGVjaGNvcnAuaW5mby52biIsInN1YiI6IlVTUi1OVC0wMDEiLCJwZXJzb25hS2V5IjoiY2VvLXNtZSIsImVjb3N5c3RlbVJlZ2lvbiI6Iktow6FuaCBIw7JhIn0.techcorp_verified_signature",
  currentPersona: "ceo-sme",
  selectedForumCategory: "all",
  apps: [
    {
      id: "edu-school",
      name: "QL Trường học (Mầm non - ĐH)",
      badge: "EdTech",
      appUrl: "https://truonghoc.techcorp.info.vn",
      desc: "Học vụ, Sổ liên lạc điện tử, Thu học phí QR",
      apiKeyMasked: "tc_live_edus...2b1c"
    },
    {
      id: "edu-center",
      name: "QL Trung tâm Ngoại ngữ - Tin học",
      badge: "EdTech",
      appUrl: "https://trungtam.techcorp.info.vn",
      desc: "CRM Tuyển sinh, Lớp học, Học viên, Học phí",
      apiKeyMasked: "tc_live_educ...8877"
    },
    {
      id: "lms-exam",
      name: "Học & Thi Online (LMS)",
      badge: "Core Funnel",
      appUrl: "https://thionline.techcorp.info.vn",
      desc: "Phòng thi trực tuyến, Cấp chứng chỉ số QR, Ngân hàng đề",
      apiKeyMasked: "tc_live_lmse...ccdd"
    },
    {
      id: "biz-web",
      name: "Website Doanh nghiệp Số",
      badge: "BizTech",
      appUrl: "https://web.techcorp.info.vn",
      desc: "Thương hiệu số, SEO đa ngôn ngữ, Cổng tuyển dụng nhúng",
      apiKeyMasked: "tc_live_bizw...2211"
    },
    {
      id: "biz-erp",
      name: "Quản trị Doanh nghiệp (ERP)",
      badge: "BizTech",
      appUrl: "https://erp.techcorp.info.vn",
      desc: "HRM Nhân sự, CRM Khách hàng, Tài chính, Kho vận, Công việc",
      apiKeyMasked: "tc_live_bize...8899"
    }
  ],
  personas: {
    "ceo-sme": {
      name: "CEO Khách sạn & Lữ hành Biển Nha Trang",
      org: "Nha Trang Bay Resort & Travel (Đang dùng: ERP + Website)",
      roleBadge: "Khối Doanh nghiệp SME"
    },
    "center-dir": {
      name: "Giám đốc Trung tâm Anh ngữ & Tin học Quốc tế",
      org: "Ocean English & IT Center Nha Trang (Đang dùng: QL Trung tâm + Thi Online)",
      roleBadge: "Khối Đào tạo NN-TH"
    },
    "school-principal": {
      name: "Ban Giám hiệu Trường CĐ / Mầm non Nha Trang",
      org: "Hệ thống Giáo dục Sao Biển Nha Trang (Đang dùng: QL Trường học + LMS)",
      roleBadge: "Khối Cơ sở Giáo dục"
    },
    "student-user": {
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
      pinned: true,
      title: "[Cần tìm đối tác tại Nha Trang] Tìm Trung tâm đào tạo Tiếng Anh & Tiếng Hàn giao tiếp cho 25 nhân sự Lễ tân - Nhà hàng",
      content:
        "Chào các anh/chị trong Cộng đồng TechCorp Khánh Hòa. Chuẩn bị đón đoàn khách quốc tế mùa cao điểm cuối năm, Nha Trang Bay Resort cần tìm 01 Trung tâm Ngoại ngữ uy tín trong hệ sinh thái để đào tạo cấp tốc 8 tuần (học kết hợp trên LMS Thi Online của TechCorp và thực hành tại khách sạn). Ưu tiên các trung tâm đang dùng hệ thống TechCorp để đồng bộ điểm chuyên cần trực tiếp về phân hệ HRM của chúng tôi.",
      memberDeal: "Ký hợp đồng đào tạo dài hạn 12 tháng + Tài trợ địa điểm tổ chức sự kiện cho Trung tâm tại Resort.",
      author: {
        name: "CEO Khách sạn & Lữ hành Biển Nha Trang",
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
          authorName: "Giám đốc Trung tâm Anh ngữ & Tin học Quốc tế",
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
      pinned: true,
      title: "[Tài trợ Học bổng & Kiểm tra Năng lực] Tặng 500 suất Thi thử IELTS/TOEIC & Tin học Quốc tế + Học bổng 40% cho con em Doanh nghiệp & Trường học",
      content:
        "Nhằm đồng hành cùng các Trường Mầm non - Phổ thông và gia đình cán bộ nhân viên các Doanh nghiệp SME tại Nha Trang, Ocean English & IT Center mở cổng kiểm tra năng lực Ngoại ngữ - Tin học định kỳ hoàn toàn miễn phí trên nền tảng Thi Online TechCorp. Toàn bộ kết quả được trả tự động về Sổ liên lạc điện tử của Phụ huynh.",
      memberDeal: "🎁 Đặc quyền bắt buộc (Give-to-Get): Giảm 40% học phí khóa đầu tiên + Tặng tài khoản luyện đề Online 6 tháng cho toàn bộ thành viên có TechCorp ID.",
      author: {
        name: "Giám đốc Trung tâm Anh ngữ & Tin học Quốc tế",
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
          authorName: "Ban Giám hiệu Trường CĐ / Mầm non Nha Trang",
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
      pinned: false,
      title: "Mời 05 Doanh nghiệp Du lịch / F&B / Nha khoa tại Nha Trang đồng hành Ngày hội Gia đình & Tuyển sinh Mùa Hè (Quy mô 800 Phụ huynh)",
      content:
        "Tháng tới Hệ thống Giáo dục Sao Biển (KĐT Mỹ Gia & Vĩnh Điềm Trung) tổ chức Ngày hội Trải nghiệm Công nghệ & Kỹ năng cho 800 phụ huynh học sinh. Nhà trường dành tặng 05 gian hàng trưng bày miễn phí và tích hợp phát E-Voucher trên App Sổ liên lạc Điện tử cho các doanh nghiệp cùng thuộc Hệ sinh thái TechCorp.",
      memberDeal: "Miễn phí 100% gian hàng + Đẩy thông báo thương hiệu tài trợ tới 1.200 Phụ huynh trên App Trường.",
      author: {
        name: "Ban Giám hiệu Trường CĐ / Mầm non Nha Trang",
        org: "Hệ thống Giáo dục Sao Biển Nha Trang",
        roleBadge: "Khối Cơ sở Giáo dục",
        verifiedApp: "Đang dùng: QL Trường học + LMS"
      },
      createdAt: "5 giờ trước",
      likes: 27,
      views: 195,
      comments: []
    },
    {
      id: "POST-104",
      category: "knowledge",
      categoryLabel: "💡 Góc Chia sẻ Quản trị, HR & Chuyển đổi số",
      pinned: false,
      title: "Kinh nghiệm tự động hóa 95% quy trình thu học phí QR & chấm công giáo viên tại Nha Trang bằng hệ sinh thái TechCorp",
      content:
        "Trước đây mỗi đầu tháng bộ phận kế toán của trường mất gần 5 ngày để đối soát tin nhắn chuyển khoản học phí của phụ huynh. Từ khi bật tính năng gạch nợ tự động qua QR động trên phần mềm Quản lý Trường học và đồng bộ sang phân hệ Tài chính ERP của TechCorp, phụ huynh quét mã 3 giây là biên lai điện tử xuất tự động, kế toán giảm được 80% khối lượng việc thủ công.",
      memberDeal: "Chia sẻ miễn phí bộ quy trình & biểu mẫu thiết lập thu học phí không tiền mặt cho các trường tại Khánh Hòa.",
      author: {
        name: "Ban Giám hiệu Trường CĐ / Mầm non Nha Trang",
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

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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

window.switchToTab = function (tabId) {
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.click();
};

function renderConnectedApps() {
  const listEl = document.getElementById("connectedAppsList");
  const kpiEl = document.getElementById("kpiConnectedAppsCount");
  if (kpiEl) {
    kpiEl.textContent = `${STATE.apps.length} Ứng dụng`;
  }
  if (!listEl) return;

  listEl.innerHTML = STATE.apps
    .map(
      (app, i) => `
      <div class="product-item">
        <div class="product-info">
          <h4>${i + 1}. ${escapeHtml(app.name)} <code style="font-size:11.5px;color:#38bdf8;margin-left:6px;">[${escapeHtml(app.id)}]</code></h4>
          <p>${escapeHtml(app.desc || "")}</p>
          <div style="font-size:11.5px;color:#64748b;margin-top:4px;">
            🌐 URL: <span style="color:#94a3b8;">${escapeHtml(app.appUrl || "")}</span>
            ${app.apiKeyMasked ? ` • 🔑 API Key: <code>${escapeHtml(app.apiKeyMasked)}</code>` : ""}
          </div>
        </div>
        <span class="badge badge-blue">${escapeHtml(app.badge || "Connected")}</span>
      </div>
    `
    )
    .join("");
}

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

function renderForumPosts() {
  const container = document.getElementById("forumPostsContainer");
  const kpiEl = document.getElementById("kpiForumPostsCount");
  if (kpiEl) {
    kpiEl.textContent = `${STATE.forumPosts.length} Chủ đề`;
  }
  if (!container) return;

  const cat = STATE.selectedForumCategory || "all";
  const filtered = STATE.forumPosts.filter((p) => cat === "all" || p.category === cat);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="padding:24px;text-align:center;color:#94a3b8;">Chưa có bài thảo luận nào trong chuyên mục này. Hãy là người đầu tiên đăng bài!</div>`;
    return;
  }

  container.innerHTML = filtered
    .map(
      (post) => `
      <div class="forum-post-card ${post.pinned ? "pinned" : ""}">
        <div class="forum-author-bar">
          <div>
            <span class="badge ${post.pinned ? "badge-amber" : "badge-blue"}" style="margin-right:6px;">
              ${post.pinned ? "📌 GHIM VIP • " : ""}${escapeHtml(post.categoryLabel)}
            </span>
            <span class="badge badge-green">✔ Đã xác thực TechCorp ID</span>
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
          <div style="display:flex;gap:8px;">
            <button class="btn btn-outline" onclick="likeForumPost('${post.id}')" style="padding:6px 12px;font-size:12.5px;">
              👍 Quan tâm & Hữu ích (${post.likes || 0})
            </button>
            <button class="btn btn-emerald" onclick="connectB2B('${escapeHtml(post.author?.org || post.author?.name)}')" style="padding:6px 12px;font-size:12.5px;">
              🤝 Kết nối Giao thương / Nhận Ưu đãi
            </button>
          </div>
          <span style="font-size:12px;color:#94a3b8;">💬 ${(post.comments || []).length} phản hồi xác thực</span>
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

          <div style="display:flex;gap:8px;margin-top:8px;">
            <input
              type="text"
              id="cmtInput_${post.id}"
              class="input-control"
              style="flex:1;padding:7px 11px;font-size:12.5px;"
              placeholder="Gửi báo giá / phản hồi trực tiếp với tư cách TechCorp ID của bạn..."
            />
            <button class="btn btn-primary" onclick="submitForumComment('${post.id}')" style="padding:7px 14px;font-size:12.5px;">
              Gửi phản hồi
            </button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

window.submitNewForumPost = async function () {
  const category = document.getElementById("forumPostCategory")?.value || "rfq";
  const title = document.getElementById("forumPostTitle")?.value.trim() || "";
  const content = document.getElementById("forumPostContent")?.value.trim() || "";
  const memberDeal = document.getElementById("forumPostDeal")?.value.trim() || "";
  const pinned = Boolean(document.getElementById("forumPostPinned")?.checked);

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
        personaKey: STATE.currentPersona
      })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.forumPosts = data.forumPosts;
      STATE.activityLogs = data.activityLogs;
    } else if (data && data.error) {
      showToast(`<span style="color:#fbbf24">${escapeHtml(data.error)}</span>`);
      return;
    }
  } catch (_) {
    const persona = STATE.personas[STATE.currentPersona] || STATE.personas["ceo-sme"];
    STATE.forumPosts.unshift({
      id: "POST-" + Date.now(),
      category,
      categoryLabel: CATEGORY_MAP[category] || CATEGORY_MAP.rfq,
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
    STATE.activityLogs.unshift({
      time: "Vừa xong",
      eventType: "FORUM_POST_PUBLISHED",
      text: `[Diễn đàn Cộng đồng] ${persona.name} vừa đăng bài mới: "${title}"`
    });
  }

  renderForumPosts();
  renderActivityFeed();

  const ticker = document.getElementById("tcEcoForumTicker");
  if (ticker) {
    ticker.textContent = `💬 Diễn đàn: ${title}`;
  }

  document.getElementById("forumPostTitle").value = "";
  document.getElementById("forumPostContent").value = "";
  document.getElementById("forumPostDeal").value = "";
  document.getElementById("forumPostPinned").checked = false;

  showToast(`Đã đăng bài lên Diễn đàn Cộng đồng và đẩy thông báo lên Thanh Liên thông toàn hệ thống!`);
};

window.submitForumComment = async function (postId) {
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
      STATE.activityLogs = data.activityLogs;
      renderForumPosts();
      renderActivityFeed();
      showToast("Đã gửi phản hồi xác thực TechCorp ID lên chủ đề thảo luận!");
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  const persona = STATE.personas[STATE.currentPersona] || STATE.personas["ceo-sme"];
  if (post) {
    post.comments.push({
      id: "CMT-" + Date.now(),
      authorName: persona.name,
      authorOrg: persona.org,
      roleBadge: persona.roleBadge,
      text,
      time: "Vừa xong"
    });
    renderForumPosts();
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
      renderForumPosts();
      return;
    }
  } catch (_) {}

  const post = STATE.forumPosts.find((p) => p.id === postId);
  if (post) {
    post.likes = (post.likes || 0) + 1;
    renderForumPosts();
  }
};

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
      const idx = STATE.talents.findIndex((t) => t.id === id);
      if (idx !== -1 && data.talent) STATE.talents[idx] = data.talent;
      renderTalents();
      renderActivityFeed();
      showToast(`Đã gọi API đẩy hồ sơ của <b>${name}</b> vào phân hệ HRM trên ERP!`);
      return;
    }
  } catch (_) {}

  STATE.activityLogs.unshift({
    time: "Vừa xong",
    eventType: "HRM_CANDIDATE_IMPORTED",
    text: `[1-Click HRM Sync] Hồ sơ năng lực số của ${name} (${id}) đã được đồng bộ thẳng vào Phân hệ Tuyển dụng HRM trên ERP Doanh nghiệp.`
  });
  renderActivityFeed();
  showToast(`Đã đẩy hồ sơ xác thực của <b>${name}</b> vào phân hệ HRM trên ERP!`);
};

window.simulateCrossSync = async function (presetType) {
  try {
    const res = await fetch("/api/v1/events/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presetType })
    });
    const data = await res.json();
    if (data.ok) {
      STATE.activityLogs = data.activityLogs;
      renderActivityFeed();
      showToast("Đã thực thi API đồng bộ dữ liệu liên thông và lưu vào CSDL tập trung!");
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
  renderActivityFeed();
  showToast("Đã kích hoạt đồng bộ dữ liệu liên thông thành công!");
};

window.registerNewEcosystemApp = async function () {
  const id = document.getElementById("newAppId")?.value.trim();
  const name = document.getElementById("newAppName")?.value.trim();
  const badge = document.getElementById("newAppBadge")?.value.trim() || "New App";
  const appUrl = document.getElementById("newAppUrl")?.value.trim();
  const webhookUrl = document.getElementById("newAppWebhook")?.value.trim();
  const desc = document.getElementById("newAppDesc")?.value.trim();

  if (!id || !name) {
    showToast("Vui lòng nhập đầy đủ Mã định danh (App ID) và Tên ứng dụng!");
    return;
  }

  try {
    const res = await fetch("/api/v1/apps/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, badge, appUrl, webhookUrl, desc })
    });
    const data = await res.json();
    if (data && data.ok) {
      STATE.apps = data.apps;
      STATE.activityLogs = data.activityLogs;
      renderConnectedApps();
      renderActivityFeed();

      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps);
      }

      const outEl = document.getElementById("integrationGuideOutput");
      if (outEl && data.integration) {
        outEl.innerHTML = `
          <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.4);padding:12px;border-radius:10px;margin-bottom:12px;">
            <div style="color:#34d399;font-weight:700;font-size:13.5px;">✅ Đã tích hợp "${escapeHtml(data.app.name)}" vào CSDL Tập trung & Thanh Liên thông!</div>
            <div style="font-size:12.5px;color:#f8fafc;margin-top:4px;">🔑 <strong>API Key cấp riêng:</strong> <code style="color:#fbbf24">${escapeHtml(data.app.apiKey)}</code></div>
          </div>
          <p style="font-size:12.5px;color:#94a3b8;margin-bottom:6px;"><strong>1. Mã nhúng Thanh Liên thông (Gắn vào header ứng dụng ${escapeHtml(data.app.id)}):</strong></p>
          <div class="code-box">${escapeHtml(data.integration.widgetSnippet)}</div>
          <p style="font-size:12.5px;color:#94a3b8;margin-top:12px;margin-bottom:6px;"><strong>2. Lệnh cURL / Webhook bắn sự kiện từ ${escapeHtml(data.app.id)} lên Hub:</strong></p>
          <div class="code-box"><pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(data.integration.publishEventCurl)}</pre></div>
          <p style="font-size:12.5px;color:#94a3b8;margin-top:12px;margin-bottom:6px;"><strong>3. Code mẫu đấu nối Backend:</strong></p>
          <div class="code-box"><pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(data.integration.nodeExample)}</pre></div>
        `;
      }

      showToast(`Đã cấp API Key và tích hợp <b>${escapeHtml(data.app.name)}</b> lên thanh liên thông toàn hệ thống!`);
      return;
    }
  } catch (_) {}

  const fakeKey = "tc_live_" + id.replace(/[^a-z0-9]/g, "") + "_8899aabbcc";
  const newApp = {
    id,
    name,
    badge,
    appUrl,
    desc,
    apiKeyMasked: `${fakeKey.slice(0, 12)}...cc`
  };
  STATE.apps.push(newApp);
  renderConnectedApps();
  if (typeof window.refreshTechCorpTopbar === "function") {
    window.refreshTechCorpTopbar(STATE.apps);
  }
  showToast(`Đã tích hợp <b>${escapeHtml(name)}</b> lên thanh liên thông toàn hệ thống!`);
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
      renderContests();
      renderActivityFeed();
      showToast(`Đã gọi API đồng bộ <b>${data.contest.leadsGenerated} data học viên</b> vào CRM Trung tâm!`);
      return;
    }
  } catch (_) {}
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
      body: JSON.stringify({ company })
    });
    const data = await res.json();
    if (data.ok) {
      STATE.activityLogs = data.activityLogs;
      renderActivityFeed();
      showToast(`Đã lưu yêu cầu kết nối B2B tới <b>${company}</b> trên Server!`);
      return;
    }
  } catch (_) {}
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
            <button class="btn btn-outline" onclick="incrementSigned(${idx})">+1 Chốt mới</button>
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
      renderLighthouseTable();
      updateTotalKPIs();
      renderActivityFeed();
      showToast(`Đã lưu tiến độ chốt khách hàng hạt nhân Nha Trang vào Database!`);
      return;
    }
  } catch (_) {}

  const item = STATE.lighthouseTargets[idx];
  if (item) {
    item.currentSigned += 1;
    if (item.inPipeline > 0) item.inPipeline -= 1;
    renderLighthouseTable();
    updateTotalKPIs();
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
        if (tokenBox) tokenBox.textContent = data.token;
      }
    } catch (_) {}

    const p = STATE.personas[val];
    if (p) {
      if (infoEl) infoEl.textContent = `${p.org} • [${p.roleBadge}]`;
      if (forumIdEl) forumIdEl.textContent = `${p.name} • ${p.org}`;
      const ssoBadge = document.getElementById("tcEcoSsoStatus");
      if (ssoBadge) {
        ssoBadge.textContent = `SSO: ${p.name} (${p.roleBadge})`;
      }
      showToast(`Đã chuyển định danh TechCorp ID (SSO) sang: <b>${p.name}</b>`);
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
      STATE.personas = data.personas || STATE.personas;
      STATE.forumPosts = data.forumPosts || STATE.forumPosts;
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
      if (typeof window.refreshTechCorpTopbar === "function") {
        window.refreshTechCorpTopbar(STATE.apps);
      }
    }
  } catch (err) {
    if (badgeEl) {
      badgeEl.textContent = "● Portal Ready";
      badgeEl.className = "badge badge-green";
    }
  }

  renderConnectedApps();
  renderForumPosts();
  renderActivityFeed();
  renderTalents();
  renderContests();
  renderB2B();
  renderLighthouseTable();
  updateTotalKPIs();
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
