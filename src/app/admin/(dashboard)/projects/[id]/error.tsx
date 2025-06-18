'use client'

import { Button } from '@/components/ui/button'
import { useRoute } from '@/composable/useRoute'

export default function ErrorCustom({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string }
  reset: () => void
}>) {
  function handleReset() {
    reset()
  }
  const route = useRoute()

  return (
    <div className="w-full p-10 bg-gray-300 flex flex-col items-center justify-center">
      {/* <h2>Not Found: {data.name}</h2> */}
      <div className="border-2 border-gray-500 shadow-lg rounded-lg p-5 bg-gray-200 h-[300px] grid place-items-center">
        <h1>Something went wrong! </h1>
        <p className="text-2xl italic font-bold">
          Error: {JSON.stringify(error.message)}
        </p>
        <p className="text-center text-2xl">
          <Button variant={'destructive'} onClick={handleReset}>
            Back to {route.pathname}
          </Button>
        </p>
      </div>
    </div>
    // <main className="flex h-full flex-col items-center justify-center">
    //   <h2 className="text-center">
    //     Something went wrong! Error: {JSON.stringify(error.message)}
    //   </h2>
    // <button
    //   className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
    //   onClick={handleReset}
    // >
    //   Try again
    // </button>
    // </main>
  )
}
