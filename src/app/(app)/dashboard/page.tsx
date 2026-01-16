"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaPlus, FaBook, FaClock, FaBolt, FaFileUpload, FaBrain } from "react-icons/fa"
import Link from "next/link"
import { UploadModal } from "@/components/dashboard/UploadModal"
import { useAPI } from "@/hooks/useAPI"
import { useEffect } from "react"

export default function DashboardPage() {
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const { getNotebooks, getNotes, error } = useAPI() // Assuming getNotes added to hook
    const [stats, setStats] = useState({ notesCount: 0, notebooksCount: 0 })
    const [recentNotebooks, setRecentNotebooks] = useState<any[]>([])

    useEffect(() => {
        const loadData = async () => {
            const [notebooks, notes] = await Promise.all([
                getNotebooks(),
                getNotes()
            ])
            setStats({
                notesCount: notes ? notes.length : 0,
                notebooksCount: notebooks ? notebooks.length : 0
            })
            // Sort by updated_at desc and take top 4
            if (notebooks) {
                const sorted = [...notebooks].sort((a, b) =>
                    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                ).slice(0, 4)
                setRecentNotebooks(sorted)
            }
        }
        loadData()
    }, [])

    return (
        <div className="space-y-6">
            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error loading dashboard: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="flex items-center justify-between border-b border-zinc-200 pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter uppercase mb-1">Welcome back, Scholar</h2>
                    <p className="text-zinc-500 text-sm">Review your latest activity and metrics.</p>
                </div>
                <Link href="/notebooks">
                    <Button className="gap-2">
                        <FaBook className="h-3 w-3" /> MY NOTEBOOKS
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900 border-zinc-900 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total Notebooks</CardTitle>
                        <FaBook className="h-4 w-4 text-white" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">{stats.notebooksCount}</div>
                        <p className="text-xs font-medium text-zinc-400 mt-1">ACTIVE WORKSPACES</p>
                    </CardContent>
                </Card>

                <Card className="border-black bg-zinc-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total Notes</CardTitle>
                        <FaBook className="h-4 w-4 text-black" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tighter">{stats.notesCount}</div>
                        <p className="text-xs font-medium text-zinc-500 mt-1">GENERATED AI NOTES</p>
                    </CardContent>
                </Card>
                {/* Add more metrics if needed */}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-widest">Recent Notebooks</h3>
                        <Link href="/notebooks" className="text-xs font-bold uppercase tracking-wide border-b border-black pb-0.5 hover:border-transparent transition-all">
                            View all
                        </Link>
                    </div>

                    {recentNotebooks.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recentNotebooks.map(nb => (
                                <Link key={nb.id} href={`/notebook/${nb.id}`}>
                                    <div className="p-4 border border-zinc-200 rounded-lg hover:border-black transition-colors cursor-pointer bg-white group">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                                                <FaBook className="w-4 h-4" />
                                            </div>
                                            <h4 className="font-bold text-sm truncate">{nb.title}</h4>
                                        </div>
                                        <p className="text-xs text-zinc-500">{new Date(nb.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 border border-dashed border-zinc-300 bg-zinc-50 text-center">
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">No notebooks yet</p>
                            <p className="text-zinc-400 text-xs mb-6">Create your first notebook to get started</p>
                            <Link href="/notebooks">
                                <Button className="gap-2">
                                    <FaPlus className="h-3 w-3" /> CREATE NOTEBOOK
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Quick Actions</h3>
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12"
                                onClick={() => setIsUploadOpen(true)}
                            >
                                <FaFileUpload className="h-4 w-4" /> UPLOAD PDF
                            </Button>
                            <Link href="/quizzes" className="block">
                                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                                    <FaBrain className="h-4 w-4" /> GENERATE QUIZ
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <h3 className="text-sm font-bold uppercase tracking-widest pt-4">Study Streak</h3>
                    <Card className="bg-black text-white border-black">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-4xl font-bold tracking-tighter">0 DAYS</div>
                                <FaBolt className="h-6 w-6 text-yellow-400" />
                            </div>
                            <p className="text-zinc-400 text-xs uppercase tracking-wide font-medium">Start studying to build your streak!</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

