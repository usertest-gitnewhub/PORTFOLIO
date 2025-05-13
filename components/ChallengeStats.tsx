"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Award, Rocket, Flame } from "lucide-react"
import { type ChallengeStats as ChallengeStatsType, getChallengeStats } from "@/lib/challengeUtils"

export default function ChallengeStats() {
  const [stats, setStats] = useState<ChallengeStatsType | null>(null)

  useEffect(() => {
    // Load stats from localStorage
    setStats(getChallengeStats())

    // Update stats when localStorage changes
    const handleStorageChange = () => {
      setStats(getChallengeStats())
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  if (!stats) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-background/50 to-background/10 border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-400" /> Your Challenge Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-card/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.totalCompleted}</div>
            <div className="text-xs text-muted-foreground">Total Completed</div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-card/50 rounded-lg">
            <div className="flex items-center text-2xl font-bold text-primary">
              {stats.streak} <Flame className="ml-1 h-4 w-4 text-orange-500" />
            </div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-card/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {stats.lastCompletedDate ? new Date(stats.lastCompletedDate).toLocaleDateString() : "Never"}
            </div>
            <div className="text-xs text-muted-foreground">Last Completed</div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <Badge variant="outline" className="flex items-center">
            <Star className="mr-1 h-3 w-3 text-yellow-400" /> {stats.beginner} Beginner
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Award className="mr-1 h-3 w-3 text-neon-purple" /> {stats.intermediate} Intermediate
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Rocket className="mr-1 h-3 w-3 text-neon-pink" /> {stats.advanced} Advanced
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
