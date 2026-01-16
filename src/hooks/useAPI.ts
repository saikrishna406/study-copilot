/**
 * Custom React hooks for API calls
 */
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { api, type Document, type ChatResponse } from '@/services/api';

export function useAPI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            throw new Error('Not authenticated');
        }
        return session.access_token;
    };

    const uploadDocument = async (file: File): Promise<Document | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.uploadDocument(file, token);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getDocuments = async (): Promise<Document[]> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.getDocuments(token);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch documents';
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await api.deleteDocument(documentId, token);
            return true;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete document';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const chatQuery = async (
        documentIds: string[],
        message: string,
        sessionId?: string
    ): Promise<ChatResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.chatQuery(documentIds, message, token, sessionId);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Chat query failed';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const generateNotes = async (documentIds: string[], topic?: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.generateNotes(documentIds, token, topic);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate notes';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getNotes = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            return await api.getNotes(token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notes');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async (
        documentIds: string[],
        numQuestions: number = 5,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium'
    ) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.generateQuiz(documentIds, token, numQuestions, difficulty);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to generate quiz';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getDocument = async (documentId: string): Promise<Document | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const result = await api.getDocument(documentId, token);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch document';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Notebooks
    const getNotebooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            return await api.getNotebooks(token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notebooks');
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createNotebook = async (title: string, documentIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await api.createNotebook(title, documentIds, token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create notebook');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getNotebook = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            return await api.getNotebook(id, token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notebook');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateNotebook = async (id: string, documentIds: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await api.updateNotebook(id, documentIds, token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update notebook');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteNotebook = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            await api.deleteNotebook(id, token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete notebook');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        uploadDocument,
        getDocuments,
        getDocument,
        deleteDocument,
        chatQuery,
        generateNotes,
        getNotes,
        generateQuiz,
        getNotebooks,
        createNotebook,
        getNotebook,
        updateNotebook,
        deleteNotebook,
    };
}
