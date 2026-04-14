module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            // 添加你的阿里云 OSS 域名
            // 替换 your-region 和 your-bucket，例如：
            // '*.oss-cn-hangzhou.aliyuncs.com' - 匹配所有地域的 OSS 安全域名
            "*.aliyuncs.com", // 允许所有阿里云域名
            "https:", // 允许 https 协议
          ],
          "media-src": ["'self'", "data:", "blob:", "*.aliyuncs.com"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "script-src": ["'self'", "'unsafe-inline'"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
