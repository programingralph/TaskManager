import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Pool } from 'pg' 

const app = express();
app.use(bodyParser.json());
dotenv.config({ path: '../.env' }); // Explicitly specify .env path

const pool = new Pool({
    user: process.env.VITE_USER,
    host: process.env.VITE_HOST,
    database: process.env.VITE_DATABASE,
    password: process.env.VITE_PASSWORD,
    port: process.env.VITE_PORT,
});

export default pool;
