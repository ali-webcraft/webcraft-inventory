// Ye sirf ghar/hotspot ke DNS masle ka hal hai, live server par iski zaroorat nahi
if (process.env.NODE_ENV !== 'production') {
 require('dns').setServers(['1.1.1.1', '8.8.8.8'])
}

require('dotenv').config()

const app = require('./src/app')

const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

// `node server.js` (ya nodemon) se chalane par server shuru hota hai.
// Vercel is file ko import karta hai aur sirf neeche export kiya hua `app` leta hai, isliye wahan listen nahi hota.
if (require.main === module) {
 connectDB()
  .then(() => {
   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
   })
  })
  .catch((error) => {
   console.error('MongoDB connection failed:', error.message);
   process.exit(1);
  })
}

module.exports = app
