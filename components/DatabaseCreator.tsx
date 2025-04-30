"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, Database, Wand2, History, X, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateCode } from "@/lib/generateCode"
import { OutputFormat } from "./OutputFormat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type Column = {
  name: string
  type: string
  constraints: string
}

type TableType = {
  name: string
  columns: Column[]
}

type VectorDimension = {
  dimensions: number
  metric: string
}

type VectorConfig = {
  name: string
  dimensions: VectorDimension[]
}

// Database types grouped by category
const databaseTypes = {
  relational: ["MySQL", "PostgreSQL", "SQLite", "MariaDB", "Oracle", "SQL Server"],
  document: ["MongoDB", "Firestore", "CouchDB", "DynamoDB"],
  vector: ["Pinecone", "Milvus", "Qdrant", "Weaviate", "Chroma", "FAISS"],
  graph: ["Neo4j", "ArangoDB", "Amazon Neptune"],
  timeSeries: ["InfluxDB", "TimescaleDB"],
  keyValue: ["Redis", "Cassandra", "Bigtable"],
}

// Vector database metrics
const vectorMetrics = ["cosine", "euclidean", "dot", "manhattan", "hamming", "jaccard"]

export default function DatabaseCreator() {
  const [tables, setTables] = useState<TableType[]>([])
  const [currentTable, setCurrentTable] = useState<TableType>({ name: "", columns: [] })
  const [sqlOutput, setSqlOutput] = useState("")
  const [selectedDatabaseCategory, setSelectedDatabaseCategory] = useState("relational")
  const [selectedDatabase, setSelectedDatabase] = useState(databaseTypes.relational[0])
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [promptBeforeGeneration, setPromptBeforeGeneration] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [history, setHistory] = useState<{ prompt: string; output: string; database: string }[]>([])
  const [activeTab, setActiveTab] = useState("schema-builder")

  // Vector database specific state
  const [vectorConfig, setVectorConfig] = useState<VectorConfig>({
    name: "embeddings",
    dimensions: [{ dimensions: 1536, metric: "cosine" }],
  })

  const { toast } = useToast()

  // Load history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem("databaseHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const addColumn = () => {
    setCurrentTable({
      ...currentTable,
      columns: [...currentTable.columns, { name: "", type: "", constraints: "" }],
    })
  }

  const updateColumn = (index: number, field: keyof Column, value: string) => {
    const updatedColumns = [...currentTable.columns]
    updatedColumns[index] = { ...updatedColumns[index], [field]: value }
    setCurrentTable({ ...currentTable, columns: updatedColumns })
  }

  const removeColumn = (index: number) => {
    const updatedColumns = currentTable.columns.filter((_, i) => i !== index)
    setCurrentTable({ ...currentTable, columns: updatedColumns })
  }

  const addTable = () => {
    if (currentTable.name && currentTable.columns.length > 0) {
      setTables([...tables, currentTable])
      setCurrentTable({ name: "", columns: [] })
    }
  }

  const addVectorDimension = () => {
    setVectorConfig({
      ...vectorConfig,
      dimensions: [...vectorConfig.dimensions, { dimensions: 1536, metric: "cosine" }],
    })
  }

  const updateVectorDimension = (index: number, field: keyof VectorDimension, value: any) => {
    const updatedDimensions = [...vectorConfig.dimensions]
    updatedDimensions[index] = { ...updatedDimensions[index], [field]: value }
    setVectorConfig({ ...vectorConfig, dimensions: updatedDimensions })
  }

  const removeVectorDimension = (index: number) => {
    const updatedDimensions = vectorConfig.dimensions.filter((_, i) => i !== index)
    setVectorConfig({ ...vectorConfig, dimensions: updatedDimensions })
  }

  const generateSQL = () => {
    let output = ""

    if (selectedDatabaseCategory === "relational") {
      output = `-- ${selectedDatabase} Database Schema\n\n`
      tables.forEach((table) => {
        output += `CREATE TABLE ${table.name} (\n`
        table.columns.forEach((column, index) => {
          output += `  ${column.name} ${column.type} ${column.constraints}`
          if (index < table.columns.length - 1) {
            output += ","
          }
          output += "\n"
        })
        output += ");\n\n"
      })
    } else if (selectedDatabaseCategory === "document") {
      output = `// ${selectedDatabase} Database Schema\n\n`
      tables.forEach((table) => {
        output += `// Collection: ${table.name}\n`
        output += `{\n`
        output += `  "_id": ObjectId(),\n`
        table.columns.forEach((column, index) => {
          output += `  "${column.name}": "${column.type}"${column.constraints ? ` // ${column.constraints}` : ""}`
          if (index < table.columns.length - 1) {
            output += ","
          }
          output += "\n"
        })
        output += `}\n\n`
      })
    } else if (selectedDatabaseCategory === "vector") {
      output = `// ${selectedDatabase} Vector Database Configuration\n\n`
      output += `// Index: ${vectorConfig.name}\n`
      output += `{\n`
      output += `  "name": "${vectorConfig.name}",\n`
      output += `  "dimensions": [\n`
      vectorConfig.dimensions.forEach((dim, index) => {
        output += `    {\n`
        output += `      "dimensions": ${dim.dimensions},\n`
        output += `      "metric": "${dim.metric}"\n`
        output += `    }${index < vectorConfig.dimensions.length - 1 ? "," : ""}\n`
      })
      output += `  ],\n`
      output += `  "metadata": {\n`
      tables.forEach((table, tableIndex) => {
        output += `    "${table.name}": {\n`
        table.columns.forEach((column, index) => {
          output += `      "${column.name}": "${column.type}"${index < table.columns.length - 1 ? "," : ""}\n`
        })
        output += `    }${tableIndex < tables.length - 1 ? "," : ""}\n`
      })
      output += `  }\n`
      output += `}\n`
    } else if (selectedDatabaseCategory === "graph") {
      output = `// ${selectedDatabase} Graph Database Schema\n\n`
      // Nodes (tables)
      tables.forEach((table) => {
        output += `// Node Label: ${table.name}\n`
        output += `CREATE (n:${table.name} {\n`
        table.columns.forEach((column, index) => {
          output += `  ${column.name}: ${column.type}${column.constraints ? ` // ${column.constraints}` : ""}`
          if (index < table.columns.length - 1) {
            output += ","
          }
          output += "\n"
        })
        output += `});\n\n`
      })
      // Relationships (if multiple tables)
      if (tables.length > 1) {
        output += `// Example Relationship\n`
        output += `CREATE (a:${tables[0].name})-[r:RELATES_TO]->(b:${tables[1].name});\n`
      }
    } else {
      // Generic output for other database types
      output = `// ${selectedDatabase} Database Schema\n\n`
      tables.forEach((table) => {
        output += `// Table/Collection: ${table.name}\n`
        output += `{\n`
        table.columns.forEach((column, index) => {
          output += `  "${column.name}": "${column.type}"${column.constraints ? ` // ${column.constraints}` : ""}`
          if (index < table.columns.length - 1) {
            output += ","
          }
          output += "\n"
        })
        output += `}\n\n`
      })
    }

    setSqlOutput(output)

    // Add to history
    const newHistory = [
      { prompt: "Manual Schema Creation", output, database: selectedDatabase },
      ...history.slice(0, 9),
    ]
    setHistory(newHistory)
    localStorage.setItem("databaseHistory", JSON.stringify(newHistory))
  }

  const generateFromPrompt = async () => {
    setIsGenerating(true)
    setPromptBeforeGeneration(prompt)
    try {
      const generatedSchema = await generateCode(
        `Generate a ${selectedDatabase} database schema based on the following description: ${prompt}`,
        selectedDatabaseCategory === "relational" ? "SQL" : "NoSQL",
        selectedDatabase,
      )
      setSqlOutput(generatedSchema)

      // Add to history
      const newHistory = [{ prompt, output: generatedSchema, database: selectedDatabase }, ...history.slice(0, 9)]
      setHistory(newHistory)
      localStorage.setItem("databaseHistory", JSON.stringify(newHistory))

      toast({
        title: "Schema generated",
        description: "Your database schema has been generated based on the prompt.",
      })
    } catch (error) {
      console.error("Error generating schema:", error)
      toast({
        title: "Error",
        description: "Failed to generate schema. Please try again.",
        variant: "destructive",
      })
    }
    setIsGenerating(false)
  }

  const handleDatabaseCategoryChange = (category: string) => {
    setSelectedDatabaseCategory(category)
    setSelectedDatabase(databaseTypes[category as keyof typeof databaseTypes][0])
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold mb-8 text-center text-gradient animate-glow"
        >
          Database Schema Creator
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-center mb-12 text-primary/80 max-w-2xl mx-auto"
        >
          Design and generate database schemas for various database types including relational, document, vector, and
          graph databases.
        </motion.p>

        <Card className="w-full bg-card shadow-lg border border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <Database className="mr-2 h-6 w-6 text-primary" />
              Database Creator
            </CardTitle>
            <CardDescription>
              Create schemas for various database types or generate them from a description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schema-builder">Schema Builder</TabsTrigger>
                <TabsTrigger value="prompt-generator">AI Generator</TabsTrigger>
              </TabsList>

              <TabsContent value="schema-builder" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Database Category</label>
                    <Select value={selectedDatabaseCategory} onValueChange={handleDatabaseCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Database Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relational">Relational</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="vector">Vector</SelectItem>
                        <SelectItem value="graph">Graph</SelectItem>
                        <SelectItem value="timeSeries">Time Series</SelectItem>
                        <SelectItem value="keyValue">Key-Value</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Database Type</label>
                    <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Database Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {databaseTypes[selectedDatabaseCategory as keyof typeof databaseTypes].map((db) => (
                          <SelectItem key={db} value={db}>
                            {db}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedDatabaseCategory === "vector" ? (
                  <div className="space-y-4 border border-border/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Vector Index Configuration</h3>
                      <Badge variant="outline">{selectedDatabase}</Badge>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Index Name</label>
                      <Input
                        placeholder="Index Name"
                        value={vectorConfig.name}
                        onChange={(e) => setVectorConfig({ ...vectorConfig, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Vector Dimensions</label>
                        <Button onClick={addVectorDimension} variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add Dimension
                        </Button>
                      </div>

                      <AnimatePresence>
                        {vectorConfig.dimensions.map((dim, index) => (
                          <motion.div
                            key={index}
                            className="flex space-x-2 items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Input
                              type="number"
                              placeholder="Dimensions"
                              value={dim.dimensions}
                              onChange={(e) =>
                                updateVectorDimension(index, "dimensions", Number.parseInt(e.target.value))
                              }
                              className="w-1/3"
                            />
                            <Select
                              value={dim.metric}
                              onValueChange={(value) => updateVectorDimension(index, "metric", value)}
                            >
                              <SelectTrigger className="w-2/3">
                                <SelectValue placeholder="Distance Metric" />
                              </SelectTrigger>
                              <SelectContent>
                                {vectorMetrics.map((metric) => (
                                  <SelectItem key={metric} value={metric}>
                                    {metric}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => removeVectorDimension(index)}
                              disabled={vectorConfig.dimensions.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4 border border-border/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      {selectedDatabaseCategory === "relational"
                        ? "Tables"
                        : selectedDatabaseCategory === "document"
                          ? "Collections"
                          : selectedDatabaseCategory === "graph"
                            ? "Nodes"
                            : "Data Structure"}
                    </h3>
                    <Badge variant="outline">
                      {tables.length} {tables.length === 1 ? "item" : "items"}
                    </Badge>
                  </div>

                  <Input
                    placeholder={
                      selectedDatabaseCategory === "relational"
                        ? "Table Name"
                        : selectedDatabaseCategory === "document"
                          ? "Collection Name"
                          : selectedDatabaseCategory === "graph"
                            ? "Node Label"
                            : "Structure Name"
                    }
                    value={currentTable.name}
                    onChange={(e) => setCurrentTable({ ...currentTable, name: e.target.value })}
                  />

                  <AnimatePresence>
                    {currentTable.columns.map((column, index) => (
                      <motion.div
                        key={index}
                        className="flex space-x-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Input
                          placeholder="Field Name"
                          value={column.name}
                          onChange={(e) => updateColumn(index, "name", e.target.value)}
                        />
                        <Select onValueChange={(value) => updateColumn(index, "type", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedDatabaseCategory === "relational" ? (
                              <>
                                <SelectItem value="INT">INT</SelectItem>
                                <SelectItem value="VARCHAR(255)">VARCHAR</SelectItem>
                                <SelectItem value="TEXT">TEXT</SelectItem>
                                <SelectItem value="DATE">DATE</SelectItem>
                                <SelectItem value="BOOLEAN">BOOLEAN</SelectItem>
                                <SelectItem value="FLOAT">FLOAT</SelectItem>
                                <SelectItem value="DECIMAL(10,2)">DECIMAL</SelectItem>
                                <SelectItem value="TIMESTAMP">TIMESTAMP</SelectItem>
                                <SelectItem value="JSON">JSON</SelectItem>
                              </>
                            ) : selectedDatabaseCategory === "document" ? (
                              <>
                                <SelectItem value="String">String</SelectItem>
                                <SelectItem value="Number">Number</SelectItem>
                                <SelectItem value="Boolean">Boolean</SelectItem>
                                <SelectItem value="Date">Date</SelectItem>
                                <SelectItem value="Object">Object</SelectItem>
                                <SelectItem value="Array">Array</SelectItem>
                                <SelectItem value="ObjectId">ObjectId</SelectItem>
                              </>
                            ) : selectedDatabaseCategory === "vector" ? (
                              <>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="vector">Vector</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="object">Object</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder={selectedDatabaseCategory === "relational" ? "Constraints" : "Description"}
                          value={column.constraints}
                          onChange={(e) => updateColumn(index, "constraints", e.target.value)}
                        />
                        <Button variant="destructive" size="icon" onClick={() => removeColumn(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button onClick={addColumn} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Field
                  </Button>

                  <div className="flex justify-between">
                    <Button
                      onClick={addTable}
                      disabled={!currentTable.name || currentTable.columns.length === 0}
                      variant="secondary"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save{" "}
                      {selectedDatabaseCategory === "relational"
                        ? "Table"
                        : selectedDatabaseCategory === "document"
                          ? "Collection"
                          : selectedDatabaseCategory === "graph"
                            ? "Node"
                            : "Structure"}
                    </Button>
                    <Button onClick={generateSQL} disabled={tables.length === 0} className="bg-primary">
                      Generate Schema
                    </Button>
                  </div>
                </div>

                <OutputFormat
                  isLoading={false}
                  output={sqlOutput}
                  language={selectedDatabaseCategory === "relational" ? "sql" : "json"}
                  title={`${selectedDatabase} Schema`}
                />
              </TabsContent>

              <TabsContent value="prompt-generator" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Database Category</label>
                      <Select value={selectedDatabaseCategory} onValueChange={handleDatabaseCategoryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Database Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relational">Relational</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="vector">Vector</SelectItem>
                          <SelectItem value="graph">Graph</SelectItem>
                          <SelectItem value="timeSeries">Time Series</SelectItem>
                          <SelectItem value="keyValue">Key-Value</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Database Type</label>
                      <Select value={selectedDatabase} onValueChange={setSelectedDatabase}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Database Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {databaseTypes[selectedDatabaseCategory as keyof typeof databaseTypes].map((db) => (
                            <SelectItem key={db} value={db}>
                              {db}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Describe your database schema</label>
                    <Textarea
                      placeholder="Describe your database schema here... (e.g., 'Create a database for an e-commerce platform with products, categories, users, and orders')"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <Button onClick={generateFromPrompt} disabled={!prompt || isGenerating} className="w-full">
                    {isGenerating ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate from Description
                      </motion.div>
                    )}
                  </Button>
                </div>

                <OutputFormat
                  isLoading={isGenerating}
                  output={sqlOutput}
                  language={selectedDatabaseCategory === "relational" ? "sql" : "json"}
                  title={`Generated ${selectedDatabase} Schema`}
                  beforeContent={promptBeforeGeneration ? `Description: ${promptBeforeGeneration}` : undefined}
                  afterContent={sqlOutput}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {history.length > 0 && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg"
            >
              <History size={24} />
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute right-0 top-0 h-full w-80 bg-card shadow-lg p-6"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Schemas</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  {history.map((item, index) => (
                    <motion.div
                      key={index}
                      className="mb-4 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setPrompt(item.prompt)
                        setSqlOutput(item.output)
                        setSelectedDatabase(item.database)
                        // Find the category for this database
                        for (const [category, databases] of Object.entries(databaseTypes)) {
                          if (databases.includes(item.database)) {
                            setSelectedDatabaseCategory(category)
                            break
                          }
                        }
                        setIsHistoryOpen(false)
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{item.database}</Badge>
                        <Badge variant="secondary">
                          {item.prompt === "Manual Schema Creation" ? "Manual" : "AI Generated"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.prompt === "Manual Schema Creation" ? "Schema created manually" : item.prompt}
                      </p>
                    </motion.div>
                  ))}
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
