"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FaUser, FaLock, FaBell, FaGlobe, FaSave, FaSignOutAlt } from "react-icons/fa"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 w-full">
            <div className="border-b border-zinc-200 pb-6">
                <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Account Settings</h2>
                <p className="text-zinc-500 text-sm font-medium">Manage your profile details and preferences.</p>
            </div>

            <div className="grid gap-12 lg:grid-cols-12">
                {/* Settings Sidebar */}
                <nav className="flex flex-col space-y-1 lg:col-span-3">
                    {[
                        { name: "Profile", icon: FaUser, active: true },
                        { name: "Security", icon: FaLock, active: false },
                        { name: "Notifications", icon: FaBell, active: false },
                        { name: "Language", icon: FaGlobe, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest text-left transition-all border-l-4
                            ${item.active
                                    ? "border-black bg-zinc-50 text-black"
                                    : "border-transparent text-zinc-500 hover:text-black hover:bg-zinc-50"}`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </button>
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest text-left transition-all border-l-4 border-transparent text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <FaSignOutAlt className="h-4 w-4" />
                        Log Out
                    </button>
                </nav>

                {/* Settings Content */}
                <div className="lg:col-span-9 space-y-8">
                    <Card className="border-zinc-200 rounded-none shadow-sm">
                        <CardHeader className="border-b border-zinc-100 pb-6 p-8">
                            <CardTitle className="text-lg font-bold uppercase tracking-widest">Profile Information</CardTitle>
                            <CardDescription className="text-xs text-zinc-400 font-bold uppercase tracking-wide mt-1">Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-8">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">First Name</label>
                                    <input
                                        placeholder="Enter first name"
                                        defaultValue={user?.user_metadata?.first_name || ""}
                                        className="w-full bg-white border border-zinc-200 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none appearance-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Last Name</label>
                                    <input
                                        placeholder="Enter last name"
                                        defaultValue={user?.user_metadata?.last_name || ""}
                                        className="w-full bg-white border border-zinc-200 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none appearance-none"
                                    />
                                </div>
                                <div className="space-y-3 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                                    <input
                                        placeholder="Enter email address"
                                        type="email"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-500 focus:outline-none rounded-none appearance-none cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-3 sm:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bio</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Tell us about yourself..."
                                        className="w-full bg-white border border-zinc-200 px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-none resize-none appearance-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-zinc-100">
                                <Button className="h-12 px-8 gap-2 bg-black text-white rounded-none uppercase font-bold tracking-widest hover:bg-zinc-800 transition-all">
                                    <FaSave className="h-4 w-4" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
