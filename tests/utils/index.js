import pg from 'pg';

import {
  getByIdQuery, getQuery, getQueryCondition,
  mapDBAlbumsToModel, mapDBSongToModel, mapDBSongsToModel,
} from '../../src/utils';

const { Pool } = pg;
const pool = new Pool();

/**
 * Album Utils
 */

export const payloadAlbum = {
  name: 'Lorem',
  year: 2023,
};

export const payloadAlbumUpdate = {
  name: 'Lorem Ipsum',
  year: 2022,
};

export const firstAlbum = async () => {
  const query = getQuery('albums');
  const result = await pool.query(query);
  return result.rows.map(mapDBAlbumsToModel)[0];
};

export const findAlbumId = async (id) => {
  const query = getByIdQuery(id, 'albums');
  const result = await pool.query(query);
  return result.rows.map(mapDBAlbumsToModel)[0];
};

export const removeAllAlbum = async () => {
  const query = {
    text: 'DELETE FROM albums',
  };
  await pool.query(query);
};

/**
 * Song Utils
 */

export const payloadSong = {
  title: 'Evaluasi',
  year: 2023,
  genre: 'Indie',
  performer: 'Hindia',
  duration: 240,
};

export const payloadUpdateSong = {
  title: 'Lorem Ipsum',
  year: 2023,
  genre: 'Rock',
  performer: 'Sit Dolor',
  duration: 380,
};

export const firstSong = async () => {
  const query = getQuery('songs');
  const result = await pool.query(query);
  return result.rows.map(mapDBSongsToModel)[0];
};

export const findSongId = async (id) => {
  const query = getByIdQuery(id, 'songs');
  const result = await pool.query(query);
  return result.rows.map(mapDBSongToModel)[0];
};

export const removeAllSong = async () => {
  const query = {
    text: 'DELETE FROM songs',
  };
  await pool.query(query);
};

/**
 * User Utils
 */

export const payloadUser = {
  username: 'test_jest_user',
  password: 'secretpassword',
  fullname: 'Test Jest User',
};

export const payloadUserTwo = {
  username: 'test_jest_user_2',
  password: 'secretpassword',
  fullname: 'Test Jest User 2',
};

export const firstUser = async () => {
  const query = getQuery('users');
  const result = await pool.query(query);
  return result.rows[0];
};

export const findUserId = async (id) => {
  const query = getByIdQuery(id, 'users');
  const result = await pool.query(query);
  return result.rows[0];
};

export const findUserByUsername = async (username) => {
  const query = getQueryCondition({ username }, [], 'users');
  const result = await pool.query(query);
  return result.rows[0];
};

export const removeAllUser = async () => {
  const query = {
    text: 'DELETE FROM users',
  };
  await pool.query(query);
};

/**
 * Authentications Utils
 */

export const payloadAuthentication = {
  username: payloadUser.username,
  password: payloadUser.password,
};

export const payloadAuthenticationTwo = {
  username: payloadUserTwo.username,
  password: payloadUserTwo.password,
};
