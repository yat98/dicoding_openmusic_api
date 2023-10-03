/* c8 ignore next 2 */
// import { nanoid } from 'nanoid';
import pg from 'pg';

class CollaborationsService {
  constructor() {
    const { Pool } = pg;
    this._table = 'collaborations';
    this._pool = new Pool();
  }
}

export default CollaborationsService;
