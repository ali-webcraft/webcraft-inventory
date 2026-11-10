const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config()

const app = require('./src/app')

const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
 await connectDB()
 app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
 }
 )
}

startServer()