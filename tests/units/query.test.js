import {
  createQuery, getQuery, getByIdQuery,
  updateByIdQuery, deleteByIdQuery, getQueryFilter,
  getJoinTwoTableQuery,
  getQueryCondition,
} from '../../src/utils/index.js';

describe('Test transform utils', () => {
  it('should success return create query', () => {
    const values = ['Title', 'Body'];
    const query = createQuery(values, 'songs');
    expect(query).toEqual({
      text: 'INSERT INTO songs VALUES($1,$2) RETURNING id',
      values,
    });
  });

  it('should success return get query', () => {
    const query = getQuery('songs');
    expect(query).toBe('SELECT * FROM songs');
  });

  it('should success return get query', () => {
    const query = getQuery('songs');
    expect(query).toBe('SELECT * FROM songs');
  });

  it('should success return get query condition', () => {
    const query = getQueryCondition({ title: 'cold', performer: 'chris' }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE title = $1 AND performer = $2',
      values: ['cold', 'chris'],
    });
  });

  it('should success return get query condition only one condition', () => {
    const query = getQueryCondition({ title: 'cold' }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE title = $1',
      values: ['cold'],
    });
  });

  it('should success return get query condition without condition', () => {
    const query = getQueryCondition({}, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs',
      values: [],
    });
  });

  it('should success return get query filter', () => {
    const query = getQueryFilter({ title: 'cold', performer: 'chris' }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      values: ['%cold%', '%chris%'],
    });
  });

  it('should success return get query filter only one filter', () => {
    const query = getQueryFilter({ title: 'cold' }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1)',
      values: ['%cold%'],
    });
  });

  it('should success return get query filter when object is null', () => {
    const query = getQueryFilter({}, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs',
      values: [],
    });
  });

  it('should success return get query filter when object is undefined', () => {
    const query = getQueryFilter({ title: undefined, body: undefined }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs',
      values: [],
    });
  });

  it('should success return get query filter when object is empty string', () => {
    const query = getQueryFilter({ title: '', body: undefined }, 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1)',
      values: ['%%'],
    });
  });

  it('should success return get query by id', () => {
    const query = getByIdQuery('1', 'songs');
    expect(query).toEqual({
      text: 'SELECT * FROM songs WHERE id=$1',
      values: ['1'],
    });
  });

  it('should success return update query by id', () => {
    const values = {
      title: 'Lorem',
      body: 'lorem ipsum sit dolor',
    };
    const query = updateByIdQuery('1', values, 'songs');
    expect(query).toEqual({
      text: 'UPDATE songs SET title=$1,body=$2 WHERE id=$3 RETURNING id',
      values: [...Object.values(values), '1'],
    });
  });

  it('should success return delete query by id', () => {
    const query = deleteByIdQuery('1', 'songs');
    expect(query).toEqual({
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: ['1'],
    });
  });

  it('should success return get inner join two table query', () => {
    const query = getJoinTwoTableQuery(
      '1',
      'notes',
      'users',
      'user_id',
      'id',
      ['user_id', 'title'],
      ['id', 'username'],
      'INNER JOIN',
    );
    expect(query).toEqual({
      text: `SELECT t1.user_id,t1.title,t2.id,t2.username 
      FROM notes t1
      INNER JOIN users t2 ON t1.user_id = t2.id
      WHERE t1.user_id = $1`,
      values: ['1'],
    });
  });
});
