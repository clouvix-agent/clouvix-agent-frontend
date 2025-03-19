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
  Fab,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clearAuth } from '../../utils/auth';

interface Message {
  type: 'user' | 'assistant' | 'tool' | 'error';
  role?: 'user' | 'assistant' | 'tool';
  content: string;
  tool?: string;
  tool_call_id?: string;
  timestamp: Date;
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  const connectWebSocket = () => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket('wss://backend.clouvix.com/ws/chat');

      ws.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data);

          if (data?.type === 'complete' || data?.type === 'error') {
            setIsLoading(false);
          }

          const newMsg = convertServerDataToMessage(data);
          if (newMsg) {
            setMessages((prev) => {
              if (prev.length > 0) {
                const lastMsg = prev[prev.length - 1];
                const sameType = lastMsg.type === newMsg.type;
                const sameContent =
                  JSON.stringify(lastMsg.content) === JSON.stringify(newMsg.content);
                if (sameType && sameContent) {
                  return prev;
                }
              }
              return [...prev, newMsg];
            });
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          setMessages((prev) => [
            ...prev,
            {
              type: 'error',
              content: 'Error parsing message from server',
              timestamp: new Date(),
            },
          ]);
          setIsLoading(false);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        console.log('WebSocket closed:', event);
        setConnectionError('Connection lost. Attempting to reconnect...');
        
        if (!event.wasClean) {
          const delay = 3000; // 3 seconds delay between reconnection attempts
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setIsConnected(false);
        setConnectionError(
          'Connection error. Please ensure:\n' +
          '1. The backend server is running\n' +
          '2. The WebSocket endpoint is properly configured\n' +
          '3. Your network connection is stable'
        );
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError(
        'Failed to create WebSocket connection. Please check your network connection.'
      );
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  function convertServerDataToMessage(data: any): Message | null {
    if (typeof data === 'string') {
      return {
        type: 'error',
        content: data,
        timestamp: new Date(),
      };
    }

    if (data && typeof data === 'object' && 'type' in data) {
      const { type } = data;
      
      switch (type) {
        case 'step':
          return {
            type: 'assistant',
            role: 'assistant',
            content: data.content,
            timestamp: new Date(),
          };
        case 'complete':
          return null;
        default:
          return {
            type: 'error',
            content: `Unrecognized message type: ${type}`,
            timestamp: new Date(),
          };
      }
    }

    return {
      type: 'error',
      content: `Unrecognized data: ${JSON.stringify(data)}`,
      timestamp: new Date(),
    };
  }

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
    setIsLoading(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (type: Message['type']) => {
    switch (type) {
      case 'user':
        return { backgroundColor: '#e3f2fd', marginLeft: '20%' };
      case 'assistant':
        return { backgroundColor: '#f5f5f5', marginRight: '20%' };
      case 'tool':
        return { backgroundColor: '#fff9c4', marginRight: '20%' }; 
      case 'error':
        return { backgroundColor: '#ffebee', marginRight: '20%' };
      default:
        return { backgroundColor: '#f5f5f5', marginRight: '20%' };
    }
  };

  /** Renders each Message's content. */
  const renderMessageContent = (msg: Message) => {
    const { type, content, tool } = msg;

    const CodeBlock = ({ children }: { children: any }) => {
      const [copied, setCopied] = useState(false);
      const [isHovered, setIsHovered] = useState(false);
      
      const handleCopy = async () => {
        let codeText = '';
        if (typeof children === 'string') {
          codeText = children;
        } else if (children?.props?.children) {
          codeText = children.props.children;
        }
        
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <Box 
          sx={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <pre style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            padding: '16px',
            paddingRight: '48px', // Space for copy button
            borderRadius: '4px',
            overflowX: 'auto'
          }}>
            <Box 
              sx={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s',
                visibility: isHovered ? 'visible' : 'hidden'
              }}
            >
              <Tooltip title={copied ? "Copied!" : "Copy code"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopy}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <code>{children}</code>
          </pre>
        </Box>
      );
    };

    if (type === 'tool') {
      return (
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" color="primary">
            Tool: {tool}
          </Typography>
          <Typography variant="body1">{content}</Typography>
        </Box>
      );
    }

    if (type === 'assistant') {
      return (
        <Box sx={{ 
          '& code': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            padding: '2px 4px',
            borderRadius: 1,
            fontFamily: 'monospace'
          },
          '& p': {
            margin: '8px 0'
          },
          '& ul, & ol': {
            marginLeft: 3
          }
        }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <Typography variant="body1" {...props} />,
              a: ({node, ...props}) => <Typography component="a" color="primary" {...props} style={{textDecoration: 'underline'}} />,
              h1: ({node, ...props}) => <Typography variant="h4" {...props} sx={{mt: 2, mb: 1}} />,
              h2: ({node, ...props}) => <Typography variant="h5" {...props} sx={{mt: 2, mb: 1}} />,
              h3: ({node, ...props}) => <Typography variant="h6" {...props} sx={{mt: 2, mb: 1}} />,
              code: ({children, ...props}: any) => 
                props.inline ? <code {...props}>{children}</code> : children,
              pre: ({node, children, ...props}) => {
                const codeContent = Array.isArray(children) 
                  ? children.find(child => child?.props?.children)
                  : children;
                
                const codeText = codeContent?.props?.children || '';
                return <CodeBlock>{codeText}</CodeBlock>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </Box>
      );
    }

    return <Typography variant="body1">{content}</Typography>;
  };

  return (
      <Container maxWidth="md" sx={{ height: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => router.back()} 
              color="primary"
              aria-label="go back"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h6">Clouvix</Typography>
              <Typography variant="caption" color={isConnected ? 'success.main' : 'error.main'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {connectionError && (
          <Alert severity="error" sx={{ m: 2 }}>
            {connectionError}
          </Alert>
        )}

        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                ...getMessageStyle(message.type),
              }}
            >
              {renderMessageContent(message)}

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.5 }}
              >
                {message.timestamp.toLocaleTimeString()}
              </Typography>
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
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!isConnected || isLoading || !inputMessage.trim()}
            >
              {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
