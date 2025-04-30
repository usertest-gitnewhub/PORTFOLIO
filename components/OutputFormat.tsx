"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThinkingAnimation } from "./ThinkingAnimation"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/components/ui/button"
import { Copy, Download, Check, Code, FileText, FileDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generatePDF } from "@/lib/generatePDF"

interface OutputFormatProps {
  isLoading: boolean
  output: string
  language: string
  title?: string
  beforeContent?: string
  afterContent?: string
}

export function OutputFormat({
  isLoading,
  output,
  language,
  title = "Output",
  beforeContent,
  afterContent,
}: OutputFormatProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"output" | "before-after">(
    beforeContent && afterContent ? "before-after" : "output",
  )
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setIsCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "The output has been copied to your clipboard.",
    })
    setTimeout(() => setIsCopied(false), 2000)
  }

  const downloadAsODF = () => {
    // Create a simple XML for ODF text document
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
                xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                office:mimetype="application/vnd.oasis.opendocument.text">
  <office:body>
    <office:text>
      <text:p>${title}</text:p>
      <text:p>${output.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text:p>
    </office:text>
  </office:body>
</office:document>`

    const blob = new Blob([xmlContent], { type: "application/vnd.oasis.opendocument.text" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.odt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded as ODF",
      description: "The output has been downloaded as an ODF document.",
    })
  }

  const downloadAsPDF = () => {
    try {
      generatePDF(output, title)
      toast({
        title: "Downloaded as PDF",
        description: "The output has been downloaded as a PDF document.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <ThinkingAnimation key="thinking" />
      ) : (
        output && (
          <motion.div
            key="output"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="rounded-lg overflow-hidden border border-border/50 shadow-lg"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm font-medium text-foreground/80">{title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8"
                  title="Copy to clipboard"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadAsODF} className="h-8 w-8" title="Download as ODF">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={downloadAsPDF} className="h-8 w-8" title="Download as PDF">
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {beforeContent && afterContent ? (
              <Tabs
                defaultValue={activeTab}
                onValueChange={(value) => setActiveTab(value as "output" | "before-after")}
                className="w-full"
              >
                <div className="px-4 pt-2 bg-muted/30">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="output" className="text-xs">
                      <Code className="mr-1 h-3 w-3" /> Code Output
                    </TabsTrigger>
                    <TabsTrigger value="before-after" className="text-xs">
                      <FileText className="mr-1 h-3 w-3" /> Before/After
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="output" className="mt-0">
                  <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1.5rem",
                      borderRadius: 0,
                    }}
                    showLineNumbers
                  >
                    {output}
                  </SyntaxHighlighter>
                </TabsContent>

                <TabsContent value="before-after" className="mt-0 p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
                    <div className="p-4 bg-red-500/10">
                      <div className="mb-2 text-xs font-medium text-red-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                        BEFORE
                      </div>
                      <div className="text-sm font-mono whitespace-pre-wrap">{beforeContent}</div>
                    </div>
                    <div className="p-4 bg-green-500/10">
                      <div className="mb-2 text-xs font-medium text-green-500 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                        AFTER
                      </div>
                      <div className="text-sm font-mono whitespace-pre-wrap">{afterContent}</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <SyntaxHighlighter
                language={language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1.5rem",
                  borderRadius: 0,
                }}
                showLineNumbers
              >
                {output}
              </SyntaxHighlighter>
            )}
          </motion.div>
        )
      )}
    </AnimatePresence>
  )
}
