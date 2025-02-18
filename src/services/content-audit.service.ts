import AipContentCensorClient from 'baidu-aip-sdk';
import { config } from '../config';

export class ContentAuditService {
  private client: any;

  constructor() {
    this.client = new AipContentCensorClient(
      process.env.BAIDU_APP_ID,
      process.env.BAIDU_API_KEY,
      process.env.BAIDU_SECRET_KEY
    );
  }

  // 文本审核
  async auditText(text: string): Promise<{
    pass: boolean;
    reason?: string;
  }> {
    try {
      const result = await this.client.textCensorUserDefined(text);
      
      // 判断审核结果
      if (result.conclusionType === 1) {
        return { pass: true };
      }

      // 获取不通过原因
      const reasons = result.data
        ?.map((item: any) => item.msg)
        .join(', ');

      return {
        pass: false,
        reason: reasons || '内容不合规'
      };
    } catch (error) {
      console.error('Text audit error:', error);
      throw new Error('文本审核失败');
    }
  }

  // 图片审核
  async auditImage(imageUrl: string): Promise<{
    pass: boolean;
    reason?: string;
  }> {
    try {
      const result = await this.client.imageCensorUserDefined(imageUrl);

      if (result.conclusionType === 1) {
        return { pass: true };
      }

      const reasons = result.data
        ?.map((item: any) => item.msg)
        .join(', ');

      return {
        pass: false,
        reason: reasons || '图片不合规'
      };
    } catch (error) {
      console.error('Image audit error:', error);
      throw new Error('图片审核失败');
    }
  }

  // 批量审核图片
  async auditMultipleImages(imageUrls: string[]): Promise<{
    pass: boolean;
    reasons: string[];
  }> {
    try {
      const auditResults = await Promise.all(
        imageUrls.map(url => this.auditImage(url))
      );

      const failedResults = auditResults.filter(result => !result.pass);
      
      return {
        pass: failedResults.length === 0,
        reasons: failedResults.map(result => result.reason!).filter(Boolean)
      };
    } catch (error) {
      console.error('Multiple images audit error:', error);
      throw new Error('批量图片审核失败');
    }
  }
} 