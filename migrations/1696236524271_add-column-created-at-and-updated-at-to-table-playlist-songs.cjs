/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('playlist_songs', {
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('playlist_songs', 'created_at');
  pgm.dropColumn('playlist_songs', 'updated_at');
};
