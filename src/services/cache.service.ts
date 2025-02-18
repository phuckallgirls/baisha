import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 默认缓存10分钟
      checkperiod: 120 // 每2分钟检查过期的缓存
    });
  }

  // 设置缓存
  public set(key: string, value: any, ttl?: number): boolean {
    try {
      return this.cache.set(key, value, ttl);
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // 获取缓存
  public get<T>(key: string): T | undefined {
    try {
      return this.cache.get<T>(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return undefined;
    }
  }

  // 删除缓存
  public delete(key: string): number {
    try {
      return this.cache.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
      return 0;
    }
  }

  // 清空所有缓存
  public clear(): void {
    try {
      this.cache.flushAll();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // 获取缓存统计信息
  public getStats() {
    return this.cache.getStats();
  }
} 