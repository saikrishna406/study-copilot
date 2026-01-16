import { Mic, Video, FileText, Zap, PieChart, Layers, Table, MoreVertical, Play, Calendar, X } from "lucide-react"

interface StudioPanelProps {
    isOpen: boolean
    onToggle: () => void
    onAction: (prompt: string) => void
    onQuizClick?: () => void
}

export function StudioPanel({ isOpen, onToggle, onAction, onQuizClick }: StudioPanelProps) {
    if (!isOpen) {
        return (
            <div className="h-full w-14 border-l border-zinc-200 bg-zinc-50 flex flex-col items-center py-4 gap-4 transition-all">
                <button
                    onClick={onToggle}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <Layers className="w-5 h-5" />
                </button>
                <div className="flex-1 w-full flex flex-col items-center gap-4">
                    <div className="h-px w-8 bg-zinc-200" />
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <Zap className="w-4 h-4 text-zinc-400" />
                    <PieChart className="w-4 h-4 text-zinc-400" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-l border-zinc-200">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-500">Studio</h2>
                <button onClick={onToggle} className="text-zinc-400 hover:text-zinc-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Grid of Tools */}
                <div className="grid grid-cols-2 gap-3">
                    <StudioCard
                        icon={FileText}
                        label="Reports"
                        color="text-yellow-500"
                        onClick={() => onAction("Summarize this document as a detailed report.")}
                    />
                    <StudioCard
                        icon={Zap}
                        label="Flashcards"
                        color="text-pink-500"
                        onClick={() => onAction("Create 5 study flashcards with questions and answers based on these documents.")}
                    />
                    <StudioCard
                        icon={PieChart}
                        label="Quiz"
                        color="text-orange-500"
                        highlight
                        onClick={() => onQuizClick && onQuizClick()}
                    />
                    <StudioCard
                        icon={Table}
                        label="Data Table"
                        color="text-gray-500"
                        onClick={() => onAction("Identify 5 key data points or dates from the text and present them in a markdown table.")}
                    />
                    <StudioCard icon={Video} label="Video Overview" color="text-blue-500" />
                </div>

            </div>
        </div>
    )
}

function StudioCard({ icon: Icon, label, color, highlight, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`
            bg-white border rounded-xl p-3 flex flex-col gap-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
            ${highlight ? 'border-orange-200 bg-orange-50/10' : 'border-zinc-200'}
        `}>
            <div className="flex justify-between items-start">
                <Icon className={`w-5 h-5 ${color}`} />
                <div className="bg-zinc-100 rounded-full p-1 hover:bg-zinc-200">
                    <MoreVertical className="w-3 h-3 text-zinc-400" />
                </div>
            </div>
            <p className="text-xs font-medium text-zinc-700">{label}</p>
        </div>
    )
}


