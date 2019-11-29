import mysql, { Pool } from 'mysql';

const pool: Pool = mysql
    .createPool(process.env.JAWSDB_MARIA_URL + '?connectionLimit=100');

export const multipleStatementConnection = () => mysql
    .createConnection(process.env.JAWSDB_MARIA_URL + '?multipleStatements=true');

export default pool;
