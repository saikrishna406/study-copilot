
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";
import { motion } from "framer-motion";

interface Plan {
    id: string;
    title: string;
    start_date: string;
    exam_date: string;
    plan: {
        days: DayPlan[];
    };
    status: string;
}

interface DayPlan {
    day_number: number;
    date: string;
    topics: string[];
    tasks: Task[];
}

interface Task {
    id: string;
    description: string;
    duration_minutes: number;
    type: string;
    completed?: boolean;
}

interface CalendarViewProps {
    plan: Plan;
    onUpdateTask: (dayNum: number, taskId: string, completed: boolean) => void;
}

export function CalendarView({ plan, onUpdateTask }: CalendarViewProps) {
    if (!plan || !plan.plan?.days) return <div>No plan data available</div>;

    const days = plan.plan.days;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">{plan.title || "Your Study Plan"}</h2>
                    <p className="text-muted-foreground text-sm">
                        Goal: Exam on {plan.exam_date} • {plan.start_date && `Started: ${plan.start_date}`}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {days.map((day) => (
                    <motion.div
                        key={day.day_number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: day.day_number * 0.05 }}
                    >
                        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-3 bg-slate-100 border-b flex justify-between items-center">
                                <span className="font-bold text-sm">Day {day.day_number}</span>
                                <span className="text-xs text-slate-500 font-mono">
                                    {day.date || "Date TBD"}
                                </span>
                            </div>
                            <CardContent className="p-3 flex-1 flex flex-col gap-3">
                                {day.topics && day.topics.length > 0 && (
                                    <div className="mb-2">
                                        <div className="flex flex-wrap gap-1">
                                            {day.topics.map((t, i) => (
                                                <span key={i} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {day.tasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onToggle={(taskId, completed) => onUpdateTask(day.day_number, taskId, completed)}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
