'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  type: 'user' | 'assistant' | 'tool' | 'error';
  role?: 'user' | 'assistant' | 'tool';
  content: string;
  tool?: string;
  tool_call_id?: string;
  timestamp: Date;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const prompt = sessionStorage.getItem('prefilledPrompt');
    if (prompt) {
      setInputMessage(prompt);
      sessionStorage.removeItem('prefilledPrompt');
    }
  }, []);

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const token = localStorage.getItem("token");
    const ws = new WebSocket(`wss://backend.clouvix.com/ws/chat?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.type === 'complete' || data?.type === 'error') {
          setIsLoading(false);
          return; // ✅ Prevents falling through to unrecognized format
        }

        if (data?.suggestions) setSuggestions(data.suggestions);

        if (data?.reply && data?.suggestions) {
          setSuggestions(data.suggestions);
          setMessages((prev) => [
            ...prev,
            {
              type: 'assistant',
              role: 'assistant',
              content: data.reply,
              timestamp: new Date(),
            },
          ]);
          return;
        }

        const newMsg = convertServerDataToMessage(data, setSuggestions);
        if (newMsg) {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.type === newMsg.type && last?.content === newMsg.content) return prev;
            return [...prev, newMsg];
          });
        }
      } catch (error) {
        console.error('Message parse error:', error);
        setMessages((prev) => [
          ...prev,
          { type: 'error', content: 'Message parsing error', timestamp: new Date() },
        ]);
        setIsLoading(false);
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      setConnectionError('Connection lost. Attempting to reconnect...');
      if (!event.wasClean) reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setIsConnected(false);
      setConnectionError('WebSocket error. Please check your backend and network.');
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  const cleanMarkdownCodeBlock = (content: string): string =>
    content.replace(/```json\n|\n```/g, '').trim();

  const convertServerDataToMessage = (data: any, setSuggestions: (s: string[]) => void): Message | null => {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(cleanMarkdownCodeBlock(data));
        if (parsed.reply && parsed.suggestions) {
          setSuggestions(parsed.suggestions);
          return { type: 'assistant', role: 'assistant', content: parsed.reply, timestamp: new Date() };
        }
      } catch {
        return { type: 'assistant', role: 'assistant', content: data, timestamp: new Date() };
      }
    }

    if (typeof data === 'object') {
      if (data.reply && data.suggestions) {
        setSuggestions(data.suggestions);
        return { type: 'assistant', role: 'assistant', content: data.reply, timestamp: new Date() };
      }

      if (data.type === 'step' && typeof data.content === 'string') {
        try {
          const parsed = JSON.parse(cleanMarkdownCodeBlock(data.content));
          if (parsed.reply && parsed.suggestions) {
            setSuggestions(parsed.suggestions);
            return { type: 'assistant', role: 'assistant', content: parsed.reply, timestamp: new Date() };
          }
        } catch {
          return { type: 'assistant', role: 'assistant', content: data.content, timestamp: new Date() };
        }
      }

      if (data.type === 'error') {
        return { type: 'error', content: data.content || 'Error', timestamp: new Date() };
      }
    }

    return {
      type: 'error',
      content: `Unrecognized format: ${JSON.stringify(data)}`,
      timestamp: new Date(),
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || !isConnected) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setSuggestions([]);
    wsRef.current.send(inputMessage);
    setInputMessage('');
    setIsLoading(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => router.back()} color="primary"><ArrowBackIcon /></IconButton>
          <Box>
            <Typography variant="h6">Clouvix</Typography>
            <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        {connectionError && <Alert severity="error" sx={{ m: 2 }}>{connectionError}</Alert>}

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.map((msg, i) => (
            <Box key={i} sx={{ mb: 2, p: 2, borderRadius: 2, backgroundColor: msg.type === 'user' ? '#e3f2fd' : '#f5f5f5' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{msg.timestamp.toLocaleTimeString()}</Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isConnected || isLoading}
            />
            <Button variant="contained" onClick={handleSendMessage} disabled={!isConnected || isLoading || !inputMessage.trim()}>
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
