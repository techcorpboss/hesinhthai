/**
 * TechCorp Ecosystem Unified Topbar Widget (v5.1 - 15 Real Live Apps + Dual Mode Public/Admin)
 * Tự động tải danh sách 15 ứng dụng thực tế từ:
 *   GET https://hesinhthai.techcorp.info.vn/api/v1/apps
 */
(function () {
  if (window.__TECHCORP_BAR_LOADED__) return;
  window.__TECHCORP_BAR_LOADED__ = true;

  const FALLBACK_PRODUCTS = [
    { id: "mamnon", name: "Mầm non", appUrl: "https://mamnon.techcorp.info.vn", desc: "EduManager Pro — Quản lý Trường Mầm non & AI" },
    { id: "tieuhoc", name: "Tiểu học", appUrl: "https://tieuhoc.techcorp.info.vn", desc: "EduManager Pro — Quản lý Trường Tiểu học & AI" },
    { id: "thcs", name: "THCS", appUrl: "https://thcs.techcorp.info.vn", desc: "EduManager Pro — Quản lý Trường THCS & AI" },
    { id: "thpt", name: "THPT", appUrl: "https://thpt.techcorp.info.vn", desc: "EduManager Pro — Quản lý Trường THPT & AI" },
    { id: "gdtx", name: "GDTX", appUrl: "https://gdtx.techcorp.info.vn", desc: "EduManager Pro — Trung tâm GDNN - GDTX" },
    { id: "qldt", name: "Đại học (TC COMPASS)", appUrl: "https://qldt.techcorp.info.vn", desc: "TC COMPASS — Quản trị Đại học & Hiệu suất" },
    { id: "ttnn", name: "Trung tâm NN-TH", appUrl: "https://ttnn.techcorp.info.vn", desc: "Quản lý Trung tâm Ngoại ngữ & Tin học" },
    { id: "lms", name: "Thi Online (LMS)", appUrl: "https://lms.techcorp.info.vn", desc: "TechCorp LMS & E-Testing — Khảo thí Trực tuyến" },
    { id: "learn", name: "TechCorpLearn", appUrl: "https://learn.techcorp.info.vn", desc: "TechCorpLearn — Học trực tuyến & Khóa học số" },
    { id: "kpi", name: "BSC-KPI", appUrl: "https://kpi.techcorp.info.vn", desc: "Hệ thống BSC-KPI & Quản trị Doanh nghiệp Thông minh" },
    { id: "erp", name: "ERP Doanh nghiệp", appUrl: "https://erp.techcorp.info.vn", desc: "Hệ thống Quản trị Doanh nghiệp Tổng thể ERP" },
    { id: "qldh", name: "Khách sạn (PMS)", appUrl: "https://qldh.techcorp.info.vn", desc: "TechCorp PMS — Quản lý Khách sạn & Resort" },
    { id: "bds", name: "Bất động sản AI", appUrl: "https://bds.techcorp.info.vn", desc: "Hưng Phát Land — Sàn Giao dịch BĐS & Trợ lý AI" },
    { id: "noithat", name: "Nội thất 3D", appUrl: "https://noithat.techcorp.info.vn", desc: "Thiết kế, Thi công & Showroom Nội thất" },
    { id: "techcorp", name: "TechCorp Academy", appUrl: "https://techcorp.info.vn", desc: "Cổng Giải pháp Phần mềm PMS, ERP, LMS & Đào tạo" }
  ];

  const scriptEl = document.currentScript;
  const hubBaseUrl = (scriptEl && scriptEl.getAttribute("data-hub-url")) || "";
  let currentAppId = (scriptEl && scriptEl.getAttribute("data-app-id")) || "erp";
  const currentOrg = (scriptEl && scriptEl.getAttribute("data-org-name")) || "TechCorp Headquarters";
  const currentRole = (scriptEl && scriptEl.getAttribute("data-user-role")) || "Chủ Hệ sinh thái";
  const isAdminPage = window.location.pathname.indexOf("admin.html") !== -1;

  const style = document.createElement("style");
  style.textContent = `
    .tc-eco-bar {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(90deg, #002b75 0%, #0055e5 50%, #0284c7 100%);
      color: #ffffff;
      height: 44px;
      padding: 0 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      box-shadow: 0 2px 12px rgba(0, 85, 229, 0.25);
      position: relative;
      z-index: 9999;
      box-sizing: border-box;
      gap: 10px;
    }
    .tc-eco-left, .tc-eco-right {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .tc-eco-left {
      flex: 1;
      overflow: hidden;
    }
    .tc-eco-brand {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-weight: 800;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.2px;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.14);
      padding: 4px 10px;
      border-radius: 7px;
      border: 1px solid rgba(255, 255, 255, 0.28);
      flex-shrink: 0;
    }
    .tc-eco-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      box-shadow: 0 0 8px #4ade80;
    }
    .tc-eco-switcher {
      display: flex;
      align-items: center;
      gap: 5px;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tc-eco-switcher::-webkit-scrollbar {
      display: none;
    }
    .tc-eco-pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.22);
      color: rgba(255, 255, 255, 0.94);
      padding: 4px 10px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.18s ease;
      white-space: nowrap;
      text-decoration: none;
      flex-shrink: 0;
    }
    .tc-eco-pill:hover {
      background: rgba(255, 255, 255, 0.28);
      color: #ffffff;
    }
    .tc-eco-pill.active {
      background: #ffffff;
      color: #0047cc;
      border-color: #ffffff;
      font-weight: 800;
    }
    .tc-eco-mode-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 11px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 800;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.18s ease;
      flex-shrink: 0;
    }
    .tc-eco-mode-public {
      background: ${!isAdminPage ? "#ffffff" : "rgba(255,255,255,0.16)"};
      color: ${!isAdminPage ? "#0047cc" : "#ffffff"};
      border: 1px solid rgba(255,255,255,0.4);
    }
    .tc-eco-mode-admin {
      background: ${isAdminPage ? "#ff6b00" : "linear-gradient(135deg, #ff7e29 0%, #ff5500 100%)"};
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.45);
      box-shadow: 0 2px 8px rgba(255, 85, 0, 0.35);
    }
    .tc-eco-sso-badge {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }
    @media (max-width: 1280px) {
      .tc-eco-sso-badge {
        display: none;
      }
    }
    @media (max-width: 900px) {
      .tc-eco-switcher {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.className = "tc-eco-bar";
  bar.innerHTML = `
    <div class="tc-eco-left">
      <a href="${hubBaseUrl}/index.html" class="tc-eco-brand" title="Về Trang chủ Public Hệ sinh thái TechCorp">
        <span class="tc-eco-dot"></span>
        TECHCORP ECOSYSTEM (16 SITES)
      </a>
      <div class="tc-eco-switcher" id="tcEcoSwitcher"></div>
    </div>
    <div class="tc-eco-right">
      <a href="${hubBaseUrl}/index.html" class="tc-eco-mode-link tc-eco-mode-public">
        🌍 Trang Public Hệ sinh thái
      </a>
      <a href="${hubBaseUrl}/admin.html" class="tc-eco-mode-link tc-eco-mode-admin" id="tcEcoForumTicker">
        🛡️ Cổng Quản trị Theo Vai trò (SSO)
      </a>
      <span class="tc-eco-sso-badge" id="tcEcoSsoStatus">
        ✓ SSO: ${currentOrg} (${currentRole})
      </span>
    </div>
  `;

  function shortLabel(p) {
    const map = {
      mamnon: "Mầm non",
      tieuhoc: "Tiểu học",
      thcs: "THCS",
      thpt: "THPT",
      gdtx: "GDTX",
      qldt: "ĐH (TC COMPASS)",
      ttnn: "Trung tâm NN-TH",
      lms: "Thi Online LMS",
      learn: "TechCorpLearn",
      kpi: "BSC-KPI",
      erp: "ERP Doanh nghiệp",
      qldh: "Khách sạn PMS",
      bds: "BĐS AI",
      noithat: "Nội thất",
      techcorp: "TechCorp Academy"
    };
    return map[p.id] || p.name;
  }

  function renderSwitcher(apps) {
    const switcher = bar.querySelector("#tcEcoSwitcher");
    if (!switcher) return;
    switcher.innerHTML = apps
      .map(
        (p) => `
        <a href="${p.appUrl || "#"}" target="_blank" rel="noopener" class="tc-eco-pill ${p.id === currentAppId ? "active" : ""}" data-product-id="${p.id}" title="${p.name} — ${p.appUrl || ""}">
          ${shortLabel(p)} ↗
        </a>
      `
      )
      .join("");
  }

  window.refreshTechCorpTopbar = function (apps) {
    if (Array.isArray(apps) && apps.length) {
      renderSwitcher(apps);
    }
  };

  renderSwitcher(FALLBACK_PRODUCTS);

  if (document.body) {
    document.body.insertBefore(bar, document.body.firstChild);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      document.body.insertBefore(bar, document.body.firstChild);
    });
  }

  const apiEndpoint = `${hubBaseUrl}/api/v1/apps`;
  if (window.location.protocol.startsWith("http")) {
    fetch(apiEndpoint)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.apps) && data.apps.length) {
          renderSwitcher(data.apps);
        }
      })
      .catch(() => {});
  }
})();
