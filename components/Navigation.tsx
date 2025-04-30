"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Menu, X, Code, Database, Home, Lightbulb, BookOpen, Github, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/generate", label: "Generate", icon: Code },
  { href: "/database", label: "Database", icon: Database },
  { href: "/dsa-solver", label: "DSA Solver", icon: BookOpen },
  { href: "/challenges", label: "Challenges", icon: Award },
  { href: "/about", label: "About", icon: Lightbulb },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(false)
    router.push(href)
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-200 ${
        scrolled
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" onClick={(e) => handleNavigation("/", e)}>
              <motion.span
                className="text-xl md:text-2xl font-bold text-primary flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Code className="mr-2" />
                Code Muse
              </motion.span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavigation(item.href, e)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <motion.div
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-primary/10 hover:text-primary"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <ThemeToggle />
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground/60 hover:text-primary hover:bg-primary/10 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavigation(item.href, e)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <motion.div
                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/60 hover:bg-primary/10 hover:text-primary"
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
