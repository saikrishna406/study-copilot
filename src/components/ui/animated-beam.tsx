"use client";

import { motion } from "motion/react";

export function AnimatedBeam({ className }: { className?: string }) {
    return (
        <div className={`w-full h-0.5 bg-slate-100 overflow-hidden ${className}`}>
            <motion.div
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                animate={{
                    x: ["-100%", "200%"],
                }}
                transition={{
                    duration: 2.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.5,
                }}
            />
        </div>
    );
}
