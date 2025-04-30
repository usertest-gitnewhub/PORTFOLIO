"use client"

import { motion } from "framer-motion"
import CodeChallenges from "@/components/CodeChallenges"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, BookOpen, History } from "lucide-react"
import { useState, useEffect } from "react"
import { type CompletedChallenge, getCompletedChallenges } from "@/lib/challengeUtils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function ChallengesClientPage() {
  const [activeTab, setActiveTab] = useState("daily")
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([])

  // Load completed challenges on mount
  useEffect(() => {
    setCompletedChallenges(getCompletedChallenges())

    // Update when localStorage changes
    const handleStorageChange = () => {
      setCompletedChallenges(getCompletedChallenges())
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-4 text-center text-gradient animate-glow"
      >
        AI-Powered Code Challenges
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-center mb-12 text-primary/80 max-w-2xl mx-auto"
      >
        Test your skills with our AI-generated challenges. New challenges daily for all skill levels.
      </motion.p>

      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Challenges
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> History
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <CodeChallenges />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-primary" /> Challenge History
              </CardTitle>
              <CardDescription>Your completed coding challenges</CardDescription>
            </CardHeader>
            <CardContent>
              {completedChallenges.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven't completed any challenges yet. Start solving challenges to build your history!
                </p>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {completedChallenges
                      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                      .map((challenge, index) => (
                        <div key={index} className="p-4 border border-border/50 rounded-lg bg-card/50">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{challenge.title}</h3>
                            <Badge variant="outline">{challenge.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Completed on: {new Date(challenge.completedAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-neon-blue" /> Community Challenges
              </CardTitle>
              <CardDescription>Challenges created by the community</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Browse and solve challenges created by other Code Muse users. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12"
      >
        <Card className="bg-gradient-to-br from-primary/30 via-background to-secondary/20 border border-primary/20 overflow-hidden shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" /> Why Practice Coding Challenges?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Regular practice with coding challenges helps you:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc list-inside">
              <li>Improve problem-solving skills</li>
              <li>Prepare for technical interviews</li>
              <li>Learn new algorithms and data structures</li>
              <li>Build coding speed and efficiency</li>
              <li>Understand different approaches to problems</li>
              <li>Practice multiple programming languages</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
