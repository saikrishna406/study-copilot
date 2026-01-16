'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Play, Sparkles, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <section className="relative w-full overflow-hidden bg-white pb-24 pt-10 dark:bg-slate-950">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent blur-[100px] dark:from-indigo-500/10"></div>
            </div>

            {/* Dot Pattern */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:opacity-20"></div>

            {/* Navigation */}
            <nav className="relative z-50 mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">StudyCopilot</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
                    <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</Link>
                    <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Changelog</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">Sign in</Link>
                    <Button className="h-9 px-4 rounded-full bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 shadow-lg shadow-indigo-500/20">
                        Get Started
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600">
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-16 lg:px-8 lg:pt-32 text-center">

                {/* Badge */}
                <div className="mb-8 inline-flex animate-fade-in-up items-center justify-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10 backdrop-blur-sm dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-300">
                    <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> New: GPT-4o Integration is live
                    </span>
                    <span className="mx-2 text-indigo-300 dark:text-indigo-700">|</span>
                    <Link href="#" className="flex items-center hover:underline">
                        Learn more <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                {/* Headline */}
                <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-slate-50 mb-8 [text-wrap:balance]">
                    Master your coursework with <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        AI-Powered Assistant
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                    Transform your PDFs into interactive study sessions. Generate quizzes, flashcards,
                    and summaries instantly. <span className="text-slate-900 dark:text-slate-200 font-medium">Join 50,000+ students studying smarter.</span>
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Button size="lg" className="h-12 px-8 rounded-full bg-slate-900 text-base hover:bg-slate-800 shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 dark:bg-slate-50 dark:text-slate-900">
                        Start Studying Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 rounded-full border-slate-200 bg-white/50 text-base text-slate-600 hover:bg-slate-50 backdrop-blur-sm dark:border-slate-800 dark:bg-white/5 dark:text-slate-300">
                        <Play className="mr-2 h-4 w-4 fill-current opacity-50" /> View Demo
                    </Button>
                </div>

                {/* 3D Dashboard Preview (SaaS Mockup) */}
                <div className="relative mx-auto max-w-5xl group perspective-1000">
                    {/* Glow behind the dashboard */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative rounded-xl border border-slate-200/50 bg-slate-50/50 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/50 lg:rounded-2xl ring-1 ring-white/50 dark:ring-white/10 transform transition-transform duration-500 hover:scale-[1.01]">
                        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-950">
                            {/* Mock Browser Top bar */}
                            <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                                <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                                <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                                <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                                <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate-400 shadow-sm dark:bg-slate-950 border border-slate-100 dark:border-slate-800 opacity-50">
                                    study-copilot.com/dashboard/biology-101
                                </div>
                            </div>
                            {/* Mock UI Content (Simplified Image or Div Structure) */}
                            <div className="bg-white dark:bg-slate-950 aspect-[16/10] w-full flex relative overflow-hidden">
                                {/* Sidebar Mock */}
                                <div className="w-64 border-r border-slate-100 bg-slate-50/30 p-4 hidden md:block dark:border-slate-800 dark:bg-slate-900/30">
                                    <div className="space-y-3">
                                        <div className="h-8 w-3/4 rounded-md bg-slate-200/50 dark:bg-slate-800"></div>
                                        <div className="h-4 w-1/2 rounded-md bg-slate-200/50 dark:bg-slate-800"></div>
                                        <div className="h-4 w-2/3 rounded-md bg-slate-200/50 dark:bg-slate-800"></div>
                                    </div>
                                    <div className="mt-8 space-y-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="h-4 w-4 rounded bg-slate-200 dark:bg-slate-800"></div>
                                                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-900"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Main Content Mock */}
                                <div className="flex-1 p-6 md:p-8 grid gap-6">
                                    <div className="flex justify-between items-center">
                                        <div className="h-8 w-64 rounded-lg bg-slate-100 dark:bg-slate-800"></div>
                                        <div className="h-8 w-24 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/20"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4 dark:bg-slate-900/50 dark:border-slate-800">
                                            <div className="h-full w-full bg-slate-100/50 rounded dark:bg-slate-800/50 animate-pulse"></div>
                                        </div>
                                        <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4 dark:bg-slate-900/50 dark:border-slate-800"></div>
                                    </div>
                                    <div className="flex-1 rounded-xl bg-slate-50 border border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 relative">
                                        <div className="absolute inset-4 rounded border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 dark:border-slate-800">
                                            <span className="text-sm font-medium">AI Chat & Notes Preview</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Company Logos */}
                <div className="mt-20 border-t border-slate-100 pt-10 dark:border-slate-900">
                    <p className="text-sm font-semibold text-slate-500 mb-6">TRUSTED BY STUDENTS AT TOP UNIVERSITIES</p>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-40 mix-blend-multiply dark:mix-blend-screen">
                        {/* Text placeholders for brands */}
                        <h3 className="text-xl font-serif font-bold tracking-tight">Stanford</h3>
                        <h3 className="text-xl font-serif font-bold tracking-tight text-slate-800 dark:text-slate-200 italic">Harvard</h3>
                        <h3 className="text-xl font-sans font-black tracking-tighter text-slate-700 dark:text-slate-300">MIT</h3>
                        <h3 className="text-xl font-serif font-bold tracking-tight text-slate-800 dark:text-slate-200">Berkeley</h3>
                        <h3 className="text-xl font-sans font-bold tracking-wide">OXFORD</h3>
                    </div>
                </div>

            </div>
        </section>
    );
}
