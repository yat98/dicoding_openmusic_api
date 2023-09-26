/* eslint-disable camelcase */
const mapDBAlbumsToModel = ({
  id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapDBSongsToModel = ({
  id,
  album_id,
  title,
  year,
  genre,
  performer,
  duration,
  created_at,
  updated_at,
}) => ({
  id,
  albumId: album_id,
  title,
  year,
  genre,
  performer,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
});

export {
  mapDBAlbumsToModel,
  mapDBSongsToModel,
};
