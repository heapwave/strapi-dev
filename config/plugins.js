module.exports = ({ env }) => ({
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
