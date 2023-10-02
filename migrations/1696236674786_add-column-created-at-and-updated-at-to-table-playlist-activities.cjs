/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('playlist_activities', {
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
  pgm.dropColumn('playlist_activities', 'created_at');
  pgm.dropColumn('playlist_activities', 'updated_at');
};
