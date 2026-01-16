"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { FaMinus, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { supabase } from "@/lib/supabase"
import type { Document as ApiDocument } from "@/services/api"
import { ArrowLeft, Loader2 } from "lucide-react"

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    document: ApiDocument
    targetPage?: number
    onClose?: () => void
}

export function PdfViewer({ document, targetPage, onClose }: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    useEffect(() => {
        if (targetPage) {
            setPageNumber(targetPage)
        }
    }, [targetPage])

    useEffect(() => {
        if (document?.file_path) {
            // Get signed URL
            const getUrl = async () => {
                const { data } = await supabase.storage
                    .from("documents")
                    .createSignedUrl(document.file_path, 3600)
                setFileUrl(data?.signedUrl || null)
            }
            getUrl()
        }
    }, [document])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    return (
        <div className="flex flex-col h-full bg-zinc-100 border-r border-zinc-200">
            {/* Toolbar */}
            <div className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                {/* Left: Back Button & File Info */}
                <div className="flex items-center gap-3">
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 gap-1 pl-0 pr-3 text-zinc-500 hover:text-zinc-900"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Back</span>
                        </Button>
                    )}
                    <div className="h-4 w-px bg-zinc-200 mx-1" />
                    <h2 className="font-semibold text-sm text-zinc-800 truncate max-w-[200px]" title={document.title}>
                        {document.title}
                    </h2>
                </div>

                {/* Center: Page Navigation */}
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 p-1 rounded-md">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-sm text-zinc-500 hover:text-black"
                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                        disabled={pageNumber <= 1}
                    >
                        <FaChevronLeft className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold text-zinc-600 w-20 text-center select-none">
                        {pageNumber} / {numPages || '-'}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-sm text-zinc-500 hover:text-black"
                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || prev))}
                        disabled={pageNumber >= (numPages || 1)}
                    >
                        <FaChevronRight className="h-3 w-3" />
                    </Button>
                </div>

                {/* Right: Zoom Tools */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-black"
                        onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}
                    >
                        <FaMinus className="h-3 w-3" />
                    </Button>
                    <span className="text-xs font-bold text-zinc-600 w-12 text-center select-none">{Math.round(scale * 100)}%</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-zinc-500 hover:bg-zinc-50 hover:text-black"
                        onClick={() => setScale(s => Math.min(s + 0.1, 2.5))}
                    >
                        <FaPlus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* PDF Canvas Area */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-zinc-100/50">
                {/* Document Container */}
                <div className="bg-white shadow-lg border border-zinc-200">
                    {fileUrl ? (
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="h-[600px] w-[500px] flex items-center justify-center bg-white">
                                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                                </div>
                            }
                            error={
                                <div className="h-[200px] w-[300px] flex items-center justify-center text-red-500 text-xs font-bold uppercase">
                                    Failed to load PDF
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={true}
                                renderAnnotationLayer={true}
                                className="border-b border-zinc-100 last:border-0"
                            />
                        </Document>
                    ) : (
                        <div className="h-full w-[600px] flex items-center justify-center bg-white">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
