/**
 * API Client for StudyCopilot Backend
 * Handles all communication with FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface Document {
    id: string;
    user_id: string;
    title: string;
    file_path: string;
    file_size: number;
    page_count?: number;
    status: 'processing' | 'ready' | 'failed';
    created_at: string;
    updated_at: string;
    summary?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{ chunk_id: string; similarity: number }>;
}

export interface ChatResponse {
    session_id: string;
    message: string;
    sources: Array<{ chunk_id: string; similarity: number }>;
}

class APIClient {
    private getAuthHeaders(token: string) {
        return {
            'Authorization': `Bearer ${token}`,
        };
    }

    // Documents
    async uploadDocument(file: File, token: string): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: 'POST',
            headers: this.getAuthHeaders(token),
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return response.json();
    }

    async getDocuments(token: string): Promise<Document[]> {
        const response = await fetch(`${API_BASE_URL}/documents`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch documents: ${response.statusText}`);
        }

        return response.json();
    }

    async getDocument(documentId: string, token: string): Promise<Document> {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        return response.json();
    }

    async deleteDocument(documentId: string, token: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to delete document: ${response.statusText}`);
        }
    }

    // Chat
    async chatQuery(
        documentIds: string[],
        message: string,
        token: string,
        sessionId?: string
    ): Promise<ChatResponse> {
        const response = await fetch(`${API_BASE_URL}/chat/query`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document_ids: documentIds,
                message,
                session_id: sessionId,
            }),
        });

        if (!response.ok) {
            throw new Error(`Chat query failed: ${response.statusText}`);
        }

        return response.json();
    }

    async getChatSessions(token: string) {
        const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch chat sessions: ${response.statusText}`);
        }

        return response.json();
    }

    async getChatSession(sessionId: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch chat session: ${response.statusText}`);
        }

        return response.json();
    }

    async generateNotes(documentIds: string[], token: string, topic?: string) {
        const response = await fetch(`${API_BASE_URL}/notes/generate`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document_ids: documentIds, topic }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate notes: ${response.statusText}`);
        }

        return response.json();
    }

    async getNotes(token: string) {
        const response = await fetch(`${API_BASE_URL}/notes`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch notes: ${response.statusText}`);
        }

        return response.json();
    }

    async generateQuiz(
        documentIds: string[],
        token: string,
        numQuestions: number = 5,
        difficulty: 'easy' | 'medium' | 'hard' = 'medium'
    ) {
        const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document_ids: documentIds,
                num_questions: numQuestions,
                difficulty,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate quiz: ${response.statusText}`);
        }

        return response.json();
    }

    async generateSummary(
        documentIds: string[],
        token: string,
        length: 'short' | 'medium' | 'long' = 'medium'
    ) {
        const response = await fetch(`${API_BASE_URL}/summary/generate`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document_ids: documentIds, length }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate summary: ${response.statusText}`);
        }

        return response.json();
    }

    async generateStudyPlan(
        documentIds: string[],
        token: string,
        examDate: string,
        hoursPerDay: number = 2
    ) {
        const response = await fetch(`${API_BASE_URL}/planner/generate`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                document_ids: documentIds,
                exam_date: examDate,
                hours_per_day: hoursPerDay,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate study plan: ${response.statusText}`);
        }

        return response.json();
    }

    async getPlans(token: string) {
        const response = await fetch(`${API_BASE_URL}/planner`, {
            headers: this.getAuthHeaders(token),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch plans: ${response.statusText}`);
        }

        return response.json();
    }

    async updateTaskStatus(
        planId: string,
        dayNum: number,
        taskId: string,
        completed: boolean,
        token: string
    ) {
        const response = await fetch(`${API_BASE_URL}/planner/${planId}/days/${dayNum}/tasks/${taskId}?completed=${completed}`, {
            method: 'PATCH',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to update task: ${response.statusText}`);
        }

        return response.json();
    }

    // Notebooks (Workspaces)
    async createNotebook(title: string, documentIds: string[], token: string) {
        const response = await fetch(`${API_BASE_URL}/notebooks`, {
            method: 'POST',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, document_ids: documentIds }),
        });

        if (!response.ok) {
            throw new Error(`Failed to create notebook: ${response.statusText}`);
        }
        return response.json();
    }

    async getNotebooks(token: string) {
        const response = await fetch(`${API_BASE_URL}/notebooks`, {
            headers: this.getAuthHeaders(token),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch notebooks: ${response.statusText}`);
        }
        return response.json();
    }

    async updateNotebook(id: string, documentIds: string[], token: string) {
        const response = await fetch(`${API_BASE_URL}/notebooks/${id}`, {
            method: 'PATCH',
            headers: {
                ...this.getAuthHeaders(token),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ document_ids: documentIds }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update notebook: ${response.statusText}`);
        }
        return response.json();
    }

    async getNotebook(id: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/notebooks/${id}`, {
            headers: this.getAuthHeaders(token),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch notebook: ${response.statusText}`);
        }
        return response.json();
    }

    async deleteNotebook(id: string, token: string) {
        const response = await fetch(`${API_BASE_URL}/notebooks/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(token),
        });
        if (!response.ok) {
            throw new Error(`Failed to delete notebook: ${response.statusText}`);
        }
        return response.json();
    }
}

export const api = new APIClient();
