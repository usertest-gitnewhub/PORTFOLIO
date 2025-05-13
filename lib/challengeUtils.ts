import type { Challenge } from "@/components/CodeChallenges"

// Interface for storing completed challenges
export interface CompletedChallenge {
  id: string
  title: string
  difficulty: string
  completedAt: string
}

// Interface for challenge stats
export interface ChallengeStats {
  totalCompleted: number
  beginner: number
  intermediate: number
  advanced: number
  streak: number
  lastCompletedDate: string | null
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

// Check if challenges should refresh (new day)
export function shouldRefreshChallenges(): boolean {
  const lastRefreshDate = localStorage.getItem("lastChallengeRefreshDate")
  const today = getTodayDate()

  // If no refresh date or different from today, refresh is needed
  return !lastRefreshDate || lastRefreshDate !== today
}

// Update the refresh date to today
export function updateRefreshDate(): void {
  localStorage.setItem("lastChallengeRefreshDate", getTodayDate())
}

// Save a completed challenge
export function saveCompletedChallenge(challenge: Challenge): void {
  const completedChallenges = getCompletedChallenges()

  // Check if already completed to avoid duplicates
  if (!completedChallenges.some((c) => c.id === challenge.id)) {
    const completedChallenge: CompletedChallenge = {
      id: challenge.id,
      title: challenge.title,
      difficulty: challenge.difficulty,
      completedAt: new Date().toISOString(),
    }

    completedChallenges.push(completedChallenge)
    localStorage.setItem("completedChallenges", JSON.stringify(completedChallenges))

    // Update stats
    updateChallengeStats(challenge.difficulty)
  }
}

// Get all completed challenges
export function getCompletedChallenges(): CompletedChallenge[] {
  const stored = localStorage.getItem("completedChallenges")
  return stored ? JSON.parse(stored) : []
}

// Get challenge statistics
export function getChallengeStats(): ChallengeStats {
  const stored = localStorage.getItem("challengeStats")

  if (stored) {
    return JSON.parse(stored)
  }

  // Default stats
  return {
    totalCompleted: 0,
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    streak: 0,
    lastCompletedDate: null,
  }
}

// Update challenge statistics
function updateChallengeStats(difficulty: string): void {
  const stats = getChallengeStats()
  const today = getTodayDate()

  // Update total count
  stats.totalCompleted += 1

  // Update difficulty-specific count
  switch (difficulty) {
    case "beginner":
      stats.beginner += 1
      break
    case "intermediate":
      stats.intermediate += 1
      break
    case "advanced":
      stats.advanced += 1
      break
  }

  // Update streak
  if (stats.lastCompletedDate) {
    const lastDate = new Date(stats.lastCompletedDate)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (stats.lastCompletedDate === today) {
      // Already completed a challenge today, streak unchanged
    } else if (new Date(stats.lastCompletedDate).toDateString() === yesterday.toDateString()) {
      // Completed yesterday, increment streak
      stats.streak += 1
    } else {
      // Break in streak, reset to 1
      stats.streak = 1
    }
  } else {
    // First challenge ever completed
    stats.streak = 1
  }

  stats.lastCompletedDate = today

  // Save updated stats
  localStorage.setItem("challengeStats", JSON.stringify(stats))
}
