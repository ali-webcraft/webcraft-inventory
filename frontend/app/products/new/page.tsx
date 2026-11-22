'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar, { User } from "../../components/Navbar"

// Har input par yehi style lagti hai, is liye ek jagah likh di
const inputClass = "rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-indigo-600 focus:outline-none"

export default function NewProductPage() {
 const router = useRouter()
 const [user, setUser] = useState<User | null>(null)
 const [name, setName] = useState('')
 const [price, setPrice] = useState('')
 const [stock, setStock] = useState('')
 const [category, setCategory] = useState('')
 const [description, setDescription] = useState('')
 const [file, setFile] = useState<File | null>(null)
 const [error, setError] = useState('')
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(false)

 useEffect(() => {
  const checkAdmin = async () => {
   try {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    const data = await response.json()

    if (!response.ok || data.data.role !== 'admin') {
     router.push('/login')
     return
    }
    setUser(data.data)
    setLoading(false)
   } catch (error) {
    router.push('/login')
    console.log(error)
   }
  }
  checkAdmin()
 }, [router])

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!file) {
   setError('Image is required')
   return
  }

  const formData = new FormData()
  formData.append('name', name)
  formData.append('price', price)
  formData.append('stock', stock)
  formData.append('category', category)
  formData.append('description', description)
  formData.append('image', file)

  setError('')
  setSubmitting(true)
  try {
   const response = await fetch('/api/product', {
    method: 'POST',
    credentials: 'include',
    body: formData
   })
   const data = await response.json()
   if (!response.ok) {
    setError(data.message)
    return
   }
   router.push('/products')
  } catch (error) {
   console.log(error)
   setError('Something went wrong')
  } finally {
   setSubmitting(false)
  }
 }

 if (loading) return <p className="p-10 text-gray-600">Loading...</p>

 return (
  <div>
   <Navbar user={user} />

   <main className="mx-auto max-w-xl px-6 py-8">
    <h1 className="mb-5 text-2xl font-semibold">Add Product</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8">
     <div className="flex flex-col gap-1.5">
      <label htmlFor="name" className="text-sm font-medium">Name</label>
      <input id="name" type="text" placeholder="Product name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
     </div>

     <div className="flex gap-4">
      <div className="flex flex-1 flex-col gap-1.5">
       <label htmlFor="price" className="text-sm font-medium">Price</label>
       <input id="price" type="number" placeholder="0" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
       <label htmlFor="stock" className="text-sm font-medium">Stock</label>
       <input id="stock" type="number" placeholder="0" className={inputClass} value={stock} onChange={(e) => setStock(e.target.value)} />
      </div>
     </div>

     <div className="flex flex-col gap-1.5">
      <label htmlFor="category" className="text-sm font-medium">Category</label>
      <input id="category" type="text" placeholder="e.g. Electronics" className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} />
     </div>

     <div className="flex flex-col gap-1.5">
      <label htmlFor="description" className="text-sm font-medium">Description</label>
      <textarea id="description" rows={3} placeholder="Short description" className={`${inputClass} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} />
     </div>

     <div className="flex flex-col gap-1.5">
      <label htmlFor="image" className="text-sm font-medium">Product image</label>
      <input
       id="image"
       type="file"
       accept="image/*"
       className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-sm"
       onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <span className="text-xs text-gray-600">PNG or JPG, up to 2 MB</span>
     </div>

     {error && <p className="text-sm text-red-700">{error}</p>}

     <div className="flex justify-end gap-3">
      <Link href="/products" className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50">
       Cancel
      </Link>
      <button
       type="submit"
       disabled={submitting}
       className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
      >
       {submitting ? 'Adding...' : 'Add Product'}
      </button>
     </div>
    </form>
   </main>
  </div>
 )
}
