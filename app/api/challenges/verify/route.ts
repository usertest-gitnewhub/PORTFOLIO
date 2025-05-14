import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI as createGroq } from "@ai-sdk/openai"

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
})

// Function to extract JSON from markdown code blocks
function extractJsonFromMarkdown(text: string): string {
  // Look for JSON code blocks
  const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
  const match = text.match(jsonRegex)

  if (match && match[1]) {
    return match[1].trim()
  }

  // If no code blocks found, return the original text
  // (it might already be JSON without markdown formatting)
  return text
}

// Fallback evaluation result for when the API fails
function getFallbackEvaluation(solution: string, language: string): any {
  return {
    isCorrect: false,
    score: 50,
    feedback:
      "We couldn't automatically verify your solution due to a technical issue. However, your solution has been recorded. Here's some general feedback based on common patterns.",
    suggestions: [
      "Ensure your solution handles all edge cases",
      "Check for optimal time and space complexity",
      "Make sure your code is properly formatted and follows best practices",
    ],
    optimizedSolution: solution, // Return their own solution as we can't generate an optimized one
  }
}

export async function POST(req: Request) {
  console.log("Challenge verification API route called")

  try {
    // Parse request body
    const body = await req.json()
    const { challenge, solution, language = "javascript" } = body

    // Validate inputs
    if (!challenge || !solution) {
      console.error("Missing required fields:", { challenge: !!challenge, solution: !!solution })
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Both challenge and solution are required",
        },
        { status: 400 },
      )
    }

    console.log("Verifying solution for challenge:", challenge.title)

    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY not available, using fallback evaluation")
      return NextResponse.json(getFallbackEvaluation(solution, language))
    }

    const prompt = `You are an expert code reviewer. Evaluate the following solution for a coding challenge.
    
    Challenge: ${challenge.title}
    Description: ${challenge.description}
    Sample Input: ${challenge.sampleInput || "N/A"}
    Expected Output: ${challenge.sampleOutput || "N/A"}
    
    User's Solution (${language}):
    ${solution}
    
    Evaluate the solution based on:
    1. Correctness: Does it solve the problem correctly?
    2. Efficiency: Is the solution efficient?
    3. Code quality: Is the code well-written and easy to understand?
    
    Your response MUST be a valid JSON object with the following structure and nothing else:
    {
      "isCorrect": true/false,
      "score": 0-100,
      "feedback": "Detailed feedback about the solution, explaining why it's correct or incorrect",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "optimizedSolution": "An optimized version of the solution if applicable"
    }
    
    Do not include any markdown formatting, code blocks, or explanations outside the JSON structure.
    Just return the raw JSON object.`

    try {
      console.log("Calling GROQ API")
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        temperature: 0.2, // Lower temperature for more consistent results
        max_tokens: 2000,
      })

      console.log("Received response from GROQ API")

      // Extract JSON if the response contains markdown formatting
      const jsonText = extractJsonFromMarkdown(text)

      try {
        // Parse the JSON
        const result = JSON.parse(jsonText)

        // Validate the result structure
        if (!result.isCorrect || !result.score || !result.feedback) {
          console.warn("Invalid result structure, using fallback", result)
          return NextResponse.json({
            ...getFallbackEvaluation(solution, language),
            originalResponse: result,
          })
        }

        console.log("Successfully parsed and validated result")
        return NextResponse.json(result)
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        console.error("Raw response:", text)
        console.error("Extracted JSON text:", jsonText)

        // Return a fallback response with the raw text for debugging
        return NextResponse.json({
          ...getFallbackEvaluation(solution, language),
          debug: {
            error: "Failed to parse JSON response",
            rawResponse: text.substring(0, 500) + (text.length > 500 ? "..." : ""),
          },
        })
      }
    } catch (aiError) {
      console.error("Error calling AI service:", aiError)
      return NextResponse.json({
        ...getFallbackEvaluation(solution, language),
        error: "Failed to call AI service: " + (aiError instanceof Error ? aiError.message : String(aiError)),
      })
    }
  } catch (error) {
    console.error("Error in challenge verification API route:", error)
    return NextResponse.json(
      {
        error: "Failed to verify solution",
        message: error instanceof Error ? error.message : "Unknown error",
        fallback: getFallbackEvaluation("", "javascript"),
      },
      { status: 500 },
    )
  }
}
