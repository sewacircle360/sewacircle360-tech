"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { MessageSquare, X, Send, Loader2, User, Sparkles } from "lucide-react";
import { createComment, getComments } from "../actions/comments";

interface CommentItem {
  id: string;
  content: string;
  userName: string;
  userId: string;
  createdAt: Date | string;
}

interface SupportChatBubbleProps {
  projectId: string;
  currentUserId: string;
  currentUserName: string;
  initialComments?: CommentItem[];
}

export function SupportChatBubble({
  projectId,
  currentUserId,
  currentUserName,
  initialComments = []
}: SupportChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Poll comments every 8 seconds for a simulated real-time support experience!
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(async () => {
      try {
        const fresh = await getComments({ projectId });
        const mapped = fresh.map((c: any) => ({
          id: c.id,
          content: c.content,
          userName: c.userName,
          userId: c.userId,
          createdAt: c.createdAt,
        }));
        
        if (mapped.length > comments.length) {
          setComments(mapped);
          setHasNewMessage(true);
        }
      } catch (err) {
        console.error("Failed to poll comments:", err);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [isOpen, projectId, comments.length]);

  // Scroll to bottom when comments list updates or opens
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const result = await createComment({
        content,
        userName: currentUserName,
        userId: currentUserId,
        projectId,
      });

      if (result.comment) {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end no-print">
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasNewMessage(false);
          }}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative group animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <MessageSquare className="h-6 w-6" />
          {hasNewMessage && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
          )}
          <span className="absolute -left-28 top-3.5 bg-slate-900 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none uppercase tracking-wider">
            Support Chat
          </span>
        </button>
      )}

      {/* Floating WhatsApp/Intercom style Chat Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[360px] h-[480px] bg-white dark:bg-[#070b19] border dark:border-slate-805 rounded-2xl flex flex-col justify-between shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-primary p-4 text-white flex justify-between items-center relative shrink-0">
            <div className="flex items-center gap-2.5 text-left">
              <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 relative shrink-0">
                <User className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-primary animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  SewaCircle360 Team <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                </span>
                <span className="text-[9px] text-white/70 font-semibold uppercase tracking-widest mt-0.5">Online Support Desk</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages view */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/20 text-left scrollbar-thin"
          >
            <div className="bg-primary/5 dark:bg-slate-900 border dark:border-slate-850 p-3 rounded-2xl text-[10px] text-slate-500 leading-normal mb-3 text-center">
              👋 Hello! Ask us anything about your dynamic builds, tasks, or SLA contract parameters. We typically reply within minutes.
            </div>

            {comments.map((comm) => {
              const isMe = comm.userId === currentUserId;
              
              return (
                <div 
                  key={comm.id} 
                  className={`flex gap-2 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 flex items-center justify-center shrink-0 mt-1">
                    <User className="h-3 w-3 text-slate-500" />
                  </div>
                  <div className={`p-2.5 rounded-2xl text-xs flex flex-col gap-1 shadow-sm border ${
                    isMe 
                      ? "bg-primary text-white border-primary/25 rounded-tr-none" 
                      : "bg-white dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 border-slate-150 dark:border-slate-850 rounded-tl-none"
                  }`}>
                    <span className={`text-[8px] font-bold uppercase tracking-wide ${isMe ? "text-white/60" : "text-slate-400"}`}>
                      {comm.userName}
                    </span>
                    <p className="leading-relaxed break-all font-medium whitespace-pre-wrap">{comm.content}</p>
                    <span className={`text-[7px] font-semibold text-right ${isMe ? "text-white/50" : "text-slate-400"}`}>
                      {new Date(comm.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form input */}
          <form onSubmit={handleSubmit} className="p-3 border-t dark:border-slate-850 bg-white dark:bg-[#070b19] flex gap-2 items-center shrink-0">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              disabled={isPending}
              className="flex-grow px-3 py-2 text-xs bg-slate-55 dark:bg-slate-950/80 border dark:border-slate-800 rounded-xl outline-none focus:border-primary text-foreground"
            />
            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="h-8 w-8 bg-primary hover:bg-primary/95 text-white flex items-center justify-center rounded-xl disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
