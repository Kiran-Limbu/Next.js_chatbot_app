"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/src/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import apiClientWraper from "@/src/utils/client";

type Message = {
  _id: string;
  content: string;
  role: "user" | "model";
};

type InputTextBarProps = {
  onMessageAdded?: (message: Message) => void;
};

const InputTextBar = ({
  onMessageAdded,
}: InputTextBarProps) => {
  const params = useParams<{ id?: string }>();
  const conversationId = params.id;
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const submittedMessage = message.trim();
    if (!submittedMessage || isSubmitting) return;

    if (!session) {
      router.push("/signin");
      return;
    }

    setMessage("");
    setError("");
    setIsSubmitting(true);
    
    try {
      const url = conversationId ? `/api/chat/${conversationId}` : "/api/chat";
      const response = await apiClientWraper.post(url, {message});
      
      const assistantMessage = response.data.messageData;
      console.log(`YOUR USER ID'S : ${assistantMessage._id}`)
      console.log(`YOUR USER NAME  : ${assistantMessage.content}`)
      if (onMessageAdded) {
        onMessageAdded({
          _id: assistantMessage._id,
          role: "user",
          content: submittedMessage,
        });
      }
      
      if (!conversationId) {
        router.replace(`/chat/${response.data.conversationId}`);
      }
    router.refresh();
    } catch {
      setMessage(submittedMessage);
      setError("Message could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full shrink-0 bg-transparent p-3 sm:px-6 sm:py-4 shadow-2xl shadow-zinc-500/13"
    >
      <div className="mx-auto px-5 py-2 flex justify-center text-center bg-zinc-900  w-full max-w-3xl items-center gap-2 rounded-full shadow-xl shadow-cyan-500/3">
        <Input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask anything"
          aria-label="Message"
          className="h-10 border-none focus:ring-0 focus:ring-offset-0 focus:outline-none px-2 w-full text-[#f7f1e8] placeholder:text-[#9f968b]"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!message.trim() || isSubmitting}
          className="bg-[#f4b860] text-[#fdfbf8] hover:bg-[#f4b862] cursor-pointer"
        >
          <Send />
        </Button>
      </div>
      {error && (
        <p
          role="alert"
          className="mx-auto mt-2 w-full max-w-3xl text-sm text-red-400"
        >
          {error}
        </p>
      )}
    </form>
  );
};

export default InputTextBar;
