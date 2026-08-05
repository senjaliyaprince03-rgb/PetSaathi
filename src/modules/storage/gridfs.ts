import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";

import { getGridFsBucket } from "@/lib/mongodb";

const TOKEN_TTL_SECONDS = 10 * 60;

type StoredObjectMetadata = {
  uploadId: string;
  bucket: string;
  objectPath: string;
  contentType: string;
  sizeBytes: number;
  createdAt: Date;
};

function signingSecret() {
  const configured = process.env.UPLOAD_SIGNING_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV !== "production") {
    return "petsaathi-local-upload-secret-change-before-production";
  }
  throw new Error("UPLOAD_SIGNING_SECRET must contain at least 32 characters in production.");
}

function signature(uploadId: string, expiresAt: number) {
  return createHmac("sha256", signingSecret()).update(`${uploadId}:${expiresAt}`).digest("hex");
}

function equalHex(leftHex: string, rightHex: string) {
  const left = Buffer.from(leftHex, "hex");
  const right = Buffer.from(rightHex, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

export function createUploadToken(uploadId: string) {
  const expiresAt = Math.floor(Date.now() / 1_000) + TOKEN_TTL_SECONDS;
  return `${expiresAt}.${signature(uploadId, expiresAt)}`;
}

export function verifyUploadToken(uploadId: string, token: string | null) {
  if (!token) return false;
  const [rawExpiry, received] = token.split(".");
  const expiresAt = Number(rawExpiry);
  if (!received || !Number.isSafeInteger(expiresAt) || expiresAt < Math.floor(Date.now() / 1_000)) return false;
  return equalHex(signature(uploadId, expiresAt), received);
}

async function findStoredObject(uploadId: string, bucketName: string) {
  const bucket = await getGridFsBucket();
  const [stored] = await bucket.find({
    "metadata.uploadId": uploadId,
    "metadata.bucket": bucketName,
  }).limit(1).toArray();
  return stored ?? null;
}

export async function storeGridFsObject(input: {
  uploadId: string;
  bucket: string;
  objectPath: string;
  contentType: string;
  bytes: Buffer;
}) {
  if (await findStoredObject(input.uploadId, input.bucket)) {
    throw new Error("gridfs_object_already_exists");
  }

  const bucket = await getGridFsBucket();
  const metadata: StoredObjectMetadata = {
    uploadId: input.uploadId,
    bucket: input.bucket,
    objectPath: input.objectPath,
    contentType: input.contentType,
    sizeBytes: input.bytes.byteLength,
    createdAt: new Date(),
  };
  const upload = bucket.openUploadStream(`${input.bucket}/${input.objectPath}`, {
    contentType: input.contentType,
    metadata,
  });

  await new Promise<void>((resolve, reject) => {
    upload.once("finish", () => resolve());
    upload.once("error", reject);
    Readable.from(input.bytes).pipe(upload);
  });
}

export async function readGridFsObject(uploadId: string, bucketName: string) {
  const stored = await findStoredObject(uploadId, bucketName);
  if (!stored) return null;
  const bucket = await getGridFsBucket();
  const chunks: Buffer[] = [];
  const stream = bucket.openDownloadStream(stored._id);
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export async function deleteGridFsObject(uploadId: string, bucketName: string) {
  const bucket = await getGridFsBucket();
  const stored = await bucket.find({
    "metadata.uploadId": uploadId,
    "metadata.bucket": bucketName,
  }).toArray();
  await Promise.all(stored.map(({ _id }) => bucket.delete(_id)));
  return stored.length;
}

export async function promoteGridFsObject(input: {
  uploadId: string;
  fromBucket: string;
  toBucket: string;
  destinationPath: string;
  contentType: string;
}) {
  const bytes = await readGridFsObject(input.uploadId, input.fromBucket);
  if (!bytes) return false;
  await storeGridFsObject({
    uploadId: input.uploadId,
    bucket: input.toBucket,
    objectPath: input.destinationPath,
    contentType: input.contentType,
    bytes,
  });
  await deleteGridFsObject(input.uploadId, input.fromBucket);
  return true;
}
