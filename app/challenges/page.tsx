import ChallengesClientPage from "./ChallengesClientPage"
import { generateChallengesPageSchema } from "@/lib/structuredData"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Code Challenges - Code Muse",
  description: "Test your coding skills with our daily challenges for all skill levels.",
  keywords: "code challenges, programming problems, coding practice, algorithm challenges, daily coding problems",
}

export default function ChallengesPage() {
  const structuredData = generateChallengesPageSchema()

  return (
    <>
      <Script
        id="challenges-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ChallengesClientPage />
    </>
  )
}
