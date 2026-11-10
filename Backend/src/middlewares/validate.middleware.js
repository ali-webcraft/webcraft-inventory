// validate(schema) ek middleware banata hai jo req.body ko schema se check karta hai.
// Sahi ho to saaf kiya hua data req.body mein rakh kar aage (controller) bhejta hai, ghalat ho to 400 deta hai.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {})

  if (!result.success) {
    // Har field ka sirf pehla message lete hain, taake ek field par 2 messages na aayen.
    const seen = new Set()
    const errors = []
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? 'body')
      if (seen.has(field)) continue
      seen.add(field)
      errors.push(issue.message)
    }
    return res.status(400).json({ success: false, message: errors.join(', '), errors })
  }

  req.body = result.data
  next()
}

module.exports = validate
