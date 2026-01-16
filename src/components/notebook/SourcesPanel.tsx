import { Document } from "@/services/api"
import { Plus, Search, Globe, FileText, CheckSquare, Layers, FolderClosed, X } from "lucide-react"

interface SourcesPanelProps {
    documents: Document[]
    onSourceClick: (doc: Document) => void
    isOpen: boolean
    onToggle: () => void
    onAddSource?: () => void
}

export function SourcesPanel({ documents, onSourceClick, isOpen, onToggle, onAddSource }: SourcesPanelProps) {
    if (!isOpen) {
        return (
            <div className="h-full w-14 border-r border-zinc-200 bg-zinc-50 flex flex-col items-center py-4 gap-4 transition-all">
                <button
                    onClick={onToggle}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <FolderClosed className="w-5 h-5" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 border-r border-zinc-200">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-500">Sources</h2>
                <button onClick={onToggle} className="text-zinc-400 hover:text-zinc-600">
                    <span className="sr-only">Toggle Sidebar</span>
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content ... */}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">

                {/* Add Sources Box */}
                <div className="border border-zinc-200 rounded-xl bg-white p-3 shadow-sm space-y-3">
                    <button
                        onClick={() => onAddSource && onAddSource()}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add sources
                    </button>
                </div>

                {/* Search & Stats */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 px-1">
                        <span>Select all sources</span>
                        <CheckSquare className="w-3 h-3" />
                    </div>
                </div>

                {/* Sources List */}
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => onSourceClick(doc)}
                            className="bg-white border border-zinc-200 rounded-lg p-3 shadow-sm cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-red-50 rounded text-red-500 shrink-0">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-medium text-zinc-900 truncate group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                                    <p className="text-[10px] text-zinc-500 truncate mt-1">{doc.page_count} pages • PDF</p>
                                </div>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
