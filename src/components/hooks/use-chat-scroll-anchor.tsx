"use client";

import { Message } from "ai";
import { RefObject, useEffect } from "react";

export const useChatScrollAnchor = (
  chats: Message[],
  ref: RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    if (ref && ref.current) {
      const chatContainer = ref.current;
      const scrollHeight = chatContainer.scrollHeight;
      const scrollTop = chatContainer.scrollTop;
      const windowHeight = chatContainer.clientHeight;
      const scrollStep = 5; // Adjust the scrolling speed as needed

      const scrollInterval = setInterval(() => {
        if (scrollTop < scrollHeight - windowHeight) {
          chatContainer.style.transition = "transform 0.2s ease-in-out";
          chatContainer.style.transform = `translateY(-${scrollStep}px)`;
          setTimeout(() => {
            chatContainer.style.transition = "none";
            chatContainer.style.transform = "translateY(0)";
            chatContainer.scrollTop += scrollStep;
          }, 200); // Adjust the duration as needed
        } else {
          clearInterval(scrollInterval);
        }
      }, 100); // Adjust the interval as needed for smoothness

      return () => {
        clearInterval(scrollInterval);
      };
    }
  }, [chats, ref]);
};
