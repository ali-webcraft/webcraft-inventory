const { z } = require('zod')
const { textField } = require('./fields')

const registerSchema = z.object({
  name: textField('Name'),
  email: z.string({ error: 'Email is required' }).trim().email('Invalid email address'),
  password: z.string({ error: 'Password is required' }).min(6, 'Password must be at least 6 characters')
})

module.exports = { registerSchema }
