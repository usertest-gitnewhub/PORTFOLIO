import AnimatedGeneratePage from "@/components/AnimatedGeneratePage"
import { generateGeneratePageSchema } from "@/lib/structuredData"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Generate Code - Code Muse",
  description:
    "Generate high-quality code in multiple programming languages and frameworks using AI. Perfect for developers and students.",
  keywords: "code generation, AI code, programming, development, MATLAB, Python, JavaScript, Java",
}

export default function GeneratePage() {
  const structuredData = generateGeneratePageSchema()

  return (
    <>
      <Script
        id="generate-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnimatedGeneratePage />
    </>
  )
}
