import { FC, memo } from "react"
import { Prism } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { ClipboardIcon } from "lucide-react"
import { Button } from "@/features/ui/button"
import { AI_NAME } from "@/features/theme/customise"

export const fence = {
  render: "CodeBlock",
  attributes: {
    language: {
      type: String,
    },
    value: {
      type: String,
    },
  },
}

interface Props {
  language: string
  children: string
}

export const CodeBlock: FC<Props> = memo(({ language, children }) => {
  const handleCopy = async () => {
    try {
      // Default attribution
      let attribution = language + " code generated by " + AI_NAME

      if (language === "python") {
        attribution = "# " + language + " code generated by " + AI_NAME
      } else if (["javascript", "typescript", "c", "java", "c++", "c#", "php"].includes(language)) {
        attribution = "// " + language + " code generated by " + AI_NAME
      } else if (language === "html") {
        attribution = "<!-- " + language + " code generated by " + AI_NAME + " -->"
      }
      // Additional conditions for other languages' comment formats can be added here

      await navigator.clipboard.writeText(children + "\n" + attribution)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="group relative">
      <Prism language={language} style={atomDark} PreTag="pre">
        {children}
      </Prism>
      <Button
        onClick={handleCopy}
        className="absolute right-2 top-2 h-7 p-1 text-sm focus:bg-accent focus:text-link"
        title="Copy code"
      >
        <ClipboardIcon size={14} />
        Copy {language}
      </Button>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"
