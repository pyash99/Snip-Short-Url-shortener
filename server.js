const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// MongoDB connection - use environment variable in production, local in development
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/urlShortener'

console.log('🔄 Attempting to connect to MongoDB...')
console.log('📍 Using:', mongoUrl.includes('mongodb+srv') ? 'MongoDB Atlas (SRV)' : mongoUrl.includes('mongodb://') ? 'MongoDB (Direct)' : 'Unknown')

// Connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Add SSL options for MongoDB Atlas
if (mongoUrl.includes('mongodb+srv') || mongoUrl.includes('mongodb.net')) {
  connectionOptions.ssl = true
  connectionOptions.tls = true
  connectionOptions.tlsAllowInvalidCertificates = false
}

mongoose.connect(mongoUrl, connectionOptions)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB')
    console.log('📊 Database:', mongoose.connection.name)
    console.log('🔗 Host:', mongoose.connection.host)
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
    console.error('📋 Error name:', err.name)
    if (err.reason) {
      console.error('📋 Reason:', err.reason)
    }
    console.error('💡 Troubleshooting:')
    console.error('   1. Verify MONGODB_URI uses mongodb+srv:// format')
    console.error('   2. Check username and password are correct')
    console.error('   3. Ensure IP whitelist includes 0.0.0.0/0 in MongoDB Atlas')
    console.error('   4. Verify database user has proper permissions')
  })

// Handle connection events
mongoose.connection.on('error', err => {
  console.error('❌ MongoDB runtime error:', err.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected')
})


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
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`)
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`)
})