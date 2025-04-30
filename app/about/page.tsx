import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Zap, Users, Globe, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - Code Muse",
  description: "Learn about Code Muse, your intelligent coding companion for generating, debugging, and learning code.",
  keywords: "about Code Muse, AI coding tool, code generation platform, programming assistant",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Code Muse</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Code Muse is your intelligent coding companion, designed to help developers and students generate, debug, and
          learn code across various programming languages and frameworks.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2" /> Multi-Language Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            Generate code in Python, JavaScript, Java, C#, Ruby, PHP, Go, Rust, Kotlin, TypeScript, and MATLAB.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2" /> Database Creation
            </CardTitle>
          </CardHeader>
          <CardContent>
            Design and create database schemas for MySQL, PostgreSQL, SQLite, MongoDB, and vector databases like
            Pinecone.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2" /> Intelligent Error Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            Identify and fix errors in your code with detailed explanations and suggestions for improvement.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" /> Community-Driven
            </CardTitle>
          </CardHeader>
          <CardContent>
            Join a growing community of developers and students to share knowledge and collaborate on projects.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2" /> Always Up-to-Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            Stay current with the latest programming languages, frameworks, and best practices in software development.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2" /> Secure and Private
            </CardTitle>
          </CardHeader>
          <CardContent>
            Your code and data are always protected. We prioritize the security and privacy of our users.
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Supported Languages and Frameworks</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Python",
            "JavaScript",
            "Java",
            "C#",
            "Ruby",
            "PHP",
            "Go",
            "Rust",
            "Kotlin",
            "TypeScript",
            "MATLAB",
            "React",
            "Vue",
            "Angular",
            "Node.js",
            "Django",
            "Flask",
            "Spring Boot",
            ".NET Core",
            "Ruby on Rails",
          ].map((tech) => (
            <Badge key={tech} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  )
}
