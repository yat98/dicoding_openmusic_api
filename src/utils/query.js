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

const getQueryFilter = (datas, table) => {
  let text = `SELECT * FROM ${table}`;
  const datasArray = Object.entries(datas);
  const filterExists = datasArray.filter((value) => value[1] !== undefined);
  const params = filterExists.map((value) => `LOWER(${value[0]}) LIKE LOWER('%${value[1]}%')`)
    .toString()
    .replace(/,/g, ' AND ');
  if (params.length > 0) text += ` WHERE ${params}`;

  return text;
};

const getByIdQuery = (id, table) => ({
  text: `SELECT * FROM ${table} WHERE id=$1`,
  values: [id],
});

const getByIdJoinQuery = (id, table1, table2, pk1, pk2) => ({
  text: `SELECT t1.id, t2.id, t2.title, t2.performer FROM ${table1} t1
  INNER JOIN ${table2} t2 ON t1.${pk1} = t2.${pk2} WHERE t1.${pk1}=$1`,
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
  getByIdJoinQuery,
  getByIdQuery,
  updateByIdQuery,
  deleteByIdQuery,
  getQueryFilter,
};
