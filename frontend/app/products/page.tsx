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

const LOW_STOCK = 10   // is se kam ya barabar stock par "Low stock" dikhta hai
const PAGE_SIZE = 12

// Stock ka rang: 0 = laal, kam = peela, theek = hara
function StockLabel({ stock }: { stock: number }) {
 if (stock === 0) {
  return <span className="text-[13px] font-medium text-red-700">Out of stock</span>
 }
 if (stock <= LOW_STOCK) {
  return <span className="text-[13px] font-medium text-amber-700">Low stock: {stock}</span>
 }
 return <span className="text-[13px] font-medium text-green-700">In stock: {stock}</span>
}

export default function Page() {
 const [user, setUser] = useState<User | null>(null)
 const [products, setProducts] = useState<Product[]>([])
 const [categories, setCategories] = useState<string[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState('')
 const [actionError, setActionError] = useState('')
 const [search, setSearch] = useState('')
 const [debouncedSearch, setDebouncedSearch] = useState('')
 const [category, setCategory] = useState('')
 const [page, setPage] = useState(1)
 const [totalPages, setTotalPages] = useState(1)
 const [total, setTotal] = useState(0)
 const [reload, setReload] = useState(0)

 const isAdmin = user?.role === 'admin'

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

 // Search: user ke likhna rokne ke 300ms baad hi backend ko poochte hain (har harf par nahi)
 useEffect(() => {
  const timer = setTimeout(() => {
   setDebouncedSearch(search)
   setPage(1)
  }, 300)
  return () => clearTimeout(timer)
 }, [search])

 // Category ki list (dropdown ke liye)
 useEffect(() => {
  const loadCategories = async () => {
   try {
    const response = await fetch('/api/product/categories')
    const json = await response.json()
    if (response.ok) {
     setCategories(json.data)
    }
   } catch (error) {
    console.log(error)
   }
  }
  loadCategories()
 }, [reload])

 // Products: search, category ya page badalte hi dobara laate hain
 useEffect(() => {
  let cancelled = false

  async function loadProducts() {
   try {
    const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
    if (debouncedSearch) params.set('search', debouncedSearch)
    if (category) params.set('category', category)

    const response = await fetch(`/api/product?${params}`)
    const json = await response.json()
    if (cancelled) return

    if (!response.ok) {
     setError(json.message || 'Error in fetching products')
     return
    }
    setProducts(json.data)
    setTotal(json.total)
    setTotalPages(Math.max(1, json.totalPages))
    setError('')
   } catch (error) {
    if (!cancelled) setError('Error in fetching products')
    console.log(error)
   } finally {
    if (!cancelled) setLoading(false)
   }
  }
  loadProducts()

  // Purani request ka jawab nayi request ke baad aa jaye to usay ignore karte hain
  return () => { cancelled = true }
 }, [debouncedSearch, category, page, reload])

 const handleDelete = async (id: string) => {
  setActionError('')
  try {
   const response = await fetch(`/api/product/${id}`, {
    method: 'DELETE',
    credentials: 'include'
   })

   if (!response.ok) {
    const data = await response.json()
    return setActionError(data.message)
   }
   // Aakhri product delete hua to pichle page par jao, warna list dobara lao
   if (products.length === 1 && page > 1) {
    setPage(page - 1)
   } else {
    setReload((r) => r + 1)
   }
  } catch (error) {
   console.log(error)
  }
 }

 // change = +1 ya -1
 const changeStock = async (id: string, change: number) => {
  setActionError('')
  try {
   const response = await fetch(`/api/product/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ change })
   })
   const data = await response.json()

   if (!response.ok) {
    return setActionError(data.message)
   }
   setProducts((list) => list.map((p) => (p._id === id ? { ...p, stock: data.data.stock } : p)))
  } catch (error) {
   console.log(error)
   setActionError('Something went wrong')
  }
 }

 if (loading) return <p className="p-10 text-gray-600">Loading...</p>

 return (
  <div>
   <Navbar user={user} />

   <main className="mx-auto max-w-6xl px-10 py-8">
    <div className="mb-6 flex items-center justify-between">
     <div>
      <h1 className="text-2xl font-semibold">Products</h1>
      <p className="mt-1 text-sm text-gray-600">{total} {total === 1 ? 'product' : 'products'}</p>
     </div>
     {isAdmin ? (
      <Link
       href="/products/new"
       className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
       Add Product
      </Link>
     ) : null}
    </div>

    <div className="mb-6 flex flex-wrap gap-3">
     <input
      type="search"
      aria-label="Search products"
      placeholder="Search products"
      className="min-w-[200px] flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-indigo-600 focus:outline-none"
      value={search}
      onChange={(e) => setSearch(e.target.value)} />
     <select
      aria-label="Filter by category"
      className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
      value={category}
      onChange={(e) => {
       setCategory(e.target.value)
       setPage(1)
      }}
     >
      <option value="">All categories</option>
      {categories.map((c) => (
       <option key={c} value={c}>{c}</option>
      ))}
     </select>
    </div>

    {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
    {actionError && <p className="mb-4 text-sm text-red-700">{actionError}</p>}

    {!error && products.length === 0 && <p className="text-gray-600">No products found.</p>}

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

         <div className="mt-auto flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
           <StockLabel stock={p.stock} />
           {isAdmin ? (
            <div className="flex items-center gap-1.5">
             <button
              aria-label={`Decrease stock of ${p.name}`}
              disabled={p.stock === 0}
              onClick={() => changeStock(p._id, -1)}
              className="h-7 w-7 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
             >
              -
             </button>
             <button
              aria-label={`Increase stock of ${p.name}`}
              onClick={() => changeStock(p._id, 1)}
              className="h-7 w-7 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50"
             >
              +
             </button>
            </div>
           ) : null}
          </div>

          {isAdmin ? (
           <div className="flex justify-end gap-2">
            <Link
             href={`/products/${p._id}/edit`}
             className="rounded-lg border border-gray-300 bg-white px-3.5 py-1.5 text-[13px] font-medium hover:bg-gray-50"
            >
             Edit
            </Link>
            <button
             onClick={() => handleDelete(p._id)}
             className="rounded-lg border border-red-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-red-700 hover:bg-red-50"
            >
             Delete
            </button>
           </div>
          ) : null}
         </div>
        </div>
       </article>
      )
     })}
    </div>

    {totalPages > 1 && (
     <div className="mt-8 flex items-center justify-center gap-4">
      <button
       disabled={page <= 1}
       onClick={() => setPage(page - 1)}
       className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
      >
       Previous
      </button>
      <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      <button
       disabled={page >= totalPages}
       onClick={() => setPage(page + 1)}
       className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
      >
       Next
      </button>
     </div>
    )}
   </main>
  </div>
 )
}
