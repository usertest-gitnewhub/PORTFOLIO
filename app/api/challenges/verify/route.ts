import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI as createGroq } from "@ai-sdk/openai"

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { challenge, solution, language = "javascript" } = await req.json()

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
    
    Format your response as a JSON object with the following structure:
    {
      "isCorrect": true/false,
      "score": 0-100,
      "feedback": "Detailed feedback about the solution",
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "optimizedSolution": "An optimized version of the solution if applicable"
    }`

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    })

    // Parse the response as JSON
    const result = JSON.parse(text)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error verifying solution:", error)
    return NextResponse.json({ error: "Failed to verify solution" }, { status: 500 })
  }
}
