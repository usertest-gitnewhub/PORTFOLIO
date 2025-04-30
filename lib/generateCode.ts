export async function generateCode(problem: string, language: string, framework: string): Promise<string> {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem,
        language,
        framework,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API error:", errorText)
      throw new Error(`Failed to generate code: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error)
    }

    return data.code || "// No code was generated. Please try again."
  } catch (error) {
    console.error("Error in generateCode:", error)
    throw error
  }
}
