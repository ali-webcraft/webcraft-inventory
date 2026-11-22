'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"

// User ki shakal: dono pages (products, new) isi ko use karte hain
export type User = { name: string; role: string }

// Ye component har page par upar ki patti (brand + Welcome + Logout) dikhata hai.
// Logout ka kaam bhi isi ke andar hai, is liye har page mein dobara likhna nahi paray ga.
export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white">
     <div className="mx-auto flex max-w-6xl items-center justify-between px-10 py-4">
      <Link href="/" className="text-lg font-semibold text-gray-900">
        Webcraft Inventory
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">
              Welcome, {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Login
          </Link>
        )}
      </div>
     </div>
    </header>
  )
}
