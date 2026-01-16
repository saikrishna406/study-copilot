import { Button } from "@/components/ui/button"
import { Copy, Download, Save } from "lucide-react"

export function NotesPanel() {
    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 p-2 dark:border-slate-800">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-slate-900">
                    {['Short Notes', 'Detailed', 'Flashcards'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${i === 0 ? 'bg-white shadow text-slate-900 dark:bg-slate-800 dark:text-slate-50' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 font-serif text-slate-800 leading-relaxed dark:text-slate-200">
                <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50">Lecture Summary: Intro to Biology</h1>
                <p className="mb-4">Biology is the scientific study of life. It is a natural science with a broad scope but has several unifying themes that tie it together as a single, coherent field.</p>
                <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-50">Key Concepts</h2>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                    <li><strong>Cell Theory:</strong> All living organisms are made up of cells.</li>
                    <li><strong>Genetics:</strong> Genes are the basic unit of heredity.</li>
                    <li><strong>Evolution:</strong> Engine of biological diversity.</li>
                </ul>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 p-3 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 rounded-b-xl">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
                    <Copy className="mr-2 h-3 w-3" /> Copy
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="mr-2 h-3 w-3" /> PDF
                    </Button>
                    <Button size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700">
                        <Save className="mr-2 h-3 w-3" /> Save to Drive
                    </Button>
                </div>
            </div>
        </div>
    )
}
