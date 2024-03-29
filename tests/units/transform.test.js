import { mapDBAlbumsToModel, mapDBSongsToModel, mapDBSongToModel } from '../../src/utils/index.js';
import { mapDBPlaylistActivitiesToModel, mapDBPlaylistsToModel } from '../../src/utils/transform.js';

describe('Test transform utils', () => {
  it('should transform albums model', () => {
    const date = new Date().toISOString();
    const album = mapDBAlbumsToModel({
      id: 1,
      name: 'Test album',
      year: 2023,
      cover: null,
      created_at: date,
      updated_at: date,
    });

    expect(album).toEqual({
      id: 1,
      name: 'Test album',
      coverUrl: null,
      year: 2023,
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
      title: 'Test song',
      performer: 'Test',
    });
  });

  it('should transform song model', () => {
    const date = new Date().toISOString();
    const song = mapDBSongToModel({
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
    });
  });

  it('should transform playlist model', () => {
    const date = new Date().toISOString();
    const playlist = mapDBPlaylistsToModel({
      id: 1,
      user_id: 1,
      name: 'Ipsum',
      username: 'Lorem',
      created_at: date,
      updated_at: date,
    });

    expect(playlist).toEqual({
      id: 1,
      name: 'Ipsum',
      username: 'Lorem',
    });
  });

  it('should transform playlist activities model', () => {
    const playlist = mapDBPlaylistActivitiesToModel({
      username: 'John',
      title: 'Lorem',
      action: 'add',
      time: '2021-09-13T08:06:20.600Z',
      id: 1,
    });

    expect(playlist).toEqual({
      username: 'John',
      title: 'Lorem',
      action: 'add',
      time: '2021-09-13T08:06:20.600Z',
    });
  });
});
