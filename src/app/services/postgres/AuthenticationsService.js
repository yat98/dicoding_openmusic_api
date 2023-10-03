/* c8 ignore next 2 */
import pg from 'pg';
import { getConditionQuery, updateByConditionQuery, updateByIdQuery } from '../../../utils/index.js';
import ValidationError from '../../exceptions/ValidationError.js';

class AuthenticationsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'users';
    this._pool = new Pool();
  }

  async addRefreshToken(userId, token) {
    const query = updateByIdQuery(userId, { token }, this._table);
    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = getConditionQuery({ token }, ['token'], this._table);
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new ValidationError('token is invalid');
  }

  async deleteRefreshToken(token) {
    const query = updateByConditionQuery({ token: null }, { token }, this._table);
    await this._pool.query(query);
  }
}

export default AuthenticationsService;
