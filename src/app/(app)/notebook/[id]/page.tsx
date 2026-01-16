"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { useAPI } from "@/hooks/useAPI"
import { Document } from "@/services/api"
import { Loader2 } from "lucide-react"

// Import Panels
import { SourcesPanel } from "@/components/notebook/SourcesPanel"
import { ChatPanel } from "@/components/notebook/ChatPanel"
import { StudioPanel } from "@/components/notebook/StudioPanel"

const PdfViewer = dynamic(() => import("@/components/notebook/PdfViewer").then((mod) => mod.PdfViewer), {
    ssr: false,
    loading: () => <div className="flex-1 flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-zinc-300" /></div>
})

import { useRouter } from "next/navigation"

import { AddSourceModal } from "@/components/notebook/AddSourceModal"

export default function NotebookPage() {
    const params = useParams()
    const router = useRouter()
    const { getNotebook, getDocuments, updateNotebook, loading, error } = useAPI()
    const [notebook, setNotebook] = useState<any | null>(null)
    const [documents, setDocuments] = useState<Document[]>([]) // Attached docs
    const [allDocuments, setAllDocuments] = useState<Document[]>([]) // All library docs

    // UI State
    const [isSourcesOpen, setIsSourcesOpen] = useState(true)
    const [isStudioOpen, setIsStudioOpen] = useState(true)
    const [pendingAction, setPendingAction] = useState<string | null>(null)
    const [isAddSourceOpen, setIsAddSourceOpen] = useState(false)

    // PDF Viewer State
    const [isPdfOpen, setIsPdfOpen] = useState(false)
    const [pdfPage, setPdfPage] = useState(1)
    const [activePdfDoc, setActivePdfDoc] = useState<Document | null>(null)

    useEffect(() => {
        if (params.id) {
            loadNotebook(params.id as string)
        }
    }, [params.id])

    const loadNotebook = async (id: string) => {
        const nb = await getNotebook(id)
        if (nb) {
            setNotebook(nb)
            const allDocs = await getDocuments()
            setAllDocuments(allDocs)
            const nbDocs = allDocs.filter(d => nb.document_ids.includes(d.id))
            setDocuments(nbDocs)
        }
    }

    const handleAddDocuments = async (newDocIds: string[]) => {
        if (!notebook) return
        const updatedIds = [...new Set([...notebook.document_ids, ...newDocIds])]
        await updateNotebook(notebook.id, updatedIds)
        loadNotebook(notebook.id)
    }

    const handleCitationClick = (page: number) => {
        setPdfPage(page)
        setIsPdfOpen(true)
    }

    const handleSourceClick = (doc: Document) => {
        setActivePdfDoc(doc)
        setPdfPage(1)
        setIsPdfOpen(true)
    }

    const handleQuizClick = () => {
        if (documents.length > 0) {
            // For now just pass the first doc ID or handle multiple in quiz page
            router.push(`/quizzes?docId=${documents[0].id}`)
        }
    }

    if (loading && !notebook) return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-zinc-400" /></div>
    if (error) return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>
    if (!notebook) return null

    return (
        <div className="fixed top-16 left-64 right-0 bottom-0 flex overflow-hidden bg-zinc-50 font-sans shadow-inner">

            {/* Left Column: Sources */}
            <div className={`shrink-0 flex flex-col h-full border-r border-zinc-200 bg-zinc-50 z-10 transition-all duration-300 ease-in-out ${isSourcesOpen ? 'w-[280px]' : 'w-14'}`}>
                <SourcesPanel
                    documents={documents}
                    onSourceClick={(doc) => {
                        setActivePdfDoc(doc)
                        setPdfPage(1)
                        setIsPdfOpen(true)
                    }}
                    isOpen={isSourcesOpen}
                    onToggle={() => setIsSourcesOpen(!isSourcesOpen)}
                    onAddSource={() => setIsAddSourceOpen(true)}
                />
            </div>

            {/* Middle Column: Chat */}
            <div className="flex-1 min-w-0 flex flex-col h-full bg-white relative z-0">
                <ChatPanel
                    document={documents[0] || null}
                    onCitationClick={handleCitationClick}
                    triggerMessage={pendingAction}
                    onTriggerComplete={() => setPendingAction(null)}
                />
            </div>

            {/* Right Column: Studio */}
            <div className={`shrink-0 flex flex-col h-full border-l border-zinc-200 bg-zinc-50 z-10 transition-all duration-300 ease-in-out ${isStudioOpen ? 'w-[360px]' : 'w-14'}`}>
                <StudioPanel
                    isOpen={isStudioOpen}
                    onToggle={() => setIsStudioOpen(!isStudioOpen)}
                    onAction={setPendingAction}
                    onQuizClick={handleQuizClick}
                />
            </div>

            {/* PDF Viewer Overlay */}
            {isPdfOpen && activePdfDoc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
                        <PdfViewer
                            document={activePdfDoc}
                            targetPage={pdfPage}
                            onClose={() => setIsPdfOpen(false)}
                        />
                    </div>
                </div>
            )}

            <AddSourceModal
                isOpen={isAddSourceOpen}
                onClose={() => setIsAddSourceOpen(false)}
                onAdd={handleAddDocuments}
                documents={allDocuments}
                currentDocIds={notebook.document_ids}
            />
        </div>
    )
}
