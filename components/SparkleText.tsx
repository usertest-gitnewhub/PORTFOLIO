"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const Sparkle = ({ style }: { style: React.CSSProperties }) => (
  <motion.span
    className="absolute inline-block w-1 h-1 bg-white rounded-full"
    style={style}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: Math.random() * 2,
    }}
  />
)

export function SparkleText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; style: React.CSSProperties }>>([])

  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        transform: `rotate(${Math.random() * 360}deg)`,
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
      },
    }))
    setSparkles(newSparkles)
  }, [])

  return (
    <motion.div
      className={`relative inline-block z-10 ${className}`}
      animate={{
        filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"],
      }}
      transition={{
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} style={sparkle.style} />
      ))}
      <motion.div
        className="relative z-10"
        initial={{ textShadow: "0 0 0px rgba(255, 255, 255, 0)" }}
        animate={{
          textShadow: [
            "0 0 4px rgba(255, 255, 255, 0.5)",
            "0 0 8px rgba(255, 255, 255, 0.8)",
            "0 0 4px rgba(255, 255, 255, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
