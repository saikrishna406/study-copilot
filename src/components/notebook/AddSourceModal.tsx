
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
// Using a custom overlay for consistency if shadcn dialog issues persist, but let's try to match CreateNotebookModal
import { Document } from "@/services/api"
import { Loader2, Plus, Check } from "lucide-react"

interface AddSourceModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (selectedDocIds: string[]) => Promise<void>
    documents: Document[]
    currentDocIds: string[]
}

export function AddSourceModal({ isOpen, onClose, onAdd, documents, currentDocIds }: AddSourceModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    // Reset selection when opening, excluding already added docs
    useEffect(() => {
        if (isOpen) {
            setSelectedIds([])
        }
    }, [isOpen])

    const availableDocs = documents.filter(doc => !currentDocIds.includes(doc.id))

    if (!isOpen) return null

    const handleSubmit = async () => {
        if (selectedIds.length === 0) return

        setLoading(true)
        try {
            await onAdd(selectedIds)
            onClose()
        } catch (e) {
            console.error(e)
            alert("Failed to update notebook")
        } finally {
            setLoading(false)
        }
    }

    const toggleDoc = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(d => d !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex justify-between items-center bg-zinc-50">
                    <h2 className="text-sm font-bold uppercase tracking-wide">Add Sources</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {availableDocs.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-zinc-500 text-sm">No new documents available.</p>
                            <p className="text-zinc-400 text-xs mt-1">Upload more to your Library first.</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {availableDocs.map(doc => (
                                <div
                                    key={doc.id}
                                    className={`p-3 flex items-center gap-3 cursor-pointer rounded-md transition-colors ${selectedIds.includes(doc.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-zinc-50 border border-transparent'}`}
                                    onClick={() => toggleDoc(doc.id)}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.includes(doc.id) ? 'bg-blue-600 border-blue-600' : 'border-zinc-300'}`}>
                                        {selectedIds.includes(doc.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate text-zinc-900">{doc.title}</p>
                                        <p className="text-[10px] text-zinc-500">{Math.round(doc.file_size / 1024)} KB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-zinc-50 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || selectedIds.length === 0} size="sm" className="gap-2">
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Add Selected
                    </Button>
                </div>
            </div>
        </div>
    )
}
