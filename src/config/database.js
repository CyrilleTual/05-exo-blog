import mysql from "mysql2/promise";

import { DB_HOST, DB_NAME, DB_USER, DB_PWD, DB_PORT } from "./const.js";


export const pool = mysql.createPool({
    host: DB_HOST,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PWD,
    port: DB_PORT,
});

pool.getConnection().then(res => console.log(`Connected to : ${res.config.database}`));    