const createQuery = (values, table) => {
  const params = values.map((values, index) => `$${index + 1}`)
    .toString();
  const text = `INSERT INTO ${table} VALUES(${params}) RETURNING id`;
  return {
    text,
    values,
  }
};

const getQuery = (table) => {
  return `SELECT * FROM ${table}`;
};

const getByIdQuery = (id, table) => {
  return {
    text: `SELECT * FROM ${table} WHERE id=$1`,
    values: [id],
  };
};

const updateByIdQuery = (id, values, table) => {
  const valuesArray = Object.entries(values);
  const params = valuesArray.map((value, index) => `${value[0]}=$${index + 1}`)
    .toString();
  
  const text = `UPDATE ${table} SET ${params} WHERE id=$${valuesArray.length + 1} RETURNING id`;
  return {
    text,
    values: [...Object.values(values),id],
  }
};

const deleteByIdQuery = (id, table) => {
  const text = `DELETE FROM ${table} WHERE id=$1 RETURNING id`;
  return {
    text,
    values: [id],
  }
};

export {
  createQuery,
  getQuery,
  getByIdQuery,
  updateByIdQuery,
  deleteByIdQuery,
}