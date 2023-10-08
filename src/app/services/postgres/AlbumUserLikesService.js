/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import { createQuery, deleteByConditionQuery, getConditionQuery } from '../../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import ValidationError from '../../exceptions/ValidationError.js';

class AlbumUserLikesService {
  constructor(cacheService) {
    const { Pool } = pg;
    this._pool = new Pool();
    this._table = 'album_user_likes';
    this._cacheService = cacheService;
  }

  async addAlbumUserLike(albumId, userId) {
    await this.verifyAlbumUserLikeNotExists(albumId, userId);
    const id = `like-${nanoid(16)}`;
    const cacheKey = `album_user_likes:${albumId}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      albumId,
      userId,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    await this._cacheService.delete(cacheKey);
    return result.rows[0].id;
  }

  async getAlbumUserLikeByAlbumId(albumId) {
    const cacheKey = `album_user_likes:${albumId}`;
    try {
      const result = await this._cacheService.get(cacheKey);
      return JSON.parse(result);
    } catch (error) {
      const query = getConditionQuery({ album_id: albumId }, ['count(*)'], this._table);
      const result = await this._pool.query(query);
      const cacheData = {
        cache: true,
        likes: Number(result.rows[0].count),
      };
      await this._cacheService.set(cacheKey, JSON.stringify(cacheData), 1800);
      cacheData.cache = false;
      return cacheData;
    }
  }

  async deleteAlbumUserLikeByAlbumId(albumId, userId) {
    const cacheKey = `album_user_likes:${albumId}`;
    const query = deleteByConditionQuery(this._table, { album_id: albumId, user_id: userId }, 'id');
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('like not found');
    await this._cacheService.delete(cacheKey);
  }

  async verifyAlbumUserLikeNotExists(albumId, userId) {
    const query = getConditionQuery({ album_id: albumId, user_id: userId }, [], this._table);
    const result = await this._pool.query(query);

    if (result.rows.length > 0) throw new ValidationError('album already liked');
  }
}

export default AlbumUserLikesService;
