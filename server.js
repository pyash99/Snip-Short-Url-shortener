const express = require('express');
const { Pool } = require('pg');
const shortid = require('shortid');

const app = express();

// PostgreSQL connection – Render provides DATABASE_URL automatically.
// Fallback to local Postgres for development.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/urlshortener',
});

// Ensure the required table exists.
const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS short_urls (
      id SERIAL PRIMARY KEY,
      full TEXT NOT NULL,
      short VARCHAR(20) NOT NULL UNIQUE,
      clicks INTEGER NOT NULL DEFAULT 0
    );
  `);
  console.log('✅ PostgreSQL table ready');
};
initDb();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Home page – list all short URLs.
app.get('/', async (req, res) => {
  const { rows: shortUrls } = await pool.query('SELECT * FROM short_urls ORDER BY id DESC');
  res.render('index', {
    shortUrls,
    message: req.query.message || null,
    messageType: req.query.type || 'info',
    existingShortUrl: req.query.shortUrl || null,
  });
});

// Create a new short URL.
app.post('/shortUrls', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  // Check for duplicate full URL.
  const { rows } = await pool.query('SELECT * FROM short_urls WHERE full = $1', [fullUrl]);
  if (rows.length > 0) {
    const existing = rows[0];
    return res.redirect(`/?message=${encodeURIComponent('This URL has already been shortened!')}&type=info&shortUrl=${existing.short}`);
  }
  // Generate a new short code.
  const short = shortid.generate();
  await pool.query('INSERT INTO short_urls (full, short) VALUES ($1, $2)', [fullUrl, short]);
  res.redirect('/?message=URL shortened successfully!&type=success');
});

// Redirect short URL to original URL and increment click count.
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const { rows } = await pool.query('SELECT * FROM short_urls WHERE short = $1', [shortUrl]);
  if (rows.length === 0) return res.sendStatus(404);
  const urlRecord = rows[0];
  await pool.query('UPDATE short_urls SET clicks = clicks + 1 WHERE id = $1', [urlRecord.id]);
  res.redirect(urlRecord.full);
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});