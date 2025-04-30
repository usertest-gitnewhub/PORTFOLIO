"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ThinkingAnimation } from "./ThinkingAnimation"
import SyntaxHighlighter from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeOutputProps {
  isLoading: boolean
  code: string
  language: string
}

export function CodeOutput({ isLoading, code, language }: CodeOutputProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <ThinkingAnimation key="thinking" />
      ) : (
        code && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-sm text-gray-400">Output</span>
              </div>
            </div>
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1.5rem",
              }}
              showLineNumbers
            >
              {code}
            </SyntaxHighlighter>
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}
