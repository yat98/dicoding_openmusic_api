exports.up = (pgm) => {
  pgm.addColumn('album_user_likes', {
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
  pgm.dropColumn('album_user_likes', 'created_at');
  pgm.dropColumn('album_user_likes', 'updated_at');
};
