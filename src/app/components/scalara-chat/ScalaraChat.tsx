"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import "./ScalaraChat.css";

/* ============ Types ============ */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ScalaraChatProps {
  whatsappHref?: string;
}

/* ============ Constants ============ */

const QUICK_ACTIONS = [
  "What services do you offer?",
  "Tell me about the team",
  "I have a project idea",
  "What's your tech stack?",
];

/* ============ Helpers ============ */

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Lightweight markdown → HTML for chat messages.
 * Handles: **bold**, numbered lists, bullet lists, line breaks.
 * No external dependencies.
 */
function renderMarkdown(text: string): string {
  // Escape basic HTML
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Split into lines for block-level processing
  const lines = html.split("\n");
  const result: string[] = [];
  let inOl = false;
  let inUl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Numbered list: "1. text" or "1) text"
    const olMatch = line.match(/^(\d+)[.)]\s+(.+)/);
    // Bullet list: "- text" or "• text"
    const ulMatch = line.match(/^[-•]\s+(.+)/);

    if (olMatch) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (!inOl) { result.push("<ol>"); inOl = true; }
      result.push(`<li>${olMatch[2]}</li>`);
    } else if (ulMatch) {
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (!inUl) { result.push("<ul>"); inUl = true; }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else {
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (inUl) { result.push("</ul>"); inUl = false; }

      if (line === "") {
        // Empty line — skip consecutive empties
        if (result.length > 0 && !result[result.length - 1].endsWith("</p>")) {
          // do nothing
        }
      } else {
        result.push(`<p>${line}</p>`);
      }
    }
  }

  if (inOl) result.push("</ol>");
  if (inUl) result.push("</ul>");

  return result.join("");
}

/* ============ SVG Icons ============ */

/** The actual Scalara Labs "S" logo — matches the header exactly */
function ScalaraLogoSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 34.9 38" fill="none">
      <path d="M19.0023 24.139L24.7406 26.402L18.626 29.2308L13.6403 26.8734L19.0023 24.139Z" fill="#123587" />
      <path d="M18.3438 0L34.9002 7.63772L25.9635 11.9752L18.3438 8.48635V0Z" fill="#7FCCF8" />
      <path d="M2.53991 7.54342L18.3438 0V8.48635L11.947 11.6923L2.53991 7.54342Z" fill="#4099ED" />
      <path d="M2.53991 7.54342L11.947 11.6923V21.2159L2.53991 17.1613V7.54342Z" fill="#0E65CC" />
      <path d="M11.947 11.6923L22.2007 16.1241V25.4591L11.947 21.2159V11.6923Z" fill="#74C6FB" />
      <path d="M22.2007 16.1241L34.2417 21.9702V30.268L22.2007 25.4591V16.1241Z" fill="#2F6FD5" />
      <path d="M18.626 29.2308L34.2417 21.9702V30.6452L18.626 38V29.2308Z" fill="#123587" />
      <path d="M10.2537 25.2705L18.626 29.2308V38L0 29.9851L10.2537 25.2705Z" fill="#3F95E8" />
      <path d="M18.3438 8.48635L25.9635 11.9752L19.5667 14.9926L11.947 11.6923L18.3438 8.48635Z" fill="#1A4BAA" />
      <path d="M34.2417 30.6452L24.6609 26.4416L34.2417 21.9702V30.6452Z" fill="#1A4BAA" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.486 2 2 5.589 2 10c0 2.908 1.898 5.516 5 6.934V22l5.34-4.005C17.697 17.852 22 14.32 22 10c0-4.411-4.486-8-10-8Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function SendPlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="m22 2-11 11" />
    </svg>
  );
}

function ArrowSendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ============ Component ============ */

export default function ScalaraChat({ whatsappHref }: ScalaraChatProps) {
  const [state, setState] = useState<"closed" | "hub" | "chat">("closed");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showQA, setShowQA] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => {
    if (state === "chat" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [state]);

  // Close hub on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (
        state === "hub" &&
        !t.closest(".scalara-hub-panel") &&
        !t.closest(".scalara-hub-collapse") &&
        !t.closest(".scalara-hub-trigger")
      ) {
        setState("closed");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [state]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;
    setShowQA(false);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "38px";

    setIsStreaming(true);
    const aId = uid();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [
        ...prev,
        { id: aId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const payload = line.slice(6);
          if (payload === "[DONE]") break;
          try {
            const { content: chunk } = JSON.parse(payload);
            assistantContent += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === aId ? { ...m, content: assistantContent } : m
              )
            );
          } catch {
            /* skip */
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== aId),
        {
          id: uid(),
          role: "assistant",
          content: "Something went wrong. Please try again or reach out directly.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "38px";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  // Memoize rendered messages so markdown only re-parses when content changes
  const renderedMessages = useMemo(() => {
    return messages.map((m) => ({
      ...m,
      html: m.role === "assistant" ? renderMarkdown(m.content) : undefined,
    }));
  }, [messages]);

  return (
    <>
      {/* ===== Trigger Button — Savante-style circular black ===== */}
      <AnimatePresence>
        {state === "closed" && (
          <motion.button
            className="scalara-hub-trigger"
            onClick={() => setState("hub")}
            aria-label="Open contact menu"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <ChatBubbleIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== Hub Panel — Savante-style welcome ===== */}
      <AnimatePresence>
        {state === "hub" && (
          <>
            <motion.div
              className="scalara-hub-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Dark header with logo + greeting */}
              <div className="scalara-hub-panel-header">
                <button
                  className="scalara-hub-panel-close"
                  onClick={() => setState("closed")}
                  aria-label="Close"
                >
                  <XIcon />
                </button>

                <div className="scalara-hub-panel-logo">
                  <ScalaraLogoSVG className="scalara-hub-panel-logo-icon" />
                  <div className="scalara-hub-panel-logo-text">
                    <span className="scalara-hub-panel-logo-text-scalara">Scalara</span>
                    <span className="scalara-hub-panel-logo-text-labs">Labs</span>
                  </div>
                </div>

                <div className="scalara-hub-panel-greeting">
                  Hi there 👋<br />
                  How can we help?
                </div>
              </div>

              {/* White cards */}
              <div className="scalara-hub-panel-cards">
                {/* AI Chat card */}
                <div
                  className="scalara-hub-panel-card"
                  onClick={() => setState("chat")}
                  role="button"
                  tabIndex={0}
                >
                  <div className="scalara-hub-panel-card-icon scalara-hub-panel-card-icon-chat">
                    <ChatBubbleIcon />
                  </div>
                  <span className="scalara-hub-panel-card-label">Live Chat</span>
                  <span className="scalara-hub-panel-card-arrow">
                    <SendPlaneIcon />
                  </span>
                </div>

                {/* WhatsApp card */}
                {whatsappHref && (
                  <a
                    className="scalara-hub-panel-card"
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="scalara-hub-panel-card-icon scalara-hub-panel-card-icon-wa">
                      <WhatsAppIcon />
                    </div>
                    <span className="scalara-hub-panel-card-label">WhatsApp Us</span>
                    <span className="scalara-hub-panel-card-arrow">
                      <ExternalLinkIcon />
                    </span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== Chat Panel ===== */}
      <AnimatePresence>
        {state === "chat" && (
          <motion.div
            className="scalara-chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Header */}
            <div className="scalara-chat-header">
              <button
                className="scalara-chat-back-btn"
                onClick={() => setState("hub")}
                aria-label="Back to menu"
              >
                <BackArrowIcon />
              </button>
              <ScalaraLogoSVG className="scalara-chat-header-logo" />
              <div className="scalara-chat-header-info">
                <div className="scalara-chat-header-name">Scalara AI</div>
                <div className="scalara-chat-header-status">
                  <span className="scalara-chat-header-status-dot" />
                  Online
                </div>
              </div>
              <button
                className="scalara-chat-close-btn"
                onClick={() => setState("closed")}
                aria-label="Close chat"
              >
                <XIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="scalara-chat-messages">
              {messages.length === 0 && !isStreaming && (
                <motion.div
                  className="scalara-chat-welcome"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                >
                  <ScalaraLogoSVG className="scalara-chat-welcome-logo" />
                  <h3>Scalara Labs</h3>
                  <p>
                    Ask about our services, team, tech stack, or tell us about
                    your project.
                  </p>
                </motion.div>
              )}

              {renderedMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`scalara-msg scalara-msg-${msg.role === "user" ? "user" : "agent"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === "assistant" && msg.html ? (
                    <div
                      className="scalara-msg-bubble"
                      dangerouslySetInnerHTML={{ __html: msg.html }}
                    />
                  ) : (
                    <div className="scalara-msg-bubble">{msg.content}</div>
                  )}
                  <span className="scalara-msg-time">{fmtTime(msg.timestamp)}</span>
                </motion.div>
              ))}

              {isStreaming &&
                messages[messages.length - 1]?.role !== "assistant" && (
                  <motion.div
                    className="scalara-chat-typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="scalara-typing-dot" />
                    <span className="scalara-typing-dot" />
                    <span className="scalara-typing-dot" />
                  </motion.div>
                )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {showQA && messages.length === 0 && (
              <motion.div
                className="scalara-chat-qas"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.25 }}
              >
                {QUICK_ACTIONS.map((a) => (
                  <button
                    key={a}
                    className="scalara-chat-qa"
                    onClick={() => sendMessage(a)}
                  >
                    {a}
                  </button>
                ))}
              </motion.div>
            )}

            {/* Input */}
            <div className="scalara-chat-input-area">
              <textarea
                ref={inputRef}
                className="scalara-chat-input"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                rows={1}
                disabled={isStreaming}
              />
              <button
                className="scalara-chat-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                aria-label="Send"
              >
                <ArrowSendIcon />
              </button>
            </div>

            <div className="scalara-chat-footer">
              Powered by Scalara Labs
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
