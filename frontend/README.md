# Webcraft Inventory (Frontend)

Next.js frontend for the Webcraft inventory app. Admins log in, add products with a photo, and delete them. Everyone can browse the product list.

## Features
- Cookie based login (httpOnly JWT cookie), logout and a `/me` check
- Product list with image, price, category and stock
- Admin only: add product (image upload) and delete product
- `/products/new` is protected, non admins are sent to `/login`

## Tech
Next.js (App Router), React, TypeScript, Tailwind CSS

## Run locally
1. Start the backend on `http://localhost:5000`
2. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000
