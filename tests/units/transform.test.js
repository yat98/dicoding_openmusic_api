import { mapDBAlbumsToModel, mapDBSongsToModel } from '../../src/utils/index.js';

describe('Test transform utils', () => {
  it('should transform albums model', () => {
    const date = new Date().toISOString();
    const album = mapDBAlbumsToModel({
      id: 1,
      name: 'Test album',
      year: 2023,
      created_at: date,
      updated_at: date,
    });

    expect(album).toEqual({
      id: 1,
      name: 'Test album',
      year: 2023,
      createdAt: date,
      updatedAt: date,
    });
  });

  it('should transform songs model', () => {
    const date = new Date().toISOString();
    const song = mapDBSongsToModel({
      id: 1,
      album_id: 1,
      title: 'Test song',
      year: 2023,
      genre: 'Test',
      performer: 'Test',
      duration: 501,
      created_at: date,
      updated_at: date,
    });

    expect(song).toEqual({
      id: 1,
      albumId: 1,
      title: 'Test song',
      year: 2023,
      genre: 'Test',
      performer: 'Test',
      duration: 501,
      createdAt: date,
      updatedAt: date,
    });
  });
});