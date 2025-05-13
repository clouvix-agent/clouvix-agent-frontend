'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface Message {
  type: 'user' | 'assistant' | 'tool' | 'error';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`wss://backend.clouvix.com/ws/chat?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
    
        // ✅ Skip completion notifications
        if (data.type === 'complete') {
          setIsLoading(false);
          return;
        }
    
        // ✅ Handle tool response as regular assistant message
        if (data.type === 'step' && typeof data.content === 'string') {
          setMessages((prev) => [
            ...prev,
            { type: 'assistant', content: data.content, timestamp: new Date() }
          ]);
          setIsLoading(false);
          return;
        }
    
        // ✅ Primary structure from backend: reply + suggestions
        if (data.reply || data.suggestions) {
          if (data.reply) {
            setMessages((prev) => [
              ...prev,
              { type: 'assistant', content: data.reply, timestamp: new Date() }
            ]);
          }
          if (data.suggestions) {
            setSuggestions(data.suggestions);
          }
          setIsLoading(false);
          return;
        }
    
        // 🛑 Fallback: Show unexpected strings
        setMessages((prev) => [
          ...prev,
          { type: 'assistant', content: event.data, timestamp: new Date() }
        ]);
        setIsLoading(false);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { type: 'error', content: 'Message parsing error', timestamp: new Date() }
        ]);
        setIsLoading(false);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConnectionError('Connection lost. Reconnecting...');
      setTimeout(() => window.location.reload(), 3000);
    };

    ws.onerror = () => {
      setIsConnected(false);
      setConnectionError('WebSocket error. Please check your network.');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || !isConnected) return;

    const userMessage: Message = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    wsRef.current.send(inputMessage);
    setInputMessage('');
    setSuggestions([]); // clear suggestions after sending
    setIsLoading(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
      <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton onClick={() => router.back()}><ArrowBackIcon /></IconButton>
          <Box ml={1}>
            <Typography variant="h6">ClouVix AI Assistant</Typography>
            <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Typography>
          </Box>
        </Box>

        {/* Error Message */}
        {connectionError && <Alert severity="error" sx={{ m: 2 }}>{connectionError}</Alert>}

        {/* Messages */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, backgroundColor: '#f7f7f7' }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '75%',
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: msg.type === 'user' ? '#007aff' : '#e0e0e0',
                  color: msg.type === 'user' ? 'white' : 'black',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {children}
                      </Typography>
                    ),
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline ? (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match?.[1] || 'bash'}
                            PreTag="div"
                            customStyle={{
                              borderRadius: '10px',
                              padding: '1rem',
                              maxHeight: '400px',
                              overflowX: 'auto',
                              backgroundColor: '#1e1e1e',
                              fontSize: '0.9rem'
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </Box>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
                  {msg.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ px: 2, py: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, i) => (
              <Button
                key={i}
                variant="outlined"
                onClick={() => {
                  setInputMessage(suggestion);
                  setSuggestions([]); // optional: hide after selecting
                }}
                sx={{ textTransform: 'none' }}
              >
                {suggestion}
              </Button>
            ))}
          </Box>
        )}

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isLoading}
            />
            <Button variant="contained" onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
