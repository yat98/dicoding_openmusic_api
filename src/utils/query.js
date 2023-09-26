const createQuery = (values, table) => {
  const params = values.map((value, index) => `$${index + 1}`)
    .toString();
  const text = `INSERT INTO ${table} VALUES(${params}) RETURNING id`;
  return {
    text,
    values,
  };
};

const getQuery = (table) => `SELECT * FROM ${table}`;

const getByIdQuery = (id, table) => ({
  text: `SELECT * FROM ${table} WHERE id=$1`,
  values: [id],
});

const updateByIdQuery = (id, datas, table) => {
  const datasArray = Object.entries(datas);
  const params = datasArray.map((value, index) => `${value[0]}=$${index + 1}`)
    .toString();

  const text = `UPDATE ${table} SET ${params} WHERE id=$${datasArray.length + 1} RETURNING id`;
  return {
    text,
    values: [...Object.values(datas), id],
  };
};

const deleteByIdQuery = (id, table) => {
  const text = `DELETE FROM ${table} WHERE id=$1 RETURNING id`;
  return {
    text,
    values: [id],
  };
};

export {
  createQuery,
  getQuery,
  getByIdQuery,
  updateByIdQuery,
  deleteByIdQuery,
};
