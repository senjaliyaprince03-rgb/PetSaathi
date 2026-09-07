/**
 * Upload Security Validation
 * Validates MIME types, file sizes, and prevents common upload attacks
 */

import "server-only";

/**
 * Allowed MIME types by upload purpose
 */
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  PET_PHOTO: ["image/jpeg", "image/png", "image/webp"],
  SITTER_EVIDENCE: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  REPORT_MEDIA: ["image/jpeg", "image/png", "image/webp", "video/mp4"],
  INCIDENT_EVIDENCE: ["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"],
  MEDICAL_DOCUMENT: ["application/pdf", "image/jpeg", "image/png"],
  INVOICE_DOCUMENT: ["application/pdf"]
};

/**
 * Maximum file sizes by purpose (in bytes)
 */
const MAX_FILE_SIZES: Record<string, number> = {
  PET_PHOTO: 10 * 1024 * 1024, // 10MB
  SITTER_EVIDENCE: 10 * 1024 * 1024, // 10MB
  REPORT_MEDIA: 50 * 1024 * 1024, // 50MB (for videos)
  INCIDENT_EVIDENCE: 50 * 1024 * 1024, // 50MB
  MEDICAL_DOCUMENT: 10 * 1024 * 1024, // 10MB
  INVOICE_DOCUMENT: 5 * 1024 * 1024 // 5MB
};

/**
 * Validate MIME type for upload purpose
 */
export function validateMimeType(purpose: string, mimeType: string): void {
  const allowed = ALLOWED_MIME_TYPES[purpose];
  
  if (!allowed) {
    throw new Error(`Unknown upload purpose: ${purpose}`);
  }

  if (!allowed.includes(mimeType)) {
    throw new Error(
      `Invalid file type ${mimeType} for ${purpose}. Allowed: ${allowed.join(", ")}`
    );
  }
}

/**
 * Validate file size for upload purpose
 */
export function validateFileSize(purpose: string, sizeBytes: number): void {
  const maxSize = MAX_FILE_SIZES[purpose];

  if (!maxSize) {
    throw new Error(`Unknown upload purpose: ${purpose}`);
  }

  if (sizeBytes > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    throw new Error(
      `File size ${(sizeBytes / (1024 * 1024)).toFixed(2)}MB exceeds maximum ${maxMB}MB for ${purpose}`
    );
  }

  if (sizeBytes <= 0) {
    throw new Error("File size must be positive");
  }
}

/**
 * Validate file extension matches MIME type
 * Prevents content-type spoofing
 */
export function validateFileExtension(filename: string, mimeType: string): void {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw new Error("File must have an extension");
  }

  const validExtensions: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "application/pdf": ["pdf"],
    "video/mp4": ["mp4"]
  };

  const allowed = validExtensions[mimeType];

  if (!allowed) {
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }

  if (!allowed.includes(extension)) {
    throw new Error(
      `File extension .${extension} does not match MIME type ${mimeType}`
    );
  }
}

/**
 * Sanitize filename to prevent path traversal attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators
  let sanitized = filename.replace(/[/\\]/g, "");
  
  // Remove leading dots (hidden files)
  sanitized = sanitized.replace(/^\.+/, "");

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Limit length
  if (sanitized.length > 255) {
    const extension = sanitized.split(".").pop();
    const nameWithoutExt = sanitized.substring(0, 255 - (extension?.length ?? 0) - 1);
    sanitized = `${nameWithoutExt}.${extension}`;
  }

  if (!sanitized) {
    throw new Error("Invalid filename");
  }

  return sanitized;
}

/**
 * Generate secure upload path
 * Prevents directory traversal and ensures unique paths
 */
export function generateSecureUploadPath(
  purpose: string,
  resourceId: string,
  filename: string
): string {
  const sanitized = sanitizeFilename(filename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  
  // Generate path: purpose/resourceId/timestamp-random-filename
  return `${purpose.toLowerCase()}/${resourceId}/${timestamp}-${random}-${sanitized}`;
}

/**
 * Validate upload request
 * Comprehensive validation of all upload parameters
 */
export function validateUploadRequest(params: {
  purpose: string;
  resourceId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}): void {
  const { purpose, resourceId, filename, mimeType, sizeBytes } = params;

  // Validate purpose
  if (!ALLOWED_MIME_TYPES[purpose]) {
    throw new Error(`Invalid upload purpose: ${purpose}`);
  }

  // Validate resource ID (UUID format)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resourceId)) {
    throw new Error("Invalid resource ID format");
  }

  // Validate filename
  if (!filename || filename.length === 0) {
    throw new Error("Filename is required");
  }

  // Validate MIME type
  validateMimeType(purpose, mimeType);

  // Validate file extension
  validateFileExtension(filename, mimeType);

  // Validate file size
  validateFileSize(purpose, sizeBytes);
}

/**
 * Check if file is an image
 */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is a video
 */
export function isVideo(mimeType: string): boolean {
  return mimeType.startsWith("video/");
}

/**
 * Check if file is a PDF
 */
export function isPDF(mimeType: string): boolean {
  return mimeType === "application/pdf";
}

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): "image" | "video" | "pdf" | "other" {
  if (isImage(mimeType)) return "image";
  if (isVideo(mimeType)) return "video";
  if (isPDF(mimeType)) return "pdf";
  return "other";
}
