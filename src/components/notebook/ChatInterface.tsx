import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area" // Need to implement ScrollArea or use div
import { Send, Sparkles, FileText, BrainCircuit } from "lucide-react"

export function ChatInterface() {
    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 p-3 px-4 dark:border-slate-800">
                <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    AI Chat
                </h3>
                <Button variant="ghost" size="sm" className="h-8 text-xs">Clear Chat</Button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {/* Welcome Message */}
                <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Sparkles className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="space-y-2">
                        <div className="rounded-lg rounded-tl-none border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                            Hello! I've analyzed your documents. I can help you summarize them, create quizzes, or answer specific questions.
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-xs bg-white">
                                <FileText className="mr-1 h-3 w-3" /> Summarize
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-xs bg-white">
                                <BrainCircuit className="mr-1 h-3 w-3" /> Quiz me
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-b-xl">
                <div className="relative">
                    <Input
                        placeholder="Ask anything about your notes..."
                        className="pr-12 py-6"
                    />
                    <Button size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full" variant="ghost">
                        <Send className="h-4 w-4 text-indigo-600" />
                    </Button>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-slate-400">AI can make mistakes. Check important info.</p>
                </div>
            </div>
        </div>
    )
}
