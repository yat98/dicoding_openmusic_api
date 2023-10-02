/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('collaborations', {
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
  pgm.dropColumn('collaborations', 'created_at');
  pgm.dropColumn('collaborations', 'updated_at');
};
