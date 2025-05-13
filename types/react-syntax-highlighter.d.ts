declare module "react-syntax-highlighter" {
  interface SyntaxHighlighterProps {
    language?: string
    style?: any
    customStyle?: React.CSSProperties
    codeTagProps?: React.HTMLAttributes<HTMLElement>
    useInlineStyles?: boolean
    showLineNumbers?: boolean
    startingLineNumber?: number
    lineNumberStyle?: React.CSSProperties | ((lineNumber: number) => React.CSSProperties)
    lineProps?: React.HTMLAttributes<HTMLElement> | ((lineNumber: number) => React.HTMLAttributes<HTMLElement>)
    wrapLines?: boolean
    lineNumberContainerStyle?: React.CSSProperties
    className?: string
    children: string | React.ReactNode
  }

  const SyntaxHighlighter: React.FC<SyntaxHighlighterProps>
  export default SyntaxHighlighter
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const vscDarkPlus: any
  export const dracula: any
  export const atomDark: any
  export const prism: any
  export const okaidia: any
  export const tomorrow: any
  export const solarizedlight: any
  export const materialLight: any
  export const materialDark: any
}
