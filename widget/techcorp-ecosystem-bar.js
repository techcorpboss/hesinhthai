/**
 * TechCorp Ecosystem Unified Topbar Widget (v3.0 - International Bright Blue Enterprise Edition)
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
  const currentRole = (scriptEl && scriptEl.getAttribute("data-user-role")) || "Super Admin";

  const style = document.createElement("style");
  style.textContent = `
    .tc-eco-bar {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(90deg, #003580 0%, #0061ff 50%, #0284c7 100%);
      color: #ffffff;
      height: 44px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      box-shadow: 0 2px 12px rgba(0, 97, 255, 0.25);
      position: relative;
      z-index: 9999;
      box-sizing: border-box;
      gap: 12px;
    }
    .tc-eco-left, .tc-eco-right {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .tc-eco-brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.3px;
      white-space: nowrap;
      background: rgba(255, 255, 255, 0.14);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.25);
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
      gap: 6px;
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
      color: rgba(255, 255, 255, 0.92);
      padding: 4px 11px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .tc-eco-pill:hover {
      background: rgba(255, 255, 255, 0.26);
      color: #ffffff;
      transform: translateY(-1px);
    }
    .tc-eco-pill.active {
      background: #ffffff;
      color: #0052d4;
      border-color: #ffffff;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    .tc-eco-forum-alert {
      background: linear-gradient(135deg, #ff7e29 0%, #ff5500 100%);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      max-width: 270px;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 2px 8px rgba(255, 85, 0, 0.35);
    }
    .tc-eco-forum-alert:hover {
      filter: brightness(1.08);
    }
    .tc-eco-sso-badge {
      background: rgba(255, 255, 255, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      padding: 4px 11px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      white-space: nowrap;
    }
    @media (max-width: 1150px) {
      .tc-eco-forum-alert {
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
      <span class="tc-eco-brand">
        <span class="tc-eco-dot"></span>
        TECHCORP CLOUD ECOSYSTEM
      </span>
      <div class="tc-eco-switcher" id="tcEcoSwitcher"></div>
    </div>
    <div class="tc-eco-right">
      <button type="button" class="tc-eco-forum-alert" id="tcEcoForumTicker" title="Bấm để mở Diễn đàn Cộng đồng & Giao thương TechCorp">
        🔥 Diễn đàn B2B: Tìm đối tác đào tạo & Ưu đãi nội bộ mới!
      </button>
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
        if (data && data.latestForumHeadline && data.latestForumHeadline.title) {
          const ticker = bar.querySelector("#tcEcoForumTicker");
          if (ticker) {
            ticker.textContent = `🔥 Diễn đàn: ${data.latestForumHeadline.title}`;
          }
        }
      })
      .catch(() => {});
  }

  bar.addEventListener("click", (e) => {
    if (e.target.closest("#tcEcoForumTicker")) {
      if (typeof window.switchToTab === "function") {
        window.switchToTab("tab-forum");
      }
      return;
    }
    const pill = e.target.closest(".tc-eco-pill");
    if (!pill) return;
    currentAppId = pill.getAttribute("data-product-id");
    bar.querySelectorAll(".tc-eco-pill").forEach((el) => el.classList.remove("active"));
    pill.classList.add("active");
    window.dispatchEvent(
      new CustomEvent("techcorp:product-switch", {
        detail: { productId: currentAppId }
      })
    );
  });
})();
