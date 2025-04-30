import AnimatedHome from "@/components/AnimatedHome"
import { generateHomePageSchema } from "@/lib/structuredData"
import Script from "next/script"

export default function Home() {
  const structuredData = generateHomePageSchema()

  return (
    <>
      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnimatedHome />
    </>
  )
}
