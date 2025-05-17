const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
pool
  .connect()
  .then(() => console.log("Connected to the PostgreSQL database"))
  .catch((err) => console.error("Error connecting to the database", err));

pool.query(`
  CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    location TEXT NOT NULL,
    submitted_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rating NUMERIC DEFAULT NULL
  );`, 
  (err) => {
  if (err) {
    console.error('Error creating images table:', err);
  } else {
    console.log('Images table is ready.');
  }
});

module.exports = pool;
