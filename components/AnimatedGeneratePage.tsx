"use client"

import type React from "react"
import { useState } from "react"
import CodeGenerator from "@/components/CodeGenerator"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Code, FileCode, GitBranch } from "lucide-react"

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="bg-gradient-to-br from-background/50 to-background/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 border border-primary/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-primary">
        {icon}
        {title}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
)

export default function AnimatedGeneratePage() {
  const [activeTab, setActiveTab] = useState("generate")

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-8 text-center text-gradient animate-glow"
        >
          Generate Code
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-12 text-primary/80 max-w-2xl mx-auto"
        >
          Harness the power of AI to create, optimize, and learn from code.
        </motion.p>

        <Tabs defaultValue="generate" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate">Generate Code</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CodeGenerator />
            </motion.div>
          </TabsContent>
          <TabsContent value="features">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FeatureCard
                title="AI-Powered Generation"
                description="Leverage advanced AI models to generate high-quality code snippets and entire projects."
                icon={<Zap className="w-6 h-6 text-neon-blue" />}
              />
              <FeatureCard
                title="Multi-Language Support"
                description="Generate code in various programming languages and frameworks to suit your project needs."
                icon={<Code className="w-6 h-6 text-neon-purple" />}
              />
              <FeatureCard
                title="Code Explanation"
                description="Get detailed explanations of generated code to enhance understanding and learning."
                icon={<FileCode className="w-6 h-6 text-neon-pink" />}
              />
              <FeatureCard
                title="Version Control Integration"
                description="Seamlessly integrate generated code with popular version control systems."
                icon={<GitBranch className="w-6 h-6 text-neon-blue" />}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
