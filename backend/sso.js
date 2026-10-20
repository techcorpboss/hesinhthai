/**
 * TechCorp ID - Single Sign-On (SSO) & JWT Token Service
 * Chuẩn JWT (HS256) giúp các ứng dụng mới tích hợp xác thực người dùng tập trung
 * qua hesinhthai.techcorp.info.vn mà không cần đăng nhập lại.
 */

const crypto = require("crypto");

const SSO_SECRET = process.env.TECHCORP_SSO_SECRET || "techcorp_khanhhoa_sso_secret_key_2026";
const ISSUER = process.env.TECHCORP_HUB_DOMAIN || "https://hesinhthai.techcorp.info.vn";

function base64UrlEncode(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), "utf8");
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

function issueSsoToken(userPayload, expiresInSeconds = 86400) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  const payload = {
    iss: ISSUER,
    iat: now,
    exp: now + expiresInSeconds,
    sub: userPayload.userId || userPayload.id || "USR-NT-001",
    personaKey: userPayload.id || "ceo-sme",
    name: userPayload.name,
    org: userPayload.org,
    roleBadge: userPayload.roleBadge,
    defaultAppId: userPayload.defaultAppId || "biz-erp",
    ecosystemRegion: "Khánh Hòa"
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", SSO_SECRET)
    .update(signingInput)
    .digest();

  const encodedSignature = base64UrlEncode(signature);
  return {
    token: `${signingInput}.${encodedSignature}`,
    expiresAt: new Date((now + expiresInSeconds) * 1000).toISOString(),
    claims: payload
  };
}

function verifySsoToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Thiếu SSO Token" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Định dạng JWT không hợp lệ" };
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac("sha256", SSO_SECRET).update(signingInput).digest()
  );

  if (expectedSig !== encodedSignature) {
    return { valid: false, error: "Chữ ký SSO Token không hợp lệ" };
  }

  try {
    const claims = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && claims.exp < now) {
      return { valid: false, error: "SSO Token đã hết hạn" };
    }
    return { valid: true, claims };
  } catch (err) {
    return { valid: false, error: "Không thể giải mã payload JWT" };
  }
}

module.exports = {
  issueSsoToken,
  verifySsoToken,
  ISSUER
};
