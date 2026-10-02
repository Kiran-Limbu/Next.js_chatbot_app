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
  onMessageRemoved?: (messageId: string) => void;
};

const InputTextBar = ({
  onMessageAdded,
  onMessageRemoved,
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

    const optimisticId = `optimistic-${crypto.randomUUID()}`;
    if (onMessageAdded) {
      onMessageAdded({
        _id: optimisticId,
        role: "user",
        content: submittedMessage,
      });
    }
  ;
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const url = conversationId ? `/api/chat/${conversationId}` : "/api/chat";
      const response = await apiClientWraper.post(url, {
        message: submittedMessage,
      });

      const assistantMessage = response.data.messageData as Message;

      if (onMessageAdded) {
        onMessageAdded({
          _id: assistantMessage._id,
          role: "model",
          content: assistantMessage.content,
        });
      }

      if (!conversationId) {
        router.replace(`/chat/${response.data.conversationId}`);
      }
    } catch {
      if (onMessageRemoved) {
        onMessageRemoved(optimisticId);
      }
      setMessage(submittedMessage);
      setError("Message could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/10 bg-[#11100f] p-4 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-2 shadow-lg shadow-black/10">
        <Input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Ask anything"
          aria-label="Message"
          className="h-10 border-0 bg-transparent px-2 text-[#f7f1e8] placeholder:text-[#9f968b] focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Send message"
          disabled={!message.trim() || isSubmitting}
          className="bg-[#070605] text-[#11100f] hover:bg-white cursor-pointer"
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
