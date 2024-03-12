"use client"

import { CheckIcon, ClipboardIcon } from "lucide-react"
import { FC, memo, useEffect, useState } from "react"
import { Prism } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Button } from "@/features/ui/button"
import { AI_NAME } from "@/features/theme/theme-config"

interface Props {
  language: string
  children: string
}

export const CodeBlock: FC<Props> = memo(({ language, children }) => {
  const [isIconChecked, setIsIconChecked] = useState(false)

  const generateAttribution = (language: string, content: string): string => {
    let attribution = `\nCode generated by ${AI_NAME}`
    if (language === "python") {
      attribution = `# ${attribution}`
    } else if (["javascript", "typescript", "c", "java", "c++", "c#", "php"].includes(language)) {
      attribution = `// ${attribution}`
    } else if (language === "html") {
      attribution = `<!-- ${attribution} -->`
    }
    return `${content}${attribution}`
  }

  const handleCopy = async (): Promise<void> => {
    try {
      const textToCopy = generateAttribution(language, children)
      await navigator.clipboard.writeText(textToCopy)
      setIsIconChecked(true)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [isIconChecked])

  return (
    <div className="group relative">
      <Prism language={language} style={atomDark} PreTag="pre" showLineNumbers>
        {children}
      </Prism>
      <Button variant="code" title="Copy code" onClick={handleCopy} aria-label="Copy code to clipboard">
        {isIconChecked ? <CheckIcon size={14} /> : <ClipboardIcon size={14} />}
        {isIconChecked ? `Copied ${language}` : `Copy ${language}`}
      </Button>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"
