export async function generateCode(problem: string, language: string, framework: string): Promise<string> {
  try {
    // Validate inputs
    if (!problem.trim()) {
      throw new Error("Problem description is required")
    }

    if (!language.trim()) {
      throw new Error("Programming language is required")
    }

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

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error || `Server responded with status: ${response.status}`
      throw new Error(errorMessage)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    // Validate response data
    if (!data.code || typeof data.code !== "string") {
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
