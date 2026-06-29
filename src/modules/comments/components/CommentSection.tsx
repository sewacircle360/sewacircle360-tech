"use client";

import { useState, useTransition } from "react";
import { createComment } from "../actions/comments";
import { Send, Loader2, MessageSquare, User } from "lucide-react";

interface CommentItem {
  id: string;
  content: string;
  userName: string;
  userId: string;
  createdAt: Date | string;
}

interface CommentSectionProps {
  taskId?: string;
  ticketId?: string;
  projectId?: string;
  initialComments: CommentItem[];
  currentUserId: string;
  currentUserName: string;
}

export function CommentSection({
  taskId,
  ticketId,
  projectId,
  initialComments = [],
  currentUserId,
  currentUserName,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    startTransition(async () => {
      const result = await createComment({
        content,
        userName: currentUserName,
        userId: currentUserId,
        taskId,
        ticketId,
        projectId,
      });

      if (result.error) {
        setError(result.error);
      } else if (result.comment) {
        setComments(prev => [
          ...prev,
          {
            id: result.comment!.id,
            content: result.comment!.content,
            userName: result.comment!.userName,
            userId: result.comment!.userId,
            createdAt: result.comment!.createdAt,
          }
        ]);
        setContent("");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#090d1f]/60 rounded-2xl border dark:border-slate-800/80 shadow-sm p-5 flex flex-col gap-4 text-left">
      <div className="flex items-center gap-2 border-b dark:border-slate-850 pb-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Discussion &amp; Updates</span>
        <span className="text-[10px] font-extrabold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full text-slate-500">
          {comments.length} Messages
        </span>
      </div>

      {/* Messages list */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-600 text-xs">
            No remarks logged yet. Start the conversation below.
          </div>
        ) : (
          comments.map((comm) => {
            const isMe = comm.userId === currentUserId;
            
            return (
              <div 
                key={comm.id} 
                className={`flex gap-2.5 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* User avatar circle */}
                <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 flex items-center justify-center shrink-0">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                </div>

                {/* Message bubble */}
                <div className={`p-3 rounded-2xl text-xs flex flex-col gap-1 shadow-sm border ${
                  isMe 
                    ? "bg-primary text-white border-primary/25 rounded-tr-none" 
                    : "bg-slate-50 dark:bg-slate-950/65 text-slate-800 dark:text-slate-200 border-slate-150 dark:border-slate-850 rounded-tl-none"
                }`}>
                  <span className={`text-[9px] font-bold uppercase tracking-wide ${isMe ? "text-white/80" : "text-slate-400"}`}>
                    {comm.userName}
                  </span>
                  <p className="leading-relaxed font-medium break-all whitespace-pre-wrap">{comm.content}</p>
                  <span className={`text-[8px] font-semibold text-right ${isMe ? "text-white/60" : "text-slate-400"}`}>
                    {new Date(comm.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="border-t dark:border-slate-850 pt-3 flex gap-2 items-end">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message remarks..."
          disabled={isPending}
          rows={1}
          className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/85 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="h-8 w-8 bg-primary hover:bg-primary/95 text-white flex items-center justify-center rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shrink-0"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </form>

      {error && (
        <p className="text-[10px] text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
}
