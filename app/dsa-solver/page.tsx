import AnimatedDSASolverPage from "@/components/AnimatedDSASolverPage"
import { generateDSAPageSchema } from "@/lib/structuredData"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DSA Problem Solver - Code Muse",
  description:
    "Get solutions and explanations for Data Structures and Algorithms problems with our AI-powered DSA solver.",
  keywords: "DSA, algorithms, data structures, problem solving, coding interview, competitive programming",
}

export default function DSASolverPage() {
  const structuredData = generateDSAPageSchema()

  return (
    <>
      <Script
        id="dsa-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnimatedDSASolverPage />
    </>
  )
}
