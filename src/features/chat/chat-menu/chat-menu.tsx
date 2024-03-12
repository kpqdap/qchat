import { Menu, MenuContent, MenuHeader } from "@/components/menu"
import { FindAllChatThreadForCurrentUser } from "@/features/chat/chat-services/chat-thread-service"
import { MenuItems } from "./menu-items"
import { NewChat } from "./new-chat"

export const ChatMenu = async (): Promise<JSX.Element> => {
  const items = await FindAllChatThreadForCurrentUser()

  return (
    <Menu className="hidden h-full w-auto overflow-auto bg-background p-2 md:block lg:col-span-2 xl:col-span-1">
      <MenuHeader className="justify-end">
        <NewChat />
      </MenuHeader>
      <MenuContent>
        <MenuItems menuItems={items} />
      </MenuContent>
    </Menu>
  )
}
