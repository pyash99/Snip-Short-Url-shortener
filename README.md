# ✂️ Snip - URL Shortener

A modern, beautiful URL shortener built with Node.js, Express, MongoDB, and EJS.

## ✨ Features

- 🎨 **Modern UI** - Beautiful gradient design with smooth animations
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🔄 **Duplicate Detection** - Prevents creating duplicate short URLs
- 📋 **Copy to Clipboard** - One-click copy functionality
- 📱 **QR Code Generation** - Generate QR codes for shortened URLs
- 📊 **Click Tracking** - Track how many times each URL is clicked
- 🎯 **Smart Notifications** - Beautiful notification banners for user feedback
- 📱 **Responsive Design** - Works perfectly on all devices

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Template Engine**: EJS
- **Styling**: Vanilla CSS with modern design patterns
- **URL Generation**: ShortID

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Snip-Short-Url-shortener
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running locally:
```bash
brew services start mongodb-community
```

4. Start the development server:
```bash
npm run devStart
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 🌐 Deployment

This project is configured for easy deployment on Render.com.

### Deploy to Render:

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Render will auto-detect the settings
5. Add a MongoDB database (Render provides free MongoDB)
6. Set the `MONGODB_URI` environment variable to your MongoDB connection string
7. Deploy!

## 📝 Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost/urlShortener)

## 🎯 Usage

1. Enter a long URL in the input field
2. Click "Shrink It" to generate a short URL
3. Copy the short URL or generate a QR code
4. Share your shortened URL!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

ISC

## 👨‍💻 Author

Built with ❤️ using modern web technologies
