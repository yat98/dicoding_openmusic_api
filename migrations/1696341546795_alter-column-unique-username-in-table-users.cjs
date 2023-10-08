exports.up = (pgm) => {
  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
};

exports.down = (pgm) => {
  pgm.dropConstraint('users', 'unique_username');
};
