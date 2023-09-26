import { createQuery, getQuery, getByIdQuery, updateByIdQuery, deleteByIdQuery } from "../../src/utils/index.js";

describe('Test transform utils', () => {
  it('should success return create query', () => {
    const values = ['Title', 'Body'];
    const query = createQuery(values, 'songs');
    expect(query).toEqual({
      text: `INSERT INTO songs VALUES($1,$2) RETURNING id`,
      values
    });
  });

  it('should success return get query', () => {
    const query = getQuery('songs');
    expect(query).toBe(`SELECT * FROM songs`);
  });

  it('should success return get query by id', () => {
    const query = getByIdQuery('1','songs');
    expect(query).toEqual({
      text: `SELECT * FROM songs WHERE id=$1`,
      values: ['1'],
    });
  });

  it('should success return update query by id', () => {
    const values = {
      title: 'Lorem',
      body: 'lorem ipsum sit dolor'
    };
    const query = updateByIdQuery('1', values, 'songs');
    expect(query).toEqual({
      text: `UPDATE songs SET title=$1,body=$2 WHERE id=$3 RETURNING id`,
      values: [...Object.values(values), '1']
    });
  });

  it('should success return delete query by id', () => {
    const query = deleteByIdQuery('1','songs');
    expect(query).toEqual({
      text: `DELETE FROM songs WHERE id=$1 RETURNING id`,
      values: ['1'],
    });
  });
});