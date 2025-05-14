"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Check, X, Code, Send, AlertTriangle, RefreshCw } from "lucide-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Challenge } from "./CodeChallenges"

// Custom hook to verify a solution
function useSolutionVerifier() {
  const [result, setResult] = useState<any>(null)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)

  const verifySolution = useCallback(async (challenge: Challenge, solution: string, language = "javascript") => {
    setVerifying(true)
    setError(null)
    setRawResponse(null)

    try {
      console.log("Verifying solution:", { challenge: challenge.title, language })

      // Use fetch with timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 second timeout

      try {
        const response = await fetch("/api/challenges/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ challenge, solution, language }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // Handle HTTP errors
        if (!response.ok) {
          console.error("HTTP error:", response.status)

          // Try to parse error response, but handle parsing errors gracefully
          let errorMessage = `Server responded with status: ${response.status}`
          let responseText = ""

          try {
            responseText = await response.text()
            setRawResponse(responseText)

            // Try to parse as JSON if it looks like JSON
            if (responseText.trim().startsWith("{") || responseText.trim().startsWith("[")) {
              try {
                const errorData = JSON.parse(responseText)
                if (errorData?.error) {
                  errorMessage = errorData.error
                }
                if (errorData?.message) {
                  errorMessage += `: ${errorData.message}`
                }
                if (errorData?.fallback) {
                  console.log("Using fallback result from error response")
                  setResult(errorData.fallback)
                  return // Exit early with the fallback result
                }
              } catch (jsonError) {
                console.error("Failed to parse error JSON:", jsonError)
                // Use the text as the error message if JSON parsing fails
                if (responseText.trim()) {
                  errorMessage = `Failed to parse response: ${responseText.substring(0, 100)}...`
                }
              }
            } else if (responseText.trim()) {
              // If it's not JSON but has content, use the text
              errorMessage = `Server returned non-JSON response: ${responseText.substring(0, 100)}...`
            }
          } catch (textError) {
            console.error("Failed to read response text:", textError)
            // Keep the default error message
          }

          throw new Error(errorMessage)
        }

        // Try to get the response as text first
        const text = await response.text()
        setRawResponse(text)

        // If empty response
        if (!text || text.trim() === "") {
          throw new Error("Server returned an empty response")
        }

        // Try to parse as JSON
        let data
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError)
          console.error("Raw response:", text)

          // Try to extract JSON from markdown code blocks
          const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
          const match = text.match(jsonRegex)

          if (match && match[1]) {
            try {
              data = JSON.parse(match[1].trim())
              console.log("Successfully extracted JSON from markdown")
            } catch (extractError) {
              console.error("Failed to parse extracted JSON:", extractError)
              throw new Error("Invalid response format from server. Could not extract valid JSON.")
            }
          } else {
            throw new Error("Invalid response format from server. Response is not valid JSON.")
          }
        }

        // Validate the result structure
        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format: not an object")
        }

        if (data.error) {
          throw new Error(data.error)
        }

        // Set the result
        setResult(data)

        // Trigger a storage event to update stats
        window.dispatchEvent(new Event("storage"))
      } catch (fetchError) {
        // Handle abort errors specifically
        if (fetchError.name === "AbortError") {
          throw new Error("Request timed out. Please try again.")
        }
        throw fetchError
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (err) {
      console.error("Error verifying solution:", err)
      setError(err instanceof Error ? err.message : "Failed to verify solution. Please try again.")
    } finally {
      setVerifying(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setRawResponse(null)
  }, [])

  return { result, verifying, error, rawResponse, verifySolution, reset }
}

interface SolutionSubmissionProps {
  challenge: Challenge
  onComplete: () => void
}

export default function SolutionSubmission({ challenge, onComplete }: SolutionSubmissionProps) {
  const [solution, setSolution] = useState("")
  const [language, setLanguage] = useState("javascript")
  const { result, verifying, error, rawResponse, verifySolution, reset } = useSolutionVerifier()
  const [showRawResponse, setShowRawResponse] = useState(false)

  const handleSubmit = async () => {
    if (!solution.trim()) return
    await verifySolution(challenge, solution, language)
  }

  const handleRetry = () => {
    reset()
    handleSubmit()
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
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error verifying solution</AlertTitle>
          <AlertDescription className="mt-2">
            <p>{error}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRetry}>
                <RefreshCw className="mr-2 h-3 w-3" /> Retry
              </Button>
              {rawResponse && (
                <Button variant="outline" size="sm" onClick={() => setShowRawResponse(!showRawResponse)}>
                  {showRawResponse ? "Hide" : "Show"} Raw Response
                </Button>
              )}
            </div>
            {showRawResponse && rawResponse && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Raw Response:</h4>
                <div className="bg-muted p-3 rounded-md text-xs font-mono max-h-[200px] overflow-auto">
                  {rawResponse}
                </div>
              </div>
            )}
          </AlertDescription>
        </Alert>
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
              <p className="text-muted-foreground whitespace-pre-line">{result.feedback}</p>
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
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleRetry}>
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button onClick={onComplete} className="ml-auto">
              Complete Challenge
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
