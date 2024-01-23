"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const MiniNewChat = () => {
  const router = useRouter();

  const startNewChat = () => {
    router.push("/chat/");
  };

  return (
    <div className="lg:hidden absolute top-4 right-4">
      <Button
        className="gap-2 rounded-full w-[40px] h-[40px] p-1 text-primary"
        variant={"outline"}
        onClick={startNewChat}
      >
        <PlusCircle size={40} strokeWidth={1.2} />
      </Button>
    </div>
  );
};
