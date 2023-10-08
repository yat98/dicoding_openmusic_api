exports.up = (pgm) => {
  pgm.alterColumn('albums', 'cover', {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('albums', 'cover', {
    notNull: true,
  });
};
