// This file contains structured data for SEO

export function generateHomePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Code Muse",
    url: "https://codemuse.com",
    description:
      "Generate, debug, and learn code with Code Muse - the ultimate AI-powered tool for developers and students",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://codemuse.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }
}

export function generateGeneratePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Code Muse Code Generator",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web",
    description: "Generate high-quality code in multiple programming languages and frameworks using AI.",
  }
}

export function generateDatabasePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Code Muse Database Schema Creator",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web",
    description:
      "Design and generate database schemas for various database types including relational, document, vector, and graph databases.",
  }
}

export function generateDSAPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Code Muse DSA Problem Solver",
    applicationCategory: "DeveloperApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web",
    description:
      "Get solutions and explanations for Data Structures and Algorithms problems with detailed step-by-step guidance.",
  }
}

export function generateChallengesPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Code Muse Coding Challenges",
    educationalLevel: "Beginner to Advanced",
    audience: {
      "@type": "Audience",
      audienceType: "Developers and Programming Students",
    },
    description: "Daily coding challenges to improve your programming skills across different difficulty levels.",
  }
}
