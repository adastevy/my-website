import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  streamingContent: string;
  isLoading: boolean;
}

export default function ChatMessageList({ messages, streamingContent, isLoading }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);

  const isAtBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const handleScroll = () => {
    isUserScrolledUp.current = !isAtBottom();
  };

  useEffect(() => {
    if (!isUserScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingContent]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4"
    >
      {messages.length === 0 && !streamingContent && (
        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm">
          向 AI 助手提问，获取个性化学习建议
        </div>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
      ))}
      {streamingContent && (
        <ChatBubble role="assistant" content={streamingContent} />
      )}
      {isLoading && !streamingContent && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
