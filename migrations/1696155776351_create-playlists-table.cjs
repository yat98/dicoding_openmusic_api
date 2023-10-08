exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
  });
  pgm.addConstraint('playlists', 'fk_playlists.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.user_id_users.id');
  pgm.dropTable('playlists');
};
