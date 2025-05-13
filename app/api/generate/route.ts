import { NextResponse } from "next/server"
import { createOpenAI as createGroq } from "@ai-sdk/openai"
import { generateText } from "ai"

// Create a more robust Groq client with better error handling
const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  defaultQuery: {
    temperature: 0.7,
    max_tokens: 2048,
  },
})

export async function POST(req: Request) {
  try {
    // Validate request body
    if (!req.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 })
    }

    const { problem, language, framework } = await req.json()

    // Validate required fields
    if (!problem) {
      return NextResponse.json({ error: "Problem description is required" }, { status: 400 })
    }

    if (!language) {
      return NextResponse.json({ error: "Programming language is required" }, { status: 400 })
    }

    // Check if API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set")
      return NextResponse.json(
        {
          error: "API configuration error. Please check your environment variables.",
          code: "Missing API key",
        },
        { status: 500 },
      )
    }

    const prompt = `Generate ${language.toUpperCase()} code ${
      framework && framework !== "Core" ? `using the ${framework} framework ` : ""
    }to solve the following problem:

${problem}

Please provide only the ${language.toUpperCase()} code without any explanations.${
      language.toUpperCase() === "MATLAB" ? " Include necessary MATLAB toolbox functions if required." : ""
    }`

    try {
      const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt,
        maxTokens: 2048,
      })

      return NextResponse.json({ code: text.trim() })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate code with the AI service. Please try again later.",
          details: aiError instanceof Error ? aiError.message : "Unknown error",
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json(
      {
        error: "Failed to generate code",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
