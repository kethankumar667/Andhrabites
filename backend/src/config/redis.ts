import Redis from 'ioredis';

let redisClient: Redis;

export const connectRedis = async (): Promise<Redis> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redisClient = new Redis(redisUrl, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err);
    });

    redisClient.on('close', () => {
      console.warn('Redis connection closed');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    // Don't exit process, Redis is optional for some features
    console.warn('⚠️ Continuing without Redis (caching will be disabled)');
    return null as any;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

// Cache utility functions
export const setCache = async (
  key: string,
  value: any,
  ttlInSeconds: number = 3600
): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.setex(key, ttlInSeconds, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error);
  }
};