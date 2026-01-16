import { Hero } from "@/components/ui/hero-1"
import { Navbar1 } from "@/components/ui/navbar-1"
import { FeaturesSection } from "@/components/ui/features-section"
import { HowItWorks } from "@/components/ui/how-it-works"
import { Footer } from "@/components/ui/footer"

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
            <Navbar1 />
            <Hero
                eyebrow="Study Smart • Not Hard"
                title={
                    <span className="block">
                        Your Personal <br />
                        <span className="font-serif italic font-light tracking-tight text-zinc-500">
                            AI Study Copilot
                        </span>
                    </span>
                }
                subtitle="Stop drowning in PDFs. Chat with your notes, generate quizzes, and master your coursework in half the time."
                ctaLabel="Start Studying Free"
                ctaHref="/login"
            />

            {/* Features Grid */}
            <FeaturesSection />

            {/* How It Works Section */}
            <HowItWorks />

            <Footer />
        </main>
    )
}
