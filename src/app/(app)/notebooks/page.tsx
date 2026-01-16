"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaBookOpen, FaSearch, FaPlus, FaTrash, FaLayerGroup } from "react-icons/fa"
import { useAPI } from "@/hooks/useAPI"
import { Document } from "@/services/api"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { CreateNotebookModal } from "@/components/notebook/CreateNotebookModal"

interface Notebook {
    id: string
    title: string
    document_ids: string[]
    created_at: string
    updated_at: string
}

export default function NotebooksPage() {
    const router = useRouter()
    const { getNotebooks, deleteNotebook, createNotebook, getDocuments, loading } = useAPI()
    const [notebooks, setNotebooks] = useState<Notebook[]>([])
    const [libDocuments, setLibDocuments] = useState<Document[]>([]) // For modal
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const [nb, docs] = await Promise.all([getNotebooks(), getDocuments()])
        setNotebooks(nb)
        setLibDocuments(docs)
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (confirm("Delete this notebook workspace? Documents will remain in your library.")) {
            await deleteNotebook(id)
            loadData() // Refresh
        }
    }

    const handleCreate = async (title: string, docIds: string[]) => {
        await createNotebook(title, docIds)
        loadData()
    }

    const filteredNotebooks = notebooks.filter(nb =>
        nb.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1">Notebooks</h2>
                    <p className="text-zinc-500 text-sm">Your study workspaces.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-3 w-3" />
                        <input
                            type="text"
                            placeholder="SEARCH NAMES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-4 py-2 text-xs font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none uppercase tracking-wide"
                        />
                    </div>
                    <Button className="h-[34px] gap-2" onClick={() => setIsCreateOpen(true)}>
                        <FaPlus className="h-3 w-3" /> NEW NOTEBOOK
                    </Button>
                </div>
            </div>

            {loading && notebooks.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                </div>
            ) : filteredNotebooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotebooks.map((nb) => (
                        <Card
                            key={nb.id}
                            onClick={() => router.push(`/notebook/${nb.id}`)}
                            className="cursor-pointer group hover:shadow-md transition-all border-zinc-200"
                        >
                            <CardContent className="p-5 flex items-start gap-4">
                                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                                    <FaBookOpen className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-zinc-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                                        {nb.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                                        <span className="flex items-center gap-1">
                                            <FaLayerGroup className="w-3 h-3" />
                                            {nb.document_ids.length} Sources
                                        </span>
                                        <span>•</span>
                                        <span>{formatDistanceToNow(new Date(nb.updated_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-zinc-300 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => handleDelete(e, nb.id)}
                                >
                                    <FaTrash className="h-3 w-3" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="p-16 border border-dashed border-zinc-300 bg-zinc-50 text-center">
                    <FaBookOpen className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">No notebooks yet</p>
                    <p className="text-zinc-400 text-xs mb-6">Create a notebook to bundle your sources.</p>
                    <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
                        <FaPlus className="h-3 w-3" /> CREATE NOTEBOOK
                    </Button>
                </div>
            )}

            <CreateNotebookModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreate}
                documents={libDocuments}
            />
        </div>
    )
}
