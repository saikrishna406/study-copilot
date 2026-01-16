/**
 * Example: Chat Component using Backend RAG
 * Replace your existing chat logic with this
 */
'use client';

import { useState, useEffect } from 'react';
import { useAPI } from '@/hooks/useAPI';
import { Button } from '@/components/ui/button';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatExampleProps {
    documentId: string;
}

export function ChatExample({ documentId }: ChatExampleProps) {
    const { chatQuery, loading } = useAPI();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState<string | undefined>();

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput('');

        // Add user message immediately
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Query backend
        const response = await chatQuery([documentId], userMessage, sessionId);

        if (response) {
            // Update session ID
            setSessionId(response.session_id);

            // Add assistant response
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: response.message }
            ]);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-zinc-400 text-sm">
                        Ask a question about your document...
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded ${msg.role === 'user'
                                    ? 'bg-black text-white ml-auto max-w-[80%]'
                                    : 'bg-zinc-100 text-black mr-auto max-w-[80%]'
                                }`}
                        >
                            <p className="text-sm">{msg.content}</p>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <FaSpinner className="animate-spin" />
                        <span>Thinking...</span>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="border-t p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask a question..."
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-zinc-200 focus:outline-none focus:border-black"
                    />
                    <Button onClick={handleSend} disabled={loading || !input.trim()}>
                        <FaPaperPlane />
                    </Button>
                </div>
            </div>
        </div>
    );
}
