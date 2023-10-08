exports.up = (pgm) => {
  pgm.addColumn('playlists', {
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
  pgm.dropColumn('playlists', 'created_at');
  pgm.dropColumn('playlists', 'updated_at');
};
