"use client"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaBook, FaSearch, FaFilter, FaPlus, FaFilePdf, FaTrash } from "react-icons/fa"
import { useAPI } from "@/hooks/useAPI"
import { Document } from "@/services/api"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth" // Assuming this or supabase direct

export default function LibraryPage() {
    const { getDocuments, deleteDocument, uploadDocument, loading } = useAPI()
    const [documents, setDocuments] = useState<Document[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        loadDocuments()
    }, [])

    const loadDocuments = async () => {
        const docs = await getDocuments()
        setDocuments(docs)
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                await uploadDocument(e.target.files[0])
                loadDocuments()
            } catch (err) {
                console.error("Upload failed", err)
                alert("Upload failed")
            }
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Delete this document? It will be removed from all notebooks.")) {
            await deleteDocument(id)
            loadDocuments()
        }
    }

    const filteredDocs = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1">My Library</h2>
                    <p className="text-zinc-500 text-sm">Manage your documents (PDFs) here.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-3 w-3" />
                        <input
                            type="text"
                            placeholder="SEARCH DOCUMENTS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 pl-9 pr-4 py-2 text-xs font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all rounded-none uppercase tracking-wide"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleUpload}
                        />
                        <Button className="h-[34px] gap-2">
                            <FaPlus className="h-3 w-3" /> UPLOAD PDF
                        </Button>
                    </div>
                </div>
            </div>

            {loading && documents.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                </div>
            ) : filteredDocs.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDocs.map((doc) => (
                        <Card key={doc.id} className="group hover:shadow-md transition-all border-zinc-200">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                                    <FaFilePdf className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-zinc-900 truncate mb-1" title={doc.title}>
                                        {doc.title}
                                    </h3>
                                    <div className="flex flex-col text-xs text-zinc-500 gap-0.5">
                                        <span>{doc.file_size ? Math.round(doc.file_size / 1024) + ' KB' : 'Unknown Size'}</span>
                                        <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2 border-t border-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        className="text-zinc-400 hover:text-red-500 text-xs flex items-center gap-1"
                                    >
                                        <FaTrash className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="p-16 border border-dashed border-zinc-300 bg-zinc-50 text-center">
                    <FaBook className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">Likely empty library</p>
                    <p className="text-zinc-400 text-xs mb-6">Upload PDFs to reuse in multiple notebooks</p>
                    <div className="relative inline-block">
                        <input
                            type="file"
                            accept=".pdf"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleUpload}
                        />
                        <Button className="gap-2">
                            <FaPlus className="h-3 w-3" /> UPLOAD DOCUMENT
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
