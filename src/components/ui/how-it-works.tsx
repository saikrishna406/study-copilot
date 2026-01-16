"use client";

import { FaFileUpload, FaBrain, FaGraduationCap, FaArrowRight } from "react-icons/fa";
import { motion } from "motion/react";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const steps = [
    {
        icon: <FaFileUpload className="w-8 h-8 text-black" />,
        title: "Upload Materials",
        description: "Drag & drop your lecture slides, textbooks, or notes. We support PDF, PPTX, and more.",
    },
    {
        icon: <FaBrain className="w-8 h-8 text-black" />,
        title: "AI Analysis",
        description: "Our AI instantly processes your content, extracting key concepts and organizing them into bite-sized topics.",
    },
    {
        icon: <FaGraduationCap className="w-8 h-8 text-black" />,
        title: "Master It",
        description: "Study with auto-generated quizzes, flashcards, and summaries. Ace your exams with confidence.",
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
                        From Chaos to Clarity in 3 Steps
                    </h2>
                    <p className="text-lg text-slate-600">
                        StudyCopilot streamlines your workflow so you can spend less time organizing and more time learning.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <AnimatedBeam className="absolute top-12 left-0 hidden md:block -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div
                                className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-100 shadow-lg flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110 duration-300"
                            >
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>

                            {/* Mobile Connector Arrow */}
                            {index < steps.length - 1 && (
                                <div className="md:hidden mt-8 mb-4">
                                    <FaArrowRight className="w-6 h-6 text-slate-300 transform rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
