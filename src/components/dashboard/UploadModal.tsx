"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FaCloudUploadAlt, FaTimes, FaFilePdf, FaSpinner, FaCheckCircle } from "react-icons/fa"
import { useAPI } from "@/hooks/useAPI"
import { supabase } from "@/lib/supabase"

interface UploadModalProps {
    isOpen: boolean
    onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { uploadDocument, loading, error: apiError } = useAPI()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [uploadedDocId, setUploadedDocId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file)
            setUploadSuccess(false)
        } else if (file) {
            alert('Please select a PDF file')
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            fileInputRef.current?.click()
            return
        }

        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            setError('Please log in first to upload documents')
            return
        }

        setError(null) // Clear any previous errors
        const result = await uploadDocument(selectedFile)

        if (result) {
            setUploadSuccess(true)
            setUploadedDocId(result.id)

            // Redirect to notebook after 1 second
            setTimeout(() => {
                router.push(`/notebook/${result.id}`)
                onClose()
            }, 1500)
        } else if (apiError) {
            // Show the API error if upload failed
            setError(apiError)
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        setUploadSuccess(false)
        setUploadedDocId(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-zinc-200 shadow-2xl p-0 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Upload Document</h3>
                    <button onClick={onClose} className="text-zinc-400 hover:text-black transition-colors">
                        <FaTimes className="h-4 w-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div
                        className="border-2 border-dashed border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors flex flex-col items-center justify-center py-12 px-4 cursor-pointer group"
                        onClick={handleUpload}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center space-y-4">
                                <FaSpinner className="h-8 w-8 animate-spin text-black" />
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-wide">Uploading PDF...</p>
                                    <p className="text-xs text-zinc-500">Processing with AI</p>
                                </div>
                            </div>
                        ) : uploadSuccess ? (
                            <div className="flex flex-col items-center space-y-4">
                                <FaCheckCircle className="h-8 w-8 text-green-600" />
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-bold uppercase tracking-wide text-green-600">Upload Successful!</p>
                                    <p className="text-xs text-zinc-500">Opening notebook...</p>
                                </div>
                            </div>
                        ) : selectedFile ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="h-16 w-16 bg-white border border-zinc-200 flex items-center justify-center">
                                    <FaFilePdf className="h-8 w-8 text-red-500" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-bold uppercase tracking-wide">{selectedFile.name}</p>
                                    <p className="text-xs text-zinc-500">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleReset()
                                        }}
                                        className="text-xs text-zinc-500 hover:text-black underline"
                                    >
                                        Choose different file
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="h-16 w-16 bg-white border border-zinc-200 flex items-center justify-center mb-4 group-hover:border-black transition-colors">
                                    <FaCloudUploadAlt className="h-8 w-8 text-zinc-400 group-hover:text-black transition-colors" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-bold uppercase tracking-wide">Click to Upload PDF</p>
                                    <p className="text-xs text-zinc-500 max-w-[200px]">
                                        Support for .PDF files. Max size 10MB.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-zinc-50 px-4 py-3 border-t border-zinc-100 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="bg-white border-zinc-200 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-zinc-100"
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    {selectedFile && !uploadSuccess && (
                        <Button
                            onClick={handleUpload}
                            className="rounded-none text-xs font-bold uppercase tracking-widest"
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

