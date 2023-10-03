/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByConditionQuery,
  getJoinTwoTableConditionQuery,
} from '../../../utils/index.js';
import { mapDBPlaylistsToModel, mapDBSongsToModel } from '../../../utils/transform.js';
import NotFoundError from '../../exceptions/NotFoundException.js';

class PlaylistSongsService {
  constructor(songService) {
    const { Pool } = pg;
    this._table = 'playlist_songs';
    this._tablePlaylist = 'playlists';
    this._tableSong = 'songs';
    this._tableUser = 'users';
    this._pool = new Pool();
    this._songService = songService;
  }

  async addSong(playlistId, { songId }) {
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

    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getSongs(playlistId, userId) {
    let query = getJoinTwoTableConditionQuery(
      this._tablePlaylist,
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
}

export default PlaylistSongsService;
