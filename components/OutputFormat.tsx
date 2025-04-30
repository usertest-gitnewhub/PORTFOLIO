"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"

interface OutputFormatProps {
  isLoading: boolean
  output: string
  language: string
  title: string
  beforeContent?: string
  afterContent?: string
}

export function OutputFormat({ isLoading, output, language, title, beforeContent, afterContent }: OutputFormatProps) {
  const [copied, setCopied] = useState(false)
  const [displayOutput, setDisplayOutput] = useState("")

  useEffect(() => {
    setDisplayOutput(output)
  }, [output])

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadAsFile = () => {
    try {
      const fileExtension = getFileExtension(language)
      const blob = new Blob([output], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `code.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download:", error)
    }
  }

  const getFileExtension = (lang: string): string => {
    const extensions: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
      java: "java",
      csharp: "cs",
      ruby: "rb",
      php: "php",
      go: "go",
      rust: "rs",
      kotlin: "kt",
      matlab: "m",
    }
    return extensions[lang.toLowerCase()] || "txt"
  }

  const getSyntaxLanguage = (lang: string): string => {
    const syntaxMap: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      java: "java",
      csharp: "csharp",
      ruby: "ruby",
      php: "php",
      go: "go",
      rust: "rust",
      kotlin: "kotlin",
      matlab: "matlab",
    }
    return syntaxMap[lang.toLowerCase()] || "text"
  }

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    )
  }

  if (!output && !isLoading) {
    return null
  }

  return (
    <Card className="overflow-hidden border border-border">
      <div className="flex justify-between items-center p-4 bg-muted">
        <h3 className="font-medium">{title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={copyToClipboard}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={downloadAsFile}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={getSyntaxLanguage(language)}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            borderRadius: 0,
            fontSize: "0.9rem",
            maxHeight: "500px",
          }}
          wrapLongLines={true}
        >
          {displayOutput || "// No output generated"}
        </SyntaxHighlighter>
      </div>
    </Card>
  )
}
