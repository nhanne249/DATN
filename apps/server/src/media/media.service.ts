import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';

export interface MediaUploadFile {
  originalname: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadPath = path.join(
    process.env.UPLOAD_DIR || path.join(tmpdir(), 'hotel-management-uploads'),
  );

  constructor(private readonly auditLogService: AuditLogService) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(
    file: MediaUploadFile,
    userId: string,
  ): Promise<{ url: string; filename: string }> {
    const fileExt = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = path.join(this.uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const apiBase = (
      process.env.PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      '/api'
    ).replace(/\/+$/, '');
    const normalizedApiBase = apiBase.endsWith('/api')
      ? apiBase
      : `${apiBase}/api`;
    const fileUrl = `${normalizedApiBase}/uploads/${fileName}`;

    await this.auditLogService.log({
      userId,
      action: 'UPLOAD_FILE',
      module: 'MEDIA',
      details: {
        originalName: file.originalname,
        fileName,
        size: file.size,
      },
    });

    return {
      url: fileUrl,
      filename: fileName,
    };
  }

  async uploadFiles(
    files: MediaUploadFile[],
    userId: string,
  ): Promise<{ url: string; filename: string }[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, userId));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileName: string, userId: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

      await this.auditLogService.log({
        userId,
        action: 'DELETE_FILE',
        module: 'MEDIA',
        details: { fileName },
      });
    }
  }
}
