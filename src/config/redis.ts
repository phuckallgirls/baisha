import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB) || 0,
  
  // 重试策略
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // 错误处理
  maxRetriesPerRequest: 3
});

redis.on('error', (err) => {
  console.error('Redis连接错误:', err);
});

redis.on('connect', () => {
  console.log('Redis连接成功');
});

export default redis; 