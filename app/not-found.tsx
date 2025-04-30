import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Home className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </Link>
    </div>
  )
}
