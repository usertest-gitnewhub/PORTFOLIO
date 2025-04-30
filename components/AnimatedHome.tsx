"use client"

import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Code,
  Database,
  Zap,
  GitBranch,
  Terminal,
  BookOpen,
  Sparkles,
  CheckCircle,
  Users,
  Star,
  Rocket,
  Award,
} from "lucide-react"
import { SparkleText } from "./SparkleText"
import { useMediaQuery } from "@/hooks/use-media-query"

const FeatureCard = ({
  title,
  description,
  icon,
  link,
  delay = 0,
}: {
  title: string
  description: string
  icon: React.ReactNode
  link: string
  delay?: number
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: isMobile ? 1 : 1.03, boxShadow: "0px 0px 20px rgba(var(--primary-rgb), 0.3)" }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full card-gradient overflow-hidden group border border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-primary">
            {title}
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              className="text-primary/80"
            >
              {icon}
            </motion.div>
          </CardTitle>
          <CardDescription className="text-sm md:text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Link href={link} className="w-full block">
            <Button className="w-full group bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300">
              Explore
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const CodeSnippet = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="w-full max-w-2xl mx-auto mt-8 md:mt-12 overflow-hidden rounded-lg shadow-lg"
  >
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
      <div className="flex space-x-1">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
      <span className="text-sm text-gray-400">example.py</span>
    </div>
    <div className="p-4 bg-gray-900">
      <pre className="text-sm text-neon-blue overflow-x-auto">
        <code>{`def generate_code():
    """Generate high-quality code with AI assistance"""
    print("Welcome to Code Muse!")
    return "Your intelligent coding companion"

result = generate_code()
print(result)  # Output: Your intelligent coding companion`}</code>
      </pre>
    </div>
  </motion.div>
)

const StatCard = ({
  value,
  label,
  icon,
  delay = 0,
}: { value: string; label: string; icon: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-card/50 backdrop-blur-sm p-4 rounded-lg border border-primary/10 flex flex-col items-center justify-center text-center"
  >
    <div className="text-primary/80 mb-2">{icon}</div>
    <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{value}</div>
    <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
  </motion.div>
)

export default function AnimatedHome() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center flex flex-col items-center"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Your Intelligent Coding Companion
          </div>

          <SparkleText className="mb-4 md:mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Welcome to{" "}
              <span className="relative inline-block">
                <span className="text-gradient animate-glow">Code Muse</span>
                <motion.span
                  className="absolute -inset-1 rounded-lg opacity-50 blur-xl bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                />
              </span>
            </h1>
          </SparkleText>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg md:text-xl text-foreground/80 mb-6 md:mb-8 max-w-2xl mx-auto"
          >
            Generate, debug, and learn code across multiple languages and frameworks with our AI-powered platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8 md:mb-12"
          >
            <Link href="/generate">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Generating <Zap className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <CodeSnippet />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16"
        >
          <FeatureCard
            title="Generate Code"
            description="Create code snippets and entire projects with ease using AI."
            icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-neon-blue" />}
            link="/generate"
            delay={0.2}
          />
          <FeatureCard
            title="Manage Database"
            description="Design and create database schemas effortlessly."
            icon={<Database className="w-6 h-6 md:w-8 md:h-8 text-neon-purple" />}
            link="/database"
            delay={0.4}
          />
          <FeatureCard
            title="DSA Solutions"
            description="Get solutions for Data Structures and Algorithms problems."
            icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8 text-neon-pink" />}
            link="/dsa-solver"
            delay={0.6}
          />
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 md:mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Trusted by Developers Worldwide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="10+" label="Programming Languages" icon={<Code className="w-6 h-6" />} delay={0.2} />
            <StatCard value="1000+" label="Code Snippets Generated" icon={<Zap className="w-6 h-6" />} delay={0.3} />
            <StatCard
              value="500+"
              label="Database Schemas Created"
              icon={<Database className="w-6 h-6" />}
              delay={0.4}
            />
            <StatCard value="5000+" label="Happy Developers" icon={<Users className="w-6 h-6" />} delay={0.5} />
          </div>
        </motion.div>

        {/* New Feature: Code Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-16 md:mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Weekly Code Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" />
                  Beginner
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Perfect for those just starting their coding journey. Solve simple problems and build your confidence.
                </p>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full">
                    Try Beginner Challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-neon-purple" />
                  Intermediate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ready for more? Test your skills with our intermediate challenges and level up your coding abilities.
                </p>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full">
                    Try Intermediate Challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="mr-2 h-5 w-5 text-neon-pink" />
                  Advanced
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Push your limits with complex problems that will challenge even experienced developers.
                </p>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full">
                    Try Advanced Challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-16 md:mt-24 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gradient">Why Choose Code Muse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg card-gradient"
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              >
                <GitBranch className="w-10 h-10 md:w-12 md:h-12 text-neon-blue mb-4" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Version Control</h3>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                Seamless integration with popular version control systems.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg card-gradient"
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
              >
                <Terminal className="w-10 h-10 md:w-12 md:h-12 text-neon-purple mb-4" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Multi-language Support</h3>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                Generate code in various programming languages and frameworks.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center p-6 rounded-lg card-gradient"
              whileHover={{ y: isMobile ? 0 : -5 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 1 }}
              >
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-neon-pink mb-4" />
              </motion.div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Smart Suggestions</h3>
              <p className="text-sm md:text-base text-muted-foreground text-center">
                Get intelligent code suggestions and auto-completions.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="mt-16 md:mt-24 mb-8 md:mb-12 text-center"
        >
          <Card className="bg-gradient-to-br from-primary/30 via-background to-secondary/20 border border-primary/20 overflow-hidden shadow-lg">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Coding Experience?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of developers who are already using Code Muse to write better code, faster.
              </p>
              <Link href="/generate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
          className="mt-8 md:mt-16 mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: "AI-Powered Code Generation",
                description: "Generate high-quality code in multiple languages with just a few clicks",
                icon: <Zap className="h-5 w-5 text-neon-blue" />,
              },
              {
                title: "Database Schema Design",
                description: "Create optimized database schemas for various database types",
                icon: <Database className="h-5 w-5 text-neon-purple" />,
              },
              {
                title: "Algorithm Solutions",
                description: "Get detailed solutions for complex data structures and algorithms problems",
                icon: <BookOpen className="h-5 w-5 text-neon-pink" />,
              },
              {
                title: "Multi-Language Support",
                description:
                  "Support for Python, JavaScript, Java, C#, Ruby, PHP, Go, Rust, Kotlin, TypeScript, and MATLAB",
                icon: <Code className="h-5 w-5 text-neon-blue" />,
              },
              {
                title: "Error Detection & Fixing",
                description: "Identify and fix errors in your code with detailed explanations",
                icon: <CheckCircle className="h-5 w-5 text-neon-purple" />,
              },
              {
                title: "Learning Resources",
                description: "Access comprehensive learning materials to improve your coding skills",
                icon: <BookOpen className="h-5 w-5 text-neon-pink" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className="flex items-start p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-primary/10"
              >
                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">{feature.icon}</div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
