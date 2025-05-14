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

    // Use fetch with timeout to prevent hanging requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
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
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Response status:", response.status)

      // First check if the response is ok
      if (!response.ok) {
        console.error("HTTP error:", response.status)

        // Try to parse error response, but handle parsing errors gracefully
        let errorMessage = `Server responded with status: ${response.status}`

        try {
          const text = await response.text()

          // Try to parse as JSON if it looks like JSON
          if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
            try {
              const errorData = JSON.parse(text)
              if (errorData?.error) {
                errorMessage = errorData.error
              }
            } catch (jsonError) {
              console.error("Failed to parse error JSON:", jsonError)
              // Use the text as the error message if JSON parsing fails
              if (text.trim()) {
                errorMessage = text
              }
            }
          } else if (text.trim()) {
            // If it's not JSON but has content, use the text
            errorMessage = text
          }
        } catch (textError) {
          console.error("Failed to read response text:", textError)
          // Keep the default error message
        }

        throw new Error(errorMessage)
      }

      // Try to get the response as text first
      const text = await response.text()

      // If empty response
      if (!text || text.trim() === "") {
        console.error("Empty response from server")
        throw new Error("Server returned an empty response")
      }

      // Try to parse as JSON
      let data
      try {
        data = JSON.parse(text)
        console.log("Response parsed as JSON successfully")
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        // If it's not JSON but has content, return it directly as code
        if (text.trim()) {
          console.log("Returning non-JSON response as code")
          return text
        }
        throw new Error("Invalid response format from server")
      }

      // Check for error in response
      if (data.error) {
        console.error("Error in response:", data.error)
        throw new Error(data.error)
      }

      // Validate response data
      if (!data.code || typeof data.code !== "string") {
        console.error("Invalid response format:", data)

        // If the entire response is a string, use it as code
        if (typeof data === "string" && data.trim()) {
          return data
        }

        throw new Error("Invalid response format from code generation service")
      }

      return data.code
    } catch (fetchError) {
      // Handle abort errors specifically
      if (fetchError.name === "AbortError") {
        throw new Error("Request timed out. Please try again.")
      }
      throw fetchError
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    console.error("Error in generateCode:", error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("Failed to generate code")
    }
  }
}
