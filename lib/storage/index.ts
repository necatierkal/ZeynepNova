import path from "path";

export interface FileUploadResult {
  success: boolean;
  url?: string;
  filename?: string;
  sizeBytes?: number;
  mimeType?: string;
  error?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const storageService = {
  /**
   * Validates file before processing
   */
  validateFile(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { valid: false, error: "Dosya boyutu 5 MB sınırını aşamaz." };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: "Yalnızca JPG, PNG ve WEBP formatındaki ürün fotoğrafları yüklenebilir.",
      };
    }

    return { valid: true };
  },

  /**
   * Sanitizes filename and avoids directory traversal
   */
  sanitizeFilename(originalName: string, prefix = "zn"): string {
    const ext = path.extname(originalName).toLowerCase() || ".jpg";
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 30);
    const timestamp = Date.now();
    return `${prefix}_${cleanBase}_${timestamp}${ext}`;
  },

  /**
   * Upload file handler
   */
  async uploadProductImage(fileData: {
    buffer: Buffer | ArrayBuffer;
    originalName: string;
    mimeType: string;
    size: number;
    skuMatch?: string;
  }): Promise<FileUploadResult> {
    const validation = this.validateFile({
      name: fileData.originalName,
      size: fileData.size,
      type: fileData.mimeType,
    });

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const safeFilename = this.sanitizeFilename(fileData.originalName, fileData.skuMatch ? `sku_${fileData.skuMatch}` : "prod");
    // Public CDN / storage URL format
    const publicUrl = `/uploads/${safeFilename}`;

    return {
      success: true,
      url: publicUrl,
      filename: safeFilename,
      sizeBytes: fileData.size,
      mimeType: fileData.mimeType,
    };
  },
};
