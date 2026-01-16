"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaGoogle, FaChevronLeft } from "react-icons/fa"
import Link from "next/link"

interface AuthFormProps {
    mode?: "login" | "signup"
}

const AuthForm: React.FC<AuthFormProps> = ({ mode = "login" }) => {
    return (
        <div className="min-h-screen bg-white text-zinc-950 selection:bg-black selection:text-white flex items-center justify-center py-20">
            <BackButton />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md bg-white p-8 sm:p-12 border border-zinc-200 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
            >
                <Header mode={mode} />
                <SocialButtons mode={mode} />
                <Divider />
                <LoginForm mode={mode} />
                <TermsAndConditions />
            </motion.div>
            <BackgroundDecoration />
        </div>
    )
}

const BackButton: React.FC = () => {
    const router = useRouter()
    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors absolute top-8 left-8 tracking-wide"
        >
            <FaChevronLeft size={12} />
            BACK
        </button>
    )
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button
        className={`w-full bg-black text-white px-4 py-3 text-sm font-bold uppercase tracking-widest
    transition-all hover:bg-white hover:text-black border border-black ${className}`}
        {...props}
    >
        {children}
    </button>
)

const Header: React.FC<{ mode: "login" | "signup" }> = ({ mode }) => (
    <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tighter uppercase mb-2">
            {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-sm text-zinc-500 tracking-wide">
            {mode === "login"
                ? "Sign in to access your dashboard"
                : "Fill in your details below"}
        </p>
    </div>
)

const SocialButtons: React.FC<{ mode: "login" | "signup" }> = ({ mode }) => (
    <div className="mb-6">
        <SocialButton fullWidth icon={<FaGoogle size={16} />}>
            {mode === "login" ? "Sign in with Google" : "Sign up with Google"}
        </SocialButton>
    </div>
)

const SocialButton: React.FC<{
    icon?: React.ReactNode
    fullWidth?: boolean
    children?: React.ReactNode
}> = ({ icon, fullWidth, children }) => (
    <button
        className={`w-full flex items-center justify-center gap-3 border border-black bg-white 
    px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all 
    hover:bg-black hover:text-white
    ${fullWidth ? "col-span-2" : ""}`}
    >
        {icon}
        <span>{children}</span>
    </button>
)

const Divider: React.FC = () => (
    <div className="my-8 flex items-center gap-4">
        <div className="h-px w-full bg-zinc-200" />
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">OR</span>
        <div className="h-px w-full bg-zinc-200" />
    </div>
)

const LoginForm: React.FC<{ mode: "login" | "signup" }> = ({ mode }) => {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        try {
            const { supabase } = await import('@/lib/supabase')

            if (mode === 'signup') {
                const firstName = formData.get('first-name') as string
                const lastName = formData.get('last-name') as string
                const confirmPassword = formData.get('confirm-password') as string

                // Validate passwords match
                if (password !== confirmPassword) {
                    setError('Passwords do not match')
                    setLoading(false)
                    return
                }

                // Sign up with Supabase
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            first_name: firstName,
                            last_name: lastName,
                        }
                    }
                })

                if (signUpError) {
                    setError(signUpError.message)
                } else {
                    setSuccess(true)
                    setTimeout(() => router.push('/dashboard'), 1500)
                }
            } else {
                // Sign in with Supabase
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) {
                    setError(signInError.message)
                } else {
                    setSuccess(true)
                    setTimeout(() => router.push('/dashboard'), 1000)
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup id="first-name" name="first-name" label="First Name" placeholder="JOHN" required />
                    <InputGroup id="last-name" name="last-name" label="Last Name" placeholder="DOE" required />
                </div>
            )}

            <InputGroup id="email-input" name="email" label="Email" type="email" placeholder="NAME@EXAMPLE.COM" required />

            {mode === "signup" && (
                <InputGroup id="phone-input" name="phone" label="Phone (Optional)" type="tel" placeholder="+1 (555) 000-0000" />
            )}

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <Label htmlFor="password-input">Password</Label>
                    {mode === "login" && (
                        <a href="#" className="text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-black">
                            Forgot?
                        </a>
                    )}
                </div>
                <Input id="password-input" name="password" type="password" placeholder="••••••••" required />
            </div>

            {mode === "signup" && (
                <div>
                    <Label htmlFor="confirm-password">Re-type Password</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" placeholder="••••••••" className="mt-2" required />
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs">
                    {mode === 'signup' ? 'Account created! Redirecting...' : 'Logged in! Redirecting...'}
                </div>
            )}

            <Button type="submit" className="mt-4" disabled={loading}>
                {loading ? 'Please wait...' : (mode === "login" ? "Sign In" : "Sign Up")}
            </Button>

            <div className="mt-6 text-center text-xs font-medium tracking-wide text-zinc-500">
                {mode === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <Link href="/signup" className="border-b border-black text-black pb-0.5 hover:border-transparent transition-all">
                            CREATE ONE
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link href="/login" className="border-b border-black text-black pb-0.5 hover:border-transparent transition-all">
                            SIGN IN
                        </Link>
                    </>
                )}
            </div>
        </form>
    )
}

const InputGroup: React.FC<{
    id: string
    name?: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
}> = ({ id, name, label, type = "text", placeholder, required }) => (
    <div>
        <Label htmlFor={id} className="mb-2 block">{label}</Label>
        <Input id={id} name={name || id} type={type} placeholder={placeholder} required={required} />
    </div>
)

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
    <label className={`text-xs font-bold uppercase tracking-widest text-zinc-500 ${className}`} {...props}>
        {children}
    </label>
)

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input
        className={`w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-black
    placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black
    transition-all rounded-none ${className}`}
        {...props}
    />
)

const TermsAndConditions: React.FC = () => (
    <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
        By signing in, you agree to our{" "}
        <a href="#" className="text-blue-600 dark:text-blue-400">
            Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 dark:text-blue-400">
            Privacy Policy.
        </a>
    </p>
)

const BackgroundDecoration: React.FC = () => {
    return (
        <div
            className="absolute right-0 top-0 z-0 size-[50vw] pointer-events-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
        >
            <div
                className="absolute inset-0 bg-[radial-gradient(100%_100%_at_100%_0%,rgba(255,255,255,0),rgba(255,255,255,1))]"
            />
        </div>
    )
}

export default AuthForm
