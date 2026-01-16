"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FaBrain, FaArrowRight, FaCheck, FaTimes, FaRedo, FaArrowLeft } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import { useAPI } from "@/services/api"

// Type defs
interface QuizQuestion {
    question: string
    options: string[]
    correct_answer: number
    explanation: string
}

interface QuizData {
    id: string
    questions: QuizQuestion[]
}

export default function QuizPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const docId = searchParams.get('docId')

    // State
    const [loading, setLoading] = useState(false)
    const [quizData, setQuizData] = useState<QuizData | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)

    // Generate Quiz on Mount if docId exists
    useEffect(() => {
        if (docId) {
            generateQuiz(docId)
        }
    }, [docId])

    const generateQuiz = async (documentId: string) => {
        setLoading(true)
        try {
            // Call API directly for now (should be moved to api service)
            // Mocking the call structure based on backend/app/routes/quiz.py
            const token = localStorage.getItem("token")
            const res = await fetch("http://localhost:8000/api/quiz/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    document_ids: [documentId],
                    num_questions: 5,
                    difficulty: "medium"
                })
            })

            if (!res.ok) throw new Error("Failed to generate quiz")

            const data = await res.json()
            setQuizData(data)
            setCurrentQuestionIndex(0)
            setSelectedAnswers(new Array(data.questions.length).fill(-1))
            setShowResults(false)
        } catch (error) {
            console.error(error)
            alert("Failed to generate quiz. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers]
        newAnswers[currentQuestionIndex] = optionIndex
        setSelectedAnswers(newAnswers)
    }

    const handleNext = () => {
        if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            calculateScore()
        }
    }

    const calculateScore = () => {
        if (!quizData) return
        let correct = 0
        quizData.questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) correct++
        })
        setScore(correct)
        setShowResults(true)
    }

    const handleRetake = () => {
        setCurrentQuestionIndex(0)
        setSelectedAnswers(new Array(quizData?.questions.length || 0).fill(-1))
        setShowResults(false)
        setScore(0)
    }

    const handleBack = () => {
        if (docId) {
            router.push(`/notebook/${docId}`)
        } else {
            router.back()
        }
    }

    if (!docId && !quizData && !loading) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4 text-center">
                <h2 className="text-xl font-bold text-zinc-900">No Document Selected</h2>
                <p className="text-zinc-500 mt-2">Please go to a notebook and select "Quiz" to generate a test.</p>
                <Button onClick={() => router.push('/dashboard')} className="mt-4 bg-black text-white hover:bg-zinc-800">Go to Dashboard</Button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-zinc-900" />
                <h2 className="text-xl font-bold text-zinc-900 animate-pulse">Generating your quiz...</h2>
                <p className="text-zinc-500">Reading document and crafting questions</p>
            </div>
        )
    }

    if (!quizData) return null

    if (showResults) {
        return (
            <div className="max-w-2xl mx-auto py-8 px-4">
                <Button variant="ghost" className="mb-6 gap-2 text-zinc-500 hover:text-black" onClick={handleBack}>
                    <FaArrowLeft /> Back to Notebook
                </Button>

                <Card className="border-zinc-200 shadow-lg overflow-hidden">
                    <div className="bg-black p-8 text-center text-white">
                        <h1 className="text-3xl font-bold mb-2">Quiz Complete</h1>
                        <div className="text-6xl font-black mb-2 tracking-tighter">{Math.round((score / quizData.questions.length) * 100)}%</div>
                        <p className="text-zinc-400">You scored {score} out of {quizData.questions.length}</p>
                    </div>
                    <CardContent className="p-8 space-y-8">
                        {quizData.questions.map((q, idx) => {
                            const userAns = selectedAnswers[idx]
                            const isCorrect = userAns === q.correct_answer
                            return (
                                <div key={idx} className="border-b border-zinc-100 pb-6 last:border-0">
                                    <div className="flex gap-3 mb-3">
                                        <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCorrect ? 'bg-black text-white' : 'bg-red-100 text-red-700'}`}>
                                            {isCorrect ? <FaCheck /> : <FaTimes />}
                                        </div>
                                        <h3 className="font-semibold text-lg text-zinc-900">{q.question}</h3>
                                    </div>
                                    <div className="pl-9 space-y-2">
                                        <div className="flex flex-col gap-2">
                                            {q.options.map((opt, optIdx) => (
                                                <div
                                                    key={optIdx}
                                                    className={`p-3 rounded-lg border text-sm
                                                        ${optIdx === q.correct_answer ? 'bg-zinc-100 border-zinc-300 text-zinc-900 font-medium' :
                                                            optIdx === userAns ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-zinc-200 text-zinc-500'}
                                                    `}
                                                >
                                                    {opt} {optIdx === q.correct_answer && "(Correct Answer)"} {optIdx === userAns && !isCorrect && "(Your Answer)"}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-zinc-50 p-4 rounded-lg mt-3 text-sm text-zinc-600 border border-zinc-100">
                                            <span className="font-bold text-zinc-900">Explanation:</span> {q.explanation}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <div className="flex gap-4 pt-4">
                            <Button onClick={handleRetake} className="flex-1 gap-2 border-zinc-200 text-zinc-900 hover:bg-zinc-50" variant="outline">
                                <FaRedo /> Retake Quiz
                            </Button>
                            <Button onClick={handleBack} className="flex-1 bg-black text-white hover:bg-zinc-800">
                                Back to Notebook
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const currentQuestion = quizData.questions[currentQuestionIndex]

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Quiz Mode</h1>
                    <p className="text-sm text-zinc-500 font-medium">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleBack} className="text-zinc-400 hover:text-black">Exit</Button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-zinc-100 rounded-full mb-8 overflow-hidden">
                <div
                    className="h-full bg-black transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <Card className="flex-1 border-zinc-200 shadow-xl flex flex-col">
                <CardContent className="p-8 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-zinc-900 mb-8 leading-relaxed">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-3 flex-1">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                                    ${selectedAnswers[currentQuestionIndex] === idx
                                        ? 'border-black bg-zinc-50 text-black font-medium shadow-sm'
                                        : 'border-zinc-100 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'}
                                `}
                            >
                                <span className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-colors
                                         ${selectedAnswers[currentQuestionIndex] === idx ? 'bg-black border-black text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-400 group-hover:border-zinc-400 group-hover:text-zinc-600'}
                                    `}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    {option}
                                </span>
                                {selectedAnswers[currentQuestionIndex] === idx && (
                                    <FaCheck className="text-black" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={selectedAnswers[currentQuestionIndex] === undefined}
                            className="bg-black hover:bg-zinc-800 px-8 py-6 text-lg rounded-xl shadow-lg shadow-zinc-200 disabled:opacity-50 disabled:shadow-none text-white"
                        >
                            {currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            <FaArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
