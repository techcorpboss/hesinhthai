/**
 * TechCorp Ecosystem Hub Server (v2.0 — hesinhthai.techcorp.info.vn)
 * Full Backend API + Admin CMS + App CRUD + Forum Moderation + User Management + Audit Logs
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { db, SQLITE_DB_PATH, JSON_DB_PATH } = require("./backend/db");
const { issueSsoToken, verifySsoToken } = require("./backend/sso");

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "0.0.0.0";
const PUBLIC_DOMAIN = process.env.TECHCORP_HUB_DOMAIN || "https://hesinhthai.techcorp.info.vn";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  const xri = req.headers["x-real-ip"];
  if (xri) return String(xri).trim();
  return (req.socket && req.socket.remoteAddress) || (req.connection && req.connection.remoteAddress) || "103.170.122.138";
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-TechCorp-Api-Key, X-TechCorp-App-Id"
  );
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error("JSON không hợp lệ"));
      }
    });
    req.on("error", reject);
  });
}

function buildIntegrationGuide(app) {
  return {
    widgetSnippet: `<script src="${PUBLIC_DOMAIN}/widget/techcorp-ecosystem-bar.js" data-hub-url="${PUBLIC_DOMAIN}" data-app-id="${app.id}" data-org-name="Đơn vị Thành viên Khánh Hòa" data-user-role="SSO Member" defer></script>`,
    ssoVerifyCurl: `curl -X GET "${PUBLIC_DOMAIN}/api/v1/sso/verify" -H "Authorization: Bearer <SSO_JWT_TOKEN>"`,
    publishEventCurl: `curl -X POST "${PUBLIC_DOMAIN}/api/v1/events/publish" \\\n  -H "Content-Type: application/json" \\\n  -H "X-TechCorp-Api-Key: ${app.apiKey}" \\\n  -d '{"sourceApp":"${app.id}","targetApp":"biz-erp","eventType":"CUSTOM_SYNC","text":"[${app.name}] Đồng bộ dữ liệu thời gian thực lên TechCorp Hub"}'`,
    nodeExample: `// Tích hợp vào Backend Node.js / PHP / .NET của ứng dụng "${app.name}"
const response = await fetch("${PUBLIC_DOMAIN}/api/v1/events/publish", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-TechCorp-Api-Key": "${app.apiKey}"
  },
  body: JSON.stringify({
    sourceApp: "${app.id}",
    targetApp: "all",
    eventType: "DATA_SYNC",
    text: "[${app.name}] Đẩy dữ liệu liên thông lên Hệ sinh thái TechCorp"
  })
});`
  };
}

async function handleApi(req, res, parsedUrl) {
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const clientIp = getClientIp(req);

  if (method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  // 1. Healthcheck
  if (pathname === "/api/v1/health" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      service: "TechCorp Ecosystem Hub API, Admin CMS, SSO & Audit Logs",
      domain: PUBLIC_DOMAIN,
      totalConnectedApps: db.state.apps.length,
      totalUsers: (db.state.users || []).length,
      totalForumPosts: (db.state.forumPosts || []).length,
      totalAuditLogs: (db.state.auditLogs || []).length,
      storage: {
        sqlitePath: path.basename(SQLITE_DB_PATH),
        jsonPath: path.basename(JSON_DB_PATH)
      },
      timestamp: new Date().toISOString()
    });
  }

  // 2. Bootstrap Ecosystem State for Portal UI
  if (pathname === "/api/v1/bootstrap" && method === "GET") {
    const defaultPersona = db.state.personas["super-admin"] || db.state.personas["ceo-sme"];
    const sso = issueSsoToken(defaultPersona);
    return sendJson(res, 200, {
      ok: true,
      meta: db.state.meta,
      sso,
      heroSliders: db.state.heroSliders || [],
      demoRequests: db.state.demoRequests || [],
      apps: db.getPublicApps(),
      users: db.state.users || [],
      personas: db.state.personas,
      announcements: db.state.announcements || [],
      rbacMatrix: db.state.rbacMatrix || {},
      talents: db.state.talents,
      contests: db.state.contests,
      b2bOffers: db.state.b2bOffers,
      forumPosts: db.state.forumPosts || [],
      auditLogs: db.state.auditLogs || [],
      lighthouseTargets: db.state.lighthouseTargets,
      activityLogs: db.state.activityLogs
    });
  }

  // 3. List Registered Ecosystem Apps + Latest Approved Forum Headline (for Topbar Widget)
  if (pathname === "/api/v1/apps" && method === "GET") {
    const approvedPosts = (db.state.forumPosts || []).filter((p) => p.status !== "rejected");
    const topPost = approvedPosts[0] || null;
    const activeApps = db.getPublicApps().filter((a) => a.status !== "locked");
    return sendJson(res, 200, {
      ok: true,
      apps: activeApps,
      allApps: db.getPublicApps(),
      latestForumHeadline: topPost
        ? { id: topPost.id, title: topPost.title, authorOrg: (topPost.author && topPost.author.org) || "" }
        : null
    });
  }

  // 4. App Registry CRUD: Create, Update, Delete
  if (pathname === "/api/v1/apps/register" && method === "POST") {
    try {
      const body = await parseBody(req);
      if (!body.name || !body.id) {
        return sendJson(res, 400, {
          ok: false,
          error: "Vui lòng nhập Tên ứng dụng (name) và Mã định danh (id)."
        });
      }
      const newApp = db.registerApp(body, body.actorKey || "super-admin", clientIp);
      const integration = buildIntegrationGuide(newApp);
      return sendJson(res, 201, {
        ok: true,
        message: `Đã đăng ký thành công ứng dụng "${newApp.name}" vào Hệ sinh thái TechCorp!`,
        app: newApp,
        integration,
        apps: db.getPublicApps(),
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const appItemMatch = pathname.match(/^\/api\/v1\/apps\/([^/]+)$/);
  if (appItemMatch && method === "PUT") {
    try {
      const appId = decodeURIComponent(appItemMatch[1]);
      const body = await parseBody(req);
      const updated = db.updateApp(appId, body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        app: updated,
        apps: db.getPublicApps(),
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (appItemMatch && method === "DELETE") {
    try {
      const appId = decodeURIComponent(appItemMatch[1]);
      const removed = db.deleteApp(appId, "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        removed,
        apps: db.getPublicApps(),
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 5. Issue SSO JWT Token (TechCorp ID) + Audit Log
  if (pathname === "/api/v1/sso/token" && method === "POST") {
    try {
      const body = await parseBody(req);
      const personaKey = body.personaKey || "ceo-sme";
      const persona = db.state.personas[personaKey] || {
        id: personaKey,
        userId: body.userId || "USR-CUSTOM-" + Date.now(),
        name: body.name || "Thành viên TechCorp",
        org: body.org || "Đơn vị Thành viên Khánh Hòa",
        roleBadge: body.roleBadge || "SSO Member",
        defaultAppId: body.defaultAppId || "biz-erp"
      };
      const tokenData = issueSsoToken(persona);
      db.addAuditLog({
        actorKey: personaKey,
        ipAddress: clientIp,
        action: "SSO_TOKEN_ISSUED",
        target: `Phiên đăng nhập SSO (${persona.name})`,
        severity: "INFO",
        details: `Cấp mới JWT Token cho tài khoản ${persona.userId} thuộc đơn vị "${persona.org}".`
      });
      return sendJson(res, 200, {
        ok: true,
        persona,
        auditLogs: db.state.auditLogs,
        ...tokenData
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 6. Verify SSO JWT Token
  if (pathname === "/api/v1/sso/verify" && method === "GET") {
    const authHeader = req.headers["authorization"] || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const queryToken = parsedUrl.searchParams.get("token") || "";
    const token = bearerToken || queryToken;
    const result = verifySsoToken(token);
    return sendJson(res, result.valid ? 200 : 401, {
      ok: result.valid,
      ...result
    });
  }

  // 7. Community Forum APIs & Admin Moderation (Thẩm định, Tạo mới, Xem, Xoá, Lock)
  if (pathname === "/api/v1/forum/posts" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      forumPosts: db.state.forumPosts || []
    });
  }

  if (pathname === "/api/v1/forum/posts" && method === "POST") {
    try {
      const body = await parseBody(req);
      const newPost = db.createForumPost(body, body.personaKey || "ceo-sme", clientIp);
      return sendJson(res, 201, {
        ok: true,
        post: newPost,
        forumPosts: db.state.forumPosts,
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const forumPostItemMatch = pathname.match(/^\/api\/v1\/forum\/posts\/([^/]+)$/);
  if (forumPostItemMatch && method === "PUT") {
    try {
      const postId = decodeURIComponent(forumPostItemMatch[1]);
      const body = await parseBody(req);
      const updated = db.moderateForumPost(postId, body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        post: updated,
        forumPosts: db.state.forumPosts,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (forumPostItemMatch && method === "DELETE") {
    try {
      const postId = decodeURIComponent(forumPostItemMatch[1]);
      const removed = db.deleteForumPost(postId, "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        removed,
        forumPosts: db.state.forumPosts,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const forumCommentMatch = pathname.match(/^\/api\/v1\/forum\/posts\/([^/]+)\/comments$/);
  if (forumCommentMatch && method === "POST") {
    try {
      const postId = decodeURIComponent(forumCommentMatch[1]);
      const body = await parseBody(req);
      const updatedPost = db.addForumComment(
        postId,
        body.text,
        body.personaKey || "ceo-sme",
        clientIp
      );
      return sendJson(res, 201, {
        ok: true,
        post: updatedPost,
        forumPosts: db.state.forumPosts,
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const forumLikeMatch = pathname.match(/^\/api\/v1\/forum\/posts\/([^/]+)\/like$/);
  if (forumLikeMatch && method === "POST") {
    try {
      const postId = decodeURIComponent(forumLikeMatch[1]);
      const updatedPost = db.likeForumPost(postId);
      return sendJson(res, 200, {
        ok: true,
        post: updatedPost,
        forumPosts: db.state.forumPosts
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 8. User Account Management CRUD (TechCorp ID Users)
  if (pathname === "/api/v1/users" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      users: db.state.users || [],
      personas: db.state.personas
    });
  }

  if (pathname === "/api/v1/users" && method === "POST") {
    try {
      const body = await parseBody(req);
      const newUser = db.createUser(body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 201, {
        ok: true,
        user: newUser,
        users: db.state.users,
        personas: db.state.personas,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const userItemMatch = pathname.match(/^\/api\/v1\/users\/([^/]+)$/);
  if (userItemMatch && method === "PUT") {
    try {
      const userId = decodeURIComponent(userItemMatch[1]);
      const body = await parseBody(req);
      const updated = db.updateUser(userId, body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        user: updated,
        users: db.state.users,
        personas: db.state.personas,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (userItemMatch && method === "DELETE") {
    try {
      const userId = decodeURIComponent(userItemMatch[1]);
      const removed = db.deleteUser(userId, "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        removed,
        users: db.state.users,
        personas: db.state.personas,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 9. User Traceability & Audit Logs APIs
  if (pathname === "/api/v1/audit-logs" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      auditLogs: db.state.auditLogs || []
    });
  }

  if (pathname === "/api/v1/audit-logs" && method === "POST") {
    try {
      const body = await parseBody(req);
      const log = db.addAuditLog({
        actorKey: body.actorKey || "super-admin",
        ipAddress: clientIp,
        action: body.action || "USER_ACTION",
        target: body.target || "TechCorp Hub",
        severity: body.severity || "INFO",
        details: body.details || ""
      });
      return sendJson(res, 201, {
        ok: true,
        log,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 10. Publish Cross-Platform Ecosystem Event
  if (pathname === "/api/v1/events/publish" && method === "POST") {
    try {
      const body = await parseBody(req);
      const apiKey = req.headers["x-techcorp-api-key"];
      let matchedApp = null;
      if (apiKey) {
        matchedApp = db.state.apps.find((a) => a.apiKey === apiKey);
        if (!matchedApp) {
          return sendJson(res, 401, { ok: false, error: "API Key không hợp lệ." });
        }
      }

      let logText = body.text;
      let sourceApp = matchedApp ? matchedApp.id : body.sourceApp || "techcorp-hub";
      let targetApp = body.targetApp || "all";
      let eventType = body.eventType || "CUSTOM_SYNC";

      if (body.presetType === "erp-job") {
        sourceApp = "biz-erp";
        targetApp = "edu-school";
        eventType = "ERP_JOB_POSTED";
        logText =
          '[ERP -> Cổng Trường & Trung tâm] Tin tuyển dụng "Chuyên viên Kinh doanh & Điều hành Tour tiếng Anh" vừa được phát tự động tới 2 Trường ĐH và 10 Trung tâm NN-TH tại Nha Trang.';
      } else if (body.presetType === "exam-cert") {
        sourceApp = "lms-exam";
        targetApp = "edu-center";
        eventType = "EXAM_CERT_ISSUED";
        logText =
          "[Thi Online -> Hồ sơ Năng lực Số] 45 thí sinh tại Nha Trang vừa hoàn thành bài thi thử TOEIC/Tin học, hệ thống đã tự động cấp QR Chứng chỉ số và gợi ý khóa học cho Trung tâm.";
      } else if (body.presetType === "parent-voucher") {
        sourceApp = "biz-erp";
        targetApp = "edu-school";
        eventType = "SME_VOUCHER_PUBLISHED";
        logText =
          "[Doanh nghiệp SME -> Sổ liên lạc Phụ huynh] Chiến dịch E-Voucher ưu đãi 20% dịch vụ Gia đình & Khóa học Hè đã gửi tới 3.500 Phụ huynh Mầm non - Phổ thông tại Nha Trang.";
      }

      if (!logText) {
        return sendJson(res, 400, { ok: false, error: "Thiếu nội dung sự kiện (text)." });
      }

      const evt = db.addEvent({ sourceApp, targetApp, eventType, text: logText });
      db.addAuditLog({
        actorKey: body.actorKey || "super-admin",
        ipAddress: clientIp,
        action: eventType,
        target: `${sourceApp} -> ${targetApp}`,
        severity: "INFO",
        details: logText
      });

      return sendJson(res, 201, {
        ok: true,
        event: evt,
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 11. Push Candidate Profile (Talent Passport) to ERP HRM
  const pushErpMatch = pathname.match(/^\/api\/v1\/talents\/([^/]+)\/push-erp$/);
  if (pushErpMatch && method === "POST") {
    const talentId = decodeURIComponent(pushErpMatch[1]);
    const talent = db.state.talents.find((t) => t.id === talentId);
    if (!talent) {
      return sendJson(res, 404, { ok: false, error: "Không tìm thấy hồ sơ ứng viên." });
    }
    talent.syncedToErpCount = (talent.syncedToErpCount || 0) + 1;
    const evt = db.addEvent({
      sourceApp: "lms-exam",
      targetApp: "biz-erp",
      eventType: "HRM_CANDIDATE_IMPORTED",
      text: `[1-Click HRM Sync] Hồ sơ năng lực số của ${talent.name} (${talent.id}) đã được đồng bộ thẳng vào Phân hệ Tuyển dụng HRM trên ERP Doanh nghiệp.`
    });
    db.addAuditLog({
      actorKey: "ceo-sme",
      ipAddress: clientIp,
      action: "HRM_CANDIDATE_IMPORT",
      target: `${talent.name} (${talent.id})`,
      severity: "INFO",
      details: `Đồng bộ Hồ sơ Năng lực Số của ứng viên ${talent.name} vào phân hệ HRM trên ERP.`
    });
    return sendJson(res, 200, {
      ok: true,
      talent,
      event: evt,
      auditLogs: db.state.auditLogs,
      activityLogs: db.state.activityLogs
    });
  }

  // 12. Sync Leads from Contest to Training Center CRM
  const syncLeadMatch = pathname.match(/^\/api\/v1\/contests\/([^/]+)\/sync-leads$/);
  if (syncLeadMatch && method === "POST") {
    const contestId = decodeURIComponent(syncLeadMatch[1]);
    const contest = db.state.contests.find((c) => c.id === contestId);
    if (!contest) {
      return sendJson(res, 404, { ok: false, error: "Không tìm thấy kỳ thi." });
    }
    contest.participants += 12;
    contest.leadsGenerated += 5;
    const evt = db.addEvent({
      sourceApp: "lms-exam",
      targetApp: "edu-center",
      eventType: "CENTER_LEADS_SYNCED",
      text: `[Thi Online -> CRM Trung tâm] Đã chuyển ${contest.leadsGenerated} học viên tiềm năng từ kỳ thi "${contest.title}" vào phần mềm Quản lý Trung tâm Ngoại ngữ - Tin học.`
    });
    db.addAuditLog({
      actorKey: "center-dir",
      ipAddress: clientIp,
      action: "LMS_LEAD_SYNC",
      target: contest.title,
      severity: "INFO",
      details: `Đồng bộ ${contest.leadsGenerated} data thí sinh từ kỳ thi Online về CRM Trung tâm.`
    });
    return sendJson(res, 200, {
      ok: true,
      contest,
      contests: db.state.contests,
      event: evt,
      auditLogs: db.state.auditLogs,
      activityLogs: db.state.activityLogs
    });
  }

  // 13. Connect B2B Offer
  if (pathname === "/api/v1/b2b/connect" && method === "POST") {
    try {
      const body = await parseBody(req);
      const company = body.company || "Doanh nghiệp Thành viên";
      const evt = db.addEvent({
        sourceApp: "techcorp-hub",
        targetApp: "biz-erp",
        eventType: "B2B_MATCH_REQUEST",
        text: `[Kết nối B2B Nội bộ] Đơn vị thành viên vừa gửi yêu cầu hợp tác ưu đãi nội bộ tới "${company}" qua TechCorp Hub.`
      });
      db.addAuditLog({
        actorKey: body.actorKey || "ceo-sme",
        ipAddress: clientIp,
        action: "B2B_CONNECT",
        target: company,
        severity: "INFO",
        details: `Gửi yêu cầu kết nối giao thương nội bộ tới "${company}".`
      });
      return sendJson(res, 200, {
        ok: true,
        event: evt,
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 14. Increment Lighthouse Customer Deal in Nha Trang
  const lighthouseMatch = pathname.match(/^\/api\/v1\/lighthouse\/(\d+)\/increment$/);
  if (lighthouseMatch && method === "POST") {
    const idx = parseInt(lighthouseMatch[1], 10);
    const item = db.state.lighthouseTargets[idx];
    if (!item) {
      return sendJson(res, 404, { ok: false, error: "Không tìm thấy phân khúc mục tiêu." });
    }
    item.currentSigned += 1;
    if (item.inPipeline > 0) item.inPipeline -= 1;
    const evt = db.addEvent({
      sourceApp: "techcorp-hub",
      targetApp: "all",
      eventType: "LIGHTHOUSE_DEAL_CLOSED",
      text: `[Chiến dịch Hạt nhân Nha Trang] Chúc mừng! Vừa chốt thêm 01 khách hàng thuộc nhóm "${item.segment}" (Tổng: ${item.currentSigned}/${item.targetCount}).`
    });
    db.addAuditLog({
      actorKey: "super-admin",
      ipAddress: clientIp,
      action: "CRM_LIGHTHOUSE_CLOSE",
      target: item.segment,
      severity: "INFO",
      details: `Cập nhật tiến độ chốt khách hàng hạt nhân Nha Trang lên ${item.currentSigned}/${item.targetCount}.`
    });
    return sendJson(res, 200, {
      ok: true,
      lighthouseTargets: db.state.lighthouseTargets,
      event: evt,
      auditLogs: db.state.auditLogs,
      activityLogs: db.state.activityLogs
    });
  }

  // 15. RBAC Permission Matrix Update
  if (pathname === "/api/v1/rbac" && method === "PUT") {
    try {
      const body = await parseBody(req);
      const updatedMatrix = db.updateRbacPermission(
        body.roleCode,
        body.permKey,
        body.value,
        body.actorKey || "super-admin",
        clientIp
      );
      return sendJson(res, 200, {
        ok: true,
        rbacMatrix: updatedMatrix,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 16. Ecosystem Central Announcements (Master & Member Bulletins)
  if (pathname === "/api/v1/announcements" && method === "POST") {
    try {
      const body = await parseBody(req);
      const created = db.createAnnouncement(body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 201, {
        ok: true,
        announcement: created,
        announcements: db.state.announcements,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const annDeleteMatch = pathname.match(/^\/api\/v1\/announcements\/([^/]+)$/);
  if (annDeleteMatch && method === "DELETE") {
    try {
      const annId = decodeURIComponent(annDeleteMatch[1]);
      const removed = db.deleteAnnouncement(annId, "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        removed,
        announcements: db.state.announcements,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 17. Hero Sliders CMS (6 Slides on Public Page)
  if (pathname === "/api/v1/hero-sliders" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      heroSliders: db.state.heroSliders || []
    });
  }

  if (pathname === "/api/v1/hero-sliders/reset" && method === "POST") {
    try {
      const body = await parseBody(req);
      const resetList = db.resetHeroSliders(body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        heroSliders: resetList,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const sliderMatch = pathname.match(/^\/api\/v1\/hero-sliders\/([^/]+)$/);
  if (sliderMatch && method === "PUT") {
    try {
      const slideId = decodeURIComponent(sliderMatch[1]);
      const body = await parseBody(req);
      const updated = db.updateHeroSlider(slideId, body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        slide: updated,
        heroSliders: db.state.heroSliders,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 18. Customer Demo Requests & Contact Leads Management
  if (pathname === "/api/v1/demo-requests" && method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      demoRequests: db.state.demoRequests || []
    });
  }

  if (pathname === "/api/v1/demo-requests" && method === "POST") {
    try {
      const body = await parseBody(req);
      const created = db.createDemoRequest(body, clientIp);
      return sendJson(res, 201, {
        ok: true,
        message: "Đã gửi yêu cầu Đăng ký Demo thành công! Chuyên gia TechCorp sẽ liên hệ trong 15 phút.",
        demoRequest: created,
        demoRequests: db.state.demoRequests,
        auditLogs: db.state.auditLogs,
        activityLogs: db.state.activityLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  const demoLeadMatch = pathname.match(/^\/api\/v1\/demo-requests\/([^/]+)$/);
  if (demoLeadMatch && method === "PUT") {
    try {
      const leadId = decodeURIComponent(demoLeadMatch[1]);
      const body = await parseBody(req);
      const updated = db.updateDemoRequest(leadId, body, body.actorKey || "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        demoRequest: updated,
        demoRequests: db.state.demoRequests,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (demoLeadMatch && method === "DELETE") {
    try {
      const leadId = decodeURIComponent(demoLeadMatch[1]);
      const removed = db.deleteDemoRequest(leadId, "super-admin", clientIp);
      return sendJson(res, 200, {
        ok: true,
        removed,
        demoRequests: db.state.demoRequests,
        auditLogs: db.state.auditLogs
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  return sendJson(res, 404, { ok: false, error: `API endpoint không tồn tại: ${method} ${pathname}` });
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    if (parsedUrl.pathname.startsWith("/api/")) {
      return await handleApi(req, res, parsedUrl);
    }

    let safePath = path.normalize(decodeURIComponent(parsedUrl.pathname)).replace(/^(\.\.[/\\])+/, "");
    if (safePath === "/" || safePath === "\\") {
      safePath = "/index.html";
    }

    const filePath = path.join(__dirname, safePath);
    if (!filePath.startsWith(__dirname)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      setCorsHeaders(res);
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
    }
  } catch (err) {
    sendJson(res, 500, { ok: false, error: err.message || "Internal Server Error" });
  }
});

if (process.argv.includes("--seed")) {
  db.save();
  console.log("✅ Đã khởi tạo dữ liệu mẫu v4.0 (Multi-Tenant RBAC, Announcements, Admin CMS & Audit Logs) thành công!");
  process.exit(0);
}

server.listen(PORT, HOST, () => {
  console.log("==================================================================");
  console.log(`🚀 TECHCORP ECOSYSTEM HUB v4.0 (MULTI-TENANT RBAC & ENTERPRISE PORTAL) ĐANG CHẠY!`);
  console.log(`🌐 Local URL   : http://localhost:${PORT}`);
  console.log(`🌍 Domain đích : ${PUBLIC_DOMAIN}`);
  console.log(`🗄️  SQLite DB   : ${SQLITE_DB_PATH}`);
  console.log(`📄 JSON DB     : ${JSON_DB_PATH}`);
  console.log("==================================================================");
});
