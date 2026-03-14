import { Injectable, Logger } from '@nestjs/common';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadPath = path.join(
    process.cwd(),
    'apps/server/public/uploads',
  );

  constructor(private readonly auditLogService: AuditLogService) {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(file: any, userId: string): Promise<string> {
    const fileExt = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = path.join(this.uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/uploads/${fileName}`;

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

    return fileUrl;
  }

  async uploadFiles(files: any[], userId: string): Promise<string[]> {
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
