import mariadb from 'mariadb'
import * as dotenv from 'dotenv'
dotenv.config()

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionlimit: 5
})

(async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const data = await connection.query(`SELECT * FROM brilliant_minds.ideas`);
        console.log(data)
    } catch(err) {
        throw err;
        //console.error("Error: ", err);
    } finally {
        if (connection) connection.end();
    }
})()

// the wrapper around the connection & try-catch-finally is just nameless arrow function to create an asynchronous environment.