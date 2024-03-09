import { Markdown } from "@/components/markdown/markdown"
import { Card } from "@/features/ui/card"
import { VersionDisplay } from "@/features/change-log/version-display"
import { promises as fs } from "fs"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function Home(): Promise<JSX.Element> {
  const content = await loadContent()
  return (
    <Card className="flex h-full flex-1 justify-center overflow-y-scroll">
      <div className="flex flex-col gap-8 py-8">
        <Suspense fallback={"Getting version"}>
          <VersionDisplay />
        </Suspense>
        <div className="prose prose-slate max-w-4xl break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 ">
          <Markdown content={content} />
        </div>
      </div>
    </Card>
  )
}

const loadContent = async () => {
  // if (process.env.NODE_ENV === "production") {
  //   const response = await fetch(
  //     "https://raw.githubusercontent.com/kpqdap/azurechat/main/src/app/change-log/update.md",
  //     {
  //       cache: "no-cache",
  //     }
  //   );
  //   return await response.text();
  // } else {
  return await fs.readFile(process.cwd() + "/public/update.md", "utf8")
  // }
}
