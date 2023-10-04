/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByConditionQuery,
  getConditionQuery,
  getJoinTableOrConditionQuery,
  getJoinTwoTableConditionQuery,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel, mapDBSongsToModel } from '../../../utils/transform.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import ValidationError from '../../exceptions/ValidationError.js';

class PlaylistSongsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'playlist_songs';
    this._tablePlaylist = 'playlists';
    this._tableSong = 'songs';
    this._tableUser = 'users';
    this._tableCollaboration = 'collaborations';
    this._pool = new Pool();
  }

  async addSong(playlistId, { songId }) {
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      playlistId,
      songId,
      createdAt,
      createdAt,
    ];

    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getSongs(playlistId, userId) {
    let query = getJoinTableOrConditionQuery(
      this._tablePlaylist,
      [`${this._tablePlaylist}.id`, `${this._tablePlaylist}.name`, `${this._tableUser}.username`],
      `LEFT JOIN ${this._tableUser} ON ${this._tableUser}.id = ${this._tablePlaylist}.owner 
      LEFT JOIN ${this._tableCollaboration} ON ${this._tableCollaboration}.playlist_id = ${this._tablePlaylist}.id`,
      'WHERE collaborations.user_id = $1 OR playlists.owner = $2 AND playlists.id = $3',
      [userId, userId, playlistId],
    );
    const resultPlaylist = await this._pool.query(query);

    query = getJoinTwoTableConditionQuery(
      this._tableSong,
      this._table,
      'id',
      'song_id',
      ['id', 'title', 'performer'],
      ['playlist_id'],
      {},
      { playlist_id: playlistId },
    );
    const resultSongs = await this._pool.query(query);

    const data = {
      ...resultPlaylist.rows.map(mapDBPlaylistsToModel)[0],
      songs: [],
    };
    if (resultSongs.rows.length > 0) data.songs = resultSongs.rows.map(mapDBSongsToModel);

    return data;
  }

  async deleteSong(id, { songId }) {
    const query = deleteByConditionQuery(this._table, { playlist_id: id, song_id: songId }, 'id');
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('song not found');
  }

  async verifySongNotExistsInPlaylist(id, songId) {
    const query = getConditionQuery({ playlist_id: id, song_id: songId }, [], this._table);
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new ValidationError('song already exists');
    }
  }
}

export default PlaylistSongsService;
