import express from "express";
import { config } from "dotenv";
import mariadb from "mariadb";
const cors = require('cors');
app.use(cors());

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

app.get("/:id", async (req, res) => {
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

app.post('/create-ideas', async (req, res) => {
    try {
        // Access the data sent in the request body
        const { title, description } = req.body;

        // TODO: Process this data (e.g., validate it, save it to a database)

        // For now, just logging the received data
        console.log("Received Idea: ", title, description);

        // Send a response back to the client
        res.json({ message: "Idea successfully received", data: req.body });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send("An error occurred on the server");
    }
});


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
