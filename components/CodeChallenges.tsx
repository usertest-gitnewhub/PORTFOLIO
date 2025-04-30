"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Award, Rocket, Clock, Calendar, ArrowRight, Code, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { useDailyChallenges, type Challenge } from "@/lib/challengeData"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function CodeChallenges() {
  const [activeTab, setActiveTab] = useState("beginner")
  const [showSolution, setShowSolution] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const challenges = useDailyChallenges()
  const [nextRefresh, setNextRefresh] = useState("")

  useEffect(() => {
    // Calculate time until next refresh (midnight)
    const calculateNextRefresh = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diffMs = tomorrow.getTime() - now.getTime()
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      setNextRefresh(`${diffHrs}h ${diffMins}m`)
    }

    calculateNextRefresh()
    const intervalId = setInterval(calculateNextRefresh, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [])

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Star className="h-5 w-5 text-yellow-400" />
      case "intermediate":
        return <Award className="h-5 w-5 text-neon-purple" />
      case "advanced":
        return <Rocket className="h-5 w-5 text-neon-pink" />
      default:
        return <Star className="h-5 w-5 text-yellow-400" />
    }
  }

  const handleViewDetails = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowSolution(false)
    setIsDialogOpen(true)
  }

  const getCurrentChallenge = () => {
    switch (activeTab) {
      case "beginner":
        return challenges.beginner
      case "intermediate":
        return challenges.intermediate
      case "advanced":
        return challenges.advanced
      default:
        return null
    }
  }

  const renderChallengeCard = (challenge: Challenge | null) => {
    if (!challenge) {
      return (
        <Card className="h-full card-gradient">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="h-full card-gradient">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">{challenge.title}</CardTitle>
              {getDifficultyIcon(challenge.difficulty)}
            </div>
            <CardDescription>
              Daily {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)} Challenge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" /> {challenge.timeEstimate}
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" onClick={() => handleViewDetails(challenge)}>
                View Details
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground">
                Start Challenge <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" /> Refreshes in: {nextRefresh}
              </div>
              <Badge variant="outline" className="text-xs">
                {challenge.difficulty}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="beginner" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="beginner" className="flex items-center gap-2">
            <Star className="h-4 w-4" /> Beginner
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Rocket className="h-4 w-4" /> Advanced
          </TabsTrigger>
        </TabsList>

        {["beginner", "intermediate", "advanced"].map((difficulty) => (
          <TabsContent key={difficulty} value={difficulty}>
            <div className="grid grid-cols-1 gap-6">
              {difficulty === activeTab && renderChallengeCard(getCurrentChallenge())}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    {getDifficultyIcon(selectedChallenge.difficulty)}
                    <span className="ml-2">{selectedChallenge.title}</span>
                  </span>
                  <Badge variant="outline">{selectedChallenge.difficulty}</Badge>
                </DialogTitle>
                <DialogDescription>Daily coding challenge - {selectedChallenge.timeEstimate}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
                </div>

                {selectedChallenge.sampleInput && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Input</h3>
                    <div className="bg-muted p-3 rounded-md text-sm font-mono">{selectedChallenge.sampleInput}</div>
                  </div>
                )}

                {selectedChallenge.sampleOutput && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sample Output</h3>
                    <div className="bg-muted p-3 rounded-md text-sm font-mono">{selectedChallenge.sampleOutput}</div>
                  </div>
                )}

                {selectedChallenge.hints && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Hints</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {selectedChallenge.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedChallenge.solution && (
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold mb-2">Solution</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSolution(!showSolution)}
                        className="flex items-center gap-1"
                      >
                        {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showSolution ? "Hide Solution" : "Show Solution"}
                      </Button>
                    </div>

                    {showSolution && (
                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                          borderRadius: "0.375rem",
                        }}
                      >
                        {selectedChallenge.solution}
                      </SyntaxHighlighter>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button className="bg-primary text-primary-foreground">
                  <Code className="mr-2 h-4 w-4" /> Start Coding
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
