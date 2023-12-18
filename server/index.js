const express = require('express');
const app = express();
import * as dotenv from 'dotenv'
import {config} from "dotenv";
dotenv.config()
const port = process.env.PORT || 8000;
const path = require('path');
import mariadb from 'mariadb'
config()

server.get("/show-all", async (req, res) => {
    // database connection
    // execute query
        // send response with data
})

// Middleware to parse request body
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('This is the Index page')
})

app.post('/create', (req, res) => {
    console.log(req.body);
    res.send("Idea received: " + JSON.stringify(req.body));
})

app.get('/ideas', (req, res) => {
    let connection;
    try {
        
    } catch (error) {
        
    }
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})