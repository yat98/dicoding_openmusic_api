/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByIdQuery, getQueryCondition,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel } from '../../../utils/transform.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

class PlaylistsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'playlists';
    this._pool = new Pool();
  }

  async addPlaylist({ name, userId }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      userId,
      name,
      createdAt,
      createdAt,
    ];

    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    const query = getQueryCondition({ user_id: userId }, [], this._table);
    const result = await this._pool.query(query);
    return result.rows.map(mapDBPlaylistsToModel);
  }

  async deletePlaylistById(id) {
    const query = deleteByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('playlist not found');
  }

  async verifyPlaylistOwner(id, userId) {
    const query = getQueryCondition({ id }, [], this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('playlist not found');
    const playlist = result.rows[0];

    if (playlist.user_id !== userId) throw new AuthorizationError('unauthorized');
    return playlist;
  }
}

export default PlaylistsService;
