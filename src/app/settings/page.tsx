import { Markdown } from "@/components/markdown/markdown";
import { Card } from "@/components/ui/card";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await loadContent();
  return (
  <div className="col-span-5 bg-altBackground text-foreground shadow-sm h-full items-left">
  <section className="w-full container mx-auto max-w-3xl justify-center h-full gap-9 bg-altBackground" aria-labelledby="startChatTitle">
    <div className="col-span-5 sm:col-span-6 gap-8 py-8">
    <div className="prose prose-slate dark:prose-invert break-words prose-p:leading-relaxed prose-pre:p-0 max-w-4xl items-left">
        <Markdown content={content} />
    </div>
    </div>
  </section>
  </div>
  );
}

const loadContent = async () => {
  return await fs.readFile(
    process.cwd() + "/public/holding.md",
    "utf8"
  );
};

//p-2 bg-background hidden md:block overflow-auto
