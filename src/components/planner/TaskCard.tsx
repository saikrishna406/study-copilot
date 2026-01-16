
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
    id: string;
    description: string;
    duration_minutes: number;
    type: string;
    completed?: boolean;
}

interface TaskCardProps {
    task: Task;
    onToggle: (taskId: string, completed: boolean) => void;
    isLoading?: boolean;
}

export function TaskCard({ task, onToggle, isLoading }: TaskCardProps) {
    const [completed, setCompleted] = useState(task.completed || false);

    const handleToggle = () => {
        if (isLoading) return;
        const newState = !completed;
        setCompleted(newState);
        onToggle(task.id, newState);
    };

    return (
        <Card
            onClick={handleToggle}
            className={cn(
                "cursor-pointer hover:bg-slate-50 transition-colors border-l-4",
                completed ? "border-l-green-500 bg-slate-50 opacity-70" : "border-l-blue-500"
            )}
        >
            <CardContent className="p-4 flex items-start gap-3">
                <button
                    className={cn("mt-1 shrink-0", isLoading && "opacity-50")}
                    disabled={isLoading}
                >
                    {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                    )}
                </button>
                <div className="flex-1">
                    <p className={cn("text-sm font-medium leading-none", completed && "line-through text-slate-500")}>
                        {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.duration_minutes}m
                        </span>
                        <span className="px-1.5 py-0.5 rounded-full bg-slate-100 uppercase tracking-tighter text-[10px]">
                            {task.type}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
