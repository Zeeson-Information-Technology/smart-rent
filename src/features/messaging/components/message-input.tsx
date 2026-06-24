"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui";
import type { MessageRecord } from "@/features/messaging/types";

type MessageInputProps = {
  conversationId: string;
  onSent: (message: MessageRecord) => void;
  receiverId: string;
};

export function MessageInput({
  conversationId,
  onSent,
  receiverId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSending(true);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        receiverId,
        message,
      }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error ?? "Unable to send message.");
      setIsSending(false);
      return;
    }

    onSent(result.message);
    setMessage("");
    setIsSending(false);
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="message">
        Message
        <textarea
          className="min-h-28 rounded-lg border bg-white px-3 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-blue-100"
          id="message"
          name="message"
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a reply"
          required
          value={message}
        />
      </label>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <Button className="w-full sm:w-fit" disabled={isSending || !message.trim()} type="submit">
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
