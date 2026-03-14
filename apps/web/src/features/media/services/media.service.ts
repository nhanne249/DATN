import axiosInstance from '@/lib/axios';

export const mediaService = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<{ url: string; filename: string }>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axiosInstance.post<{ url: string; filename: string }[]>('/media/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: (filename: string) => 
    axiosInstance.delete(`/media/${filename}`),

  getFileUrl: (filename: string) => {
    if (!filename) return '';
    if (filename.startsWith('http')) return filename;
    const raw = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '');
    const base = !raw ? '/api' : raw.endsWith('/api') ? raw : `${raw}/api`;
    return `${base}/uploads/${filename}`;
  },
};
