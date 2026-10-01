import mysql from 'mysql2/promise.js';
import config from '../config/Config.js';

const pool = await mysql.createPool(config.db);

async function query(sql, params) {
  const [results, ] = await pool.query(sql, params);
  return results;
}

export default {
  query
};