/**
 * TechCorp Ecosystem Unified Topbar Widget (v6.6 - Strict Auth State & Logout Support)
 * - Khi chưa đăng nhập: Chỉ hiển thị nút "🔐 Đăng nhập", ẩn các liên kết Quản trị nội bộ.
 * - Khi đã đăng nhập: Hiển thị đúng Tên & Vai trò của tài khoản đang đăng nhập, nút vào Workspace của vai trò đó và nút "🚪 Đăng xuất".
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
    { id: "jobai", name: "TechCorp HireMind AI — Sàn Tuyển dụng & Tìm việc", badge: "Enterprise & KPI", appUrl: "https://jobai.techcorp.info.vn/careers.html" },
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

  function getSavedSsoSession() {
    try {
      const raw = localStorage.getItem("tc_sso_session");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.personaKey && parsed.email) {
        return parsed;
      }
    } catch (_) {}
    return null;
  }

  window.handleGlobalSsoLogout = function (ev) {
    if (ev) ev.preventDefault();
    try {
      localStorage.removeItem("tc_sso_session");
    } catch (_) {}
    window.location.href = (hubBaseUrl ? hubBaseUrl + "/" : "") + "login.html?logged_out=1";
  };

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
      gap: 10px;
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
    .tc-eco-user-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(148, 163, 184, 0.35);
      color: #e2e8f0;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap;
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
    .tc-eco-logout-btn {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      text-decoration: none;
      padding: 5px 11px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      white-space: nowrap;
      border: 1px solid rgba(248, 113, 113, 0.4);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }
    .tc-eco-logout-btn:hover {
      background: #dc2626;
      color: #ffffff;
      border-color: #dc2626;
    }
    .tc-eco-mobile-short {
      display: none;
    }
    @media (max-width: 1024px) {
      .tc-eco-quick-stats, .tc-eco-user-badge {
        display: none;
      }
      .tc-eco-dd-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 768px) {
      .tc-eco-bar {
        height: auto;
        min-height: 38px;
        padding: 6px 10px;
      }
      .tc-eco-inner {
        gap: 6px;
      }
      .tc-eco-left, .tc-eco-right {
        gap: 6px;
      }
      .tc-eco-divider {
        display: none;
      }
      .tc-eco-desktop-full {
        display: none;
      }
      .tc-eco-mobile-short {
        display: inline;
      }
      .tc-eco-brand {
        font-size: 11px;
        gap: 5px;
      }
      .tc-eco-launcher-btn {
        padding: 4px 8px;
        font-size: 11px;
        gap: 4px;
      }
      .tc-eco-link {
        padding: 4px 7px;
        font-size: 11px;
      }
      .tc-eco-sso-btn, .tc-eco-logout-btn {
        padding: 4px 9px;
        font-size: 11px;
      }
      .tc-eco-dropdown {
        position: fixed;
        top: 44px;
        left: 8px;
        right: 8px;
        width: auto;
        max-width: none;
        max-height: 78vh;
        overflow-y: auto;
        padding: 14px;
        border-radius: 14px;
        -webkit-overflow-scrolling: touch;
      }
      .tc-eco-dd-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      .tc-eco-dd-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }
    }
  `;
  document.head.appendChild(style);

  const basePrefix = hubBaseUrl ? hubBaseUrl + "/" : "";
  const companyMainSiteHtml = `<a href="https://techcorp.info.vn" target="_blank" rel="noopener" class="tc-eco-link" style="background:rgba(251,191,36,0.18);border:1px solid rgba(251,191,36,0.55);color:#fde047;font-weight:800;" title="Truy cập Website Chính thức của Công ty TNHH Công nghệ và Giáo dục TechCorp"><span class="tc-eco-desktop-full">🏛️ Website Công ty (techcorp.info.vn) ↗</span><span class="tc-eco-mobile-short">🏛️ techcorp.info.vn ↗</span></a>`;
  const publicLinkHtml =
    isAdminPage || isLoginPage
      ? `<a href="${basePrefix}index.html" class="tc-eco-link"><span class="tc-eco-desktop-full">🌍 Về Trang Public</span><span class="tc-eco-mobile-short">🌍 Trang chủ</span></a>`
      : `<a href="https://jobai.techcorp.info.vn/careers.html" target="_blank" rel="noopener" class="tc-eco-link" style="color:#38bdf8;font-weight:700;"><span class="tc-eco-desktop-full">🤖 Sàn Việc làm JobAI ↗</span><span class="tc-eco-mobile-short">🤖 JobAI ↗</span></a>`;

  function buildRightAuthHtml() {
    const savedSession = getSavedSsoSession();
    if (!savedSession) {
      return `
        ${companyMainSiteHtml}
        ${publicLinkHtml}
        <a href="${basePrefix}login.html" class="tc-eco-sso-btn" id="tcEcoSsoStatus">
          🔐 Đăng nhập
        </a>
      `;
    }
    const workspaceLabelFull =
      savedSession.roleCode === "super_admin"
        ? "👑 Quản trị Hệ sinh thái"
        : "⚙️ Không gian Quản trị";
    return `
      ${companyMainSiteHtml}
      ${publicLinkHtml}
      <span class="tc-eco-user-badge" id="tcEcoSsoStatus">
        👤 ${savedSession.name} • <span style="color:#38bdf8;">${savedSession.roleBadge || "Thành viên"}</span>
      </span>
      <a href="${basePrefix}admin.html" class="tc-eco-link ${isAdminPage ? "active" : ""}">
        <span class="tc-eco-desktop-full">${workspaceLabelFull}</span>
        <span class="tc-eco-mobile-short">⚙️ Quản trị</span>
      </a>
      <button type="button" class="tc-eco-logout-btn" onclick="window.handleGlobalSsoLogout(event)">
        <span class="tc-eco-desktop-full">🚪 Đăng xuất</span>
        <span class="tc-eco-mobile-short">🚪 Thoát</span>
      </button>
    `;
  }

  const bar = document.createElement("div");
  bar.className = "tc-eco-bar";
  bar.innerHTML = `
    <div class="tc-eco-inner">
      <div class="tc-eco-left">
        <a href="${basePrefix}index.html" class="tc-eco-brand">
          <span class="tc-eco-dot"></span>
          <span class="tc-eco-desktop-full">TECHCORP CLOUD ECOSYSTEM</span>
          <span class="tc-eco-mobile-short">TECHCORP</span>
        </a>
        <span class="tc-eco-divider"></span>
        <div class="tc-eco-launcher-wrap" id="tcEcoLauncherWrap">
          <button type="button" class="tc-eco-launcher-btn" id="tcEcoLauncherBtn">
            <span class="tc-eco-desktop-full">🌐 Khám phá 16 Nền tảng Live</span>
            <span class="tc-eco-mobile-short">🌐 16 App Live</span>
            <span style="font-size:10px;opacity:0.85;">▼</span>
          </button>
          <div class="tc-eco-dropdown" id="tcEcoDropdown">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:10px 14px;margin-bottom:12px;border-radius:10px;background:linear-gradient(135deg,#071936 0%,#0043b8 100%);border:1.5px solid #fbbf24;color:#ffffff;">
              <div>
                <div style="font-size:12.5px;font-weight:800;color:#fde047;">🏛️ WEBSITE CHÍNH THỨC CỦA CÔNG TY TECHCORP — https://techcorp.info.vn</div>
                <div style="font-size:11px;color:#e2e8f0;">Cổng thông tin chính thức Công ty TNHH Công nghệ và Giáo dục TechCorp • Tư vấn Giải pháp Số &amp; Đào tạo</div>
              </div>
              <a href="https://techcorp.info.vn" target="_blank" rel="noopener" style="background:#fbbf24;color:#071936;font-weight:900;font-size:11.5px;padding:6px 12px;border-radius:7px;text-decoration:none;white-space:nowrap;">Mở techcorp.info.vn ↗</a>
            </div>
            <div class="tc-eco-dd-header">
              <div>
                <strong style="font-size:13.5px;color:#071936;">Danh mục 16 Hệ thống Phần mềm Đang Vận hành Thực tế (*.techcorp.info.vn)</strong>
                <div style="font-size:11.5px;color:#64748b;">100% Trực tuyến (HTTP 200 & SSL) • Kết nối định danh tập trung TechCorp ID</div>
              </div>
              <a href="${basePrefix}index.html?page=products" style="font-size:12px;font-weight:700;color:#0055e5;text-decoration:none;">Xem chi tiết 16 Sản phẩm →</a>
            </div>
            <div class="tc-eco-dd-grid" id="tcEcoDropdownGrid"></div>
          </div>
        </div>
        <div class="tc-eco-quick-stats">
          <span>● 17/17 Domains Online</span>
          <span>•</span>
          <span>SSO JWT v6.6</span>
        </div>
      </div>
      <div class="tc-eco-right" id="tcEcoRightActions">
        ${buildRightAuthHtml()}
      </div>
    </div>
  `;

  window.refreshTechCorpTopbarAuth = function () {
    const rightEl = bar.querySelector("#tcEcoRightActions");
    if (rightEl) {
      rightEl.innerHTML = buildRightAuthHtml();
    }
  };

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
      .map(function (g) {
        const items = apps
          .filter(function (a) {
            return (a.badge || "") === g.badge;
          })
          .map(function (a) {
            const domain = (a.appUrl || "").replace("https://", "");
            return `
              <a href="${basePrefix}product.html?id=${encodeURIComponent(a.id)}" class="tc-eco-dd-item">
                <div>${a.name}</div>
                <span class="tc-eco-dd-domain">🌐 ${domain} • Xem chi tiết & Dùng thử →</span>
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

  function mountBar() {
    if (!document.body) return;
    document.body.insertBefore(bar, document.body.firstChild);
    renderDropdownApps(FALLBACK_PRODUCTS);

    const btn = bar.querySelector("#tcEcoLauncherBtn");
    const dd = bar.querySelector("#tcEcoDropdown");
    const wrap = bar.querySelector("#tcEcoLauncherWrap");

    if (btn && dd) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        dd.classList.toggle("open");
      });
      document.addEventListener("click", function (e) {
        if (wrap && !wrap.contains(e.target)) {
          dd.classList.remove("open");
        }
      });
    }
  }

  window.refreshTechCorpTopbar = function (apps) {
    if (Array.isArray(apps) && apps.length) {
      renderDropdownApps(apps);
    }
    window.refreshTechCorpTopbarAuth();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountBar);
  } else {
    mountBar();
  }
})();
