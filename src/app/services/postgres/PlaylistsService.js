/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByConditionQuery, deleteByIdQuery,
  getConditionQuery, getJoinTwoTableConditionQuery,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel, mapDBSongsToModel } from '../../../utils/transform.js';
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

  async addSongsInPlaylist(playlistId, { songId }) {
    await this._songService.verifySongExists(songId);
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      playlistId,
      songId,
      createdAt,
      createdAt,
    ];

    const query = createQuery(data, this._tablePlaylistSongs);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getSongInPlaylist(playlistId, userId) {
    let query = getJoinTwoTableConditionQuery(
      this._table,
      this._tableUser,
      'owner',
      'id',
      ['id', 'owner', 'name'],
      ['username'],
      { owner: userId },
      {},
    );
    const resultPlaylist = await this._pool.query(query);

    query = getJoinTwoTableConditionQuery(
      this._tableSong,
      this._tablePlaylistSongs,
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

  async deleteSongInPlaylist(id, { songId }) {
    const query = deleteByConditionQuery(this._tablePlaylistSongs, { playlist_id: id, song_id: songId }, 'id');
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('song not found');
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
