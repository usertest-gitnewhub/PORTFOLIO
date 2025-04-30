"use client"

import { motion } from "framer-motion"
import { Brain, Sparkles, Zap } from "lucide-react"

export function ThinkingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-8 space-y-6"
    >
      <motion.div
        className="relative w-20 h-20 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
        <Brain className="w-10 h-10 text-primary" />

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{
              x: Math.random() * 60 - 30,
              y: Math.random() * 60 - 30,
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.4,
              repeatType: "loop",
            }}
          >
            <Sparkles className="w-4 h-4 text-neon-pink" />
          </motion.div>
        ))}
      </motion.div>

      <div className="space-y-2 text-center">
        <motion.div
          className="flex items-center justify-center space-x-2"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <Zap className="w-5 h-5 text-neon-blue" />
          <h3 className="text-xl font-bold text-primary">Thinking...</h3>
          <Zap className="w-5 h-5 text-neon-pink" />
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground max-w-md"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Analyzing your request and generating the perfect solution
        </motion.p>
      </div>
    </motion.div>
  )
}
