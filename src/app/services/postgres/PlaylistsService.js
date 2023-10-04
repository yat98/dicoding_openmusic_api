/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByIdQuery,
  getConditionQuery, getJoinTableOrConditionQuery,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel } from '../../../utils/transform.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import AuthorizationError from '../../exceptions/AuthorizationError.js';

class PlaylistsService {
  constructor(songService, collaborationService) {
    const { Pool } = pg;
    this._table = 'playlists';
    this._tableUser = 'users';
    this._tableSong = 'songs';
    this._tablePlaylist = 'playlist';
    this._tableCollaboration = 'collaborations';
    this._pool = new Pool();
    this._songService = songService;
    this._collaborationService = collaborationService;
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
    const query = getJoinTableOrConditionQuery(
      this._table,
      [`${this._table}.id`, `${this._table}.owner`, `${this._table}.name`, `${this._tableUser}.username`],
      `LEFT JOIN ${this._tableUser} ON ${this._tableUser}.id = ${this._table}.owner 
      LEFT JOIN ${this._tableCollaboration} ON ${this._tableCollaboration}.playlist_id = ${this._table}.id`,
      'WHERE collaborations.user_id = $1 OR playlists.owner = $2',
      [userId, userId],
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

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaboration(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

export default PlaylistsService;
