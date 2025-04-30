import { NextResponse } from "next/server"
import { createOpenAI as createGroq } from "@ai-sdk/openai"
import { generateText } from "ai"

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { problem, language, framework } = await req.json()

    const prompt = `Generate ${language.toUpperCase()} code ${
      framework !== "Core" ? `using the ${framework} framework ` : ""
    }to solve the following problem:

${problem}

Please provide only the ${language.toUpperCase()} code without any explanations.${
      language.toUpperCase() === "MATLAB" ? " Include necessary MATLAB toolbox functions if required." : ""
    }`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    })

    return NextResponse.json({ code: text.trim() })
  } catch (error) {
    console.error("Error generating code:", error)
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
  }
}
