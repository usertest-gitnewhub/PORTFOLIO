"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Award, Rocket, Clock, Calendar, ArrowRight, Code, RefreshCw, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import ChallengeTimer from "./ChallengeTimer"
import SolutionSubmission from "./SolutionSubmission"
import ChallengeStats from "./ChallengeStats"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { shouldRefreshChallenges, updateRefreshDate, saveCompletedChallenge } from "@/lib/challengeUtils"

// Define Challenge interface locally to avoid import issues
export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  timeEstimate: string
  dateAdded: string
  sampleInput?: string
  sampleOutput?: string
  hints?: string[]
  solution?: string
}

// Custom hook to fetch a challenge
function useChallenge(difficulty: string) {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchChallenge = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/challenges/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ difficulty }),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.challenge) {
        throw new Error("No challenge data received")
      }

      // Store the challenge in localStorage
      localStorage.setItem(`current_${difficulty}_challenge`, JSON.stringify(data.challenge))

      setChallenge(data.challenge)
    } catch (err) {
      console.error("Error fetching challenge:", err)
      setError("Failed to load challenge. Please try again.")

      // Try to use a cached challenge as fallback
      const storedChallenge = localStorage.getItem(`current_${difficulty}_challenge`)
      if (storedChallenge) {
        try {
          setChallenge(JSON.parse(storedChallenge))
          setError("Using cached challenge. Refresh to try again.")
        } catch (cacheErr) {
          console.error("Error parsing cached challenge:", cacheErr)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // Load challenge from localStorage or fetch a new one
  const loadOrFetchChallenge = async () => {
    // Check if we need to refresh challenges (new day)
    const shouldRefresh = shouldRefreshChallenges()

    // Try to get from localStorage first
    const storedChallenge = localStorage.getItem(`current_${difficulty}_challenge`)

    if (storedChallenge && !shouldRefresh) {
      // Use stored challenge if it exists and doesn't need refresh
      setChallenge(JSON.parse(storedChallenge))
    } else {
      // Fetch new challenge if needed
      await fetchChallenge()

      // If this is a refresh due to a new day, update the refresh date
      if (shouldRefresh) {
        updateRefreshDate()
      }
    }
  }

  return {
    challenge,
    loading,
    error,
    fetchChallenge,
    loadOrFetchChallenge,
  }
}

// Custom hook to manage challenge state
function useChallengeState() {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null)
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  const startChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge)
    setChallengeStarted(true)
    setStartTime(Date.now())
  }

  const endChallenge = () => {
    setChallengeStarted(false)
    setStartTime(null)

    // Save the completed challenge if it exists
    if (activeChallenge) {
      saveCompletedChallenge(activeChallenge)
    }
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (challengeStarted && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [challengeStarted, startTime])

  const formatElapsedTime = () => {
    const seconds = Math.floor(elapsedTime / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  return {
    activeChallenge,
    challengeStarted,
    startChallenge,
    endChallenge,
    elapsedTime,
    formatElapsedTime,
  }
}

export default function CodeChallenges() {
  const [activeTab, setActiveTab] = useState("beginner")
  const [showSolution, setShowSolution] = useState(false)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isChallengeActive, setIsChallengeActive] = useState(false)
  const [showRefreshAlert, setShowRefreshAlert] = useState(false)
  const [completedChallengeCount, setCompletedChallengeCount] = useState(0)

  const {
    challenge: beginnerChallenge,
    loading: loadingBeginner,
    error: errorBeginner,
    fetchChallenge: fetchBeginnerChallenge,
    loadOrFetchChallenge: loadOrFetchBeginnerChallenge,
  } = useChallenge("beginner")

  const {
    challenge: intermediateChallenge,
    loading: loadingIntermediate,
    error: errorIntermediate,
    fetchChallenge: fetchIntermediateChallenge,
    loadOrFetchChallenge: loadOrFetchIntermediateChallenge,
  } = useChallenge("intermediate")

  const {
    challenge: advancedChallenge,
    loading: loadingAdvanced,
    error: errorAdvanced,
    fetchChallenge: fetchAdvancedChallenge,
    loadOrFetchChallenge: loadOrFetchAdvancedChallenge,
  } = useChallenge("advanced")

  const { activeChallenge, challengeStarted, startChallenge, endChallenge, formatElapsedTime } = useChallengeState()

  // Load challenges on initial render and check for daily refresh
  useEffect(() => {
    const checkAndLoadChallenges = async () => {
      // Check if challenges need to be refreshed (new day)
      if (shouldRefreshChallenges()) {
        setShowRefreshAlert(true)

        // Update the refresh date
        updateRefreshDate()

        // Fetch new challenges
        await Promise.all([fetchBeginnerChallenge(), fetchIntermediateChallenge(), fetchAdvancedChallenge()])
      } else {
        // Load existing challenges
        loadOrFetchBeginnerChallenge()
        loadOrFetchIntermediateChallenge()
        loadOrFetchAdvancedChallenge()
      }
    }

    checkAndLoadChallenges()

    // Load completed challenge count
    const completedChallenges = localStorage.getItem("completedChallenges")
    if (completedChallenges) {
      setCompletedChallengeCount(JSON.parse(completedChallenges).length)
    }
  }, [])

  // Update completed challenge count when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const completedChallenges = localStorage.getItem("completedChallenges")
      if (completedChallenges) {
        setCompletedChallengeCount(JSON.parse(completedChallenges).length)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleRefreshChallenge = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        fetchBeginnerChallenge()
        break
      case "intermediate":
        fetchIntermediateChallenge()
        break
      case "advanced":
        fetchAdvancedChallenge()
        break
    }
  }

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

  const handleStartChallenge = (challenge: Challenge) => {
    startChallenge(challenge)
    setIsChallengeActive(true)
    setIsDialogOpen(false)
  }

  const handleCompleteChallenge = async () => {
    endChallenge()
    setIsChallengeActive(false)

    // Generate a new challenge of the same difficulty after completion
    if (activeChallenge) {
      switch (activeChallenge.difficulty) {
        case "beginner":
          await fetchBeginnerChallenge()
          break
        case "intermediate":
          await fetchIntermediateChallenge()
          break
        case "advanced":
          await fetchAdvancedChallenge()
          break
      }
    }

    // Trigger a custom event to update stats
    window.dispatchEvent(new Event("storage"))

    // Update completed challenge count
    const completedChallenges = localStorage.getItem("completedChallenges")
    if (completedChallenges) {
      setCompletedChallengeCount(JSON.parse(completedChallenges).length)
    }
  }

  const getCurrentChallenge = () => {
    switch (activeTab) {
      case "beginner":
        return beginnerChallenge
      case "intermediate":
        return intermediateChallenge
      case "advanced":
        return advancedChallenge
      default:
        return null
    }
  }

  const isLoading = () => {
    switch (activeTab) {
      case "beginner":
        return loadingBeginner
      case "intermediate":
        return loadingIntermediate
      case "advanced":
        return loadingAdvanced
      default:
        return false
    }
  }

  const getError = () => {
    switch (activeTab) {
      case "beginner":
        return errorBeginner
      case "intermediate":
        return errorIntermediate
      case "advanced":
        return errorAdvanced
      default:
        return null
    }
  }

  const renderChallengeCard = (challenge: Challenge | null) => {
    if (isLoading()) {
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

    const error = getError()
    if (error) {
      return (
        <Card className="h-full card-gradient">
          <CardHeader>
            <CardTitle>Error Loading Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={() => handleRefreshChallenge(activeTab)} variant="outline" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </CardContent>
        </Card>
      )
    }

    if (!challenge) {
      return (
        <Card className="h-full card-gradient">
          <CardHeader>
            <CardTitle>No Challenge Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Click the button below to generate a new challenge.</p>
            <Button onClick={() => handleRefreshChallenge(activeTab)} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" /> Generate Challenge
            </Button>
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
              AI-Generated {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)} Challenge
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
              <Button
                size="sm"
                className="bg-primary text-primary-foreground"
                onClick={() => handleStartChallenge(challenge)}
              >
                Start Challenge <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-xs"
                onClick={() => handleRefreshChallenge(activeTab)}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> New Challenge
              </Button>
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
      {/* Daily refresh alert */}
      <AnimatePresence>
        {showRefreshAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>New challenges available!</AlertTitle>
              <AlertDescription>
                Daily challenges have been refreshed. Good luck with today's coding challenges!
              </AlertDescription>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowRefreshAlert(false)}>
                Dismiss
              </Button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge stats */}
      <div className="mb-6">
        <ChallengeStats />
      </div>

      {/* Completed challenges count */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Coding Challenges</h2>
        <Badge variant="outline" className="flex items-center">
          <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
          {completedChallengeCount} {completedChallengeCount === 1 ? "Challenge" : "Challenges"} Completed
        </Badge>
      </div>

      {isChallengeActive && activeChallenge ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{activeChallenge.title}</h2>
            <Badge variant="outline">{activeChallenge.difficulty}</Badge>
          </div>

          <ChallengeTimer
            startTime={challengeStarted ? Date.now() - 1000 : null}
            isRunning={challengeStarted}
            estimatedTime={activeChallenge.timeEstimate}
          />

          <Card>
            <CardHeader>
              <CardTitle>Challenge Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{activeChallenge.description}</p>

              {activeChallenge.sampleInput && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sample Input</h3>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono">{activeChallenge.sampleInput}</div>
                </div>
              )}

              {activeChallenge.sampleOutput && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sample Output</h3>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono">{activeChallenge.sampleOutput}</div>
                </div>
              )}

              {activeChallenge.hints && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hints</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {activeChallenge.hints.map((hint, index) => (
                      <li key={index}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <SolutionSubmission challenge={activeChallenge} onComplete={handleCompleteChallenge} />
        </div>
      ) : (
        <>
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
                    <DialogDescription>
                      AI-generated coding challenge - {selectedChallenge.timeEstimate}
                    </DialogDescription>
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
                        <div className="bg-muted p-3 rounded-md text-sm font-mono">
                          {selectedChallenge.sampleOutput}
                        </div>
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
                  </div>

                  <DialogFooter className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => handleStartChallenge(selectedChallenge)}
                    >
                      <Code className="mr-2 h-4 w-4" /> Start Challenge
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
