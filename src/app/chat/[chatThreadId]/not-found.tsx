import { Card } from "@/features/ui/card"
import { NewChat } from "@/features/chat/chat-menu/new-chat"

export default function NotFound(): JSX.Element {
  return (
    <Card className="col-span-5 h-full items-center justify-center gap-4">
      <div className="container mx-auto flex size-full max-w-xl items-center justify-center gap-2">
        <div className="flex flex-1 flex-col items-start gap-5">
          <h2 className="text-4xl font-bold"> Uh-oh! 404</h2>
          <p className="text-muted-foreground text-sm">How about we start a new chat?</p>
          <NewChat />
        </div>
      </div>
    </Card>
  )
}
