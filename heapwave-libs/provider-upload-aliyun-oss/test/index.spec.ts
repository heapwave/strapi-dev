import AliyunOSSProvider from "../index.js";
import * as dotenv from "dotenv";
import assert from "node:assert";
import { describe, it } from "mocha";
import { renderBuckets } from "../utils/index.js";

dotenv.config();

const provider = AliyunOSSProvider

console.log("provider", provider, process.env.OSS_ACCESS_KEY_ID);

describe("OSS Client", () => {
  let initializedProvider: any = null;

  beforeEach(() => {
    const options = {
      accessKeyId: process.env.OSS_ACCESS_KEY_ID || "your-access-key-id",
      accessKeySecret:
        process.env.OSS_ACCESS_KEY_SECRET || "your-access-key-secret",
      region: "oss-cn-hangzhou",
      secure: true,
    };
    initializedProvider = provider.init(options);
  });

  it("initialization check", () => {
    const result = initializedProvider.health();
    assert.strictEqual(result, "healthy", "Provider should be healthy");
  });

  it("list buckets", async () => {
    const result = await initializedProvider.listBuckets();
    console.log("Buckets:", renderBuckets(result.buckets));
    assert.ok(result, "Should return a list of buckets");
  });
});
