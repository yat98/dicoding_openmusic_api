/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, deleteByIdQuery,
  getByIdQuery, getQuery, mapDBAlbumsToModel,
  mapDBSongsToModel, updateByIdQuery,
} from '../../../utils/index.js';
import NotFoundError from '../../exceptions/NotFoundException.js';
import { getJoinTwoTableQuery } from '../../../utils/query.js';

class AlbumsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'albums';
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      name,
      year,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getAlbums() {
    const query = getQuery(this._table);
    const result = await this._pool.query(query);
    return result.rows.map(mapDBAlbumsToModel);
  }

  async getAlbumById(id) {
    let query = getByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    query = getJoinTwoTableQuery(id, this._table, 'songs', 'id', 'album_id', ['id'], ['id', 'title', 'performer']);
    const resultSongs = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('album not found');

    const data = {
      ...result.rows.map(mapDBAlbumsToModel)[0],
      songs: [],
    };
    if (resultSongs.rows.length > 0) data.songs = resultSongs.rows.map(mapDBSongsToModel);

    return data;
  }

  async updateAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const data = {
      id,
      name,
      year,
      updated_at: updatedAt,
    };
    const query = updateByIdQuery(id, data, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('album not found');
  }

  async updateAlbumCoverById(id, cover) {
    const updatedAt = new Date().toISOString();
    const data = {
      cover,
      updated_at: updatedAt,
    };
    const query = updateByIdQuery(id, data, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('album not found');
  }

  async deleteAlbumById(id) {
    const query = deleteByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('album not found');
  }
}

export default AlbumsService;
