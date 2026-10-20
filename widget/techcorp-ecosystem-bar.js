/**
 * TechCorp Ecosystem Unified Topbar Widget (v6.0 - Clean International Enterprise Topbar + Mega Launcher)
 * Thiết kế gọn gàng, hiện đại, không dính chùm:
 *   - Bên trái: Thương hiệu TECHCORP CLOUD + Nút Mega-Menu "🌐 Khám phá 15 Nền tảng Live ▾" chia theo 4 khối ngành
 *   - Bên phải: Nút chuyển nhanh Trang Public, Cổng Quản trị & Trạng thái Tài khoản Đăng nhập SSO
 */
(function () {
  if (window.__TECHCORP_BAR_LOADED__) return;
  window.__TECHCORP_BAR_LOADED__ = true;

  const FALLBACK_PRODUCTS = [
    { id: "mamnon", name: "Quản lý Trường Mầm non & AI", badge: "EdTech K-12", appUrl: "https://mamnon.techcorp.info.vn" },
    { id: "tieuhoc", name: "Quản lý Trường Tiểu học & AI", badge: "EdTech K-12", appUrl: "https://tieuhoc.techcorp.info.vn" },
    { id: "thcs", name: "Quản lý Trường THCS & AI", badge: "EdTech K-12", appUrl: "https://thcs.techcorp.info.vn" },
    { id: "thpt", name: "Quản lý Trường THPT & AI", badge: "EdTech K-12", appUrl: "https://thpt.techcorp.info.vn" },
    { id: "gdtx", name: "Trung tâm GDNN - GDTX", badge: "EdTech K-12", appUrl: "https://gdtx.techcorp.info.vn" },
    { id: "qldt", name: "TC COMPASS — Quản trị Đại học", badge: "EdTech & LMS", appUrl: "https://qldt.techcorp.info.vn" },
    { id: "ttnn", name: "Quản lý Trung tâm Ngoại ngữ - TH", badge: "EdTech & LMS", appUrl: "https://ttnn.techcorp.info.vn" },
    { id: "lms", name: "TechCorp LMS & Khảo thí Online", badge: "EdTech & LMS", appUrl: "https://lms.techcorp.info.vn" },
    { id: "learn", name: "TechCorpLearn — E-Learning", badge: "EdTech & LMS", appUrl: "https://learn.techcorp.info.vn" },
    { id: "kpi", name: "Hệ thống Quản trị BSC-KPI", badge: "Enterprise & KPI", appUrl: "https://kpi.techcorp.info.vn" },
    { id: "erp", name: "TechCorp ERP — Quản trị Doanh nghiệp", badge: "Enterprise & KPI", appUrl: "https://erp.techcorp.info.vn" },
    { id: "jobai", name: "TechCorp HireMind AI — Sàn Tuyển dụng & Tìm việc", badge: "Enterprise & KPI", appUrl: "https://jobai.techcorp.info.vn" },
    { id: "techcorp", name: "TechCorp Academy & Giải pháp Số", badge: "Enterprise & KPI", appUrl: "https://techcorp.info.vn" },
    { id: "qldh", name: "TechCorp PMS — Quản lý Khách sạn", badge: "Chuyên ngành", appUrl: "https://qldh.techcorp.info.vn" },
    { id: "bds", name: "Hưng Phát Land — Sàn BĐS & AI", badge: "Chuyên ngành", appUrl: "https://bds.techcorp.info.vn" },
    { id: "noithat", name: "TechCorp Interior — Nội thất 3D", badge: "Chuyên ngành", appUrl: "https://noithat.techcorp.info.vn" }
  ];

  const scriptEl = document.currentScript;
  const hubBaseUrl = (scriptEl && scriptEl.getAttribute("data-hub-url")) || "";
  const pathname = window.location.pathname || "";
  const isAdminPage = pathname.indexOf("admin.html") !== -1;
  const isLoginPage = pathname.indexOf("login.html") !== -1;

  // Check session role from localStorage
  let savedSession = null;
  try {
    const raw = localStorage.getItem("tc_sso_session");
    if (raw) savedSession = JSON.parse(raw);
  } catch (_) {}

  const style = document.createElement("style");
  style.textContent = `
    .tc-eco-bar {
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #071936;
      color: #f8fafc;
      height: 42px;
      padding: 0 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      position: relative;
      z-index: 10000;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .tc-eco-inner {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .tc-eco-left, .tc-eco-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tc-eco-brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      font-size: 12px;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.4px;
      white-space: nowrap;
    }
    .tc-eco-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
    }
    .tc-eco-divider {
      width: 1px;
      height: 16px;
      background: rgba(255, 255, 255, 0.18);
    }
    .tc-eco-launcher-wrap {
      position: relative;
    }
    .tc-eco-launcher-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.15s ease;
      font-family: inherit;
    }
    .tc-eco-launcher-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.35);
    }
    .tc-eco-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      width: 880px;
      max-width: 92vw;
      background: #ffffff;
      color: #0f172a;
      border-radius: 14px;
      box-shadow: 0 20px 50px rgba(7, 25, 54, 0.28);
      border: 1px solid #cbd5e1;
      padding: 18px 20px;
      z-index: 10001;
    }
    .tc-eco-dropdown.open {
      display: block;
    }
    .tc-eco-dd-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .tc-eco-dd-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }
    .tc-eco-dd-col h6 {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0055e5;
      margin: 0 0 8px 0;
      letter-spacing: 0.4px;
    }
    .tc-eco-dd-item {
      display: block;
      padding: 7px 9px;
      border-radius: 8px;
      text-decoration: none;
      color: #1e293b;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.15s ease;
      margin-bottom: 3px;
    }
    .tc-eco-dd-item:hover {
      background: #eff6ff;
      color: #0055e5;
    }
    .tc-eco-dd-domain {
      display: block;
      font-size: 10.5px;
      color: #64748b;
      font-weight: 500;
      margin-top: 1px;
    }
    .tc-eco-quick-stats {
      font-size: 11.5px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tc-eco-link {
      color: #cbd5e1;
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .tc-eco-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
    .tc-eco-link.active {
      color: #ffffff;
      background: rgba(0, 97, 255, 0.45);
      border: 1px solid rgba(96, 165, 250, 0.4);
      font-weight: 700;
    }
    .tc-eco-sso-btn {
      background: linear-gradient(135deg, #0061ff 0%, #0284c7 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 5px 13px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap;
      border: 1px solid rgba(255, 255, 255, 0.25);
      transition: all 0.15s ease;
    }
    .tc-eco-sso-btn:hover {
      filter: brightness(1.1);
    }
    @media (max-width: 1024px) {
      .tc-eco-quick-stats {
        display: none;
      }
      .tc-eco-dd-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 640px) {
      .tc-eco-bar {
        padding: 0 12px;
      }
      .tc-eco-dd-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  const publicLinkHtml =
    isAdminPage || isLoginPage
      ? `<a href="${hubBaseUrl}/index.html" class="tc-eco-link">🌍 Về Trang Public</a>`
      : `<a href="https://jobai.techcorp.info.vn" target="_blank" rel="noopener" class="tc-eco-link" style="color:#38bdf8;font-weight:700;">🤖 Sàn Việc làm JobAI ↗</a>`;

  const bar = document.createElement("div");
  bar.className = "tc-eco-bar";
  bar.innerHTML = `
    <div class="tc-eco-inner">
      <div class="tc-eco-left">
        <a href="${hubBaseUrl}/index.html" class="tc-eco-brand">
          <span class="tc-eco-dot"></span>
          TECHCORP CLOUD ECOSYSTEM
        </a>
        <span class="tc-eco-divider"></span>
        <div class="tc-eco-launcher-wrap" id="tcEcoLauncherWrap">
          <button type="button" class="tc-eco-launcher-btn" id="tcEcoLauncherBtn">
            <span>🌐 Khám phá 16 Nền tảng Live</span>
            <span style="font-size:10px;opacity:0.85;">▼</span>
          </button>
          <div class="tc-eco-dropdown" id="tcEcoDropdown">
            <div class="tc-eco-dd-header">
              <div>
                <strong style="font-size:13.5px;color:#071936;">Danh mục 16 Hệ thống Phần mềm Đang Vận hành Thực tế (*.techcorp.info.vn)</strong>
                <div style="font-size:11.5px;color:#64748b;">100% Trực tuyến (HTTP 200 & SSL) • Kết nối định danh tập trung TechCorp ID</div>
              </div>
              <a href="${hubBaseUrl}/index.html#sec-products" style="font-size:12px;font-weight:700;color:#0055e5;text-decoration:none;">Xem chi tiết 16 Sản phẩm →</a>
            </div>
            <div class="tc-eco-dd-grid" id="tcEcoDropdownGrid"></div>
          </div>
        </div>
        <div class="tc-eco-quick-stats">
          <span>● 17/17 Domains Online</span>
          <span>•</span>
          <span>SSO JWT v6.1</span>
        </div>
      </div>
      <div class="tc-eco-right">
        ${publicLinkHtml}
        <a href="${hubBaseUrl}/admin.html" class="tc-eco-link ${isAdminPage ? "active" : ""}">
          🛡️ Cổng Quản trị
        </a>
        <a href="${hubBaseUrl}/login.html" class="tc-eco-sso-btn" id="tcEcoSsoStatus">
          ${savedSession && savedSession.name ? "👤 " + savedSession.name + " (Đổi Vai trò)" : "🔐 Đăng nhập Quản trị (SSO)"}
        </a>
      </div>
    </div>
  `;

  function renderDropdownApps(apps) {
    const grid = bar.querySelector("#tcEcoDropdownGrid");
    if (!grid) return;

    const groups = [
      { title: "🎓 Giáo dục Mầm non & K-12", badge: "EdTech K-12" },
      { title: "🏫 Đại học, TTNN & Khảo thí LMS", badge: "EdTech & LMS" },
      { title: "🏢 Quản trị ERP & BSC-KPI", badge: "Enterprise & KPI" },
      { title: "🏨 Khách sạn, BĐS AI & Nội thất", badge: "Chuyên ngành" }
    ];

    grid.innerHTML = groups
      .map((g) => {
        const items = apps
          .filter((a) => (a.badge || "") === g.badge)
          .map((a) => {
            const cleanDomain = (a.appUrl || "").replace("https://", "");
            return `
              <a href="${a.appUrl || "#"}" target="_blank" rel="noopener" class="tc-eco-dd-item">
                <div>${a.name} ↗</div>
                <span class="tc-eco-dd-domain">${cleanDomain}</span>
              </a>
            `;
          })
          .join("");
        return `
          <div class="tc-eco-dd-col">
            <h6>${g.title}</h6>
            ${items}
          </div>
        `;
      })
      .join("");
  }

  window.refreshTechCorpTopbar = function (apps) {
    if (Array.isArray(apps) && apps.length) {
      renderDropdownApps(apps);
    }
  };

  renderDropdownApps(FALLBACK_PRODUCTS);

  if (document.body) {
    document.body.insertBefore(bar, document.body.firstChild);
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      document.body.insertBefore(bar, document.body.firstChild);
    });
  }

  const btn = bar.querySelector("#tcEcoLauncherBtn");
  const dd = bar.querySelector("#tcEcoDropdown");
  const wrap = bar.querySelector("#tcEcoLauncherWrap");

  if (btn && dd) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dd.classList.toggle("open");
    });
    document.addEventListener("click", (e) => {
      if (wrap && !wrap.contains(e.target)) {
        dd.classList.remove("open");
      }
    });
  }

  const apiEndpoint = `${hubBaseUrl}/api/v1/apps`;
  if (window.location.protocol.startsWith("http")) {
    fetch(apiEndpoint)
      .then((r) => r.json())
      .then((data) => {
        if (data && Array.isArray(data.apps) && data.apps.length) {
          renderDropdownApps(data.apps);
        }
      })
      .catch(() => {});
  }
})();
