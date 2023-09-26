/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'Text',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'TEXT',
      notNull: false,
    },
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

exports.down = pgm => {
  pgm.dropTable('songs');
};
