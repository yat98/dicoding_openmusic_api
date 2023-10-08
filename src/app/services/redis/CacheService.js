/* c8 ignore next 2 */
import * as redis from 'redis';
import cache from '../../../config/cache.js';

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: cache.redis.server,
      },
    });

    /* c8 ignore next 3 */
    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('cache not found');
    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

export default CacheService;
