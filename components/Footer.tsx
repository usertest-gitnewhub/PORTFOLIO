import Link from "next/link"
import { Linkedin, Heart, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Code Muse</h3>
            <p className="text-sm text-muted-foreground">
              Your intelligent coding companion for generating, debugging, and learning code across multiple languages
              and frameworks.
            </p>
            <div className="flex space-x-4">
              {[, { icon: Linkedin, href: "https://in.linkedin.com/" }, ,].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="space-y-2">
              {[
                { name: "Code Generation", path: "/generate" },
                { name: "Database Creator", path: "/database" },
                { name: "DSA Solver", path: "/dsa-solver" },
                { name: "Error Detection", path: "/generate" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              ail.com
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Send Feedback
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> by Shashank. © {currentYear} Code Muse.
            </p>
          </div>
          <nav className="flex space-x-4">
            {[
              { name: "About", path: "/about" },
              { name: "Privacy", path: "/privacy" },
              { name: "Terms", path: "/terms" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
