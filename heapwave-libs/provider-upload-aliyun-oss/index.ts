import OSS from "ali-oss";

interface ProviderOptions {
  endpoint?: string;
  accessKeyId: string;
  accessKeySecret: string;
  region?: string;
  bucket?: string;
  appPath?: string;
  secure: boolean;
  extraParams?: any; // 其他OSS客户端支持的参数
}

export = {
  name: "aliyun-oss",
  init(providerOptions: ProviderOptions) {
    const appPath = providerOptions.appPath || "example";
    const options = {
      // 填写Bucket所在地域
      region: providerOptions.region || "oss-cn-hangzhou",
      // 从环境变量中获取访问凭证
      accessKeyId: providerOptions.accessKeyId,
      accessKeySecret: providerOptions.accessKeySecret,
      // 启用V4签名
      authorizationV4: providerOptions.secure ?? true,
      endpoint: providerOptions.endpoint,
      bucket: providerOptions.bucket,
      ...(providerOptions.extraParams || {}),
    };
    const client = new OSS({
      // 填写Bucket所在地域
      region: providerOptions.region || "oss-cn-hangzhou",
      // 从环境变量中获取访问凭证
      accessKeyId: providerOptions.accessKeyId,
      accessKeySecret: providerOptions.accessKeySecret,
      // 启用V4签名
      authorizationV4: providerOptions.secure ?? true,
      endpoint: providerOptions.endpoint,
      bucket: providerOptions.bucket,
      ...(providerOptions.extraParams || {}),
    });

    // 自定义请求头
    const headers = {
      // 指定Object的存储类型。
      "x-oss-storage-class": "Standard",
      // 指定Object的访问权限。
      "x-oss-object-acl": "private",
      // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
      "Content-Disposition": 'attachment; filename="example.txt"',
      // 设置Object的标签，可同时设置多个标签。
      "x-oss-tagging": "Tag1=1&Tag2=2",
      // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
      "x-oss-forbid-overwrite": "true",
    };

    // health check
    const health = () => {
      if (client) return "healthy";
    };

    async function listBuckets() {
      if (!client) {
        console.error(
          "OSS client is not initialized. Please call init() first.",
        );
        return;
      }
      try {
        // 列举所有Bucket
        const result = await client.listBuckets({});
        return result;
      } catch (err) {
        console.log("列举Bucket失败，详细信息如下:");
        console.error(err);
        return;
      }
    }

    // Upload file using buffer
    function upload(file: any, options: any) {
      console.log("upload-->", typeof file, file, options);
      // file content is accessible via file.buffer
      // Upload to your OSS server here
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
        }, 100);
      });
    }

    // Upload file using stream
    async function uploadStream(file: any) {
      // 本后端服务提供的代理访问 oss 图片的接口基本路径
      // const baseUrl =
      //   process.env.NODE_ENV === "production"
      //     ? "https://heapwave.cn"
      //     : "http://localhost:1337";
      // console.log("uploadStream -->", options);
      // file content is accessible via file.stream
      const stream = file.stream;
      // 构建 OSS 中的文件路径
      const objectKey = appPath + "/" + file.hash + file.ext;

      try {
        // 上传到 OSS
        let result = await client.putStream(objectKey, stream);
        console.log("[upload stream]", result);

        // 构建 OSS URL
        const bucket = providerOptions.bucket;
        const endpoint = providerOptions.endpoint;
        // 如果没有 endpoint，则 url 为空
        const ossUrl = endpoint
          ? `https://${bucket}.${endpoint}/${objectKey}`
          : "";

        // 返回上传结果
        // Strapi 将使用这些信息来存储文件引用
        return {
          url: ossUrl, // 用于后续 getSignedUrl 生成签名 URL
          key: objectKey, // 存储在 OSS 中的对象键
        };
      } catch (err) {
        console.error("Error uploading file to OSS:", err);
        throw err;
      }
    }

    // Delete file from OSS
    async function __delete(file: any) {
      console.log("[delete oss file]", file);
      // Delete the file from your OSS server
      const fileName = appPath + "/" + file.hash + file.ext;
      try {
        await client.delete(fileName);
      } catch (error: any) {
        error.failObjectName = fileName;
        return error;
      }
    }

    // Delete multiple files from OSS
    async function deleteMany(files: any[]) {
      console.log("[deleteMany oss files]", files);
      // Delete multiple files from your OSS server
    }

    // Optional: custom file size check
    function checkFileSize(file: any, { sizeLimit }: { sizeLimit: number }) {
      // implement your own file size limit logic
    }

    // Optional: for private buckets - generate signed URLs
    function getSignedUrl(file: any) {
      // Generate signed URL for private bucket access
      try {
        // Strapi 会根据数据库中存储的文件信息调用此方法
        // file 对象可能包含的属性：hash, ext, name, url, path 等

        let objectKey: string;

        // 策略 1：如果 file 同时有 hash 和 ext（来自 uploadStream），使用此路径
        if (file.hash && file.ext) {
          objectKey = appPath + "/" + file.hash + file.ext;
        }
        // 策略 2：如果 file 有 url 属性，尝试从 URL 中提取路径
        else if (file.url) {
          // 从 URL 中提取对象路径，例如从 https://bucket.endpoint/appPath/hash.ext 提取 appPath/hash.ext
          const urlParts = file.url.split("/");
          objectKey = urlParts.slice(-2).join("/"); // 假设最后两部分是路径
        }
        // 策略 3：如果 file 有 path 属性
        else if (file.path) {
          objectKey = file.path;
        }
        // 策略 4：使用文件名称构建（备用方案）
        else if (file.name) {
          objectKey = appPath + "/" + file.name;
        } else {
          throw new Error("Cannot determine object key from file object");
        }

        console.log("getSignedUrl: objectKey =", objectKey, "file =", file);

        // 使用 ali-oss 生成签名 URL
        // expires: 签名有效期（秒），设置为 1 天，确保缩略图长期有效
        const signedUrl = client.signatureUrl(objectKey, {
          expires: 86400, // 1 天有效期
          method: "GET",
          // 再加一个 inline 响应参数（可选但推荐）：
          response: {
            "content-disposition": "inline",
          },
        });

        console.log("[getSignedUrl] generated URL:", signedUrl);
        return { url: signedUrl };
      } catch (err) {
        console.error("Error generating signed URL:", err);
        // 降级方案：返回空 URL，让 Strapi 使用默认处理
        return { url: "" };
      }
    }

    // Optional: return true if bucket is private
    function isPrivate() {
      return true; // set to true for private buckets
    }

    return {
      isPrivate,
      upload,
      uploadStream,
      getSignedUrl,
      delete: __delete,
      health,
      checkFileSize,
    };
  },
};
