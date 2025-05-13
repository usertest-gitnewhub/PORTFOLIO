"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check, X, Code, Send } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import type { Challenge } from "./CodeChallenges"

// Custom hook to verify a solution
function useSolutionVerifier() {
  const [result, setResult] = useState<any>(null)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifySolution = async (challenge: Challenge, solution: string, language = "javascript") => {
    setVerifying(true)
    setError(null)

    try {
      const response = await fetch("/api/challenges/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ challenge, solution, language }),
      })

      if (!response.ok) {
        throw new Error("Failed to verify solution")
      }

      const data = await response.json()
      setResult(data)

      // Trigger a storage event to update stats
      window.dispatchEvent(new Event("storage"))
    } catch (err) {
      setError("Failed to verify solution. Please try again.")
      console.error(err)
    } finally {
      setVerifying(false)
    }
  }

  return { result, verifying, error, verifySolution }
}

interface SolutionSubmissionProps {
  challenge: Challenge
  onComplete: () => void
}

export default function SolutionSubmission({ challenge, onComplete }: SolutionSubmissionProps) {
  const [solution, setSolution] = useState("")
  const [language, setLanguage] = useState("javascript")
  const { result, verifying, error, verifySolution } = useSolutionVerifier()

  const handleSubmit = async () => {
    if (!solution.trim()) return
    await verifySolution(challenge, solution, language)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" /> Your Solution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" onValueChange={setLanguage}>
            <TabsList className="mb-4">
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="java">Java</TabsTrigger>
              <TabsTrigger value="cpp">C++</TabsTrigger>
            </TabsList>

            <Textarea
              placeholder={`Write your ${language} solution here...`}
              className="font-mono min-h-[300px] bg-muted"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={verifying || !solution.trim()}
            className="bg-primary text-primary-foreground"
          >
            {verifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Solution
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md">{error}</div>
      )}

      {result && (
        <Card className={result.isCorrect ? "border-green-500" : "border-amber-500"}>
          <CardHeader>
            <CardTitle className="flex items-center">
              {result.isCorrect ? (
                <Check className="mr-2 h-5 w-5 text-green-500" />
              ) : (
                <X className="mr-2 h-5 w-5 text-amber-500" />
              )}
              {result.isCorrect ? "Solution Accepted" : "Solution Needs Improvement"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Score: {result.score}/100</h3>
              <p className="text-muted-foreground">{result.feedback}</p>
            </div>

            {result.suggestions && result.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.optimizedSolution && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Optimized Solution</h3>
                <SyntaxHighlighter
                  language={language}
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: "0.375rem",
                  }}
                >
                  {result.optimizedSolution}
                </SyntaxHighlighter>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={onComplete} className="ml-auto">
              Complete Challenge
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
