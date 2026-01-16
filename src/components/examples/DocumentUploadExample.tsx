/**
 * Example: Document Upload Component using Backend API
 * Replace your existing upload logic with this
 */
'use client';

import { useState } from 'react';
import { useAPI } from '@/hooks/useAPI';
import { Button } from '@/components/ui/button';
import { FaUpload, FaSpinner } from 'react-icons/fa';

export function DocumentUploadExample() {
    const { uploadDocument, loading, error } = useAPI();
    const [success, setSuccess] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.pdf')) {
            alert('Please upload a PDF file');
            return;
        }

        // Upload to backend
        const result = await uploadDocument(file);

        if (result) {
            setSuccess(true);
            console.log('Document uploaded:', result);
            // Optionally refresh document list or navigate
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="hidden"
                    id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                    <Button
                        as="span"
                        disabled={loading}
                        className="cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <FaUpload className="mr-2" />
                                Upload PDF
                            </>
                        )}
                    </Button>
                </label>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
                    Document uploaded successfully! Processing in background...
                </div>
            )}
        </div>
    );
}
