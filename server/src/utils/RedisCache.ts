import redis from '@/config/redis';

export const saveCache = (key: string, data: any, ttlSeconds = 60) => {
  try {
    const success = redis.setJson(key, data, ttlSeconds);
    if (!success) {
      console.warn('⚠️ Cache save failed (redis set returned false):', key);
    } else {
      console.log('💾 Cache saved:', key);
    }
    return success;
  } catch (err) {
    console.warn('🚫 Cache save exception:', (err as Error).message);
    return false;
  }
};

export const getKey = (type: string, userId: string, suffix?: string) =>
  [type, userId, suffix].filter(Boolean).join(':');

// Thêm hàm getCache để sử dụng trong controller
export const getCache = async (key: string) => {
  try {
    const cacheData = await redis.getJson(key);
    return cacheData ?? null;
  } catch (err) {
    console.warn('Cache get failed -', (err as Error).message);
    return null;
  }
};

export const delCache = (key: string) => {
  try {
    const success = redis.del(key);
    if (!success) {
      console.warn('⚠️ Cache save failed (redis set returned false):', key);
    } else {
      console.log('💾 Cache del :', key);
    }
    return success;
  } catch (err) {
    console.warn('🚫 Cache save exception:', (err as Error).message);
    return false;
  }
};
