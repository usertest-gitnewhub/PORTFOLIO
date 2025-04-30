import { NextResponse } from "next/server"

// Mock challenges for fallback
const mockChallenges = {
  beginner: {
    id: "beginner-fallback",
    title: "Sum of Two Numbers",
    description: "Write a function that takes two numbers as input and returns their sum.",
    difficulty: "beginner",
    timeEstimate: "5 minutes",
    dateAdded: new Date().toISOString().split("T")[0],
    sampleInput: "5, 3",
    sampleOutput: "8",
    hints: [
      "Use the addition operator (+)",
      "Make sure to handle different data types",
      "Consider edge cases like negative numbers",
    ],
  },
  intermediate: {
    id: "intermediate-fallback",
    title: "Palindrome Checker",
    description:
      "Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).",
    difficulty: "intermediate",
    timeEstimate: "15 minutes",
    dateAdded: new Date().toISOString().split("T")[0],
    sampleInput: "racecar",
    sampleOutput: "true",
    hints: [
      "Consider using string reversal",
      "You might need to handle spaces and capitalization",
      "Think about using array methods",
    ],
  },
  advanced: {
    id: "advanced-fallback",
    title: "Merge Sort Implementation",
    description: "Implement the merge sort algorithm to sort an array of integers in ascending order.",
    difficulty: "advanced",
    timeEstimate: "30 minutes",
    dateAdded: new Date().toISOString().split("T")[0],
    sampleInput: "[38, 27, 43, 3, 9, 82, 10]",
    sampleOutput: "[3, 9, 10, 27, 38, 43, 82]",
    hints: [
      "Use the divide and conquer approach",
      "Split the array into halves recursively",
      "Merge the sorted subarrays",
    ],
  },
}

export async function POST(req: Request) {
  try {
    const { difficulty } = await req.json()

    // Use the fallback challenge if available
    const fallbackChallenge = mockChallenges[difficulty as keyof typeof mockChallenges]

    try {
      // Direct API call to Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that generates coding challenges. Respond with valid JSON only, no markdown formatting.",
            },
            {
              role: "user",
              content: `Generate a coding challenge with the following difficulty level: ${difficulty} (beginner, intermediate, or advanced).
              
              The challenge should include:
              1. A title
              2. A detailed description of the problem
              3. Sample input and expected output
              4. Difficulty level (${difficulty})
              5. Estimated time to complete
              6. 2-3 hints that could help solve the problem
              
              Format the response as a JSON object with the following structure:
              {
                "title": "Challenge Title",
                "description": "Detailed description of the problem",
                "difficulty": "${difficulty}",
                "timeEstimate": "XX minutes",
                "sampleInput": "Example input",
                "sampleOutput": "Expected output",
                "hints": ["Hint 1", "Hint 2"]
              }
              
              Do not include a solution in this response. Do not use markdown formatting or code blocks. Return only the raw JSON.`,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      let content = data.choices[0].message.content

      // Clean up the response if it contains markdown formatting
      if (content.includes("```")) {
        // Extract JSON from markdown code block
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch && jsonMatch[1]) {
          content = jsonMatch[1].trim()
        } else {
          // If we can't extract from code block, try to find JSON object
          const jsonStart = content.indexOf("{")
          const jsonEnd = content.lastIndexOf("}")
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            content = content.substring(jsonStart, jsonEnd + 1)
          }
        }
      }

      // Parse the JSON
      const challenge = JSON.parse(content)

      // Add a unique ID and date
      challenge.id = `${difficulty}-${Date.now()}`
      challenge.dateAdded = new Date().toISOString().split("T")[0]

      return NextResponse.json({ challenge })
    } catch (apiError) {
      console.error("API or parsing error:", apiError)

      // Return the fallback challenge if API call fails
      if (fallbackChallenge) {
        console.log("Using fallback challenge")
        return NextResponse.json({ challenge: fallbackChallenge })
      }

      throw apiError // Re-throw if no fallback
    }
  } catch (error) {
    console.error("Error generating challenge:", error)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}
