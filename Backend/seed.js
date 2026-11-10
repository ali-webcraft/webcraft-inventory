// Dummy products dalne ke liye: `npm run seed`
// Hatane ke liye:               `npm run seed:remove`
// Ye sirf wahi products hatata hai jin ki imageFileId "dummy-" se shuru hoti hai, aap ke asli products ko nahi chhedta.
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])

require('dotenv').config()

const mongoose = require('mongoose')
const Product = require('./src/models/product.model')

// Naam wali placeholder image (internet se aati hai), taake card ka design dikhe
const imageFor = (name) =>
  `https://placehold.co/800x600/E8EAF0/4F46E5.png?text=${name.split(" ").slice(0, 3).join("+")}`

const products = [
  { name: 'Wireless Mouse', price: 1800, stock: 24, category: 'Electronics', description: 'Compact 2.4 GHz wireless mouse with silent clicks and long battery life.' },
  { name: 'Insulated Steel Water Bottle with Carry Handle (750 ml)', price: 1200, stock: 58, category: 'Home', description: 'Double wall bottle that keeps drinks cold for 12 hours and hot for 6.' },
  { name: 'Notebook Pack', price: 650, stock: 112, category: 'Stationery', description: 'Set of three ruled notebooks with soft covers.' },
  { name: 'LED Desk Lamp', price: 2400, stock: 9, category: 'Home', description: 'Adjustable LED lamp with three brightness levels, a flexible neck and a USB charging port. Gentle on the eyes, so it is good for long study or work sessions at night.' },
  { name: 'Cotton T-Shirt', price: 950, stock: 0, category: 'Fashion', description: 'Soft round neck cotton t-shirt, currently out of stock.' },
  { name: 'Basmati Rice 5 kg', price: 1650, stock: 40, category: 'Groceries', description: 'Long grain aged basmati rice.' },
  { name: 'USB-C Charger 20W', price: 1450, stock: 15, category: 'Electronics', description: 'Fast wall charger with a USB-C port, works with most phones.' },
  { name: 'Dish Wash Liquid 500 ml', price: 380, stock: 76, category: 'Cleaning Supplies', description: 'Lemon scented liquid that cuts grease easily.' }
]

async function run() {
  const removeOnly = process.argv[2] === 'remove'
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const removed = await Product.deleteMany({ imageFileId: /^dummy-/ })
    console.log(`Removed ${removed.deletedCount} old dummy products`)

    if (!removeOnly) {
      const docs = products.map((p, i) => ({
        ...p,
        imageUrl: imageFor(p.name),
        imageFileId: `dummy-${i + 1}`
      }))
      const created = await Product.insertMany(docs)
      console.log(`Added ${created.length} dummy products`)
    }
  } catch (error) {
    console.error('Seed failed:', error.message)
  } finally {
    await mongoose.disconnect()
  }
}

run()
