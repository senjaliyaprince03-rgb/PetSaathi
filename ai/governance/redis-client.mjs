import Redis from 'ioredis';

let redisClient = null;

export function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times >= 3) {
        return null; // Stop retrying, fail fast so circuit breakers/fallback can handle it
      }
      return Math.min(times * 50, 2000);
    }
  });

  redisClient.on('error', (err) => {
    console.error('[Redis Error] ', err.message);
  });

  return redisClient;
}

export async function checkRedisHealth() {
  try {
    const client = getRedisClient();
    await client.ping();
    return true;
  } catch (error) {
    return false;
  }
}
