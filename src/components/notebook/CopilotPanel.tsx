"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FaPaperPlane, FaMagic, FaBookOpen, FaList, FaBolt, FaCopy, FaFilePdf, FaChevronDown, FaQuoteRight, FaLayerGroup } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { useAPI } from "@/hooks/useAPI"
import type { Document } from "@/services/api"
import { Loader2 } from "lucide-react"

const TABS = [
    { id: "chat", label: "CHAT", icon: FaMagic },
    { id: "notes", label: "NOTES", icon: FaBookOpen },
    { id: "quiz", label: "QUIZ", icon: FaBolt },
    { id: "summary", label: "SUMMARY", icon: FaList },
]

interface CopilotPanelProps {
    document: Document
}

export function CopilotPanel({ document }: CopilotPanelProps) {
    const [activeTab, setActiveTab] = useState("chat")

    return (
        <div className="flex flex-col h-full bg-white border-l border-zinc-200 w-full max-w-md">
            {/* Tabs */}
            <div className="flex items-center border-b border-zinc-200 shrink-0">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-1.5 transition-all outline-none
                        ${activeTab === tab.id
                                ? "bg-black text-white"
                                : "text-zinc-400 hover:text-black hover:bg-zinc-50"}`}
                    >
                        <tab.icon className="h-3 w-3" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 scroll-smooth">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === "chat" && <ChatTab document={document} />}
                        {activeTab === "notes" && <NotesTab document={document} />}
                        {activeTab === "quiz" && <QuizTab document={document} />}
                        {activeTab === "summary" && <SummaryTab document={document} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

function ChatTab({ document }: { document: Document }) {
    const { chatQuery, loading } = useAPI()
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: `Hello! I've analyzed **${document.title}**. What would you like to know?` }
    ])
    const [input, setInput] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async (text: string = input) => {
        if (!text.trim() || loading) return

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
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }])
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 space-y-6 pb-4 overflow-y-auto">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-8 w-8 rounded-none flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-black text-white' : 'bg-zinc-200'}`}>
                            {msg.role === 'assistant' ? <FaMagic className="h-4 w-4" /> : <FaUserPlaceholder />}
                        </div>
                        <div className={`space-y-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`${msg.role === 'assistant' ? 'bg-white border border-zinc-200' : 'bg-black text-white'} p-3 rounded-none shadow-sm`}>
                                <div className={`text-sm leading-relaxed font-medium ${msg.role === 'assistant' ? 'text-zinc-800' : 'text-white'} whitespace-pre-wrap`}>
                                    {msg.content}
                                </div>
                            </div>
                            {msg.sources && msg.sources.length > 0 && (
                                <SourcesAccordion source={`Source Chunks (${msg.sources.length})`} />
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-none bg-black flex items-center justify-center shrink-0 animate-pulse">
                            <FaMagic className="h-4 w-4 text-white" />
                        </div>
                        <div className="space-y-2 max-w-[85%] w-full">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-zinc-200 bg-white -mx-4 px-4 sticky bottom-0">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {["Explain this page", "Summarize", "Key Concepts"].map((action) => (
                        <button key={action} onClick={() => handleSend(action)} className="whitespace-nowrap px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:border-black hover:text-black transition-colors rounded-none outline-none">
                            {action}
                        </button>
                    ))}
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="w-full bg-white border border-zinc-200 pl-4 pr-12 py-3 text-sm font-medium focus:outline-none focus:border-black rounded-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button onClick={() => handleSend()} disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-black transition-colors">
                        <FaPaperPlane className="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function NotesTab({ document }: { document: Document }) {
    const { generateNotes, loading } = useAPI()
    const [notes, setNotes] = useState<string | null>(null)

    const handleGenerate = async () => {
        const result = await generateNotes([document.id])
        if (result) setNotes(result.content)
    }

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>

    if (!notes) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-12 opacity-80">
                <div className="h-20 w-20 bg-zinc-50 rounded-full border border-zinc-200 flex items-center justify-center">
                    <FaLayerGroup className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-black uppercase tracking-widest text-lg">No Notes Yet</h4>
                    <p className="text-xs text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                        Generate comprehensive study notes for this document.
                    </p>
                </div>
                <Button onClick={handleGenerate} className="bg-black text-white hover:bg-zinc-800 rounded-none uppercase text-[10px] font-bold tracking-widest px-8 py-6 h-auto">
                    Generate Notes
                </Button>
            </div>
        )
    }

    return (
        <div className="prose prose-sm max-w-none p-4 bg-white border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100">
                <h3 className="text-sm font-black uppercase tracking-widest m-0">Study Notes</h3>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(notes)}><FaCopy className="h-3 w-3" /></Button>
            </div>
            <div className="whitespace-pre-wrap text-zinc-600 text-xs leading-relaxed">
                {notes}
            </div>
        </div>
    )
}

function QuizTab({ document }: { document: Document }) {
    const { generateQuiz, loading } = useAPI()
    const [quiz, setQuiz] = useState<any>(null)

    const handleGenerate = async () => {
        const result = await generateQuiz([document.id], 5, 'medium')
        if (result) setQuiz(result)
    }

    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 pt-12 opacity-80">
                <div className="h-20 w-20 bg-zinc-50 rounded-full border border-zinc-200 flex items-center justify-center">
                    <FaBolt className="h-8 w-8 text-zinc-300" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-black uppercase tracking-widest text-lg">Knowledge Check</h4>
                    <p className="text-xs text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                        Create a quiz to test your understanding.
                    </p>
                </div>
                <Button onClick={handleGenerate} className="bg-black text-white hover:bg-zinc-800 rounded-none uppercase text-[10px] font-bold tracking-widest px-8 py-6 h-auto">
                    Generate Quiz
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-2">
            {quiz.questions.map((q: any, i: number) => (
                <Card key={i} className="rounded-none border-zinc-200 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                        <p className="text-xs font-bold text-black border-b border-zinc-100 pb-2">Q{i + 1}: {q.question}</p>
                        <div className="space-y-1">
                            {q.options.map((opt: string, idx: number) => (
                                <div key={idx} className={`p-2 text-xs border border-transparent hover:bg-zinc-50 cursor-pointer transition-colors ${idx === q.correct_answer ? 'text-green-600 font-bold' : 'text-zinc-600'}`}>
                                    {["A", "B", "C", "D"][idx]}. {opt}
                                </div>
                            ))}
                        </div>
                        <div className="text-[10px] text-zinc-400 pt-2 italic">
                            Ans: {["A", "B", "C", "D"][q.correct_answer]} - {q.explanation}
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button onClick={() => setQuiz(null)} variant="outline" className="w-full text-xs uppercase font-bold tracking-widest">Reset Quiz</Button>
        </div>
    )
}

function SummaryTab({ document }: { document: Document }) {
    return (
        <div className="space-y-4">
            <Card className="border-black shadow-none rounded-none bg-white">
                <CardContent className="p-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-black mb-4 border-b border-zinc-100 pb-2">Document Summary</h4>
                    <div className="text-xs text-zinc-600 font-medium leading-relaxed whitespace-pre-wrap">
                        {document.summary || "No summary available for this document."}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const FaUserPlaceholder = () => (
    <svg className="h-4 w-4 text-zinc-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
)

const SourcesAccordion = ({ source }: { source: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-zinc-100 bg-zinc-50/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
                <span className="flex items-center gap-1"><FaQuoteRight className="h-2 w-2" /> Sources</span>
                <FaChevronDown className={`h-2 w-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-2 border-t border-zinc-100 text-[9px] text-zinc-500">
                            {source}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}


