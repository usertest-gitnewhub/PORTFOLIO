"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertTriangle } from "lucide-react"

interface ChallengeTimerProps {
  startTime: number | null
  isRunning: boolean
  estimatedTime?: string
}

export default function ChallengeTimer({ startTime, isRunning, estimatedTime }: ChallengeTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isOvertime, setIsOvertime] = useState(false)

  // Convert estimatedTime string (e.g., "30 minutes") to milliseconds
  const getEstimatedTimeMs = () => {
    if (!estimatedTime) return Number.POSITIVE_INFINITY

    const match = estimatedTime.match(/(\d+)\s*minutes?/)
    if (match && match[1]) {
      return Number.parseInt(match[1]) * 60 * 1000
    }
    return Number.POSITIVE_INFINITY
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (isRunning && startTime) {
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime
        setElapsedTime(elapsed)

        // Check if we've exceeded the estimated time
        if (elapsed > getEstimatedTimeMs()) {
          setIsOvertime(true)
        }
      }, 1000)
    } else {
      setElapsedTime(0)
      setIsOvertime(false)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning, startTime, estimatedTime])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    return `${hours.toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  return (
    <Card className={`${isOvertime ? "border-red-500 dark:border-red-700" : "border-primary/20"}`}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Clock className={`h-5 w-5 mr-2 ${isOvertime ? "text-red-500 dark:text-red-400" : "text-primary"}`} />
          <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
        </div>

        {isOvertime && (
          <div className="flex items-center text-red-500 dark:text-red-400 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Exceeded estimated time</span>
          </div>
        )}

        {!isOvertime && estimatedTime && (
          <div className="text-sm text-muted-foreground">Estimated: {estimatedTime}</div>
        )}
      </CardContent>
    </Card>
  )
}
