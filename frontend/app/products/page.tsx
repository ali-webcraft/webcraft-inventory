'use client'

type Product = {
 _id: string,
 imageUrl: string,
 name: string,
 price: number,
 stock: number,
 category: string,
 description: string
}
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar, { User } from "../components/Navbar";


export default function Page() {
 const [user, setUser] = useState<User | null>(null)
 const [products, setProducts] = useState<Product[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')
 const [deleteError, setDeleteError] = useState('')

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

 useEffect(() => {
  async function products() {
   try {
    const response = await fetch('/api/product/')
    const json = await response.json()
    setProducts(json.data)

   } catch (error) {
    setError('Error in fetching products')
    console.log(error)

   } finally {
    setLoading(false)
   }
  }
  products()
 }, [])

 const handleDelete = async (id: string) => {
  try {
   const response = await fetch(`/api/product/${id}`, {
    method: 'DELETE',
    credentials: 'include'
   })

   if (!response.ok) {
    const data = await response.json()
    return setDeleteError(data.message)
   }
   setProducts(products.filter((p) => p._id !== id))
  } catch (error) {
   console.log(error)
  }
 }

 if (loading) return <p className="p-10 text-gray-600">Loading...</p>
 if (error) return <p className="p-10 text-red-700">{error}</p>

 return (
  <div>
   <Navbar user={user} />

   <main className="mx-auto max-w-6xl px-10 py-8">
    <div className="mb-6 flex items-center justify-between">
     <h1 className="text-2xl font-semibold">Products</h1>
     {user?.role === 'admin' ? (
      <Link
       href="/products/new"
       className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
       Add Product
      </Link>
     ) : null}
    </div>

    {deleteError && <p className="mb-4 text-sm text-red-700">{deleteError}</p>}

    {products.length === 0 && <p className="text-gray-600">No products yet.</p>}

    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
     {products.map((p) => {
      return (
       <article key={p._id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="relative aspect-[4/3] w-full bg-gray-100">
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img src={p.imageUrl} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
         <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-base font-semibold">{p.name}</h2>
          <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold">Rs {p.price.toLocaleString()}</span>
         </div>
         <span className="self-start rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-800">{p.category}</span>
         <p className="line-clamp-3 text-[13px] leading-6 text-gray-600">{p.description}</p>
         <div className="mt-auto flex items-center justify-between pt-1">
          {p.stock === 0 ? (
           <span className="text-[13px] font-medium text-red-700">Out of stock</span>
          ) : (
           <span className="text-[13px] font-medium text-green-700">In stock: {p.stock}</span>
          )}
          {user?.role === 'admin' ? (
           <button
            onClick={() => handleDelete(p._id)}
            className="rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-red-700 hover:bg-red-50"
           >
            Delete
           </button>
          ) : null}
         </div>
        </div>
       </article>
      )
     })}
    </div>
   </main>
  </div>
 )
}
