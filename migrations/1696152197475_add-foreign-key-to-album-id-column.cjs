exports.up = (pgm) => {
  pgm.sql("INSERT into albums(id, name, year, created_at, updated_at) VALUES('old_albums','old_albums','0000','2023-10-01T09:30:15.847Z','2023-10-01T09:30:15.847Z')");

  pgm.sql("UPDATE songs SET album_id='old_albums' WHERE album_id IS NULL");

  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album_id_albums.id');

  pgm.sql('UPDATE songs SET album_id = NULL WHERE album_id = \'old_albums\'');

  pgm.sql('DELETE from albums WHERE id=\'old_albums\'');
};
