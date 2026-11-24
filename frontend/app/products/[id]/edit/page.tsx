'use client'

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navbar, { User } from "../../../components/Navbar"
import ProductFields, { emptyProduct, ProductValues } from "../../../components/ProductFields"

function EditProductForm() {
 const router = useRouter()
 const { id } = useParams<{ id: string }>()
 const [user, setUser] = useState<User | null>(null)
 const [values, setValues] = useState<ProductValues>(emptyProduct)
 const [error, setError] = useState('')
 const [loadError, setLoadError] = useState('')
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(false)

 useEffect(() => {
  const load = async () => {
   try {
    // 1. Pehle check: admin hai ya nahi
    const meResponse = await fetch('/api/auth/me', { credentials: 'include' })
    const meData = await meResponse.json()
    if (!meResponse.ok || meData.data.role !== 'admin') {
     router.push('/login')
     return
    }
    setUser(meData.data)

    // 2. Phir product lao aur form mein bhar do (form ke inputs mein text hi rehta hai)
    const response = await fetch(`/api/product/${id}`)
    const data = await response.json()
    if (!response.ok) {
     setLoadError(data.message || 'Product not found')
     setLoading(false)
     return
    }
    const p = data.data
    setValues({
     name: p.name,
     price: String(p.price),
     stock: String(p.stock),
     category: p.category,
     description: p.description
    })
    setLoading(false)
   } catch (error) {
    console.log(error)
    router.push('/login')
   }
  }
  load()
 }, [id, router])

 const handleChange = (field: keyof ProductValues, value: string) => {
  setValues((current) => ({ ...current, [field]: value }))
 }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setSubmitting(true)
  try {
   const response = await fetch(`/api/product/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(values)
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

 if (loadError) {
  return (
   <div>
    <Navbar user={user} />
    <main className="mx-auto max-w-xl px-6 py-8">
     <p className="mb-4 text-red-700">{loadError}</p>
     <Link href="/products" className="text-sm font-medium text-indigo-600 hover:underline">Back to products</Link>
    </main>
   </div>
  )
 }

 return (
  <div>
   <Navbar user={user} />

   <main className="mx-auto max-w-xl px-6 py-8">
    <h1 className="mb-5 text-2xl font-semibold">Edit Product</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8">
     <ProductFields values={values} onChange={handleChange} />

     <p className="text-xs text-gray-600">To change the photo, delete this product and add it again.</p>

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
       {submitting ? 'Saving...' : 'Save changes'}
      </button>
     </div>
    </form>
   </main>
  </div>
 )
}

// useParams (URL se id lene) ko Next.js build ke waqt Suspense ke andar chahiye hota hai
export default function EditProductPage() {
 return (
  <Suspense fallback={<p className="p-10 text-gray-600">Loading...</p>}>
   <EditProductForm />
  </Suspense>
 )
}
