
"use client";

import { useState, useEffect } from "react";
import { PlannerForm } from "@/components/planner/PlannerForm";
import { CalendarView } from "@/components/planner/CalendarView";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { api } from "@/services/api";
import { PlusCircle, Loader2 } from "lucide-react";

export default function PlannerPage() {
    const [view, setView] = useState<'list' | 'create'>('list');
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const [activePlan, setActivePlan] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.access_token) {
                setToken(data.session.access_token);
                loadPlans(data.session.access_token);
            } else {
                setLoading(false);
                // Optionally redirect to login or show empty state
            }
        };
        init();
    }, []);

    const loadPlans = async (authToken: string) => {
        try {
            const userPlans = await api.getPlans(authToken);
            setPlans(userPlans);
            if (userPlans.length > 0) {
                // Determine active plan (e.g., most recent active one)
                // For MVP just taking the first one
                setActivePlan(userPlans[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePlanCreated = (newPlan: any) => {
        setPlans([newPlan, ...plans]);
        setActivePlan(newPlan);
        setView('list');
    };

    const handleTaskUpdate = async (dayNum: number, taskId: string, completed: boolean) => {
        if (!activePlan || !token) return;

        // Optimistic update
        const updatedPlan = { ...activePlan };
        const day = updatedPlan.plan.days.find((d: any) => d.day_number === dayNum);
        if (day) {
            const task = day.tasks.find((t: any) => t.id === taskId);
            if (task) {
                task.completed = completed;
                setActivePlan(updatedPlan);
            }
        }

        try {
            await api.updateTaskStatus(activePlan.id, dayNum, taskId, completed, token);
        } catch (e) {
            console.error("Failed to sync task update", e);
            // Revert on failure (omitted for brevity in MVP)
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!token) {
        return <div className="p-8 text-center">Please log in to use the planner.</div>;
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">AI Study Planner</h1>
                {view === 'list' && activePlan && (
                    <Button onClick={() => setView('create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Plan
                    </Button>
                )}
                {view === 'create' && (
                    <Button variant="ghost" onClick={() => setView('list')}>
                        Cancel
                    </Button>
                )}
            </div>

            {view === 'create' ? (
                <PlannerForm onSuccess={handlePlanCreated} />
            ) : (
                <>
                    {activePlan ? (
                        <div className="space-y-6">
                            {plans.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {plans.map(p => (
                                        <Button
                                            key={p.id}
                                            variant={activePlan.id === p.id ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setActivePlan(p)}
                                        >
                                            {p.title || `Plan ${p.created_at.split('T')[0]}`}
                                        </Button>
                                    ))}
                                </div>
                            )}
                            <CalendarView plan={activePlan} onUpdateTask={handleTaskUpdate} />
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
                            <h3 className="text-lg font-medium">No study plans yet</h3>
                            <p className="text-muted-foreground mb-4">Create your first AI-generated study schedule.</p>
                            <Button onClick={() => setView('create')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Plan
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
