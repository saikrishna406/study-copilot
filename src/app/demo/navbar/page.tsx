import { Navbar1 } from "@/components/ui/navbar-1"

export default function NavbarDemo() {
    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar1 />
            <div className="pt-32 px-8 text-center">
                <h2 className="text-2xl font-bold text-slate-400">Scroll to see navbar overlay</h2>
                <div className="h-[200vh]"></div>
            </div>
        </div>
    )
}
