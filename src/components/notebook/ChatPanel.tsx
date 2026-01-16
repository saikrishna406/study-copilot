"use client"

import { useState, useRef, useEffect } from "react"
import { FaPaperPlane, FaMagic, FaUser, FaQuoteRight } from "react-icons/fa"
import { useAPI } from "@/hooks/useAPI"
import { Document } from "@/services/api"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface ChatPanelProps {
    document: Document | null
    onCitationClick: (page: number) => void
    triggerMessage?: string | null
    onTriggerComplete?: () => void
}

export function ChatPanel({ document, onCitationClick, triggerMessage, onTriggerComplete }: ChatPanelProps) {
    const { chatQuery, loading } = useAPI()
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    // Handle external triggers (e.g. from Studio Panel)
    useEffect(() => {
        if (triggerMessage && !loading && document) {
            handleSend(triggerMessage)
            if (onTriggerComplete) onTriggerComplete()
        }
    }, [triggerMessage])

    // Initial greeting
    useEffect(() => {
        if (document && messages.length === 0) {
            setMessages([
                { role: 'assistant', content: `Hello! I've analyzed **${document.title}**. What would you like to know?` }
            ])
        }
    }, [document])

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (text: string = input) => {
        if (!text.trim() || loading || !document) return

        const userMsg = { role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setInput("")

        try {
            const response = await chatQuery([document.id], text)
            if (response) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.message,
                    sources: response.sources,
                    isNew: true
                }])
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }])
        }
    }

    // Helper to render text with clickable citations
    const renderContent = (content: string) => {
        // Split by [Page X] pattern
        const parts = content.split(/(\[Page \d+\])/g)
        return parts.map((part, i) => {
            const match = part.match(/\[Page (\d+)\]/)
            if (match) {
                const pageNum = parseInt(match[1])
                return (
                    <button
                        key={i}
                        onClick={() => onCitationClick(pageNum)}
                        className="inline-flex items-center justify-center px-1.5 py-0.5 mx-1 rounded bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
                        title={`Jump to Page ${pageNum}`}
                    >
                        {part}
                    </button>
                )
            }
            return part
        })
    }

    if (!document) return <div className="flex-1" />

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Context Header (Optional) */}
            <div className="h-14 border-b border-zinc-200 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 text-zinc-500">
                    <FaMagic className="w-3 h-3" />
                    <span className="text-xs font-bold uppercase tracking-wider">Chat with {document.page_count} pages</span>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'assistant' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-100 text-zinc-400 border-zinc-200'}`}>
                            {msg.role === 'assistant' ? <FaMagic className="h-3 w-3" /> : <FaUser className="h-3 w-3" />}
                        </div>

                        {/* Bubble */}
                        <div className={`space-y-2 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`
                                inline-block p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                                ${msg.role === 'assistant'
                                    ? 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                                    : 'bg-zinc-100 text-zinc-900 rounded-tr-none border border-transparent'}
                             `}>
                                {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                            </div>

                            {/* Sources Row */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {msg.sources.map((source: any, sIdx: number) => (
                                        <button
                                            key={sIdx}
                                            onClick={() => source.page && onCitationClick(source.page)}
                                            disabled={!source.page}
                                            className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] transition-colors
                                                ${source.page
                                                    ? 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer'
                                                    : 'bg-zinc-50 border-transparent text-zinc-400 cursor-default'}
                                            `}
                                        >
                                            <FaQuoteRight className="w-2 h-2" />
                                            <span className="font-medium">
                                                {source.page ? `Page ${source.page}` : `Source ${sIdx + 1}`}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 animate-pulse">
                            <FaMagic className="h-3 w-3 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-48 bg-zinc-100" />
                            <Skeleton className="h-4 w-32 bg-zinc-100" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-zinc-200 bg-white">

                {/* Suggestions */}
                {messages.length < 3 && (
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {["Summarize the key themes", "Explain the methodology", "Create a quiz"].map((q) => (
                            <button
                                key={q}
                                onClick={() => handleSend(q)}
                                className="whitespace-nowrap px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-medium text-zinc-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="w-full bg-zinc-50 border border-zinc-200 pl-4 pr-12 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500 rounded-xl transition-all shadow-inner"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
                    >
                        <FaPaperPlane className="h-3 w-3" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-zinc-400">NotebookLM can make mistakes. Please check sources.</p>
                </div>
            </div>
        </div>
    )
}
