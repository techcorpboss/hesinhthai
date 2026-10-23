/**
 * TechCorp Ecosystem Hub — Full Relational MySQL Engine (hesinhthai_db)
 * Hỗ trợ đồng thời trên cả Local (Windows MySQL 8/9) và Ubuntu Server (aaPanel MySQL/MariaDB)
 * Tự động khởi tạo Database `hesinhthai_db` gồm 19 bảng chuẩn quan hệ (UTF8MB4) và đồng bộ 2 chiều.
 */

const fs = require("fs");
const path = require("path");

// Tự động nạp biến môi trường từ file .env (không phụ thuộc thư viện ngoài)
function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  try {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach(function (line) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.indexOf("#") === 0) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    });
  } catch (_) {}
}

loadEnvFile();

// Trích xuất dữ liệu chi tiết 16 sản phẩm (96 phân hệ + 48 luồng liên thông) từ product.html
function extractProductCatalogFromHtml() {
  try {
    const htmlPath = path.join(__dirname, "..", "product.html");
    if (!fs.existsSync(htmlPath)) return {};
    const html = fs.readFileSync(htmlPath, "utf8");
    const startMarker = "const PRODUCT_CATALOG_DETAILS = {";
    const endMarker = "const ORDERED_PRODUCT_IDS = [";
    const sIdx = html.indexOf(startMarker);
    const eIdx = html.indexOf(endMarker);
    if (sIdx === -1 || eIdx === -1) return {};
    let objLiteral = html.slice(sIdx + startMarker.length - 1, eIdx).trim();
    if (objLiteral.endsWith(";")) {
      objLiteral = objLiteral.slice(0, -1);
    }
    const fn = new Function("return (" + objLiteral + ");");
    return fn() || {};
  } catch (err) {
    return {};
  }
}

function sqlEsc(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number" && !isNaN(val)) return String(val);
  const str = typeof val === "object" ? JSON.stringify(val) : String(val);
  return (
    "'" +
    str
      .replace(/\\/g, "\\\\")
      .replace(/\x00/g, "\\0")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\x1a/g, "\\Z") +
    "'"
  );
}

const SCHEMA_TABLES_DDL = [
  `CREATE TABLE IF NOT EXISTS \`hub_meta\` (
    \`meta_key\` VARCHAR(64) NOT NULL,
    \`domain\` VARCHAR(191) NOT NULL,
    \`version\` VARCHAR(32) NOT NULL,
    \`region\` VARCHAR(191) NOT NULL,
    \`updated_at\` VARCHAR(64) NOT NULL,
    PRIMARY KEY (\`meta_key\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`apps\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`name\` VARCHAR(255) NOT NULL,
    \`badge\` VARCHAR(100) DEFAULT NULL,
    \`category\` VARCHAR(64) DEFAULT NULL,
    \`color\` VARCHAR(32) DEFAULT '#0284c7',
    \`app_url\` VARCHAR(255) NOT NULL,
    \`webhook_url\` VARCHAR(255) DEFAULT NULL,
    \`description\` TEXT,
    \`api_key\` VARCHAR(191) DEFAULT NULL,
    \`status\` VARCHAR(32) DEFAULT 'active',
    \`scopes_json\` TEXT,
    \`created_at\` VARCHAR(64) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`idx_apps_category\` (\`category\`),
    KEY \`idx_apps_status\` (\`status\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`app_details\` (
    \`app_id\` VARCHAR(64) NOT NULL,
    \`short_label\` VARCHAR(100) NOT NULL,
    \`full_name\` VARCHAR(255) NOT NULL,
    \`category_badge\` VARCHAR(191) DEFAULT NULL,
    \`app_url\` VARCHAR(255) NOT NULL,
    \`target_audience\` VARCHAR(255) DEFAULT NULL,
    \`deploy_time\` VARCHAR(191) DEFAULT NULL,
    \`sso_scopes\` VARCHAR(255) DEFAULT NULL,
    \`preview_image\` TEXT,
    \`full_description\` TEXT,
    PRIMARY KEY (\`app_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`app_modules\` (
    \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    \`app_id\` VARCHAR(64) NOT NULL,
    \`module_order\` INT NOT NULL DEFAULT 1,
    \`icon\` VARCHAR(32) DEFAULT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`description\` TEXT,
    \`bullets_json\` TEXT,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`uq_app_module_order\` (\`app_id\`, \`module_order\`),
    KEY \`idx_app_modules_app\` (\`app_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`app_integrations\` (
    \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    \`app_id\` VARCHAR(64) NOT NULL,
    \`integration_order\` INT NOT NULL DEFAULT 1,
    \`title\` VARCHAR(255) NOT NULL,
    \`description\` TEXT,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`uq_app_integration_order\` (\`app_id\`, \`integration_order\`),
    KEY \`idx_app_integrations_app\` (\`app_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`persona_key\` VARCHAR(64) DEFAULT NULL,
    \`full_name\` VARCHAR(191) NOT NULL,
    \`email\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(64) DEFAULT NULL,
    \`org\` VARCHAR(255) DEFAULT NULL,
    \`role\` VARCHAR(64) NOT NULL DEFAULT 'ceo_sme',
    \`role_badge\` VARCHAR(128) DEFAULT NULL,
    \`default_app_id\` VARCHAR(64) DEFAULT 'erp',
    \`assigned_apps_json\` TEXT,
    \`status\` VARCHAR(32) DEFAULT 'active',
    \`last_login\` VARCHAR(100) DEFAULT NULL,
    \`ip_address\` VARCHAR(64) DEFAULT NULL,
    \`created_at\` VARCHAR(64) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`uq_users_email\` (\`email\`),
    KEY \`idx_users_role\` (\`role\`),
    KEY \`idx_users_status\` (\`status\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`personas\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`user_id\` VARCHAR(64) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`org\` VARCHAR(255) DEFAULT NULL,
    \`role_badge\` VARCHAR(128) DEFAULT NULL,
    \`default_app_id\` VARCHAR(64) DEFAULT 'erp',
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`rbac_roles\` (
    \`role_code\` VARCHAR(64) NOT NULL,
    \`role_name\` VARCHAR(191) NOT NULL,
    \`description\` TEXT,
    \`view_plaza\` TINYINT(1) NOT NULL DEFAULT 1,
    \`post_member_news\` TINYINT(1) NOT NULL DEFAULT 0,
    \`manage_own_org\` TINYINT(1) NOT NULL DEFAULT 1,
    \`post_forum_b2b\` TINYINT(1) NOT NULL DEFAULT 0,
    \`access_talent_pool\` TINYINT(1) NOT NULL DEFAULT 0,
    \`manage_lms_contests\` TINYINT(1) NOT NULL DEFAULT 0,
    \`publish_master_bulletin\` TINYINT(1) NOT NULL DEFAULT 0,
    \`manage_apps_users_rbac\` TINYINT(1) NOT NULL DEFAULT 0,
    \`moderate_forum_audit\` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (\`role_code\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`hero_sliders\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`slide_order\` INT NOT NULL DEFAULT 1,
    \`badge\` VARCHAR(255) DEFAULT NULL,
    \`title\` VARCHAR(500) NOT NULL,
    \`subtitle\` TEXT,
    \`image_url\` TEXT NOT NULL,
    \`cta_primary_text\` VARCHAR(191) DEFAULT NULL,
    \`cta_primary_url\` VARCHAR(255) DEFAULT NULL,
    \`cta_secondary_text\` VARCHAR(191) DEFAULT NULL,
    \`cta_secondary_url\` VARCHAR(255) DEFAULT NULL,
    \`metric1_value\` VARCHAR(128) DEFAULT NULL,
    \`metric1_sub\` VARCHAR(255) DEFAULT NULL,
    \`metric2_value\` VARCHAR(128) DEFAULT NULL,
    \`metric2_sub\` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`idx_hero_sliders_order\` (\`slide_order\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`demo_requests\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`full_name\` VARCHAR(191) NOT NULL,
    \`phone\` VARCHAR(64) NOT NULL,
    \`email\` VARCHAR(191) DEFAULT NULL,
    \`org_name\` VARCHAR(255) NOT NULL,
    \`org_scale\` VARCHAR(128) DEFAULT NULL,
    \`product_id\` VARCHAR(64) NOT NULL,
    \`product_name\` VARCHAR(255) NOT NULL,
    \`app_url\` VARCHAR(255) DEFAULT NULL,
    \`preferred_time\` VARCHAR(191) DEFAULT NULL,
    \`notes\` TEXT,
    \`status\` VARCHAR(32) NOT NULL DEFAULT 'new',
    \`admin_note\` TEXT,
    \`ip_address\` VARCHAR(64) DEFAULT NULL,
    \`created_at\` VARCHAR(64) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`idx_demo_requests_product\` (\`product_id\`),
    KEY \`idx_demo_requests_status\` (\`status\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`forum_posts\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`category\` VARCHAR(64) NOT NULL,
    \`category_label\` VARCHAR(191) DEFAULT NULL,
    \`status\` VARCHAR(32) NOT NULL DEFAULT 'approved',
    \`locked\` TINYINT(1) NOT NULL DEFAULT 0,
    \`pinned\` TINYINT(1) NOT NULL DEFAULT 0,
    \`title\` VARCHAR(500) NOT NULL,
    \`content\` TEXT NOT NULL,
    \`member_deal\` TEXT,
    \`author_name\` VARCHAR(191) DEFAULT NULL,
    \`author_org\` VARCHAR(255) DEFAULT NULL,
    \`author_role_badge\` VARCHAR(128) DEFAULT NULL,
    \`author_verified_app\` VARCHAR(191) DEFAULT NULL,
    \`created_at_label\` VARCHAR(100) DEFAULT NULL,
    \`likes\` INT NOT NULL DEFAULT 0,
    \`views\` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (\`id\`),
    KEY \`idx_forum_posts_cat\` (\`category\`),
    KEY \`idx_forum_posts_status\` (\`status\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`forum_comments\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`post_id\` VARCHAR(64) NOT NULL,
    \`author_name\` VARCHAR(191) NOT NULL,
    \`author_org\` VARCHAR(255) DEFAULT NULL,
    \`role_badge\` VARCHAR(128) DEFAULT NULL,
    \`comment_text\` TEXT NOT NULL,
    \`time_label\` VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`idx_forum_comments_post\` (\`post_id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`announcements\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`source_type\` VARCHAR(32) NOT NULL DEFAULT 'master',
    \`badge\` VARCHAR(191) DEFAULT NULL,
    \`title\` VARCHAR(500) NOT NULL,
    \`summary\` TEXT NOT NULL,
    \`author_name\` VARCHAR(191) DEFAULT NULL,
    \`author_org\` VARCHAR(255) DEFAULT NULL,
    \`created_at_label\` VARCHAR(100) DEFAULT NULL,
    \`pinned\` TINYINT(1) NOT NULL DEFAULT 0,
    \`action_label\` VARCHAR(128) DEFAULT NULL,
    \`action_view\` VARCHAR(128) DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    KEY \`idx_announcements_source\` (\`source_type\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`talents\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`name\` VARCHAR(191) NOT NULL,
    \`school\` VARCHAR(255) DEFAULT NULL,
    \`center\` VARCHAR(255) DEFAULT NULL,
    \`certs_json\` TEXT,
    \`domain\` VARCHAR(64) DEFAULT NULL,
    \`target_role\` VARCHAR(255) DEFAULT NULL,
    \`gpa\` VARCHAR(32) DEFAULT NULL,
    \`status\` VARCHAR(128) DEFAULT NULL,
    \`synced_to_erp_count\` INT NOT NULL DEFAULT 0,
    PRIMARY KEY (\`id\`),
    KEY \`idx_talents_domain\` (\`domain\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`lms_contests\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`title\` VARCHAR(255) NOT NULL,
    \`organizer\` VARCHAR(255) DEFAULT NULL,
    \`participants\` INT NOT NULL DEFAULT 0,
    \`leads_generated\` INT NOT NULL DEFAULT 0,
    \`target_group\` VARCHAR(255) DEFAULT NULL,
    \`reward\` TEXT,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`b2b_offers\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`company\` VARCHAR(255) NOT NULL,
    \`using_tech\` VARCHAR(191) DEFAULT NULL,
    \`category\` VARCHAR(128) DEFAULT NULL,
    \`offer\` TEXT NOT NULL,
    \`target_audience\` VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`lighthouse_targets\` (
    \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    \`segment\` VARCHAR(255) NOT NULL,
    \`target_count\` INT NOT NULL DEFAULT 0,
    \`current_signed\` INT NOT NULL DEFAULT 0,
    \`in_pipeline\` INT NOT NULL DEFAULT 0,
    \`focus_area\` VARCHAR(255) DEFAULT NULL,
    \`combo_package\` VARCHAR(255) DEFAULT NULL,
    \`notes\` TEXT,
    PRIMARY KEY (\`id\`),
    UNIQUE KEY \`uq_lighthouse_segment\` (\`segment\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`activity_logs\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`time_label\` VARCHAR(100) DEFAULT NULL,
    \`source_app\` VARCHAR(64) DEFAULT NULL,
    \`target_app\` VARCHAR(64) DEFAULT NULL,
    \`event_type\` VARCHAR(64) DEFAULT NULL,
    \`event_text\` TEXT,
    PRIMARY KEY (\`id\`),
    KEY \`idx_activity_source\` (\`source_app\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  `CREATE TABLE IF NOT EXISTS \`audit_logs\` (
    \`id\` VARCHAR(64) NOT NULL,
    \`timestamp_label\` VARCHAR(64) NOT NULL,
    \`actor_id\` VARCHAR(64) DEFAULT NULL,
    \`actor_name\` VARCHAR(191) DEFAULT NULL,
    \`actor_org\` VARCHAR(255) DEFAULT NULL,
    \`ip_address\` VARCHAR(64) DEFAULT NULL,
    \`action\` VARCHAR(100) NOT NULL,
    \`target\` VARCHAR(255) DEFAULT NULL,
    \`severity\` VARCHAR(32) DEFAULT 'INFO',
    \`details\` TEXT,
    PRIMARY KEY (\`id\`),
    KEY \`idx_audit_action\` (\`action\`),
    KEY \`idx_audit_severity\` (\`severity\`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
];

// Xây dựng danh sách câu lệnh SQL INSERT / UPSERT từ state + productCatalog
function buildDataSeedStatements(state, productCatalog) {
  const stmts = [];
  const meta = (state && state.meta) || {
    domain: "hesinhthai.techcorp.info.vn",
    version: "6.5.0",
    region: "Nha Trang - Khánh Hòa",
    updatedAt: new Date().toISOString()
  };

  // 1. hub_meta
  stmts.push(
    `INSERT INTO \`hub_meta\` (\`meta_key\`, \`domain\`, \`version\`, \`region\`, \`updated_at\`) VALUES ('primary', ${sqlEsc(
      meta.domain
    )}, ${sqlEsc(meta.version)}, ${sqlEsc(meta.region)}, ${sqlEsc(
      meta.updatedAt || new Date().toISOString()
    )}) ON DUPLICATE KEY UPDATE \`domain\`=VALUES(\`domain\`), \`version\`=VALUES(\`version\`), \`region\`=VALUES(\`region\`), \`updated_at\`=VALUES(\`updated_at\`);`
  );

  // 2. apps (16 hệ thống thực tế)
  const apps = (state && state.apps) || [];
  apps.forEach(function (app) {
    stmts.push(
      `INSERT INTO \`apps\` (\`id\`, \`name\`, \`badge\`, \`category\`, \`color\`, \`app_url\`, \`webhook_url\`, \`description\`, \`api_key\`, \`status\`, \`scopes_json\`, \`created_at\`) VALUES (${sqlEsc(
        app.id
      )}, ${sqlEsc(app.name)}, ${sqlEsc(app.badge)}, ${sqlEsc(app.category)}, ${sqlEsc(
        app.color
      )}, ${sqlEsc(app.appUrl)}, ${sqlEsc(app.webhookUrl)}, ${sqlEsc(app.desc)}, ${sqlEsc(
        app.apiKey
      )}, ${sqlEsc(app.status || "active")}, ${sqlEsc(app.scopes || [])}, ${sqlEsc(
        app.createdAt || "2026-10-01T08:00:00.000Z"
      )}) ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`badge\`=VALUES(\`badge\`), \`category\`=VALUES(\`category\`), \`color\`=VALUES(\`color\`), \`app_url\`=VALUES(\`app_url\`), \`webhook_url\`=VALUES(\`webhook_url\`), \`description\`=VALUES(\`description\`), \`api_key\`=VALUES(\`api_key\`), \`status\`=VALUES(\`status\`), \`scopes_json\`=VALUES(\`scopes_json\`);`
    );
  });

  // 3. app_details, app_modules (96 phân hệ), app_integrations (48 luồng liên thông)
  const catalog = productCatalog && Object.keys(productCatalog).length ? productCatalog : extractProductCatalogFromHtml();
  Object.keys(catalog).forEach(function (appId) {
    const prod = catalog[appId];
    if (!prod) return;
    stmts.push(
      `INSERT INTO \`app_details\` (\`app_id\`, \`short_label\`, \`full_name\`, \`category_badge\`, \`app_url\`, \`target_audience\`, \`deploy_time\`, \`sso_scopes\`, \`preview_image\`, \`full_description\`) VALUES (${sqlEsc(
        prod.id || appId
      )}, ${sqlEsc(prod.shortLabel)}, ${sqlEsc(prod.name)}, ${sqlEsc(
        prod.categoryBadge
      )}, ${sqlEsc(prod.appUrl)}, ${sqlEsc(prod.targetAudience)}, ${sqlEsc(
        prod.deployTime
      )}, ${sqlEsc(prod.ssoScopes)}, ${sqlEsc(prod.previewImage)}, ${sqlEsc(
        prod.desc
      )}) ON DUPLICATE KEY UPDATE \`short_label\`=VALUES(\`short_label\`), \`full_name\`=VALUES(\`full_name\`), \`category_badge\`=VALUES(\`category_badge\`), \`app_url\`=VALUES(\`app_url\`), \`target_audience\`=VALUES(\`target_audience\`), \`deploy_time\`=VALUES(\`deploy_time\`), \`sso_scopes\`=VALUES(\`sso_scopes\`), \`preview_image\`=VALUES(\`preview_image\`), \`full_description\`=VALUES(\`full_description\`);`
    );

    if (Array.isArray(prod.modules)) {
      prod.modules.forEach(function (mod, idx) {
        const orderNum = idx + 1;
        stmts.push(
          `INSERT INTO \`app_modules\` (\`app_id\`, \`module_order\`, \`icon\`, \`title\`, \`description\`, \`bullets_json\`) VALUES (${sqlEsc(
            prod.id || appId
          )}, ${orderNum}, ${sqlEsc(mod.icon)}, ${sqlEsc(mod.title)}, ${sqlEsc(
            mod.desc
          )}, ${sqlEsc(mod.bullets || [])}) ON DUPLICATE KEY UPDATE \`icon\`=VALUES(\`icon\`), \`title\`=VALUES(\`title\`), \`description\`=VALUES(\`description\`), \`bullets_json\`=VALUES(\`bullets_json\`);`
        );
      });
    }

    if (Array.isArray(prod.integrations)) {
      prod.integrations.forEach(function (integ, idx) {
        const orderNum = idx + 1;
        stmts.push(
          `INSERT INTO \`app_integrations\` (\`app_id\`, \`integration_order\`, \`title\`, \`description\`) VALUES (${sqlEsc(
            prod.id || appId
          )}, ${orderNum}, ${sqlEsc(integ.title)}, ${sqlEsc(
            integ.desc
          )}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`description\`=VALUES(\`description\`);`
        );
      });
    }
  });

  // 4. users
  const users = (state && state.users) || [];
  users.forEach(function (u) {
    stmts.push(
      `INSERT INTO \`users\` (\`id\`, \`persona_key\`, \`full_name\`, \`email\`, \`phone\`, \`org\`, \`role\`, \`role_badge\`, \`default_app_id\`, \`assigned_apps_json\`, \`status\`, \`last_login\`, \`ip_address\`, \`created_at\`) VALUES (${sqlEsc(
        u.id
      )}, ${sqlEsc(u.personaKey)}, ${sqlEsc(u.fullName)}, ${sqlEsc(u.email)}, ${sqlEsc(
        u.phone
      )}, ${sqlEsc(u.org)}, ${sqlEsc(u.role)}, ${sqlEsc(u.roleBadge)}, ${sqlEsc(
        u.defaultAppId
      )}, ${sqlEsc(u.assignedApps || [])}, ${sqlEsc(u.status || "active")}, ${sqlEsc(
        u.lastLogin
      )}, ${sqlEsc(u.ipAddress)}, ${sqlEsc(
        u.createdAt
      )}) ON DUPLICATE KEY UPDATE \`persona_key\`=VALUES(\`persona_key\`), \`full_name\`=VALUES(\`full_name\`), \`email\`=VALUES(\`email\`), \`phone\`=VALUES(\`phone\`), \`org\`=VALUES(\`org\`), \`role\`=VALUES(\`role\`), \`role_badge\`=VALUES(\`role_badge\`), \`default_app_id\`=VALUES(\`default_app_id\`), \`assigned_apps_json\`=VALUES(\`assigned_apps_json\`), \`status\`=VALUES(\`status\`), \`last_login\`=VALUES(\`last_login\`), \`ip_address\`=VALUES(\`ip_address\`);`
    );
  });

  // 5. personas
  const personas = (state && state.personas) || {};
  Object.keys(personas).forEach(function (key) {
    const p = personas[key];
    if (!p) return;
    stmts.push(
      `INSERT INTO \`personas\` (\`id\`, \`user_id\`, \`name\`, \`org\`, \`role_badge\`, \`default_app_id\`) VALUES (${sqlEsc(
        p.id || key
      )}, ${sqlEsc(p.userId || "")}, ${sqlEsc(p.name)}, ${sqlEsc(p.org)}, ${sqlEsc(
        p.roleBadge
      )}, ${sqlEsc(
        p.defaultAppId || "erp"
      )}) ON DUPLICATE KEY UPDATE \`user_id\`=VALUES(\`user_id\`), \`name\`=VALUES(\`name\`), \`org\`=VALUES(\`org\`), \`role_badge\`=VALUES(\`role_badge\`), \`default_app_id\`=VALUES(\`default_app_id\`);`
    );
  });

  // 6. rbac_roles
  const rbacMatrix = (state && state.rbacMatrix) || {};
  Object.keys(rbacMatrix).forEach(function (roleCode) {
    const r = rbacMatrix[roleCode];
    if (!r) return;
    const perms = r.permissions || {};
    stmts.push(
      `INSERT INTO \`rbac_roles\` (\`role_code\`, \`role_name\`, \`description\`, \`view_plaza\`, \`post_member_news\`, \`manage_own_org\`, \`post_forum_b2b\`, \`access_talent_pool\`, \`manage_lms_contests\`, \`publish_master_bulletin\`, \`manage_apps_users_rbac\`, \`moderate_forum_audit\`) VALUES (${sqlEsc(
        r.roleCode || roleCode
      )}, ${sqlEsc(r.roleName)}, ${sqlEsc(r.desc)}, ${sqlEsc(Boolean(perms.viewPlaza))}, ${sqlEsc(
        Boolean(perms.postMemberNews)
      )}, ${sqlEsc(Boolean(perms.manageOwnOrg))}, ${sqlEsc(Boolean(perms.postForumB2B))}, ${sqlEsc(
        Boolean(perms.accessTalentPool)
      )}, ${sqlEsc(Boolean(perms.manageLmsContests))}, ${sqlEsc(
        Boolean(perms.publishMasterBulletin)
      )}, ${sqlEsc(Boolean(perms.manageAppsUsersRbac))}, ${sqlEsc(
        Boolean(perms.moderateForumAudit)
      )}) ON DUPLICATE KEY UPDATE \`role_name\`=VALUES(\`role_name\`), \`description\`=VALUES(\`description\`), \`view_plaza\`=VALUES(\`view_plaza\`), \`post_member_news\`=VALUES(\`post_member_news\`), \`manage_own_org\`=VALUES(\`manage_own_org\`), \`post_forum_b2b\`=VALUES(\`post_forum_b2b\`), \`access_talent_pool\`=VALUES(\`access_talent_pool\`), \`manage_lms_contests\`=VALUES(\`manage_lms_contests\`), \`publish_master_bulletin\`=VALUES(\`publish_master_bulletin\`), \`manage_apps_users_rbac\`=VALUES(\`manage_apps_users_rbac\`), \`moderate_forum_audit\`=VALUES(\`moderate_forum_audit\`);`
    );
  });

  // 7. hero_sliders (6 slides)
  const sliders = (state && state.heroSliders) || [];
  sliders.forEach(function (s, idx) {
    stmts.push(
      `INSERT INTO \`hero_sliders\` (\`id\`, \`slide_order\`, \`badge\`, \`title\`, \`subtitle\`, \`image_url\`, \`cta_primary_text\`, \`cta_primary_url\`, \`cta_secondary_text\`, \`cta_secondary_url\`, \`metric1_value\`, \`metric1_sub\`, \`metric2_value\`, \`metric2_sub\`) VALUES (${sqlEsc(
        s.id
      )}, ${Number(s.order || idx + 1)}, ${sqlEsc(s.badge)}, ${sqlEsc(s.title)}, ${sqlEsc(
        s.subtitle
      )}, ${sqlEsc(s.imageUrl)}, ${sqlEsc(s.ctaPrimaryText)}, ${sqlEsc(
        s.ctaPrimaryUrl
      )}, ${sqlEsc(s.ctaSecondaryText)}, ${sqlEsc(s.ctaSecondaryUrl)}, ${sqlEsc(
        s.metric1Value
      )}, ${sqlEsc(s.metric1Sub)}, ${sqlEsc(s.metric2Value)}, ${sqlEsc(
        s.metric2Sub
      )}) ON DUPLICATE KEY UPDATE \`slide_order\`=VALUES(\`slide_order\`), \`badge\`=VALUES(\`badge\`), \`title\`=VALUES(\`title\`), \`subtitle\`=VALUES(\`subtitle\`), \`image_url\`=VALUES(\`image_url\`), \`cta_primary_text\`=VALUES(\`cta_primary_text\`), \`cta_primary_url\`=VALUES(\`cta_primary_url\`), \`cta_secondary_text\`=VALUES(\`cta_secondary_text\`), \`cta_secondary_url\`=VALUES(\`cta_secondary_url\`), \`metric1_value\`=VALUES(\`metric1_value\`), \`metric1_sub\`=VALUES(\`metric1_sub\`), \`metric2_value\`=VALUES(\`metric2_value\`), \`metric2_sub\`=VALUES(\`metric2_sub\`);`
    );
  });

  // 8. demo_requests
  const demoRequests = (state && state.demoRequests) || [];
  demoRequests.forEach(function (d) {
    stmts.push(
      `INSERT INTO \`demo_requests\` (\`id\`, \`full_name\`, \`phone\`, \`email\`, \`org_name\`, \`org_scale\`, \`product_id\`, \`product_name\`, \`app_url\`, \`preferred_time\`, \`notes\`, \`status\`, \`admin_note\`, \`ip_address\`, \`created_at\`) VALUES (${sqlEsc(
        d.id
      )}, ${sqlEsc(d.fullName)}, ${sqlEsc(d.phone)}, ${sqlEsc(d.email)}, ${sqlEsc(
        d.orgName
      )}, ${sqlEsc(d.orgScale)}, ${sqlEsc(d.productId)}, ${sqlEsc(d.productName)}, ${sqlEsc(
        d.appUrl
      )}, ${sqlEsc(d.preferredTime)}, ${sqlEsc(d.notes)}, ${sqlEsc(
        d.status || "new"
      )}, ${sqlEsc(d.adminNote || "")}, ${sqlEsc(d.ipAddress)}, ${sqlEsc(
        d.createdAt
      )}) ON DUPLICATE KEY UPDATE \`full_name\`=VALUES(\`full_name\`), \`phone\`=VALUES(\`phone\`), \`email\`=VALUES(\`email\`), \`org_name\`=VALUES(\`org_name\`), \`org_scale\`=VALUES(\`org_scale\`), \`product_id\`=VALUES(\`product_id\`), \`product_name\`=VALUES(\`product_name\`), \`app_url\`=VALUES(\`app_url\`), \`preferred_time\`=VALUES(\`preferred_time\`), \`notes\`=VALUES(\`notes\`), \`status\`=VALUES(\`status\`), \`admin_note\`=VALUES(\`admin_note\`);`
    );
  });

  // 9. forum_posts & forum_comments
  const forumPosts = (state && state.forumPosts) || [];
  forumPosts.forEach(function (p) {
    const author = p.author || {};
    stmts.push(
      `INSERT INTO \`forum_posts\` (\`id\`, \`category\`, \`category_label\`, \`status\`, \`locked\`, \`pinned\`, \`title\`, \`content\`, \`member_deal\`, \`author_name\`, \`author_org\`, \`author_role_badge\`, \`author_verified_app\`, \`created_at_label\`, \`likes\`, \`views\`) VALUES (${sqlEsc(
        p.id
      )}, ${sqlEsc(p.category)}, ${sqlEsc(p.categoryLabel)}, ${sqlEsc(
        p.status || "approved"
      )}, ${sqlEsc(Boolean(p.locked))}, ${sqlEsc(Boolean(p.pinned))}, ${sqlEsc(
        p.title
      )}, ${sqlEsc(p.content)}, ${sqlEsc(p.memberDeal)}, ${sqlEsc(author.name)}, ${sqlEsc(
        author.org
      )}, ${sqlEsc(author.roleBadge)}, ${sqlEsc(author.verifiedApp)}, ${sqlEsc(
        p.createdAt
      )}, ${Number(p.likes || 0)}, ${Number(
        p.views || 0
      )}) ON DUPLICATE KEY UPDATE \`category\`=VALUES(\`category\`), \`category_label\`=VALUES(\`category_label\`), \`status\`=VALUES(\`status\`), \`locked\`=VALUES(\`locked\`), \`pinned\`=VALUES(\`pinned\`), \`title\`=VALUES(\`title\`), \`content\`=VALUES(\`content\`), \`member_deal\`=VALUES(\`member_deal\`), \`likes\`=VALUES(\`likes\`), \`views\`=VALUES(\`views\`);`
    );

    if (Array.isArray(p.comments)) {
      p.comments.forEach(function (c) {
        stmts.push(
          `INSERT INTO \`forum_comments\` (\`id\`, \`post_id\`, \`author_name\`, \`author_org\`, \`role_badge\`, \`comment_text\`, \`time_label\`) VALUES (${sqlEsc(
            c.id
          )}, ${sqlEsc(p.id)}, ${sqlEsc(c.authorName)}, ${sqlEsc(c.authorOrg)}, ${sqlEsc(
            c.roleBadge
          )}, ${sqlEsc(c.text)}, ${sqlEsc(
            c.time
          )}) ON DUPLICATE KEY UPDATE \`comment_text\`=VALUES(\`comment_text\`), \`time_label\`=VALUES(\`time_label\`);`
        );
      });
    }
  });

  // 10. announcements
  const announcements = (state && state.announcements) || [];
  announcements.forEach(function (a) {
    stmts.push(
      `INSERT INTO \`announcements\` (\`id\`, \`source_type\`, \`badge\`, \`title\`, \`summary\`, \`author_name\`, \`author_org\`, \`created_at_label\`, \`pinned\`, \`action_label\`, \`action_view\`) VALUES (${sqlEsc(
        a.id
      )}, ${sqlEsc(a.sourceType || "master")}, ${sqlEsc(a.badge)}, ${sqlEsc(a.title)}, ${sqlEsc(
        a.summary
      )}, ${sqlEsc(a.authorName)}, ${sqlEsc(a.authorOrg)}, ${sqlEsc(a.createdAt)}, ${sqlEsc(
        Boolean(a.pinned)
      )}, ${sqlEsc(a.actionLabel)}, ${sqlEsc(
        a.actionView
      )}) ON DUPLICATE KEY UPDATE \`badge\`=VALUES(\`badge\`), \`title\`=VALUES(\`title\`), \`summary\`=VALUES(\`summary\`), \`pinned\`=VALUES(\`pinned\`);`
    );
  });

  // 11. talents
  const talents = (state && state.talents) || [];
  talents.forEach(function (t) {
    stmts.push(
      `INSERT INTO \`talents\` (\`id\`, \`name\`, \`school\`, \`center\`, \`certs_json\`, \`domain\`, \`target_role\`, \`gpa\`, \`status\`, \`synced_to_erp_count\`) VALUES (${sqlEsc(
        t.id
      )}, ${sqlEsc(t.name)}, ${sqlEsc(t.school)}, ${sqlEsc(t.center)}, ${sqlEsc(
        t.certs || []
      )}, ${sqlEsc(t.domain)}, ${sqlEsc(t.targetRole)}, ${sqlEsc(t.gpa)}, ${sqlEsc(
        t.status
      )}, ${Number(
        t.syncedToErpCount || 0
      )}) ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`school\`=VALUES(\`school\`), \`center\`=VALUES(\`center\`), \`certs_json\`=VALUES(\`certs_json\`), \`status\`=VALUES(\`status\`), \`synced_to_erp_count\`=VALUES(\`synced_to_erp_count\`);`
    );
  });

  // 12. lms_contests
  const contests = (state && state.contests) || [];
  contests.forEach(function (c) {
    stmts.push(
      `INSERT INTO \`lms_contests\` (\`id\`, \`title\`, \`organizer\`, \`participants\`, \`leads_generated\`, \`target_group\`, \`reward\`) VALUES (${sqlEsc(
        c.id
      )}, ${sqlEsc(c.title)}, ${sqlEsc(c.organizer)}, ${Number(c.participants || 0)}, ${Number(
        c.leadsGenerated || 0
      )}, ${sqlEsc(c.targetGroup)}, ${sqlEsc(
        c.reward
      )}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`participants\`=VALUES(\`participants\`), \`leads_generated\`=VALUES(\`leads_generated\`), \`reward\`=VALUES(\`reward\`);`
    );
  });

  // 13. b2b_offers
  const b2bOffers = (state && state.b2bOffers) || [];
  b2bOffers.forEach(function (o) {
    stmts.push(
      `INSERT INTO \`b2b_offers\` (\`id\`, \`company\`, \`using_tech\`, \`category\`, \`offer\`, \`target_audience\`) VALUES (${sqlEsc(
        o.id
      )}, ${sqlEsc(o.company)}, ${sqlEsc(o.usingTech)}, ${sqlEsc(o.category)}, ${sqlEsc(
        o.offer
      )}, ${sqlEsc(
        o.target
      )}) ON DUPLICATE KEY UPDATE \`company\`=VALUES(\`company\`), \`offer\`=VALUES(\`offer\`), \`target_audience\`=VALUES(\`target_audience\`);`
    );
  });

  // 14. lighthouse_targets
  const lighthouseTargets = (state && state.lighthouseTargets) || [];
  lighthouseTargets.forEach(function (lt) {
    stmts.push(
      `INSERT INTO \`lighthouse_targets\` (\`segment\`, \`target_count\`, \`current_signed\`, \`in_pipeline\`, \`focus_area\`, \`combo_package\`, \`notes\`) VALUES (${sqlEsc(
        lt.segment
      )}, ${Number(lt.targetCount || 0)}, ${Number(lt.currentSigned || 0)}, ${Number(
        lt.inPipeline || 0
      )}, ${sqlEsc(lt.focusArea)}, ${sqlEsc(lt.comboPackage)}, ${sqlEsc(
        lt.notes
      )}) ON DUPLICATE KEY UPDATE \`target_count\`=VALUES(\`target_count\`), \`current_signed\`=VALUES(\`current_signed\`), \`in_pipeline\`=VALUES(\`in_pipeline\`), \`focus_area\`=VALUES(\`focus_area\`), \`combo_package\`=VALUES(\`combo_package\`), \`notes\`=VALUES(\`notes\`);`
    );
  });

  // 15. activity_logs
  const activityLogs = (state && state.activityLogs) || [];
  activityLogs.forEach(function (act) {
    stmts.push(
      `INSERT INTO \`activity_logs\` (\`id\`, \`time_label\`, \`source_app\`, \`target_app\`, \`event_type\`, \`event_text\`) VALUES (${sqlEsc(
        act.id
      )}, ${sqlEsc(act.time)}, ${sqlEsc(act.sourceApp)}, ${sqlEsc(act.targetApp)}, ${sqlEsc(
        act.eventType
      )}, ${sqlEsc(
        act.text
      )}) ON DUPLICATE KEY UPDATE \`time_label\`=VALUES(\`time_label\`), \`event_text\`=VALUES(\`event_text\`);`
    );
  });

  // 16. audit_logs
  const auditLogs = (state && state.auditLogs) || [];
  auditLogs.forEach(function (aud) {
    stmts.push(
      `INSERT INTO \`audit_logs\` (\`id\`, \`timestamp_label\`, \`actor_id\`, \`actor_name\`, \`actor_org\`, \`ip_address\`, \`action\`, \`target\`, \`severity\`, \`details\`) VALUES (${sqlEsc(
        aud.id
      )}, ${sqlEsc(aud.timestamp)}, ${sqlEsc(aud.actorId)}, ${sqlEsc(aud.actorName)}, ${sqlEsc(
        aud.actorOrg
      )}, ${sqlEsc(aud.ipAddress)}, ${sqlEsc(aud.action)}, ${sqlEsc(aud.target)}, ${sqlEsc(
        aud.severity || "INFO"
      )}, ${sqlEsc(
        aud.details
      )}) ON DUPLICATE KEY UPDATE \`timestamp_label\`=VALUES(\`timestamp_label\`), \`actor_id\`=VALUES(\`actor_id\`), \`actor_name\`=VALUES(\`actor_name\`), \`actor_org\`=VALUES(\`actor_org\`), \`ip_address\`=VALUES(\`ip_address\`), \`action\`=VALUES(\`action\`), \`target\`=VALUES(\`target\`), \`severity\`=VALUES(\`severity\`), \`details\`=VALUES(\`details\`);`
    );
  });

  return stmts;
}

// Xuất file SQL chuẩn `database/hesinhthai_db.sql`
function exportSqlDumpFile(state, outputPath) {
  const dbName = process.env.DB_DATABASE || "hesinhthai_db";
  const catalog = extractProductCatalogFromHtml();
  const seedStmts = buildDataSeedStatements(state, catalog);

  const lines = [
    "-- =====================================================================================",
    "-- TECHCORP ECOSYSTEM HUB — FULL MYSQL DATABASE SCHEMA & SEED DATA",
    "-- Database: " + dbName,
    "-- Domain:   https://hesinhthai.techcorp.info.vn",
    "-- Includes: 19 Relational Tables | 16 Live Apps | 96 Product Modules | 48 Integrations",
    "--           TechCorp ID Users & Personas | 5 RBAC Roles | 6 Hero Sliders | Demo Leads",
    "--           B2B Forum Posts & Comments | Announcements | Talents | Contests | Audit Logs",
    "-- =====================================================================================",
    "",
    "SET NAMES utf8mb4;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
    "CREATE DATABASE IF NOT EXISTS `" +
      dbName +
      "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    "USE `" + dbName + "`;",
    "",
    "-- -------------------------------------------------------------------------------------",
    "-- 1. ĐỊNH NGHĨA CẤU TRÚC 19 BẢNG DỮ LIỆU (DDL)",
    "-- -------------------------------------------------------------------------------------",
    SCHEMA_TABLES_DDL.join("\n\n"),
    "",
    "-- -------------------------------------------------------------------------------------",
    "-- 2. DỮ LIỆU KHỞI TẠO ĐẦY ĐỦ CHO HỆ SINH THÁI TECHCORP (DML SEED)",
    "-- -------------------------------------------------------------------------------------",
    seedStmts.join("\n"),
    "",
    "SET FOREIGN_KEY_CHECKS = 1;",
    ""
  ];

  const targetFile =
    outputPath || path.join(__dirname, "..", "database", "hesinhthai_db.sql");
  const dir = path.dirname(targetFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(targetFile, lines.join("\n"), "utf8");
  return targetFile;
}

// Đọc mật khẩu MySQL root từ cấu hình aaPanel trên Ubuntu nếu có
function detectAaPanelMysqlPassword() {
  const aaPanelConfigPath = "/www/server/panel/config/config.json";
  try {
    if (fs.existsSync(aaPanelConfigPath)) {
      const cfg = JSON.parse(fs.readFileSync(aaPanelConfigPath, "utf8"));
      if (cfg && cfg.mysql_root) return String(cfg.mysql_root);
    }
  } catch (_) {}
  return null;
}

// Khởi tạo kết nối MySQL thông minh (Hỗ trợ cả mysql2 và mysql, tự động dò mật khẩu Local & Server)
let activePool = null;
let mysqlStatus = {
  connected: false,
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  database: process.env.DB_DATABASE || "hesinhthai_db",
  user: process.env.DB_USER || "root",
  driver: null,
  totalTables: 19,
  lastSyncedAt: null,
  error: null
};

function getMysqlDriver() {
  try {
    return { lib: require("mysql2"), name: "mysql2" };
  } catch (_) {
    try {
      return { lib: require("mysql"), name: "mysql" };
    } catch (e) {
      return null;
    }
  }
}

function tryConnectTarget(driverLib, targetCfg, user, password, cb) {
  const connOpts = {
    user: user,
    password: password,
    charset: "utf8mb4",
    multipleStatements: true,
    connectTimeout: 5000
  };
  if (targetCfg.socketPath) {
    connOpts.socketPath = targetCfg.socketPath;
  } else {
    connOpts.host = targetCfg.host;
    connOpts.port = targetCfg.port;
  }
  const conn = driverLib.createConnection(connOpts);
  conn.connect(function (err) {
    if (err) {
      try {
        conn.destroy();
      } catch (_) {}
      return cb(err, null);
    }
    cb(null, conn);
  });
}

function connectMysqlSmart(callback) {
  const drv = getMysqlDriver();
  if (!drv) {
    mysqlStatus.error = "Chưa cài đặt driver mysql2 hoặc mysql";
    return callback(new Error(mysqlStatus.error));
  }
  mysqlStatus.driver = drv.name;

  const host = process.env.DB_HOST || "127.0.0.1";
  const port = parseInt(process.env.DB_PORT || "3306", 10);
  const user = process.env.DB_USER || "root";

  const candidatePasswords = [];
  if (process.env.DB_PASSWORD !== undefined) candidatePasswords.push(process.env.DB_PASSWORD);
  if (process.env.DB_PASSWORD_FALLBACK) candidatePasswords.push(process.env.DB_PASSWORD_FALLBACK);
  const aaPass = detectAaPanelMysqlPassword();
  if (aaPass && candidatePasswords.indexOf(aaPass) === -1) candidatePasswords.push(aaPass);
  ["Thong1976", "root123@", "Thong7690@", "Thong1976@", "root", ""].forEach(function (pw) {
    if (candidatePasswords.indexOf(pw) === -1) candidatePasswords.push(pw);
  });

  const candidateTargets = [{ host: host, port: port }];
  if (host !== "localhost") {
    candidateTargets.push({ host: "localhost", port: port });
  }
  if (fs.existsSync("/tmp/mysql.sock")) {
    candidateTargets.push({ socketPath: "/tmp/mysql.sock" });
  }
  if (fs.existsSync("/var/run/mysqld/mysqld.sock")) {
    candidateTargets.push({ socketPath: "/var/run/mysqld/mysqld.sock" });
  }

  const attempts = [];
  candidateTargets.forEach(function (t) {
    candidatePasswords.forEach(function (pw) {
      attempts.push({ target: t, password: pw });
    });
  });

  let idx = 0;
  let lastErrorMsg = "";
  function attemptNext() {
    if (idx >= attempts.length) {
      const err = new Error(
        "Không thể kết nối MySQL tại " +
          host +
          ":" +
          port +
          " với user '" +
          user +
          "'. Chi tiết: " +
          (lastErrorMsg || "Sai mật khẩu hoặc dịch vụ MySQL chưa chạy")
      );
      mysqlStatus.connected = false;
      mysqlStatus.error = err.message;
      return callback(err);
    }
    const item = attempts[idx++];
    tryConnectTarget(drv.lib, item.target, user, item.password, function (err, conn) {
      if (!err && conn) {
        return callback(null, conn, item.password, drv.lib, item.target);
      }
      if (err && err.message) {
        lastErrorMsg = err.message;
      }
      attemptNext();
    });
  }

  attemptNext();
}

// Đọc dữ liệu thực tế từ các bảng MySQL (audit_logs, demo_requests, lighthouse_targets) vào state
function pullLiveTablesFromMysql(queryRunner, state, callback) {
  const cb = typeof callback === "function" ? callback : function () {};
  if (!queryRunner || !state) return cb(null, false);

  let stateUpdated = false;

  queryRunner.query(
    "SELECT `id`, `timestamp_label`, `actor_id`, `actor_name`, `actor_org`, `ip_address`, `action`, `target`, `severity`, `details` FROM `audit_logs` ORDER BY `timestamp_label` DESC LIMIT 300;",
    function (audErr, audRows) {
      if (!audErr && Array.isArray(audRows) && audRows.length > 0) {
        if (!Array.isArray(state.auditLogs)) state.auditLogs = [];
        const existingMap = new Map(state.auditLogs.map(function (a) { return [a.id, a]; }));
        audRows.forEach(function (r) {
          if (!r || !r.id) return;
          const mapped = {
            id: String(r.id),
            timestamp: String(r.timestamp_label || ""),
            actorId: String(r.actor_id || "USR-ADMIN-00"),
            actorName: String(r.actor_name || "Quản trị viên TechCorp"),
            actorOrg: String(r.actor_org || "TechCorp Hub"),
            ipAddress: String(r.ip_address || "103.170.122.138"),
            action: String(r.action || "SYSTEM_ACTION"),
            target: String(r.target || "System"),
            severity: String(r.severity || "INFO"),
            details: String(r.details || "")
          };
          if (!existingMap.has(mapped.id)) {
            state.auditLogs.push(mapped);
            existingMap.set(mapped.id, mapped);
            stateUpdated = true;
          }
        });
        state.auditLogs.sort(function (a, b) {
          return String(b.timestamp || "").localeCompare(String(a.timestamp || ""));
        });
        if (state.auditLogs.length > 300) {
          state.auditLogs = state.auditLogs.slice(0, 300);
        }
      }

      queryRunner.query(
        "SELECT `id`, `full_name`, `phone`, `email`, `org_name`, `org_scale`, `product_id`, `product_name`, `app_url`, `preferred_time`, `notes`, `status`, `admin_note`, `ip_address`, `created_at` FROM `demo_requests` ORDER BY `created_at` DESC;",
        function (demoErr, demoRows) {
          if (!demoErr && Array.isArray(demoRows) && demoRows.length > 0) {
            if (!Array.isArray(state.demoRequests)) state.demoRequests = [];
            const demoMap = new Map(state.demoRequests.map(function (d) { return [d.id, d]; }));
            demoRows.forEach(function (r) {
              if (!r || !r.id) return;
              const mapped = {
                id: String(r.id),
                fullName: String(r.full_name || ""),
                phone: String(r.phone || ""),
                email: String(r.email || ""),
                orgName: String(r.org_name || ""),
                orgScale: String(r.org_scale || ""),
                productId: String(r.product_id || "erp"),
                productName: String(r.product_name || ""),
                appUrl: String(r.app_url || ""),
                preferredTime: String(r.preferred_time || ""),
                notes: String(r.notes || ""),
                status: String(r.status || "new"),
                adminNote: String(r.admin_note || ""),
                ipAddress: String(r.ip_address || "103.170.122.138"),
                createdAt: String(r.created_at || "")
              };
              if (!demoMap.has(mapped.id)) {
                state.demoRequests.unshift(mapped);
                demoMap.set(mapped.id, mapped);
                stateUpdated = true;
              } else {
                const cur = demoMap.get(mapped.id);
                if (mapped.adminNote && !cur.adminNote) {
                  cur.adminNote = mapped.adminNote;
                  stateUpdated = true;
                }
                if (mapped.status && mapped.status !== "new" && cur.status === "new") {
                  cur.status = mapped.status;
                  stateUpdated = true;
                }
              }
            });
          }

          queryRunner.query(
            "SELECT `id`, `segment`, `target_count`, `current_signed`, `in_pipeline`, `focus_area`, `combo_package`, `notes` FROM `lighthouse_targets` ORDER BY `id` ASC;",
            function (lhErr, lhRows) {
              if (!lhErr && Array.isArray(lhRows) && lhRows.length > 0) {
                if (!Array.isArray(state.lighthouseTargets)) state.lighthouseTargets = [];
                lhRows.forEach(function (r, idx) {
                  if (!r || !r.segment) return;
                  const found = state.lighthouseTargets.find(function (x) {
                    return x.segment === r.segment;
                  });
                  if (found) {
                    if (!found.id) found.id = "LH-0" + (idx + 1);
                    if (Number(r.current_signed) > Number(found.currentSigned || 0)) {
                      found.currentSigned = Number(r.current_signed);
                      found.inPipeline = Number(r.in_pipeline || 0);
                      stateUpdated = true;
                    }
                  } else {
                    state.lighthouseTargets.push({
                      id: "LH-" + (r.id || Date.now()),
                      segment: String(r.segment),
                      targetCount: Number(r.target_count || 10),
                      currentSigned: Number(r.current_signed || 0),
                      inPipeline: Number(r.in_pipeline || 0),
                      focusArea: String(r.focus_area || "Nha Trang - Khánh Hòa"),
                      comboPackage: String(r.combo_package || "Gói Combo Chuyển đổi số"),
                      notes: String(r.notes || "")
                    });
                    stateUpdated = true;
                  }
                });
              }
              return cb(null, stateUpdated);
            }
          );
        }
      );
    }
  );
}

function initAndSyncMysql(state, doneCallback) {
  const cb = typeof doneCallback === "function" ? doneCallback : function () {};
  const dbName = process.env.DB_DATABASE || "hesinhthai_db";

  // Luôn xuất file database/hesinhthai_db.sql mới nhất
  try {
    exportSqlDumpFile(state);
  } catch (_) {}

  connectMysqlSmart(function (err, bootstrapConn, workingPassword, driverLib, workingTarget) {
    if (err || !bootstrapConn) {
      return cb(err);
    }

    const createDbSql =
      "CREATE DATABASE IF NOT EXISTS `" +
      dbName +
      "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; USE `" +
      dbName +
      "`;";

    bootstrapConn.query(createDbSql, function (dbErr) {
      if (dbErr) {
        mysqlStatus.connected = false;
        mysqlStatus.error = dbErr.message;
        try {
          bootstrapConn.end();
        } catch (_) {}
        return cb(dbErr);
      }

      // Tạo Pool kết nối chuẩn tới hesinhthai_db
      if (!activePool) {
        const poolOpts = {
          connectionLimit: 10,
          user: process.env.DB_USER || "root",
          password: workingPassword,
          database: dbName,
          charset: "utf8mb4",
          multipleStatements: true
        };
        if (workingTarget && workingTarget.socketPath) {
          poolOpts.socketPath = workingTarget.socketPath;
          mysqlStatus.host = workingTarget.socketPath;
        } else {
          poolOpts.host = (workingTarget && workingTarget.host) || process.env.DB_HOST || "127.0.0.1";
          poolOpts.port = (workingTarget && workingTarget.port) || parseInt(process.env.DB_PORT || "3306", 10);
          mysqlStatus.host = poolOpts.host;
          mysqlStatus.port = poolOpts.port;
        }
        activePool = driverLib.createPool(poolOpts);
      }

      // Bước 1: Tạo các bảng DDL nếu chưa có
      let ddlIdx = 0;
      function runNextDdl() {
        if (ddlIdx >= SCHEMA_TABLES_DDL.length) {
          // Bước 2: Đọc dữ liệu thực tế đang lưu trong MySQL vào state trước khi đồng bộ ngược lại
          pullLiveTablesFromMysql(bootstrapConn, state, function (_, stateUpdatedFromMysql) {
            const catalog = extractProductCatalogFromHtml();
            const dmlStatements = buildDataSeedStatements(state, catalog);
            let dmlIdx = 0;
            function runNextDml() {
              if (dmlIdx >= dmlStatements.length) {
                mysqlStatus.connected = true;
                mysqlStatus.database = dbName;
                mysqlStatus.lastSyncedAt = new Date().toISOString();
                mysqlStatus.error = null;
                try {
                  bootstrapConn.end();
                } catch (_) {}
                return cb(null, mysqlStatus, stateUpdatedFromMysql);
              }
              const sql = dmlStatements[dmlIdx++];
              bootstrapConn.query(sql, function (qErr) {
                if (qErr) {
                  mysqlStatus.error = qErr.message;
                }
                runNextDml();
              });
            }
            runNextDml();
          });
          return;
        }
        const ddlSql = SCHEMA_TABLES_DDL[ddlIdx++];
        bootstrapConn.query(ddlSql, function () {
          runNextDdl();
        });
      }

      runNextDdl();
    });
  });
}

function syncStateToMysqlAsync(state) {
  try {
    exportSqlDumpFile(state);
  } catch (_) {}

  if (!activePool) {
    initAndSyncMysql(state);
    return;
  }

  const catalog = extractProductCatalogFromHtml();
  const stmts = buildDataSeedStatements(state, catalog);
  const batchSql = stmts.join("\n");

  activePool.query(batchSql, function (err) {
    if (!err) {
      mysqlStatus.connected = true;
      mysqlStatus.lastSyncedAt = new Date().toISOString();
      mysqlStatus.error = null;
    } else {
      mysqlStatus.error = err.message;
    }
  });
}

function executeMysqlStatement(sql, callback) {
  const cb = typeof callback === "function" ? callback : function () {};
  if (!activePool || !sql) return cb(null);
  activePool.query(sql, function (err, results) {
    cb(err, results);
  });
}

function pullFromMysqlAsync(state, callback) {
  const cb = typeof callback === "function" ? callback : function () {};
  if (!activePool) return cb(null, false);
  pullLiveTablesFromMysql(activePool, state, cb);
}

function getMysqlStatus() {
  return mysqlStatus;
}

module.exports = {
  initAndSyncMysql: initAndSyncMysql,
  syncStateToMysqlAsync: syncStateToMysqlAsync,
  executeMysqlStatement: executeMysqlStatement,
  pullFromMysqlAsync: pullFromMysqlAsync,
  exportSqlDumpFile: exportSqlDumpFile,
  getMysqlStatus: getMysqlStatus,
  SCHEMA_TABLES_DDL: SCHEMA_TABLES_DDL
};

