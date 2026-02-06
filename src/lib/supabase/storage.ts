/**
 * STORAGE SERVICE
 * Handle file uploads to Supabase Storage
 */

import { supabase } from './client';

// Storage buckets
const BUCKETS = {
  SUBMISSIONS: 'submissions',
  AVATARS: 'avatars',
  PORTFOLIO: 'portfolio',
} as const;

// ============================================================================
// FILE UPLOAD
// ============================================================================

/**
 * Upload submission image
 */
export async function uploadSubmissionImage(
  studentId: string,
  challengeId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${studentId}/${challengeId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.SUBMISSIONS)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKETS.SUBMISSIONS)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload multiple submission images
 */
export async function uploadSubmissionImages(
  studentId: string,
  challengeId: string,
  files: File[]
): Promise<string[]> {
  const uploadPromises = files.map(file =>
    uploadSubmissionImage(studentId, challengeId, file)
  );

  return await Promise.all(uploadPromises);
}

/**
 * Upload submission video
 */
export async function uploadSubmissionVideo(
  studentId: string,
  challengeId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${studentId}/${challengeId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.SUBMISSIONS)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading video:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKETS.SUBMISSIONS)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true, // Replace existing avatar
    });

  if (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKETS.AVATARS)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload portfolio item
 */
export async function uploadPortfolioFile(
  studentId: string,
  portfolioItemId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${studentId}/${portfolioItemId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKETS.PORTFOLIO)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading portfolio file:', error);
    throw error;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKETS.PORTFOLIO)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// ============================================================================
// FILE DELETION
// ============================================================================

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * Delete submission files
 */
export async function deleteSubmissionFiles(
  studentId: string,
  challengeId: string
): Promise<void> {
  const folderPath = `${studentId}/${challengeId}`;

  const { data: files } = await supabase.storage
    .from(BUCKETS.SUBMISSIONS)
    .list(folderPath);

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${folderPath}/${file.name}`);

    const { error } = await supabase.storage
      .from(BUCKETS.SUBMISSIONS)
      .remove(filePaths);

    if (error) {
      console.error('Error deleting submission files:', error);
      throw error;
    }
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  const parts = url.split('.');
  return parts[parts.length - 1].split('?')[0];
}

/**
 * Check if file is image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Validate file size (in MB)
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!isImageFile(file)) {
    return { valid: false, error: 'File must be an image' };
  }

  if (!validateFileSize(file, 10)) {
    // 10MB max
    return { valid: false, error: 'Image must be less than 10MB' };
  }

  return { valid: true };
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!isVideoFile(file)) {
    return { valid: false, error: 'File must be a video' };
  }

  if (!validateFileSize(file, 100)) {
    // 100MB max
    return { valid: false, error: 'Video must be less than 100MB' };
  }

  return { valid: true };
}

/**
 * Compress image before upload (client-side)
 */
export async function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          file.type,
          0.85 // Quality
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// STORAGE BUCKET SETUP (Run once in Supabase)
// ============================================================================

/**
 * Instructions for setting up storage buckets:
 * 
 * 1. Go to Supabase Dashboard → Storage
 * 2. Create these buckets:
 *    - submissions (public)
 *    - avatars (public)
 *    - portfolio (public)
 * 
 * 3. Set up RLS policies:
 * 
 * Submissions bucket:
 * - Students can upload to their own folder
 * - Parents can view their children's submissions
 * - Tutors can view assigned students' submissions
 * 
 * Avatars bucket:
 * - Users can upload/update their own avatar
 * - All authenticated users can view avatars
 * 
 * Portfolio bucket:
 * - Students can upload to their own portfolio
 * - Public read access (for sharing)
 */
