import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"

export default function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white">
            <Sidebar />
            <div className="pl-64">
                <TopBar />
                <main className="min-h-[calc(100vh-4rem)] p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
