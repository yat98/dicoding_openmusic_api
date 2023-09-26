/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import { createQuery, deleteByIdQuery, getByIdQuery, getQuery, mapDBAlbumsToModel, updateByIdQuery } from '../../../utils/index.js'
import NotFoundError from '../../exceptions/NotFoundException.js';

class AlbumService{
  constructor() {
    const {Pool} = pg;
    this._table = 'albums';
    this._pool = new Pool();
  }

  async addAlbum({name, year}) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const data = [
      id,
      name,
      year,
      createdAt,
      updatedAt
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async getAlbums() {
    const query = getQuery(this._table);
    const result = await this._pool.query(query);
    return result.rows;
  };

  async getAlbumById(id) {
    const query = getByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if(!result.rows.length) throw new NotFoundError('album not found');

    return result.rows.map(mapDBAlbumsToModel)[0];
  }

  async updateAlbumById(id, {name, year}) {
    const updatedAt = new Date().toISOString();
    const data = {
      id,
      name,
      year,
      updated_at: updatedAt,
    }
    const query = updateByIdQuery(id, data, this._table);
    const result = await this._pool.query(query);

    if(!result.rows.length) throw new NotFoundError('album not found');
  }

  async deleteAlbumById(id) {
    const query = deleteByIdQuery(id, this._table);
    const result = await this._pool.query(query);

    if(!result.rows.length) throw new NotFoundError('album not found');
  }
}

export default AlbumService;