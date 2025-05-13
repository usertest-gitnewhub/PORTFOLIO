"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { HistoryIcon, RefreshCw, Zap, Code, AlertTriangle, X } from "lucide-react"
import { generateCode } from "@/lib/generateCode"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OutputFormat } from "./OutputFormat"

const languages = [
  { name: "Python", frameworks: ["Django", "Flask", "FastAPI"] },
  { name: "JavaScript", frameworks: ["React", "Vue", "Angular", "Node.js", "Express"] },
  { name: "Java", frameworks: ["Spring Boot", "Hibernate"] },
  { name: "C#", frameworks: [".NET Core", "ASP.NET"] },
  { name: "Ruby", frameworks: ["Ruby on Rails", "Sinatra"] },
  { name: "PHP", frameworks: ["Laravel", "Symfony"] },
  { name: "Go", frameworks: ["Gin", "Echo"] },
  { name: "Rust", frameworks: ["Actix", "Rocket"] },
  { name: "Kotlin", frameworks: ["Ktor", "Spring Boot"] },
  { name: "TypeScript", frameworks: ["Next.js", "NestJS"] },
  { name: "MATLAB", frameworks: ["Core", "Simulink", "Image Processing Toolbox", "Signal Processing Toolbox"] },
]

export default function CodeGenerator() {
  const [problem, setProblem] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<{ problem: string; code: string; language: string; framework: string }[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].name)
  const [selectedFramework, setSelectedFramework] = useState("")
  const [errorFinderInput, setErrorFinderInput] = useState("")
  const [errorFinderOutput, setErrorFinderOutput] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const storedHistory = localStorage.getItem("codeHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    setIsLoading(true)
    try {
      const code = await generateCode(problem, selectedLanguage, selectedFramework)
      setGeneratedCode(code)
      const newHistory = [
        { problem, code, language: selectedLanguage, framework: selectedFramework },
        ...history.slice(0, 9),
      ]
      setHistory(newHistory)
      localStorage.setItem("codeHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Error generating code:", error)
      let errorMessage = "Failed to generate code. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  const regenerateCode = () => {
    handleSubmit()
  }

  const handleErrorFinderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const fixedCode = await generateCode(
        `Fix the following ${selectedLanguage} ${selectedFramework} code and explain the errors:

${errorFinderInput}`,
        selectedLanguage,
        selectedFramework,
      )
      setErrorFinderOutput(fixedCode)
    } catch (error) {
      console.error("Error finding errors:", error)
      let errorMessage = "Failed to find errors. Please try again."
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full bg-card relative overflow-hidden shadow-lg border border-primary/20">
      <CardContent className="p-6 space-y-6">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator" className="text-lg">
              <Code className="mr-2" /> Code Generator
            </TabsTrigger>
            <TabsTrigger value="errorFinder" className="text-lg">
              <AlertTriangle className="mr-2" /> Error Finder
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generator" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages
                      .find((lang) => lang.name === selectedLanguage)
                      ?.frameworks.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={`Describe your ${selectedLanguage} ${selectedFramework} problem here...`}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="min-h-[150px] text-lg"
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
                {isLoading ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Generate {selectedLanguage} {selectedFramework} Code
                  </motion.div>
                )}
              </Button>
            </form>
            <OutputFormat
              isLoading={isLoading}
              output={generatedCode}
              language={selectedLanguage.toLowerCase()}
              title={`${selectedLanguage} ${selectedFramework} Code`}
            />
          </TabsContent>
          <TabsContent value="errorFinder" className="space-y-6">
            <form onSubmit={handleErrorFinderSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.name} value={lang.name}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages
                      .find((lang) => lang.name === selectedLanguage)
                      ?.frameworks.map((framework) => (
                        <SelectItem key={framework} value={framework}>
                          {framework}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder={`Paste your ${selectedLanguage} ${selectedFramework} code with errors here...`}
                value={errorFinderInput}
                onChange={(e) => setErrorFinderInput(e.target.value)}
                className="min-h-[150px] text-lg"
              />
              <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
                {isLoading ? (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Finding Errors...
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Find and Fix Errors
                  </motion.div>
                )}
              </Button>
            </form>
            <OutputFormat
              isLoading={isLoading}
              output={errorFinderOutput}
              language={selectedLanguage.toLowerCase()}
              title="Error Analysis and Fixed Code"
              beforeContent={errorFinderInput}
              afterContent={errorFinderOutput}
            />
          </TabsContent>
        </Tabs>
        {history.length > 0 && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg"
            >
              <HistoryIcon size={24} />
            </Button>
          </motion.div>
        )}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute right-0 top-0 h-full w-80 bg-card shadow-lg p-6"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Generations</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      className="mb-4 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setProblem(item.problem)
                        setGeneratedCode(item.code)
                        setSelectedLanguage(item.language)
                        setSelectedFramework(item.framework)
                        setIsHistoryOpen(false)
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.language}</Badge>
                        <Badge variant="secondary">{item.framework}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.problem}</p>
                    </motion.div>
                  ))}
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
