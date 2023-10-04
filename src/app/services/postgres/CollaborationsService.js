/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import { createQuery, deleteByConditionQuery, getConditionQuery } from '../../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundException.js';

class CollaborationsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'collaborations';
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      userId,
      playlistId,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = deleteByConditionQuery(this._table, { playlist_id: playlistId, user_id: userId }, 'id');
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('collaboration not found');
  }

  async verifyCollaboration(playlistId, userId) {
    const query = getConditionQuery({ playlist_id: playlistId, user_id: userId }, [], this._table);
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('collaboration verification fail');
  }
}

export default CollaborationsService;
