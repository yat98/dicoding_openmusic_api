/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.renameColumn('playlists', 'user_id', 'owner');
};

exports.down = (pgm) => {
  pgm.renameColumn('playlists', 'owner', 'user_id');
};
