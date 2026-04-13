export function renderBuckets(buckets: any[]) {
  if (!buckets || buckets.length === 0) {
    return "No buckets found.";
  }
  return buckets
    .map((bucket) => {
      return `\
======= Bucket Name: ${bucket.name} =======
region: ${bucket.region}
creationDate: ${bucket.creationDate}
storageClass: ${bucket.storageClass}
\n\n`;
    })
    .join("\n");
}
