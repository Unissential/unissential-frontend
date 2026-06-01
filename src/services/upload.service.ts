// src/services/upload.service.ts
// File upload service for S3 integration

import api from './api';
import { FILE_UPLOAD, ERROR_MESSAGES } from '@/config/constants';

export interface UploadResponse {
  url: string;
  key: string;
  size: number;
}

/**
 * Validates file before upload
 */
const validateFile = (file: File): void => {
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as typeof FILE_UPLOAD.ALLOWED_TYPES[number])) {
    throw new Error(ERROR_MESSAGES.FILE_TYPE_INVALID);
  }
};

/**
 * Upload Service
 * Handles file uploads to S3 with pre-signed URLs
 */
export const uploadService = {
  /**
   * Upload single file
   * Gets pre-signed URL from backend, uploads directly to S3
   */
  uploadFile: async (file: File, type: 'profile' | 'listing' = 'profile'): Promise<UploadResponse> => {
    try {
      // Validate file
      validateFile(file);

      // Get pre-signed URL from backend
      const response = await api.post<{ presignedUrl: string; key: string }>(
        '/upload/get-presigned-url',
        {
          filename: file.name,
          contentType: file.type,
          type,
        }
      );
      const { presignedUrl, key } = response.data;

      // Upload directly to S3
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(ERROR_MESSAGES.UPLOAD_FAILED);
      }

      // Construct public URL
      const url = presignedUrl.split('?')[0]; // Remove query params

      return {
        url,
        key,
        size: file.size,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  /**
   * Upload multiple files
   */
  uploadFiles: async (files: File[], type: 'profile' | 'listing' = 'profile'): Promise<UploadResponse[]> => {
    // Limit number of files
    if (files.length > FILE_UPLOAD.MAX_FILES) {
      throw new Error(`Maximum ${FILE_UPLOAD.MAX_FILES} files allowed`);
    }

    const uploadPromises = files.map(file => uploadService.uploadFile(file, type));
    return Promise.all(uploadPromises);
  },

  /**
   * Delete file from S3
   */
  deleteFile: async (key: string): Promise<void> => {
    await api.delete(`/upload/${key}`);
  },

  /**
   * Get upload progress
   * Can be implemented with XHR for progress tracking
   */
  uploadFileWithProgress: async (
    file: File,
    type: 'profile' | 'listing' = 'profile',
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    try {
      validateFile(file);

      const response = await api.post<{ presignedUrl: string; key: string }>(
        '/upload/get-presigned-url',
        {
          filename: file.name,
          contentType: file.type,
          type,
        }
      );
      const { presignedUrl, key } = response.data;

      // Upload with progress tracking using XHR
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Progress event
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            onProgress?.(percentComplete);
          }
        });

        // Completion
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const url = presignedUrl.split('?')[0];
            resolve({
              url,
              key,
              size: file.size,
            });
          } else {
            reject(new Error(ERROR_MESSAGES.UPLOAD_FAILED));
          }
        });

        // Error
        xhr.addEventListener('error', () => {
          reject(new Error(ERROR_MESSAGES.UPLOAD_FAILED));
        });

        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },
};

export default uploadService;
