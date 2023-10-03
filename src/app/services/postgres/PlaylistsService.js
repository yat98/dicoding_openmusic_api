/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByIdQuery,
  getConditionQuery, getJoinTwoTableConditionQuery,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel } from '../../../utils/transform.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

class PlaylistsService {
  constructor(songService) {
    const { Pool } = pg;
    this._table = 'playlists';
    this._tableUser = 'users';
    this._tableSong = 'songs';
    this._tablePlaylistSongs = 'playlist_songs';
    this._pool = new Pool();
    this._songService = songService;
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
    const query = getJoinTwoTableConditionQuery(
      this._table,
      this._tableUser,
      'owner',
      'id',
      ['id', 'owner', 'name'],
      ['username'],
      { owner: userId },
      {},
    );

    const result = await this._pool.query(query);
    return result.rows.map(mapDBPlaylistsToModel);
  }

  async deletePlaylistById(id) {
    const query = deleteByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('playlist not found');
  }

  async verifyPlaylistOwner(id, owner) {
    const query = getConditionQuery({ id }, [], this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('playlist not found');
    const playlist = result.rows[0];

    if (playlist.owner !== owner) throw new AuthorizationError('unauthorized');
    return playlist;
  }
}

export default PlaylistsService;
