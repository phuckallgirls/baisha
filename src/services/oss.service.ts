import OSS from 'ali-oss';
import { config } from '../config';

export class OssService {
  private client: OSS;

  constructor() {
    this.client = new OSS({
      region: process.env.OSS_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET
    });
  }

  // 上传文件到OSS
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${Date.now()}-${file.originalname}`;
      const result = await this.client.put(fileName, file.buffer);
      return result.url;
    } catch (error) {
      console.error('OSS upload error:', error);
      throw new Error('文件上传失败');
    }
  }

  // 删除OSS文件
  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = fileUrl.split('/').pop();
      if (!fileName) return false;
      
      await this.client.delete(fileName);
      return true;
    } catch (error) {
      console.error('OSS delete error:', error);
      return false;
    }
  }

  // 生成临时访问URL
  async generateSignedUrl(fileUrl: string, expireTime: number = 3600): Promise<string> {
    try {
      const fileName = fileUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid file URL');

      const url = await this.client.signatureUrl(fileName, {
        expires: expireTime
      });
      return url;
    } catch (error) {
      console.error('Generate signed URL error:', error);
      throw new Error('生成访问链接失败');
    }
  }
} 