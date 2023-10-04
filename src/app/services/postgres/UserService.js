/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import bcrypt from 'bcrypt';
import {
  createQuery, getConditionQuery,
} from '../../../utils/index.js';
import ValidationError from '../../exceptions/ValidationError.js';
import AuthenticationError from '../../exceptions/AuthenticationError.js';
import NotFoundError from '../../exceptions/NotFoundException.js';

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

  async verifyUserExists(id) {
    const query = getConditionQuery({ id }, [], this._table);
    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError('user not found');
  }

  async verifyNewUsername(username) {
    const query = getConditionQuery({ username }, [], this._table);
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new ValidationError('username already exists');
    }
  }

  async verifyUserCredential(username, password) {
    const query = getConditionQuery({ username }, ['id', 'password'], this._table);
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new AuthenticationError('username or password is wrong');

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) throw new AuthenticationError('username or password is wrong');

    return id;
  }
}

export default UsersService;
