import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { problem, language, framework } = await req.json()

    // Create a fallback response in case the API call fails
    const fallbackCode = generateFallbackCode(problem, language, framework)

    try {
      // Try to use the AI model if available
      if (process.env.GROQ_API_KEY) {
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
                content: "You are a helpful coding assistant that generates code based on requirements.",
              },
              {
                role: "user",
                content: `Generate ${language.toUpperCase()} code ${
                  framework !== "Core" ? `using the ${framework} framework ` : ""
                }to solve the following problem:\n\n${problem}\n\nPlease provide only the ${language.toUpperCase()} code without any explanations.${
                  language.toUpperCase() === "MATLAB" ? " Include necessary MATLAB toolbox functions if required." : ""
                }`,
              },
            ],
            temperature: 0.3,
            max_tokens: 2000,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.choices && data.choices[0] && data.choices[0].message) {
            return NextResponse.json({ code: data.choices[0].message.content.trim() })
          }
        }
      }

      // If we reach here, something went wrong with the API call
      return NextResponse.json({ code: fallbackCode })
    } catch (error) {
      console.error("Error calling AI API:", error)
      return NextResponse.json({ code: fallbackCode })
    }
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({
      code: "// An error occurred while generating code.\n// Please try again with a different request.",
    })
  }
}

// Function to generate fallback code based on the input
function generateFallbackCode(problem: string, language: string, framework: string): string {
  const lang = language.toLowerCase()

  // Basic templates for different languages
  if (lang === "python") {
    return `# ${problem}
# Generated ${framework} solution

def main():
    print("Solution for: ${problem}")
    # Implementation would go here
    return "Solution"

if __name__ == "__main__":
    result = main()
    print(result)
`
  } else if (lang === "javascript" || lang === "typescript") {
    return `// ${problem}
// Generated ${framework} solution

function main() {
  console.log("Solution for: ${problem}");
  // Implementation would go here
  return "Solution";
}

const result = main();
console.log(result);
`
  } else if (lang === "java") {
    return `// ${problem}
// Generated ${framework} solution

public class Solution {
  public static void main(String[] args) {
    System.out.println("Solution for: ${problem}");
    // Implementation would go here
    String result = "Solution";
    System.out.println(result);
  }
}
`
  } else if (lang === "matlab") {
    return `% ${problem}
% Generated ${framework} solution

function result = main()
    disp('Solution for: ${problem}');
    % Implementation would go here
    result = 'Solution';
end

result = main();
disp(result);
`
  } else {
    return `// ${problem}
// Generated ${language} ${framework} solution

// Implementation would go here
// This is a placeholder for the actual solution
`
  }
}
