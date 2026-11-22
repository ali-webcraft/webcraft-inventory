'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Login() {
 const router = useRouter()
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [error, setError] = useState('')

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
   const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
   })
   const data = await response.json()
   if (!response.ok) {
    setError(data.message)
    return
   }
   router.push('/products')

  }
  catch (error) {
   console.log(error)
   setError('Something went wrong')
  }
 }

 return (
  <div className="flex min-h-screen items-center justify-center p-6">
   <form
    onSubmit={handleSubmit}
    className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-10"
   >
    <div className="flex flex-col gap-1.5">
     <h1 className="text-2xl font-semibold">Sign in</h1>
     <p className="text-sm text-gray-600">Manage your Webcraft inventory</p>
    </div>

    <div className="flex flex-col gap-1.5">
     <label htmlFor="email" className="text-sm font-medium">Email</label>
     <input
      id="email"
      type="email"
      placeholder="you@example.com"
      className="rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-indigo-600 focus:outline-none"
      value={email}
      onChange={(e) => setEmail(e.target.value)} />
    </div>

    <div className="flex flex-col gap-1.5">
     <label htmlFor="password" className="text-sm font-medium">Password</label>
     <input
      id="password"
      type="password"
      placeholder="Your password"
      className="rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-indigo-600 focus:outline-none"
      value={password}
      onChange={(e) => setPassword(e.target.value)} />
    </div>

    <button
     type="submit"
     className="rounded-lg bg-indigo-600 px-4 py-3 text-[15px] font-medium text-white hover:bg-indigo-700"
    >
     Login
    </button>

    {error && <p className="text-sm text-red-700">{error}</p>}
   </form>
  </div>
 )
}
