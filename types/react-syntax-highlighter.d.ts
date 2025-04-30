import type React from "react"
declare module "react-syntax-highlighter" {
  import type { ReactNode } from "react"

  export interface SyntaxHighlighterProps {
    language?: string
    style?: any
    children?: ReactNode
    className?: string
    customStyle?: React.CSSProperties
    codeTagProps?: React.HTMLAttributes<HTMLElement>
    useInlineStyles?: boolean
    showLineNumbers?: boolean
    startingLineNumber?: number
    lineNumberStyle?: React.CSSProperties
    wrapLines?: boolean
    lineProps?: any
    renderer?: any
    PreTag?: React.ComponentType<any>
    CodeTag?: React.ComponentType<any>
    [key: string]: any
  }

  const SyntaxHighlighter: React.FC<SyntaxHighlighterProps>
  export default SyntaxHighlighter
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  const vscDarkPlus: any
  export { vscDarkPlus }
}
