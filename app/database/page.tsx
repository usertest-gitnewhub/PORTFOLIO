import AnimatedDatabasePage from "@/components/AnimatedDatabasePage"
import { generateDatabasePageSchema } from "@/lib/structuredData"
import Script from "next/script"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Database Schema Creator - Code Muse",
  description:
    "Create and generate database schemas for relational, document, vector, and graph databases with our AI-powered tool.",
  keywords: "database schema, SQL, NoSQL, vector database, Pinecone, MongoDB, PostgreSQL, database design",
}

export default function DatabasePage() {
  const structuredData = generateDatabasePageSchema()

  return (
    <>
      <Script
        id="database-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnimatedDatabasePage />
    </>
  )
}
