import { useState, useRef, useCallback, useEffect } from 'react';
import ChatMessageList, { type ChatMessage } from '../components/Chat/ChatMessageList';
import ChatInput from '../components/Chat/ChatInput';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/apiClient';

export default function ChatPage() {
  const { accessToken, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextIdRef = useRef(0);
  /** Prevents double-send (e.g. Enter + form submit). */
  const sendInFlightRef = useRef(false);

  const loadHistory = useCallback(async () => {
    if (!accessToken) return;
    try {
      const res = await apiFetch('/api/chat/history');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        nextIdRef.current = data.messages.length > 0
          ? Math.max(...data.messages.map((m: ChatMessage) => m.id)) + 1
          : 0;
      }
    } catch {
      // history load failure is non-critical
    }
  }, [accessToken]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleSend = useCallback(async (message: string) => {
    if (!isAuthenticated) {
      setError('请先登录后再使用 AI 助手');
      return;
    }
    if (sendInFlightRef.current) return;
    sendInFlightRef.current = true;
    setError(null);

    const userMsg: ChatMessage = {
      id: nextIdRef.current++,
      role: 'user',
      content: message,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setStreamingContent('');

    const controller = new AbortController();
    abortRef.current = controller;
    /** Declared outside try so finally can read it; avoids double-append from Strict Mode setState. */
    let assistantAccumulator = '';

    try {
      const res = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('登录已过期，请重新登录');
        } else {
          setError('AI 暂时不可用，请稍后重试');
        }
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const dataStr = line.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              setError('AI 暂时不可用，请稍后重试');
            } else if (parsed.token) {
              assistantAccumulator += parsed.token;
              setStreamingContent((prev) => prev + parsed.token);
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('网络连接失败，请检查后端服务是否启动');
      }
    } finally {
      setIsLoading(false);
      if (assistantAccumulator) {
        const assistantMsg: ChatMessage = {
          id: nextIdRef.current++,
          role: 'assistant',
          content: assistantAccumulator,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
      setStreamingContent('');
      sendInFlightRef.current = false;
      abortRef.current = null;
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem-2rem)] md:h-[calc(100vh-4rem-3rem)]">
      {error && (
        <div className="mx-4 mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            关闭
          </button>
        </div>
      )}
      <ChatMessageList
        messages={messages}
        streamingContent={streamingContent}
        isLoading={isLoading}
      />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
