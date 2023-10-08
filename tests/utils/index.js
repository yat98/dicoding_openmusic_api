import pg from 'pg';

import {
  getByIdQuery, getQuery, getConditionQuery,
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

export const payloadUserThree = {
  username: 'test_jest_user_3',
  password: 'secretpassword',
  fullname: 'Test Jest User 3',
};

export const payloadUserFour = {
  username: 'test_jest_user_4',
  password: 'secretpassword',
  fullname: 'Test Jest User 4',
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
  const query = getConditionQuery({ username }, [], 'users');
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

export const payloadAuthenticationThree = {
  username: payloadUserThree.username,
  password: payloadUserThree.password,
};

export const payloadAuthenticationFour = {
  username: payloadUserFour.username,
  password: payloadUserFour.password,
};

/**
 * Playlists Utils
 */

export const payloadPlaylist = {
  name: 'Lorem Playlist',
};

export const payloadUpdatePlaylist = {
  name: 'Dolor Playlist',
};

export const findPlaylistId = async (id) => {
  const query = getByIdQuery(id, 'playlists');
  const result = await pool.query(query);
  return result.rows[0];
};

export const firstPlaylist = async () => {
  const query = getQuery('playlists');
  const result = await pool.query(query);
  return result.rows[0];
};

export const removeAllPlaylist = async () => {
  const query = {
    text: 'DELETE FROM playlists',
  };
  await pool.query(query);
};

/**
 * Playlist Songs Utils
 */

export const removeAllPlaylistSong = async () => {
  const query = {
    text: 'DELETE FROM playlist_songs',
  };
  await pool.query(query);
};

/**
 * Collaborations Utils
 */

export const removeAllCollaboration = async () => {
  const query = {
    text: 'DELETE FROM collaborations',
  };
  await pool.query(query);
};

/**
 * Playlist Activities Utils
 */

export const removeAllPlaylistActivities = async () => {
  const query = {
    text: 'DELETE FROM playlist_activities',
  };
  await pool.query(query);
};

/**
 * Albul User Likes Utils
 */

export const removeAllAlbumUserLikes = async () => {
  const query = {
    text: 'DELETE FROM album_user_likes',
  };
  await pool.query(query);
};
