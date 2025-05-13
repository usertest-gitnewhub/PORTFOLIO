"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">An unexpected error has occurred. Please try again later.</p>
      <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-primary-foreground">
        <RefreshCcw className="mr-2 h-4 w-4" /> Try again
      </Button>
    </div>
  )
}
