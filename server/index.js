import express from "express";
import { config } from "dotenv";
import mariadb from "mariadb";
import cors from "cors";
config();

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs'); // Tell Express to use EJS as the templating engine

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query("SELECT * FROM ideas");
        res.render('index', { ideas: rows }); // Render 'index.ejs' and pass the ideas data
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).send("An error occurred while retrieving ideas");
    } finally {
        if (connection) connection.release();
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

/* app.post('/create-ideas', async (req, res) => {
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
}); */

app.post('/add-idea', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const { title, description } = req.body; // Extracting title and description from the request body
        const result = await connection.query("INSERT INTO ideas (title, description) VALUES (?, ?)", [title, description]);

        // Convert insertId to string to avoid BigInt serialization issues.
        res.json({ message: "Idea added successfully", ideaId: result.insertId.toString() });
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ message: "An error occurred on the server", error: error.toString() });
    } finally {
        if (connection) connection.release(); // Use release() for pool connections
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
