"use client"

import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-4">Critical Error</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            The application encountered a critical error and cannot continue.
          </p>
          <Button onClick={reset} className="bg-red-500 hover:bg-red-600 text-white">
            <RefreshCcw className="mr-2 h-4 w-4" /> Try again
          </Button>
        </div>
      </body>
    </html>
  )
}
