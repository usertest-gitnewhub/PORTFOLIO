import { NextResponse } from "next/server"
import { createOpenAI as createGroq } from "@ai-sdk/openai"
import { generateText } from "ai"

// Comprehensive fallback examples for all supported languages
const fallbackExamples: Record<string, string> = {
  python: `def solve_problem(input_data):
    """
    Solution to the problem.
    
    Args:
        input_data: The input data for the problem
        
    Returns:
        The solution to the problem
    """
    # Process the input
    result = process_input(input_data)
    
    # Solve the problem
    solution = calculate_solution(result)
    
    return solution

def process_input(data):
    """Process the input data."""
    return data.strip().split()
    
def calculate_solution(processed_data):
    """Calculate the solution based on processed data."""
    return "Solution: " + " ".join(processed_data)
    
# Example usage
if __name__ == "__main__":
    sample_input = "Example problem input"
    print(solve_problem(sample_input))`,

  javascript: `/**
 * Solves the given problem
 * @param {string} inputData - The input data for the problem
 * @returns {string} The solution to the problem
 */
function solveProblem(inputData) {
  // Process the input
  const processedData = processInput(inputData);
  
  // Solve the problem
  const solution = calculateSolution(processedData);
  
  return solution;
}

/**
 * Process the input data
 * @param {string} data - The raw input data
 * @returns {string[]} The processed data
 */
function processInput(data) {
  return data.trim().split(' ');
}

/**
 * Calculate the solution based on processed data
 * @param {string[]} processedData - The processed input data
 * @returns {string} The calculated solution
 */
function calculateSolution(processedData) {
  return "Solution: " + processedData.join(' ');
}

// Example usage
const sampleInput = "Example problem input";
console.log(solveProblem(sampleInput));`,

  typescript: `/**
 * Solves the given problem
 * @param {string} inputData - The input data for the problem
 * @returns {string} The solution to the problem
 */
function solveProblem(inputData: string): string {
  // Process the input
  const processedData = processInput(inputData);
  
  // Solve the problem
  const solution = calculateSolution(processedData);
  
  return solution;
}

/**
 * Process the input data
 * @param {string} data - The raw input data
 * @returns {string[]} The processed data
 */
function processInput(data: string): string[] {
  return data.trim().split(' ');
}

/**
 * Calculate the solution based on processed data
 * @param {string[]} processedData - The processed input data
 * @returns {string} The calculated solution
 */
function calculateSolution(processedData: string[]): string {
  return "Solution: " + processedData.join(' ');
}

// Example usage
const sampleInput: string = "Example problem input";
console.log(solveProblem(sampleInput));`,

  java: `/**
 * Solution to the problem.
 */
public class ProblemSolver {
    
    /**
     * Main method to demonstrate the solution
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        String sampleInput = "Example problem input";
        System.out.println(solveProblem(sampleInput));
    }
    
    /**
     * Solves the given problem
     * @param inputData The input data for the problem
     * @return The solution to the problem
     */
    public static String solveProblem(String inputData) {
        // Process the input
        String[] processedData = processInput(inputData);
        
        // Solve the problem
        String solution = calculateSolution(processedData);
        
        return solution;
    }
    
    /**
     * Process the input data
     * @param data The raw input data
     * @return The processed data
     */
    private static String[] processInput(String data) {
        return data.trim().split(" ");
    }
    
    /**
     * Calculate the solution based on processed data
     * @param processedData The processed input data
     * @return The calculated solution
     */
    private static String calculateSolution(String[] processedData) {
        return "Solution: " + String.join(" ", processedData);
    }
}`,

  matlab: `function solution = solveProblem(inputData)
    % SOLVEPROBLEM Solves the given problem
    %   SOLUTION = SOLVEPROBLEM(INPUTDATA) processes the input data
    %   and returns the solution to the problem
    
    % Process the input
    processedData = processInput(inputData);
    
    % Solve the problem
    solution = calculateSolution(processedData);
end

function processedData = processInput(data)
    % PROCESSINPUT Process the input data
    %   PROCESSEDDATA = PROCESSINPUT(DATA) processes the raw input data
    
    % Split the input string by spaces
    processedData = strsplit(strtrim(data));
end

function solution = calculateSolution(processedData)
    % CALCULATESOLUTION Calculate the solution based on processed data
    %   SOLUTION = CALCULATESOLUTION(PROCESSEDDATA) calculates the solution
    
    % Join the processed data with spaces
    solution = ['Solution: ', strjoin(processedData, ' ')];
end

% Example usage
sampleInput = 'Example problem input';
disp(solveProblem(sampleInput));`,

  "c#": `using System;
using System.Linq;

namespace ProblemSolver
{
    /// <summary>
    /// Main program class
    /// </summary>
    class Program
    {
        /// <summary>
        /// Main entry point
        /// </summary>
        static void Main(string[] args)
        {
            string sampleInput = "Example problem input";
            Console.WriteLine(SolveProblem(sampleInput));
        }
        
        /// <summary>
        /// Solves the given problem
        /// </summary>
        /// <param name="inputData">The input data for the problem</param>
        /// <returns>The solution to the problem</returns>
        static string SolveProblem(string inputData)
        {
            // Process the input
            string[] processedData = ProcessInput(inputData);
            
            // Solve the problem
            string solution = CalculateSolution(processedData);
            
            return solution;
        }
        
        /// <summary>
        /// Process the input data
        /// </summary>
        /// <param name="data">The raw input data</param>
        /// <returns>The processed data</returns>
        static string[] ProcessInput(string data)
        {
            return data.Trim().Split(' ');
        }
        
        /// <summary>
        /// Calculate the solution based on processed data
        /// </summary>
        /// <param name="processedData">The processed input data</param>
        /// <returns>The calculated solution</returns>
        static string CalculateSolution(string[] processedData)
        {
            return "Solution: " + string.Join(" ", processedData);
        }
    }
}`,
}

export async function POST(req: Request) {
  console.log("API route handler called")

  try {
    // Parse request body
    let body
    try {
      body = await req.json()
      console.log("Request body received:", JSON.stringify(body))
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError)
      return NextResponse.json({
        code: "// Error: Invalid request format\n// Please provide a valid problem description",
        error: "Invalid JSON in request body",
      })
    }

    const { problem, language, framework } = body

    // Validate required fields
    if (!problem || !language) {
      console.error("Missing required fields:", { problem, language })
      return NextResponse.json({
        code: "// Error: Missing required fields\n// Please provide both a problem description and a language",
        error: "Missing required fields",
      })
    }

    // Check if API key is available and try to use it
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("GROQ_API_KEY is available, attempting to use AI service")

        const groq = createGroq({
          baseURL: "https://api.groq.com/openai/v1",
          apiKey: process.env.GROQ_API_KEY,
        })

        const prompt = `Generate ${language.toUpperCase()} code ${
          framework && framework !== "Core" ? `using the ${framework} framework ` : ""
        }to solve the following problem:

${problem}

Please provide only the ${language.toUpperCase()} code without any explanations.${
          language.toUpperCase() === "MATLAB" ? " Include necessary MATLAB toolbox functions if required." : ""
        }`

        const { text } = await generateText({
          model: groq("llama-3.1-8b-instant"),
          prompt,
          maxTokens: 2048,
        })

        if (text && text.trim() !== "") {
          console.log("Successfully generated code with AI service")
          return NextResponse.json({ code: text.trim() })
        }

        console.log("Empty response from AI service, falling back to examples")
      } catch (aiError) {
        console.error("Error using AI service:", aiError)
        // Continue to fallback
      }
    }

    // Fallback to examples if AI service failed or is not available
    console.log("Using fallback example for", language)
    const langKey = language.toLowerCase()
    const fallbackCode =
      fallbackExamples[langKey] ||
      `// Example code for ${language}\n// (Fallback example used because AI service is unavailable)`

    return NextResponse.json({
      code: fallbackCode,
      info: "Using fallback example. AI service is unavailable.",
    })
  } catch (error) {
    console.error("Unhandled error in API route:", error)

    // Always return a valid response even in case of errors
    return NextResponse.json({
      code: `// An error occurred while generating code\n// Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n// Please try again with a different description`,
      error: "Failed to generate code",
    })
  }
}
