import express from "express";
import { config } from "dotenv";
import mariadb from "mariadb";
config();

const PORT = process.env.PORT || 3000;
const app = express();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.use(express.json());

app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const data = await connection.query("SELECT * FROM ideas");
        res.send(data);
    } catch(err) {
        console.error("Error: ", err);
        res.status(500).send('Server Error');
    } finally {
        if (connection) connection.end();
    }
});

app.get("/show-ideas/:id", async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const prepare = await connection.prepare("SELECT * FROM ideas WHERE id = ?");
        const data = await prepare.execute([req.params.id]);
        res.send(data);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send('Server Error');
    } finally {
        if (connection) connection.end();
    }
});

/* app.post('/create-ideas', async (req, res) => {
    //code
}) */

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
