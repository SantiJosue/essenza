"use client"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/login"
        })
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="mt-2 inline-flex justify-center items-center gap-2 cursor-pointer rounded-full border border-essenza-primary/50 px-6 py-3 text-sm font-medium text-essenza-text transition hover:bg-essenza-primary/5"
        >
            <span>Cerrar Sesión</span>
            <LogOutIcon size={16} />
        </button>
    )
}
