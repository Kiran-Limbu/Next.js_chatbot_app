"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserInputTextBar = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    setMessage("");
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
          disabled={!message.trim()}
          className="bg-[#f7f1e8] text-[#11100f] hover:bg-white cursor-pointer"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
};

export default UserInputTextBar;
