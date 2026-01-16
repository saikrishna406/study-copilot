"use client";

import { Box, Lock, Search, Settings, Sparkles, BookOpen, BrainCircuit, Calendar, FileText } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
    return (
        <div className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything you need to study smarter
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        Let AI organize your materials so you can focus on learning.
                    </p>
                </div>
                <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                    <GridItem
                        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                        icon={<BookOpen className="h-4 w-4 text-black" />}
                        title="Chat with PDFs"
                        description="Upload any lecture slide or textbook and ask questions directly. It's like having a tutor 24/7."
                    />
                    <GridItem
                        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                        icon={<BrainCircuit className="h-4 w-4 text-black" />}
                        title="Generate Quizzes"
                        description="Turn your notes into exam-ready multiple choice questions. Test your knowledge instantly."
                    />
                    <GridItem
                        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                        icon={<Sparkles className="h-4 w-4 text-black" />}
                        title="Smart Summaries"
                        description="Get AI-generated summaries and concept flashcards in seconds. Never miss a key detail."
                    />
                    <GridItem
                        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                        icon={<Calendar className="h-4 w-4 text-black" />}
                        title="Study Planner"
                        description="Auto-generate study schedules based on your exam dates and syllabus."
                    />
                    <GridItem
                        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                        icon={<FileText className="h-4 w-4 text-black" />}
                        title="Flashcards"
                        description="Create deck of flashcards from your notes and practice with spaced repetition."
                    />
                </ul>
            </div>
        </div>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            {/* Removed dark mode styling for the outer container */}
            <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-slate-200 p-2 md:rounded-[1.5rem] md:p-3 bg-white">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                {/* Removed dark mode styling for the inner container */}
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-white border-slate-100 p-6 shadow-sm md:p-6">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        {/* Removed dark mode styling for the icon container */}
                        <div className="w-fit rounded-lg border-[0.75px] border-slate-200 bg-slate-50 p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            {/* Removed dark mode styling for text */}
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-slate-900">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-slate-500">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
