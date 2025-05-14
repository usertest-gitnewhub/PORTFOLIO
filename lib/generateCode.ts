export async function generateCode(problem: string, language: string, framework: string): Promise<string> {
  console.log("generateCode called with:", { problem, language, framework })

  try {
    // Validate inputs
    if (!problem.trim()) {
      console.error("Empty problem description")
      throw new Error("Problem description is required")
    }

    if (!language.trim()) {
      console.error("Empty language")
      throw new Error("Programming language is required")
    }

    console.log("Sending request to /api/generate")

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem,
        language,
        framework: framework || "Core", // Provide default value
      }),
    })

    console.log("Response status:", response.status)

    // Handle HTTP errors
    if (!response.ok) {
      console.error("HTTP error:", response.status)
      const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }))
      const errorMessage = errorData?.error || `Server responded with status: ${response.status}`
      throw new Error(errorMessage)
    }

    // Parse response data
    let data
    try {
      data = await response.json()
      console.log("Response data keys:", Object.keys(data))
    } catch (parseError) {
      console.error("Failed to parse response:", parseError)
      throw new Error("Invalid response format from server")
    }

    // Check for empty response
    if (!data || Object.keys(data).length === 0) {
      console.error("Empty response data")
      throw new Error("Empty response from server")
    }

    // Check for error in response
    if (data.error) {
      console.error("Error in response:", data.error)
      throw new Error(data.error)
    }

    // Check for warning (fallback response)
    if (data.warning) {
      console.warn("Warning:", data.warning)
    }

    // Validate response data
    if (!data.code || typeof data.code !== "string") {
      console.error("Invalid response format:", data)
      throw new Error("Invalid response format from code generation service")
    }

    return data.code
  } catch (error) {
    console.error("Error in generateCode:", error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("Failed to generate code")
    }
  }
}
