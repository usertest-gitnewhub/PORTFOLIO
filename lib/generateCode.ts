export async function generateCode(problem: string, language: string, framework: string): Promise<string> {
  console.log("generateCode called with:", { problem, language, framework })

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

    console.log("API response status:", response.status)

    if (!response.ok) {
      console.error("API error:", response.status, response.statusText)
      return generateFallbackCode(problem, language, framework)
    }

    try {
      const data = await response.json()
      console.log("API response parsed successfully")

      if (data.error) {
        console.error("API returned error:", data.error)
        return generateFallbackCode(problem, language, framework)
      }

      return data.code || generateFallbackCode(problem, language, framework)
    } catch (parseError) {
      console.error("Error parsing API response:", parseError)
      return generateFallbackCode(problem, language, framework)
    }
  } catch (error) {
    console.error("Error in generateCode:", error)
    return generateFallbackCode(problem, language, framework)
  }
}

// Fallback code generator function
function generateFallbackCode(problem: string, language: string, framework: string): string {
  const lang = language.toLowerCase()

  if (lang === "python") {
    return `# ${problem}
# Generated ${framework} solution

def main():
    print("Solution for: ${problem}")
    # Implementation would go here
    return "Solution"

if __name__ == "__main__":
    result = main()
    print(result)`
  }

  if (lang === "javascript" || lang === "typescript") {
    return `// ${problem}
// Generated ${framework} solution

function main() {
  console.log("Solution for: ${problem}");
  // Implementation would go here
  return "Solution";
}

const result = main();
console.log(result);`
  }

  if (lang === "java") {
    return `// ${problem}
// Generated ${framework} solution

public class Solution {
  public static void main(String[] args) {
    System.out.println("Solution for: ${problem}");
    // Implementation would go here
    String result = "Solution";
    System.out.println(result);
  }
}`
  }

  if (lang === "matlab") {
    return `% ${problem}
% Generated ${framework} solution

function result = main()
    disp('Solution for: ${problem}');
    % Implementation would go here
    result = 'Solution';
end

result = main();
disp(result);`
  }

  return `// ${problem}
// Generated ${language} ${framework} solution

// Implementation would go here
// This is a placeholder for the actual solution`
}
