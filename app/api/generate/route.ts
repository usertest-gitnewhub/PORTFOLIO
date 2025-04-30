import { NextResponse } from "next/server"

// Fallback code templates for different languages
const fallbackTemplates = {
  python: (problem: string, framework: string) => `# ${problem}
# Generated ${framework} solution

def main():
    print("Solution for: ${problem}")
    # Implementation would go here
    return "Solution"

if __name__ == "__main__":
    result = main()
    print(result)`,

  javascript: (problem: string, framework: string) => `// ${problem}
// Generated ${framework} solution

function main() {
  console.log("Solution for: ${problem}");
  // Implementation would go here
  return "Solution";
}

const result = main();
console.log(result);`,

  typescript: (problem: string, framework: string) => `// ${problem}
// Generated ${framework} solution

function main(): string {
  console.log("Solution for: ${problem}");
  // Implementation would go here
  return "Solution";
}

const result = main();
console.log(result);`,

  java: (problem: string, framework: string) => `// ${problem}
// Generated ${framework} solution

public class Solution {
  public static void main(String[] args) {
    System.out.println("Solution for: ${problem}");
    // Implementation would go here
    String result = "Solution";
    System.out.println(result);
  }
}`,

  matlab: (problem: string, framework: string) => `% ${problem}
% Generated ${framework} solution

function result = main()
    disp('Solution for: ${problem}');
    % Implementation would go here
    result = 'Solution';
end

result = main();
disp(result);`,

  default: (problem: string, language: string, framework: string) => `// ${problem}
// Generated ${language} ${framework} solution

// Implementation would go here
// This is a placeholder for the actual solution`,
}

export async function POST(req: Request) {
  try {
    console.log("API route called")
    const { problem, language, framework } = await req.json()
    console.log("Request data:", { problem, language, framework })

    // Generate fallback code based on the language
    const lang = language.toLowerCase()
    let code = ""

    if (lang === "python") {
      code = fallbackTemplates.python(problem, framework)
    } else if (lang === "javascript") {
      code = fallbackTemplates.javascript(problem, framework)
    } else if (lang === "typescript") {
      code = fallbackTemplates.typescript(problem, framework)
    } else if (lang === "java") {
      code = fallbackTemplates.java(problem, framework)
    } else if (lang === "matlab") {
      code = fallbackTemplates.matlab(problem, framework)
    } else {
      code = fallbackTemplates.default(problem, language, framework)
    }

    console.log("Generated code successfully")
    return NextResponse.json({ code })
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({
      code: "// An error occurred while generating code.\n// Please try again with a different request.",
    })
  }
}
