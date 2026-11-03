"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { Eye, EyeClosed } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault()

        setError("")
        setIsLoading(true)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })

        console.log(result)

        setIsLoading(false)

        if (result?.error) {
            setError("El correo o la contraseña son incorrectos.")
            return
        }

        redirect("/admin")
    }

    return (
        <main className="relative isolate min-h-screen flex items-center justify-center bg-essenza-background px-4 overflow-x-hidden">

            {/* Decoración de fondo */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-essenza-primary/10 sm:-right-24 sm:-top-24 sm:h-72 sm:w-72"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-essenza-primary/10 sm:-bottom-24 sm:-left-24 sm:h-80 sm:w-80"
            />

            <div className="relative z-50 w-full max-w-md rounded-2xl bg-essenza-surface p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <h1 className="font-display text-3xl text-essenza-primary">
                        ESSENZA
                    </h1>

                    <p className="mt-2 text-sm text-essenza-text/70">
                        Iniciá sesión para administrar tu catálogo
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-essenza-text"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-lg border border-essenza-text/20 bg-transparent px-4 py-3 outline-none focus:border-essenza-primary"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-essenza-text"
                        >
                            Contraseña
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full rounded-lg border border-essenza-text/20 bg-transparent px-4 py-3 outline-none focus:border-essenza-primary"
                                placeholder="Tu contraseña"
                            />
                            <button onClick={() => setShowPassword((prev) => !prev)} type="button" className="absolute top-4 right-4 cursor-pointer">
                                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full cursor-pointer rounded-lg bg-essenza-primary px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "Ingresando..." : "Iniciar sesión"}
                    </button>
                </form>
            </div>


        </main>
    )
}