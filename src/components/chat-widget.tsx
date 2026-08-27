import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { playReplySound } from "@/lib/chat-sound";

const SUGGESTION_POOL = [
  "What do you manufacture?",
  "Which certifications do you hold?",
  "How do I request a quote?",
  "What is your minimum order quantity?",
  "How long is your lead time?",
  "Where is your factory located?",
  "Do you offer sampling and development?",
  "Which fabrics do you work with?",
  "What is your monthly capacity?",
  "Do you handle woven and knit both?",
  "Which markets do you export to?",
  "How do you ensure quality control?",
  "Can you do private label production?",
  "What compliance audits have you passed?",
  "How can I contact your team?",
];

function pickSuggestions(count = 3) {
  const pool = [...SUGGESTION_POOL];
  const out: string[] = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return out;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTION_POOL.slice(0, 3));

  // Rotate the starter questions on open and every few seconds while idle.
  useEffect(() => {
    if (!open) return;
    setSuggestions(pickSuggestions());
    const id = setInterval(() => setSuggestions(pickSuggestions()), 5000);
    return () => clearInterval(id);
  }, [open]);


  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  // Play a short chime whenever a new assistant reply arrives.
  const lastAssistantId = useRef<string | null>(null);
  useEffect(() => {
    if (busy) return;
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last || last.id === lastAssistantId.current) return;
    if (lastAssistantId.current === null && messages.length === 0) return;
    lastAssistantId.current = last.id;
    playReplySound();
  }, [messages, busy]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Dressy"}
        className="fixed bottom-5 right-5 z-[2147483000] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_30px_rgba(0,0,0,0.45)] ring-2 ring-background/70 transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-[2147483000] flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <img src="/dressy-logo.png" alt="Dressy" className="h-6 w-auto" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Dressy Assistant</p>
              <p className="text-[11px] text-muted-foreground">Quick answers about our factory</p>
            </div>
          </div>

          <Conversation className="flex-1">
            <ConversationContent className="gap-3 p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ask about our products, factory, compliance or how to start a project.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text) return null;
                return (
                  <Message from={message.role} key={message.id}>
                    <MessageContent
                      className={
                        message.role === "assistant"
                          ? "bg-transparent p-0 text-sm text-foreground"
                          : "bg-primary text-primary-foreground text-sm"
                      }
                    >
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}

              {busy && <Shimmer className="text-sm">Thinking...</Shimmer>}
              {error && (
                <p className="text-sm text-destructive">
                  Something went wrong. Please try again or email info@dressyclothing.com.
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(_message, event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Dressy..."
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
