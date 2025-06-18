'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    // <main className="flex h-full flex-col items-center justify-center gap-2">
    //   <h2 className="text-xl font-semibold">404 Not Found</h2>
    //   <p>Could not find the requested invoice.</p>
    // <Link
    //   href="/dashboard/invoices"
    //   className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
    // >
    //   Go Back
    // </Link>
    // </main>
    <div className="w-full p-10 bg-gray-300 flex flex-col items-center justify-center">
      {/* <h2>Not Found: {data.name}</h2> */}
      <div className="border-2 border-gray-500 shadow-lg rounded-lg p-5 bg-gray-200 h-[300px] grid place-items-center">
        <h1>404 Not Found</h1>

        <p className="text-center text-2xl">
          <Link
            href="/admin/dashboard"
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          >
            Go Back
          </Link>
        </p>
      </div>
    </div>
  )
}
