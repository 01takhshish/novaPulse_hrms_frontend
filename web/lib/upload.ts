/** Leave room for multipart overhead below the hosting platform request limit. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_BYTES = MAX_IMAGE_BYTES + 64 * 1024;
export const MAX_IMAGE_PIXELS = 25_000_000;
