const { z } = require('zod')

// Text field: text hona chahiye, aur khali nahi.
// .trim() aage peeche ke faltu spaces hata deta hai.
const textField = (label) =>
  z.string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)

// Number field: FormData se har cheez TEXT ban kar aati hai (price = "123").
// Is liye pehle text check karte hain, phir usay number mein badalte hain (.transform(Number)),
// aur agar number na ban sake (NaN) to message dete hain.
const numberField = (label) =>
  z.string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`)
    .transform(Number)
    .refine((n) => !Number.isNaN(n), `${label} must be a number`)

module.exports = { textField, numberField }
