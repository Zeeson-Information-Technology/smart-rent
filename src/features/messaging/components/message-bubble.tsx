import type { MessageRecord } from "@/features/messaging/types";
import { cn } from "@/lib/utils/cn";

type MessageBubbleProps = {
  currentUserId: string;
  message: MessageRecord;
};

export function MessageBubble({ currentUserId, message }: MessageBubbleProps) {
  const fromCurrentUser = message.senderId === currentUserId;

  return (
    <div className={cn("flex", fromCurrentUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl border p-4",
          fromCurrentUser
            ? "border-blue-200 bg-blue-600 text-white"
            : "border-slate-200 bg-white text-slate-700",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <p className={cn("text-sm font-semibold", fromCurrentUser ? "text-white" : "text-slate-950")}>
            {fromCurrentUser ? "You" : message.senderName}
          </p>
          <p className={cn("text-xs", fromCurrentUser ? "text-blue-100" : "text-slate-500")}>
            {formatDateTime(message.createdAt)}
          </p>
        </div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.message}</p>
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
