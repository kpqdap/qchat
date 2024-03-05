import { chatAPIEntry } from "@/features/chat/chat-services/chat-api-entry";
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));
export async function POST(req: Request) {
  const body = await req.json();
  
  const maxRetries = 2;
  const retryDelay = 5000;
   for (let attempt = 0; attempt <= maxRetries; attempt++) {
     try {
       const response = await chatAPIEntry(body);
       return response;
     } catch (error: any) { 
       if (attempt === maxRetries || error.status !== 504) {
         return new Response('Internal Server Error', { status: 500 });
       }
       await delay(retryDelay);
     }
   }
   return new Response('Gateway Timeout Error after retries', { status: 504 });
 };
 