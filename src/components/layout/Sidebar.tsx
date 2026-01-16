"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FaChartLine,
    FaBook,
    FaBookOpen,
    FaCalendarAlt,
    FaBrain,
    FaCog,
    FaGem
} from "react-icons/fa"

import { cn } from "@/lib/utils"

const sidebarItems = [
    {
        title: "DASHBOARD",
        href: "/dashboard",
        icon: FaChartLine,
    },
    {
        title: "MY LIBRARY",
        href: "/library",
        icon: FaBook,
    },
    {
        title: "NOTEBOOKS",
        href: "/notebooks",
        icon: FaBookOpen,
    },
    {
        title: "PLANNER",
        href: "/planner",
        icon: FaCalendarAlt,
    },
    {
        title: "QUIZZES",
        href: "/quizzes",
        icon: FaBrain,
    },
    {
        title: "SETTINGS",
        href: "/settings",
        icon: FaCog,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
            <div className="flex h-16 items-center border-b border-zinc-200 px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-black text-white rounded-none">
                        <FaChartLine size={16} />
                    </div>
                    <span className="text-lg font-bold tracking-tighter text-black uppercase">StudyCopilot</span>
                </Link>
            </div>
            <div className="flex flex-col gap-1 p-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-none px-4 py-3 text-xs font-bold tracking-widest transition-all",
                                isActive
                                    ? "bg-black text-white hover:bg-zinc-800"
                                    : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
                <div className="border border-zinc-200 bg-zinc-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[8px] text-white">
                            <FaGem />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-black">Free Plan</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-500">Upgrade for unlimited AI queries.</p>
                </div>
            </div>
        </aside>
    )
}
