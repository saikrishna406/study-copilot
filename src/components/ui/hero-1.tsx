"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import { ReactNode } from "react"

interface HeroProps {
    eyebrow?: string
    title: string | ReactNode
    subtitle: string
    ctaLabel?: string
    ctaHref?: string
}

export function Hero({
    eyebrow = "Innovate Without Limits",
    title,
    subtitle,
    ctaLabel = "Explore Now",
    ctaHref = "#",
}: HeroProps) {
    return (
        <section
            id="hero"
            className="relative mx-auto w-full pt-32 px-6 text-center md:px-8 
      min-h-screen flex flex-col justify-center items-center overflow-hidden 
      bg-white"
        >
            {/* Grid BG */}
            <div
                className="absolute -z-10 inset-0 opacity-60 h-[600px] w-full 
        bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
            />

            {/* Radial Accent - Grayscale */}
            <div
                className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%] 
        -translate-x-1/2 rounded-[100%] border-zinc-200/50 bg-white 
        bg-[radial-gradient(closest-side,#fff_82%,#000000)] 
        animate-fade-up opacity-20"
            />

            {/* Eyebrow */}
            {eyebrow && (
                <a href="#" className="group">
                    <span
                        className="text-xs font-bold font-mono tracking-widest text-zinc-900 mx-auto px-4 py-1.5 
            border border-black 
            rounded-none w-fit uppercase flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors"
                    >
                        {eyebrow}
                    </span>
                </a>
            )}

            {/* Title */}
            <h1
                className="animate-fade-in mt-8 -translate-y-4 text-balance 
        py-2 text-5xl font-extrabold leading-[0.95] tracking-tighter 
        text-zinc-950 opacity-0 sm:text-7xl md:text-8xl lg:text-[6.5rem]"
            >
                {title}
            </h1>

            {/* Subtitle */}
            <p
                className="animate-fade-in mt-6 mb-12 -translate-y-4 text-balance 
        text-lg font-normal tracking-tight text-slate-500 
        opacity-0 md:text-2xl md:leading-normal max-w-3xl mx-auto"
            >
                {subtitle}
            </p>

            {/* CTA */}
            {ctaLabel && (
                <div className="flex justify-center opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards]">
                    <Button
                        asChild
                        size="lg"
                        className="h-12 px-8 rounded-full text-base font-medium font-sans tracking-tight bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200/50 transition-all hover:scale-105"
                    >
                        <a href={ctaHref}>{ctaLabel}</a>
                    </Button>
                </div>
            )}

            {/* Bottom Fade */}
            <div
                className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,white_20%,transparent)]"
            />
        </section>
    )
}
