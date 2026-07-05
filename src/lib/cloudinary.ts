// Cloudinary helper — inactive until user provides CLOUD_NAME.
// Replace PLACEHOLDER_BASE with this when ready.

interface CldOptions {
  w?: number;
  h?: number;
}

export function cldImg(publicId: string, opts?: CldOptions): string {
  const cloudName = ""; // Set your Cloudinary cloud name here
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME not set.");
  }
  const w = opts?.w ? `w_${opts.w},` : "";
  const h = opts?.h ? `h_${opts.h},` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${w}${h}f_auto,q_auto/${publicId}`;
}
