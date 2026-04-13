module.exports = ({ env }) => ({
  /**
   * Upload plugin configuration
   */
  upload:{
    config: {
      provider: 'aliyun-oss',
      providerOptions: {
        endpoint: env('OSS_ENDPOINT', ''), // Optional, only needed if not using the default endpoint for the region
        accessKeyId: env('OSS_ACCESS_KEY_ID', ''),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET', ''),
        // region: env('OSS_REGION', 'oss-cn-hangzhou'),
        // bucket: env('OSS_BUCKET', ''),
        secure: env.bool('OSS_SECURE', true), // Optional, defaults to `true`
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    }
  },
  /**
   * Email plugin configuration
   */
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        // apiKey: "",
        host: env("SMTP_HOST", "smtp.example.com"),
        port: env.int("SMTP_PORT", 587),
        secure: false, // Use `true` for port 465
        auth: {
          user: env("SMTP_USER", ""),
          pass: env("SMTP_PASS", ""),
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM_EMAIL", "no-reply@heapwave.cn"),
        defaultReplyTo: env("SMTP_FROM_EMAIL", "no-reply@heapwave.cn"),
        ratelimit: {
          enabled: false,
          interval: 5,
          max: 5,
          delayAfter: 1, //The number of requests allowed before rate limiting is applied.
          timeWait: 1000, //Time to wait before responding to a request (in milliseconds).
          prefixKey: "${userEmail}", //The prefix for the rate limit key.
          whitelist: [], //Array of IP addresses to whitelist from rate limiting.
          store: {}, //Rate limiting storage location and for more information please see the koa2-ratelimit documentation.
        },
      },
    },
  },
});
