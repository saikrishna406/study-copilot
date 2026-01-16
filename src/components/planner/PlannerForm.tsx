
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Calendar as CalendarIcon, BookOpen } from "lucide-react";
import { api } from "@/services/api";
import { supabase } from "@/lib/supabase";

export function PlannerForm({ onSuccess }: { onSuccess: (plan: any) => void }) {
    const [loading, setLoading] = useState(false);
    const [documents, setDocuments] = useState<any[]>([]);
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [examDate, setExamDate] = useState("");
    const [hours, setHours] = useState(2);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.access_token) {
                setToken(data.session.access_token);
                try {
                    const docs = await api.getDocuments(data.session.access_token);
                    setDocuments(docs);
                } catch (err) {
                    console.error("Failed to load docs", err);
                }
            }
        };
        init();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!examDate || selectedDocs.length === 0 || !token) return;

        setLoading(true);
        try {
            const plan = await api.generateStudyPlan(
                selectedDocs,
                token,
                examDate,
                hours
            );
            onSuccess(plan);
        } catch (err) {
            console.error(err);
            alert("Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create New Study Plan</CardTitle>
                <CardDescription>Select documents and set your exam date.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Documents</label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                            {documents.length === 0 && <p className="text-xs text-muted-foreground p-2">No documents found. Upload some first.</p>}
                            {documents.map((doc) => (
                                <div key={doc.id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`doc-${doc.id}`}
                                        checked={selectedDocs.includes(doc.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedDocs([...selectedDocs, doc.id]);
                                            else setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor={`doc-${doc.id}`} className="text-sm truncate cursor-pointer flex-1">
                                        {doc.title}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Exam Date</label>
                            <Input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hours / Day</label>
                            <Input
                                type="number"
                                min={1}
                                max={12}
                                value={hours}
                                onChange={(e) => setHours(parseInt(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || selectedDocs.length === 0 || !examDate}>
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BookOpen className="w-4 h-4 mr-2" />}
                        Generate Plan
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}
