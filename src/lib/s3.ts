import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

function getClient(): S3Client | null {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) return null;
  if (!client) {
    client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
  }
  return client;
}

const ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "audio/mpeg",
  "audio/wav",
  "text/plain",
]);

export function isAllowedUploadMime(mime: string) {
  return ALLOWED_MIME.has(mime);
}

export async function createPresignedPutUrl(params: {
  bucket: string;
  key: string;
  contentType: string;
  expiresSeconds?: number;
}): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  if (!isAllowedUploadMime(params.contentType)) {
    throw new Error("File type not allowed");
  }
  const cmd = new PutObjectCommand({
    Bucket: params.bucket,
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(c, cmd, { expiresIn: params.expiresSeconds ?? 3600 });
}

export async function createPresignedGetUrl(params: {
  bucket: string;
  key: string;
  expiresSeconds?: number;
}): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  const cmd = new GetObjectCommand({ Bucket: params.bucket, Key: params.key });
  return getSignedUrl(c, cmd, { expiresIn: params.expiresSeconds ?? 3600 });
}

/** Virus scan hook — integrate ClamAV or vendor async job */
export async function virusScanPlaceholder(fileKey: string): Promise<"pending" | "clean" | "blocked"> {
  void fileKey;
  return "pending";
}
