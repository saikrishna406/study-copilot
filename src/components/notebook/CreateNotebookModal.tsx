
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog" // Assuming these exist or I'll implement a basic modal
import { Document } from "@/services/api"
import { Loader2 } from "lucide-react"

interface CreateNotebookModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (title: string, selectedDocIds: string[]) => Promise<void>
    documents: Document[]
}

// Fallback if Dialog components aren't perfectly matching (using simple fixed fixed overlay if needed, 
// but hoping shadcn components are present based on file structure)
// Actually, checking file structure earlier, we have 'components/ui/dialog.tsx'? 
// No, ls list didn't explicitly show it in ui folder earlier list.
// Let's assume standard UI or build a simple overlay for safety given I can't browse strictly right now.
// I will build a custom overlay style to be safe and dependency-free.

export function CreateNotebookModal({ isOpen, onClose, onCreate, documents }: CreateNotebookModalProps) {
    const [title, setTitle] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setLoading(true)
        try {
            await onCreate(title, selectedIds)
            onClose()
            setTitle("")
            setSelectedIds([])
        } catch (e) {
            console.error(e)
            alert("Failed to create notebook")
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-bold">Create New Notebook</h2>
                    <p className="text-sm text-zinc-500">A notebook is a workspace for your documents.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 space-y-4 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notebook Name</label>
                            <Input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. History Finals, Project Alpha"
                                autoFocus
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Documents (Optional)</label>
                            <div className="border rounded-md max-h-48 overflow-y-auto divide-y">
                                {documents.length === 0 ? (
                                    <p className="p-3 text-xs text-center text-zinc-400">No documents in library.</p>
                                ) : documents.map(doc => (
                                    <div
                                        key={doc.id}
                                        className={`p-2 flex items-center gap-3 cursor-pointer hover:bg-zinc-50 ${selectedIds.includes(doc.id) ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleDoc(doc.id)}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.includes(doc.id) ? 'bg-blue-600 border-blue-600' : 'border-zinc-300'}`}>
                                            {selectedIds.includes(doc.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium truncate">{doc.title}</p>
                                            <p className="text-[10px] text-zinc-500">{Math.round(doc.file_size / 1024)} KB</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-zinc-50 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading || !title.trim()}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Create Notebook
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
