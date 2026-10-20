/**
 * TechCorp Ecosystem Unified Topbar Widget (v5.0 - Dual Mode: Public Showcase + Role-Based Admin Portal)
 * Tự động tải danh sách ứng dụng & tin nóng từ Diễn đàn Cộng đồng qua:
 *   GET https://hesinhthai.techcorp.info.vn/api/v1/apps
 */
(function () {
  if (window.__TECHCORP_BAR_LOADED__) return;
  window.__TECHCORP_BAR_LOADED__ = true;

  const FALLBACK_PRODUCTS = [
    {
      id: "edu-school",
      name: "QL Trường học (Mầm non - ĐH)",
      badge: "EdTech",
      color: "#0061ff",
      desc: "Học vụ, Sổ liên lạc điện tử, Thu học phí"
    },
    {
      id: "edu-center",
      name: "QL Trung tâm NN - TH",
      badge: "EdTech",
      color: "#6366f1",
      desc: "CRM Tuyển sinh, Lớp học, Học viên"
    },
    {
      id: "lms-exam",
      name: "Học & Thi Online (LMS)",
      badge: "Core Funnel",
      color: "#059669",
      desc: "Phòng thi trực tuyến, Cấp chứng chỉ số"
    },
    {
      id: "biz-web",
      name: "Website Doanh nghiệp",
      badge: "BizTech",
      color: "#ea580c",
      desc: "Thương hiệu, SEO đa ngôn ngữ, Tuyển dụng"
    },
    {
      id: "biz-erp",
      name: "Quản trị Doanh nghiệp (ERP)",
      badge: "BizTech",
      color: "#0284c7",
      desc: "HRM, CRM, Tài chính, Kho vận, Công việc"
    }
  ];

  const scriptEl = document.currentScript;
  const hubBaseUrl = (scriptEl && scriptEl.getAttribute("data-hub-url")) || "";
  let currentAppId = (scriptEl && scriptEl.getAttribute("data-app-id")) || "biz-erp";
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
      font-size: 11.5px;
      font-weight: 600;
      transition: all 0.18s ease;
      white-space: nowrap;
    }
    .tc-eco-pill:hover {
      background: rgba(255, 255, 255, 0.26);
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
    }
    @media (max-width: 1180px) {
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
        TECHCORP ECOSYSTEM
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

  function renderSwitcher(apps) {
    const switcher = bar.querySelector("#tcEcoSwitcher");
    if (!switcher) return;
    switcher.innerHTML = apps
      .map(
        (p) => `
        <button type="button" class="tc-eco-pill ${p.id === currentAppId ? "active" : ""}" data-product-id="${p.id}" title="${p.desc || p.name}">
          ${p.name}
        </button>
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

  bar.addEventListener("click", (e) => {
    const pill = e.target.closest(".tc-eco-pill");
    if (pill) {
      const targetId = pill.getAttribute("data-product-id");
      currentAppId = targetId;
      bar.querySelectorAll(".tc-eco-pill").forEach((el) => {
        el.classList.toggle("active", el.getAttribute("data-product-id") === targetId);
      });
      if (typeof window.showToast === "function") {
        window.showToast(`Đã chuyển phiên SSO sang ứng dụng: <b>${pill.textContent.trim()}</b>`);
      }
    }
  });
})();
