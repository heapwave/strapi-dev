const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

module.exports = {
  async preview(ctx) {
    const { filename } = ctx.params;

    // Access the upload provider
    const provider = strapi.plugin("upload").provider;

    const stream = await provider.getStream(filename);

    // Koa/Strapi can send a Node readable stream directly.
    // The provider returns an IncomingMessage, which is already a readable stream.
    ctx.type = path.extname(filename);
    ctx.set("Content-Disposition", `inline; filename="${filename}"`);
    ctx.body = stream;
  },

  async upload(ctx) {
    const provider = strapi.plugin("upload").provider;
    const incoming = ctx.request.files?.file; // field name: file
    if (!incoming) return ctx.badRequest("No file uploaded");
    // If frontend sends multiple files with same field, normalize
    const file = Array.isArray(incoming) ? incoming[0] : incoming;
    // Build the shape your aliyun provider expects
    const uploadFile = {
      hash: crypto.randomUUID().replace(/-/g, ""),
      ext: path.extname(file.originalFilename || file.name || ""),
      mime: file.mimetype || file.type,
      name: file.originalFilename || file.name,
      size: file.size,
      stream: fs.createReadStream(file.filepath),
    };
    const result = await provider.uploadStream(uploadFile);
    const savedName = result.key.split('/').pop();
    console.log('result', result)
    // result: { url, key } from your provider
    ctx.body = {
      filename: savedName,
    };
  },
};
