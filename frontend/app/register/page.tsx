'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const inputClass = "rounded-lg border border-gray-300 px-3 py-3 text-sm focus:border-indigo-600 focus:outline-none"

export default function Register() {
 const router = useRouter()
 const [name, setName] = useState('')
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [error, setError] = useState('')
 const [submitting, setSubmitting] = useState(false)

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setSubmitting(true)
  try {
   const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
   })
   const data = await response.json()
   if (!response.ok) {
    setError(data.message)
    return
   }
   // Account ban gaya, ab login karwate hain
   router.push('/login')
  } catch (error) {
   console.log(error)
   setError('Something went wrong')
  } finally {
   setSubmitting(false)
  }
 }

 return (
  <div className="flex min-h-screen items-center justify-center p-6">
   <form
    onSubmit={handleSubmit}
    className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-10"
   >
    <div className="flex flex-col gap-1.5">
     <h1 className="text-2xl font-semibold">Create account</h1>
     <p className="text-sm text-gray-600">Sign up to browse the Webcraft inventory</p>
    </div>

    <div className="flex flex-col gap-1.5">
     <label htmlFor="name" className="text-sm font-medium">Name</label>
     <input id="name" type="text" placeholder="Your name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
    </div>

    <div className="flex flex-col gap-1.5">
     <label htmlFor="email" className="text-sm font-medium">Email</label>
     <input id="email" type="email" placeholder="you@example.com" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>

    <div className="flex flex-col gap-1.5">
     <label htmlFor="password" className="text-sm font-medium">Password</label>
     <input id="password" type="password" placeholder="At least 6 characters" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
    </div>

    <button
     type="submit"
     disabled={submitting}
     className="rounded-lg bg-indigo-600 px-4 py-3 text-[15px] font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
    >
     {submitting ? 'Creating...' : 'Create account'}
    </button>

    {error && <p className="text-sm text-red-700">{error}</p>}

    <p className="text-center text-sm text-gray-600">
     Already have an account?{' '}
     <Link href="/login" className="font-medium text-indigo-600 hover:underline">Sign in</Link>
    </p>
   </form>
  </div>
 )
}
