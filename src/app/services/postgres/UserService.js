/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { createQuery, getQueryCondition } from '../../../utils';
import ValidationError from '../../exceptions/ValidationError';

class UsersService {
  constructor() {
    const { Pool } = pg;
    this._table = 'users';
    this._pool = new Pool();
  }

  async addUser({ fullname, username, password }) {
    await this.verifyNewUsername(username);
    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = [
      id,
      fullname,
      username,
      hashedPassword,
      null,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    const result = await this._pool.query(query);

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = getQueryCondition({ username }, this._table);
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new ValidationError('username already exists');
    }
  }
}

export default UsersService;
