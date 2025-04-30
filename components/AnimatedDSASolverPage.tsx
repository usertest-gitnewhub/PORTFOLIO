"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateCode } from "@/lib/generateCode"
import { useToast } from "@/components/ui/use-toast"
import { Zap, Code, RefreshCw, History, X, BookOpen, Sparkles, Brain } from "lucide-react"
import { OutputFormat } from "./OutputFormat"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const languages = ["Python", "JavaScript", "Java", "C++", "C#", "Ruby", "Go", "Swift", "Kotlin", "TypeScript"]

const dsaCategories = [
  "Arrays",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Trees",
  "Graphs",
  "Sorting",
  "Searching",
  "Dynamic Programming",
  "Greedy Algorithms",
  "Hashing",
  "Heaps",
  "Divide and Conquer",
  "Backtracking",
  "Bit Manipulation",
]

const complexityOptions = ["Any", "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2^n)"]

export default function AnimatedDSASolverPage() {
  const [problem, setProblem] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [selectedCategory, setSelectedCategory] = useState(dsaCategories[0])
  const [selectedComplexity, setSelectedComplexity] = useState(complexityOptions[0])
  const [solution, setSolution] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [originalProblem, setOriginalProblem] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [history, setHistory] = useState<
    {
      problem: string
      solution: string
      language: string
      category: string
      complexity: string
    }[]
  >([])
  const [activeTab, setActiveTab] = useState("problem-solver")
  const { toast } = useToast()

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("dsaHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOriginalProblem(problem)

    const complexityConstraint =
      selectedComplexity !== "Any"
        ? `The solution should have a time complexity of ${selectedComplexity} if possible.`
        : ""

    try {
      const generatedSolution = await generateCode(
        `Solve the following ${selectedCategory} problem in ${selectedLanguage}:
${problem}

${complexityConstraint}

Provide a detailed explanation of the solution along with the code. Include:
1. Problem understanding
2. Approach explanation
3. Time and space complexity analysis
4. Edge cases consideration
5. Well-commented code implementation`,
        selectedLanguage,
        "DSA",
      )
      setSolution(generatedSolution)

      // Add to history
      const newHistory = [
        {
          problem,
          solution: generatedSolution,
          language: selectedLanguage,
          category: selectedCategory,
          complexity: selectedComplexity,
        },
        ...history.slice(0, 9),
      ]
      setHistory(newHistory)
      localStorage.setItem("dsaHistory", JSON.stringify(newHistory))
    } catch (error) {
      console.error("Error generating solution:", error)
      toast({
        title: "Error",
        description: "Failed to generate solution. Please try again.",
        variant: "destructive",
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-8 text-center text-gradient animate-glow"
        >
          DSA Problem Solver
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-12 text-primary/80 max-w-2xl mx-auto"
        >
          Get solutions and explanations for Data Structures and Algorithms problems with detailed step-by-step
          guidance.
        </motion.p>

        <Card className="w-full bg-card shadow-lg border border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <BookOpen className="mr-2 h-6 w-6 text-primary" />
              Solve DSA Problems
            </CardTitle>
            <CardDescription>Get detailed solutions with explanations for algorithm problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="problem-solver">Problem Solver</TabsTrigger>
                <TabsTrigger value="learning-resources">Learning Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="problem-solver" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Programming Language</label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Algorithm Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {dsaCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Time Complexity</label>
                      <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          {complexityOptions.map((complexity) => (
                            <SelectItem key={complexity} value={complexity}>
                              {complexity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Problem Description</label>
                    <Textarea
                      placeholder="Describe your DSA problem here..."
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="min-h-[150px] text-lg"
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Solving...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Solve Problem
                      </motion.div>
                    )}
                  </Button>
                </form>

                <OutputFormat
                  isLoading={isLoading}
                  output={solution}
                  language={selectedLanguage.toLowerCase()}
                  title={`${selectedCategory} Solution in ${selectedLanguage}`}
                  beforeContent={originalProblem ? `Problem: ${originalProblem}` : undefined}
                  afterContent={solution}
                />
              </TabsContent>

              <TabsContent value="learning-resources" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="mr-2 h-5 w-5 text-neon-blue" />
                        Algorithm Fundamentals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Learn the core concepts of algorithms and data structures with these resources:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-purple" />
                          Big O Notation and Algorithm Analysis
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-purple" />
                          Common Data Structures Explained
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-purple" />
                          Sorting and Searching Algorithms
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-purple" />
                          Dynamic Programming Techniques
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="mr-2 h-5 w-5 text-neon-pink" />
                        Practice Problems
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Enhance your skills with these practice problem categories:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-blue" />
                          Easy: Beginner-friendly algorithm challenges
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-blue" />
                          Medium: Intermediate problem-solving tasks
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-blue" />
                          Hard: Advanced algorithmic problems
                        </li>
                        <li className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4 text-neon-blue" />
                          Interview Prep: Common technical interview questions
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-neon-blue" />
                      Algorithm Complexity Cheat Sheet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-4">Data Structure</th>
                            <th className="text-left py-2 px-4">Access</th>
                            <th className="text-left py-2 px-4">Search</th>
                            <th className="text-left py-2 px-4">Insertion</th>
                            <th className="text-left py-2 px-4">Deletion</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/50">
                            <td className="py-2 px-4">Array</td>
                            <td className="py-2 px-4">O(1)</td>
                            <td className="py-2 px-4">O(n)</td>
                            <td className="py-2 px-4">O(n)</td>
                            <td className="py-2 px-4">O(n)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 px-4">Linked List</td>
                            <td className="py-2 px-4">O(n)</td>
                            <td className="py-2 px-4">O(n)</td>
                            <td className="py-2 px-4">O(1)</td>
                            <td className="py-2 px-4">O(1)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 px-4">Hash Table</td>
                            <td className="py-2 px-4">N/A</td>
                            <td className="py-2 px-4">O(1)</td>
                            <td className="py-2 px-4">O(1)</td>
                            <td className="py-2 px-4">O(1)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-2 px-4">Binary Search Tree</td>
                            <td className="py-2 px-4">N/A</td>
                            <td className="py-2 px-4">O(log n)</td>
                            <td className="py-2 px-4">O(log n)</td>
                            <td className="py-2 px-4">O(log n)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

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
              <History size={24} />
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
                  <h3 className="text-lg font-semibold">Recent Solutions</h3>
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
                        setSolution(item.solution)
                        setSelectedLanguage(item.language)
                        setSelectedCategory(item.category)
                        setSelectedComplexity(item.complexity)
                        setIsHistoryOpen(false)
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.language}</Badge>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.problem}</p>
                    </motion.div>
                  ))}
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
