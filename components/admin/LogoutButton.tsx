"use client"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export default function LogoutButton({children}: {children: React.ReactNode}) {
    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/login"
        })
    }

    return (
        <button
            type="button"
            aria-label="Cerrar sesión"
            onClick={handleLogout}
            className="inline-flex justify-center items-center gap-2 text-white bg-black/20 hover:cursor-pointer hover:bg-black/30 w-full text-sm py-2 px-4 rounded-xl"
        >
            <span
                className="py-1 px-2 md:py-2"
            >
                <LogOutIcon />
            </span>
            <span className="font-medium">{children}</span>
        </button>
    )
}
