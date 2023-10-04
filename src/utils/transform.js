/* eslint-disable camelcase */
const mapDBAlbumsToModel = ({
  id,
  name,
  year,
}) => {
  const yearNumber = Number(year);
  return ({
    id,
    name,
    year: yearNumber,
  });
};

const mapDBSongsToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

const mapDBSongToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => {
  const yearNumber = Number(year);
  const durationNumber = Number(duration);
  return ({
    id,
    title,
    year: yearNumber,
    performer,
    genre,
    duration: durationNumber,
    albumId: album_id,
  });
};

const mapDBPlaylistsToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapDBPlaylistActivitiesToModel = ({
  username,
  title,
  action,
  time,
}) => ({
  username,
  title,
  action,
  time,
});

export {
  mapDBAlbumsToModel,
  mapDBSongsToModel,
  mapDBSongToModel,
  mapDBPlaylistsToModel,
  mapDBPlaylistActivitiesToModel,
};
