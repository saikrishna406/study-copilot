"use client"

import { FaSearch, FaBell } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function TopBar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                    Dashboard <span className="mx-2 text-zinc-300">/</span> Overview
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-64">
                    <FaSearch className="absolute left-3 top-3 h-3 w-3 text-zinc-400" />
                    <Input
                        type="search"
                        placeholder="SEARCH..."
                        className="h-9 w-full rounded-none border-zinc-200 bg-zinc-50 pl-9 text-xs placeholder:text-zinc-400 focus:border-black focus:ring-0"
                    />
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-none">
                    <FaBell className="h-4 w-4" />
                </Button>
                <div className="h-8 w-8 bg-zinc-200 border border-zinc-300" />
            </div>
        </header>
    )
}
