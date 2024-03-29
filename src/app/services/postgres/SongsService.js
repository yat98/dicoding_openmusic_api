/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByIdQuery, getByIdQuery, getFilteredConditionQuery, mapDBSongToModel,
  mapDBSongsToModel, updateByIdQuery,
} from '../../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundException.js';

class SongsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'songs';
    this._pool = new Pool();
  }

  async addSong({
    albumId, title, year, genre, performer, duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      albumId,
      title,
      year,
      genre,
      performer,
      duration,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getSongs(filter) {
    const query = getFilteredConditionQuery(filter, this._table);
    const result = await this._pool.query(query);
    return result.rows.map(mapDBSongsToModel);
  }

  async getSongById(id) {
    const query = getByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('song not found');

    return result.rows.map(mapDBSongToModel)[0];
  }

  async updateSongById(id, {
    albumId, title, year, genre, performer, duration,
  }) {
    const updatedAt = new Date().toISOString();
    const data = {
      id,
      album_id: albumId,
      title,
      year,
      genre,
      performer,
      duration,
      updated_at: updatedAt,
    };
    const query = updateByIdQuery(id, data, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('song not found');
  }

  async deleteSongById(id) {
    const query = deleteByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('song not found');
  }

  async verifySongExists(id) {
    const query = getByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('song not found');
  }
}

export default SongsService;
