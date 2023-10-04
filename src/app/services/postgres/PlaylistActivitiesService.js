/* c8 ignore next 2 */
import { nanoid } from 'nanoid';
import pg from 'pg';
import {
  createQuery, getConditionQuery, getJoinTableOrConditionQuery,
  mapDBPlaylistActivitiesToModel,
} from '../../../utils/index.js';

class PlaylistActivitiesService {
  constructor() {
    const { Pool } = pg;
    this._table = 'playlist_activities';
    this._tableUser = 'users';
    this._tablePlaylist = 'playlists';
    this._tableSong = 'songs';
    this._pool = new Pool();
  }

  async addActivity(userId, playlistId, songId, action) {
    const id = `playlist-activity-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const data = [
      id,
      userId,
      playlistId,
      songId,
      action,
      createdAt,
      createdAt,
      createdAt,
    ];
    const query = createQuery(data, this._table);
    await this._pool.query(query);
  }

  async getActivities(playlistId) {
    let query = getConditionQuery({ id: playlistId }, ['id'], this._tablePlaylist);
    const resultPlaylist = await this._pool.query(query);

    query = getJoinTableOrConditionQuery(
      this._table,
      [`${this._tableUser}.username`, `${this._tableSong}.title`, `${this._table}.action`, `${this._table}.time`],
      `LEFT JOIN ${this._tableUser} ON ${this._tableUser}.id = ${this._table}.user_id 
      LEFT JOIN ${this._tableSong} ON ${this._tableSong}.id = ${this._table}.song_id`,
      'WHERE playlist_activities.playlist_id = $1 ORDER BY playlist_activities.time',
      [playlistId],
    );
    const resultActivities = await this._pool.query(query);

    const data = {
      playlistId: resultPlaylist.rows[0].id,
      activities: [],
    };
    if (resultActivities.rows.length > 0) {
      data.activities = resultActivities.rows.map(mapDBPlaylistActivitiesToModel);
    }

    return data;
  }
}

export default PlaylistActivitiesService;
