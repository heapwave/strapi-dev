import OSS from "ali-oss";

export interface ProviderOptions {
  endpoint?: string;
  accessKeyId: string;
  accessKeySecret: string;
  region?: string;
  bucket?: string;
  secure: boolean;
}

export default class ProviderUploadAliyunOss {
  public name: string;
  private client: OSS | null; // You can replace 'any' with the actual type of your OSS client

  constructor() {
    this.name = "aliyun-oss";
    this.client = null;
  }

  init(providerOptions: ProviderOptions): ProviderUploadAliyunOss {
    // 从环境变量中获取访问凭证（需要设置OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET）
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
    });
    this.client = client;
    return this;
  }

  health() {
    if (this.client) return "healthy";
  }

  async listBuckets() {
    if (!this.client) {
      console.error("OSS client is not initialized. Please call init() first.");
      return;
    }
    try {
      // 列举所有Bucket
      const result = await this.client.listBuckets({});
      return result;
    } catch (err) {
      console.log("列举Bucket失败，详细信息如下:");
      console.error(err);
      return;
    }
  }

  async test() {
    if (!this.client) {
      console.error("OSS client is not initialized. Please call init() first.");
      return;
    }
    try {
      // 列举所有Bucket
      const result = await this.client.listBuckets(null);

      console.log(
        "result",
        result,
        typeof result,
        Object.prototype.toString.call(result),
      );
      // 输出Bucket列表信息
      //   console.log(`共找到 ${result.buckets.length} 个Bucket:`);

      //   for (const bucket of result.buckets) {
      //     console.log(bucket.name);
      //   }
    } catch (err) {
      console.log("列举Bucket失败，详细信息如下:");
      console.error(err);
      return;
    }
  }

  // Upload file using buffer
  upload(file: any) {
    // file content is accessible via file.buffer
    // Upload to your OSS server here
  }

  // Upload file using stream
  uploadStream(file: any) {
    // file content is accessible via file.stream
    // Upload to your OSS server here
  }

  // Delete file from OSS
  delete(file: any) {
    // Delete the file from your OSS server
  }

  // Optional: custom file size check
  checkFileSize(file: any, { sizeLimit }: { sizeLimit: number }) {
    // implement your own file size limit logic
  }

  // Optional: for private buckets - generate signed URLs
  getSignedUrl(file: any) {
    // Returns an object { url: string }
  }

  // Optional: return true if bucket is private
  isPrivate() {
    return true; // set to true for private buckets
  }
}
