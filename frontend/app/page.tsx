'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar, { User } from "./components/Navbar"

const features = [
 { title: 'Product catalog', text: 'See every product with its price, category, stock and photo in one place.' },
 { title: 'Image uploads', text: 'Product photos are uploaded and stored safely on ImageKit.' },
 { title: 'Admin controls', text: 'Only admins can add or delete products, protected by a secure login.' }
]

export default function Home() {
 const [user, setUser] = useState<User | null>(null)

 useEffect(() => {
  const loginCheck = async () => {
   try {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    const data = await response.json()

    if (response.ok) {
     setUser(data.data)
    }
   }
   catch (error) {
    console.log(error)
   }
  }
  loginCheck()
 }, [])

 return (
  <div className="flex min-h-screen flex-col">
   <Navbar user={user} />

   <main className="mx-auto w-full max-w-6xl flex-1 px-10 py-20">
    <section className="flex max-w-2xl flex-col gap-5">
     <h1 className="text-5xl font-semibold leading-tight tracking-tight">Keep your inventory simple.</h1>
     <p className="text-lg leading-8 text-gray-600">
      Webcraft Inventory helps you add products, upload their photos and keep track of stock, all from one clean dashboard.
     </p>
     <div className="mt-2 flex gap-3">
      <Link href="/products" className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
       View products
      </Link>
      {!user && (
       <Link href="/login" className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium hover:bg-gray-50">
        Admin login
       </Link>
      )}
     </div>
    </section>

    <section className="mt-16 grid gap-6 sm:grid-cols-3">
     {features.map((f) => (
      <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6">
       <h2 className="mb-2 text-base font-semibold">{f.title}</h2>
       <p className="text-sm leading-6 text-gray-600">{f.text}</p>
      </div>
     ))}
    </section>
   </main>

   <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-600">
    Built by ali-webcraft
   </footer>
  </div>
 )
}
