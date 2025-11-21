const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// MongoDB connection - use environment variable in production, local in development
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/urlShortener'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))


app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', {
    shortUrls: shortUrls,
    message: req.query.message || null,
    messageType: req.query.type || 'info',
    existingShortUrl: req.query.shortUrl || null
  })
})

app.post('/shortUrls', async (req, res) => {
  // Check if URL already exists
  const existingUrl = await ShortUrl.findOne({ full: req.body.fullUrl })

  if (existingUrl) {
    // URL already exists, redirect with message
    return res.redirect(`/?message=${encodeURIComponent('This URL has already been shortened!')}&type=info&shortUrl=${existingUrl.short}`)
  }

  // Create new short URL
  await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect('/?message=URL shortened successfully!&type=success')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

const PORT = process.env.PORT || 3000
const HOST = '0.0.0.0' // Required for Render - listens on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
})