"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SpotlightProps {
  children: React.ReactNode
  className?: string
}

export function SpotlightBackground({ children, className = "" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [size, setSize] = useState(0)

  const updateSpotlight = (event: MouseEvent) => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Get position relative to container
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setPosition({ x, y })

    // Fade in spotlight when mouse enters
    setOpacity(1)

    // Adjust size based on container dimensions
    const maxSize = Math.max(rect.width, rect.height) * 1.5
    setSize(maxSize)
  }

  const resetSpotlight = () => {
    setOpacity(0)
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("mousemove", updateSpotlight)
    container.addEventListener("mouseleave", resetSpotlight)
    container.addEventListener("mouseenter", updateSpotlight)

    return () => {
      container.removeEventListener("mousemove", updateSpotlight)
      container.removeEventListener("mouseleave", resetSpotlight)
      container.removeEventListener("mouseenter", updateSpotlight)
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, 
            rgba(var(--neon-blue-rgb), 0.15) 0%, 
            rgba(var(--neon-purple-rgb), 0.1) 25%, 
            transparent 70%)`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          opacity,
          mixBlendMode: "soft-light",
        }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
