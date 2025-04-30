"use client"

import { motion } from "framer-motion"
import CodeChallenges from "@/components/CodeChallenges"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Trophy, Users, BookOpen } from "lucide-react"
import { useState } from "react"

export default function ChallengesClientPage() {
  const [activeTab, setActiveTab] = useState("daily")

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-4 text-center text-gradient animate-glow"
      >
        Code Challenges
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-center mb-12 text-primary/80 max-w-2xl mx-auto"
      >
        Test your skills with our curated challenges. New challenges every day for all skill levels.
      </motion.p>

      <Tabs defaultValue="daily" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Daily Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Leaderboard
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Community
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          <CodeChallenges />
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" /> Leaderboard
              </CardTitle>
              <CardDescription>Top performers in our coding challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Complete challenges to earn points and appear on the leaderboard. Coming soon!
              </p>
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
