import express from "express";
import { config } from "dotenv";
import mariadb from "mariadb"
config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";
const app = express();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
})

app.use(express.json());

app.get('/', async (req, res) => {
        let connection;
        try {
            connection = await pool.getConnection();
            const data = await connection.query(
                "SELECT * FROM ideas"
                )
            res.send(data)
        } catch(err) {
            throw err;
            //console.error("Error: ", err);
        } finally {
            if (connection) connection.end();
        }
})();

app.get('/ideas/:id', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const prepare = await connection.prepare(
            "SELECT * FROM ideas WHERE id = ?"
        )
        const data = await prepare.execute([req.params.id])
        res.send(data)   
    } catch (error) {
        throw error;
    } finally {
        if (connection) connection.end();
    }
  })

app.post('/create', (req, res) => {
    console.log(req.body);
    res.send("Idea received: " + JSON.stringify(req.body));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})