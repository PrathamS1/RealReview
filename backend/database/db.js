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

//* Creating images table if it does not exist
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

//* Creating ratings table if it does not exist
pool.query(`
  CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    image_id INTEGER REFERENCES images(id) ON DELETE CASCADE,
    rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  (err) => {
  if (err) {
    console.error('Error creating ratings table:', err);
  } else {
    console.log('Ratings table is ready.');
  }
});

module.exports = pool;
