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

const getConditionQuery = (datas, columns, table) => {
  let columnParams = columns.map((value) => `${value}`);
  if (columnParams.length > 0) columnParams.toString();
  else columnParams = '*';

  let text = `SELECT ${columnParams} FROM ${table}`;
  const values = [];
  const datasArray = Object.entries(datas);
  const filterExists = datasArray.filter((value) => value[1] !== undefined);
  const params = filterExists.map((value, index) => {
    values.push(`${value[1]}`);
    return `${value[0]} = $${index + 1}`;
  })
    .toString()
    .replace(/,/g, ' AND ');
  if (params.length > 0) text += ` WHERE ${params}`;

  return {
    text,
    values,
  };
};

const getFilteredQuery = (columns, table) => {
  let params = columns.map((value) => `${value}`);
  if (params.length > 0) params.toString();
  else params = '*';
  return `SELECT ${params} FROM ${table}`;
};

const getFilteredConditionQuery = (datas, table) => {
  let text = `SELECT * FROM ${table}`;
  const values = [];
  const datasArray = Object.entries(datas);
  const filterExists = datasArray.filter((value) => value[1] !== undefined);
  const params = filterExists.map((value, index) => {
    values.push(`%${value[1]}%`);
    return `LOWER(${value[0]}) LIKE LOWER($${index + 1})`;
  })
    .toString()
    .replace(/,/g, ' AND ');
  if (params.length > 0) text += ` WHERE ${params}`;

  return {
    text,
    values,
  };
};

const getByIdQuery = (id, table) => ({
  text: `SELECT * FROM ${table} WHERE id=$1`,
  values: [id],
});

const getJoinTwoTableQuery = (
  id,
  table1,
  table2,
  pk1,
  pk2,
  t1Columns,
  t2Columns,
  type = 'INNER JOIN',
) => {
  const t1ColumnString = t1Columns.map((column) => `t1.${column}`)
    .toString();
  const t2ColumnString = t2Columns.map((column) => `t2.${column}`)
    .toString();
  const columnString = [t1ColumnString, t2ColumnString].toString();

  return {
    text: `SELECT ${columnString} 
      FROM ${table1} t1
      ${type} ${table2} t2 ON t1.${pk1} = t2.${pk2}
      WHERE t1.${pk1} = $1`,
    values: [id],
  };
};

const getJoinTwoTableConditionQuery = (
  table1,
  table2,
  pk1,
  pk2,
  t1Columns,
  t2Columns,
  conditionT1 = {},
  conditionT2 = {},
  type = 'INNER JOIN',
) => {
  let index = 0;
  let text = '';
  const values = [];
  const t1ColumnString = t1Columns.map((column) => `t1.${column}`)
    .toString();
  const t2ColumnString = t2Columns.map((column) => `t2.${column}`)
    .toString();
  const columnString = [t1ColumnString, t2ColumnString].toString();

  const conditionT1Array = Object.entries(conditionT1);
  const filterT1Exists = conditionT1Array.filter((value) => value[1] !== undefined);
  const paramsT1 = filterT1Exists.map((value) => {
    index += 1;
    values.push(`${value[1]}`);
    return `t1.${value[0]} = $${index}`;
  });

  const conditionT2Array = Object.entries(conditionT2);
  const filterT2Exists = conditionT2Array.filter((value) => value[1] !== undefined);
  const paramsT2 = filterT2Exists.map((value) => {
    index += 1;
    values.push(`${value[1]}`);
    return `t2.${value[0]} = $${index}`;
  });

  text = `SELECT ${columnString} 
      FROM ${table1} t1
      ${type} ${table2} t2 ON t1.${pk1} = t2.${pk2}`;

  const conditionParams = [...paramsT1, ...paramsT2];
  if (conditionParams.length > 0) text += ` WHERE ${conditionParams.toString().replace(/,/g, ' AND ')}`;

  return {
    text,
    values,
  };
};

const getJoinTableOrConditionQuery = (
  table,
  columns,
  relations,
  conditions = null,
  values = [],
  groupBy = null,
) => {
  let text = '';
  const columnString = columns.map((column) => `${column}`)
    .toString();

  text = `SELECT ${columnString} FROM ${table} ${relations}`;

  if (values.length > 0) text += ` ${conditions}`;
  if (groupBy !== null) text += ` GROUP BY ${groupBy}`;

  return {
    text,
    values,
  };
};

const updateByConditionQuery = (datas, condition, table, returnValue = 'id') => {
  let conditionText = '';
  const datasArray = Object.entries(datas);
  const params = datasArray.map((value, index) => `${value[0]} = $${index + 1}`)
    .toString();

  const conditionArray = Object.entries(condition);
  const filterExists = conditionArray.filter((value) => value[1] !== undefined);
  const conditionParams = filterExists.map((value, index) => `${value[0]} = $${datasArray.length + index + 1}`)
    .toString()
    .replace(/,/g, ' AND ');
  if (conditionParams.length > 0) conditionText += `WHERE ${conditionParams}`;

  const text = `UPDATE ${table} SET ${params} ${conditionText} RETURNING ${returnValue}`;
  return {
    text,
    values: [...Object.values(datas), ...Object.values(condition)],
  };
};

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

const deleteByConditionQuery = (table, conditions, returnValue = 'id') => {
  let text = `DELETE FROM ${table}`;
  const values = [];
  const conditionArray = Object.entries(conditions);
  const filterExists = conditionArray.filter((value) => value[1] !== undefined);
  const params = filterExists.map((value, index) => {
    values.push(`${value[1]}`);
    return `${value[0]} = $${index + 1}`;
  })
    .toString()
    .replace(/,/g, ' AND ');
  if (params.length > 0) text += ` WHERE ${params}`;
  text += ` RETURNING ${returnValue}`;

  return {
    text,
    values,
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
  getJoinTwoTableQuery,
  getByIdQuery,
  updateByIdQuery,
  deleteByIdQuery,
  getFilteredConditionQuery,
  getConditionQuery,
  updateByConditionQuery,
  getFilteredQuery,
  getJoinTwoTableConditionQuery,
  deleteByConditionQuery,
  getJoinTableOrConditionQuery,
};
