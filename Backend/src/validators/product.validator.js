const { z } = require('zod')
const { textField, numberField } = require('./fields')

// Product banate waqt ye saare fields chahiye.
// z.object() un fields ko bhi hata deta hai jo yahan likhe nahi (jaise koi imageUrl bhej de).
const createProductSchema = z.object({
  name: textField('Name'),
  price: numberField('Price').refine((n) => n > 0, 'Price must be greater than 0'),
  stock: numberField('Stock')
    .refine((n) => Number.isInteger(n), 'Stock must be a whole number')
    .refine((n) => n >= 0, 'Stock cannot be negative'),
  category: textField('Category'),
  description: textField('Description')
})

// Update mein sab fields zaroori nahi, jo bheje wahi check hon: .partial() har field ko optional bana deta hai.
const updateProductSchema = createProductSchema.partial()

module.exports = { createProductSchema, updateProductSchema }
