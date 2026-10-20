/**
 * TechCorp Ecosystem Unified Topbar Widget (v2.1 - Dynamic API + Live Forum Ticker)
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
      color: "#0ea5e9",
      desc: "Học vụ, Sổ liên lạc điện tử, Thu học phí"
    },
    {
      id: "edu-center",
      name: "QL Trung tâm Ngoại ngữ - Tin học",
      badge: "EdTech",
      color: "#8b5cf6",
      desc: "CRM Tuyển sinh, Lớp học, Học viên"
    },
    {
      id: "lms-exam",
      name: "Học & Thi Online (LMS)",
      badge: "Core Funnel",
      color: "#10b981",
      desc: "Phòng thi trực tuyến, Cấp chứng chỉ số"
    },
    {
      id: "biz-web",
      name: "Website Doanh nghiệp Số",
      badge: "BizTech",
      color: "#f59e0b",
      desc: "Thương hiệu, SEO đa ngôn ngữ, Tuyển dụng"
    },
    {
      id: "biz-erp",
      name: "Quản trị Doanh nghiệp (ERP)",
      badge: "BizTech",
      color: "#ef4444",
      desc: "HRM, CRM, Tài chính, Kho vận, Công việc"
    }
  ];

  const scriptEl = document.currentScript;
  const hubBaseUrl = (scriptEl && scriptEl.getAttribute("data-hub-url")) || "";
  let currentAppId = (scriptEl && scriptEl.getAttribute("data-app-id")) || "biz-erp";
  const currentOrg = (scriptEl && scriptEl.getAttribute("data-org-name")) || "Nha Trang Bay Resort & Travel";
  const currentRole = (scriptEl && scriptEl.getAttribute("data-user-role")) || "CEO Doanh nghiệp SME";

  const style = document.createElement("style");
  style.textContent = `
    .tc-eco-bar {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      color: #f8fafc;
      height: 42px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12.5px;
      border-bottom: 1px solid rgba(56, 189, 248, 0.25);
      position: relative;
      z-index: 9999;
      box-sizing: border-box;
      gap: 10px;
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
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.2px;
      white-space: nowrap;
    }
    .tc-eco-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
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
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      padding: 3px 9px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 11.5px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .tc-eco-pill:hover {
      background: rgba(56, 189, 248, 0.18);
      color: #fff;
      border-color: #38bdf8;
    }
    .tc-eco-pill.active {
      background: rgba(14, 165, 233, 0.25);
      color: #fff;
      border-color: #38bdf8;
      font-weight: 600;
    }
    .tc-eco-forum-alert {
      background: rgba(245, 158, 11, 0.16);
      border: 1px solid rgba(245, 158, 11, 0.45);
      color: #fbbf24;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .tc-eco-forum-alert:hover {
      background: rgba(245, 158, 11, 0.28);
    }
    .tc-eco-sso-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 500;
      white-space: nowrap;
    }
    @media (max-width: 1100px) {
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
        HESINHTHAI.TECHCORP.INFO.VN
      </span>
      <div class="tc-eco-switcher" id="tcEcoSwitcher"></div>
    </div>
    <div class="tc-eco-right">
      <button type="button" class="tc-eco-forum-alert" id="tcEcoForumTicker" title="Bấm để mở Diễn đàn Cộng đồng & Giao thương TechCorp">
        💬 Diễn đàn: Tìm đối tác đào tạo & Ưu đãi nội bộ mới!
      </button>
      <span class="tc-eco-sso-badge" id="tcEcoSsoStatus">
        SSO: ${currentOrg} (${currentRole})
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
            ticker.textContent = `💬 Diễn đàn: ${data.latestForumHeadline.title}`;
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
