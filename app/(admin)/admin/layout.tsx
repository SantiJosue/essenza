"use client"

import LogoutButton from "@/components/admin/LogoutButton";
import { Box, ClipboardList, ClipboardPenLine, LayoutGrid, Leaf, Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathName = usePathname()

    const links = [
        { id: 1, href: "/admin", icon: <LayoutGrid />, name: "Panel principal" },
        { id: 2, href: "/admin/nueva-venta", icon: <ClipboardPenLine />, name: "Registrar venta" },
        { id: 3, href: "/admin/ventas", icon: <ClipboardList />, name: "Historial de ventas" },
        { id: 4, href: "/catalogo", icon: <Box />, name: "Catálogo" },
    ]

    const isLinkActive = (href: string) => {
        return href === "/admin"
            ? pathName === "/admin"
            : pathName.startsWith(href)
    }

    return (
        <>
            <nav 
                aria-label="Navegación principal"
                className="z-50 fixed hidden md:flex min-w-64 w-80 flex-1 flex-col justify-between min-h-screen bg-essenza-primary px-6 py-12"
            >
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-2xl text-essenza-background">
                        <div className="bg-essenza-background rounded-2xl p-2">
                            <Leaf className="text-essenza-primary " />
                        </div>
                        <h2>ESSENZA</h2>
                    </div>
                </div>
                <div className="flex flex-col gap-6 justify-center text-essenza-background w-full font-medium">
                    {links.map(link => {
                        const isActive = isLinkActive(link.href)

                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`
                                    flex gap-4 items-center relative group  hover:bg-black/30 hover:text-white py-2 px-4 rounded-xl
                                    ${isActive ? "bg-black/30 border-l-4 border-essenza-background" : "bg-black/20"}
                                `}
                            >
                                <p className="bg-black/20 rounded-2xl p-2">{link.icon}</p>
                                <p
                                    className="transition-transform group-hover:translate-x-2 text-justify"
                                >
                                    {link.name}
                                </p>
                            </Link>
                        )
                    })}
                </div>
                <LogoutButton>Cerrar sesión</LogoutButton>
            </nav>

            <div className="fixed z-50 left-2 mx-2 mt-4 md:hidden">
                <button
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="bg-essenza-primary p-2 rounded-xl cursor-pointer"
                >
                    {
                        isMenuOpen
                            ? <XIcon className="text-essenza-background" />
                            : <Menu className="text-essenza-background" />
                    }
                </button>
            </div>
            <>
                <nav 
                    id="mobile-navigation"
                    aria-label="Navegación principal"
                    className={`
                        md:hidden
                        fixed z-40 w-[80%] max-w-80 flex flex-col justify-between 
                        transition-transform duration-300
                        ${isMenuOpen
                            ? "translate-x-0 pointer-events-auto"
                            : "-translate-x-full pointer-events-none"
                        }
                        items-center min-h-screen bg-essenza-primary px-4 py-12`
                }>
                    <div className="flex flex-col items-center gap-2 text-2xl text-essenza-background">
                        <div className="bg-essenza-background rounded-2xl p-2">
                            <Leaf className="text-essenza-primary " />
                        </div>
                        <h2>ESSENZA</h2>
                    </div>
                    <div className="flex flex-col gap-6 justify-center text-essenza-background w-full text-sm font-medium">
                        {links.map(link => {
                            const isActive = isLinkActive(link.href)

                            return (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`
                                    flex flex-col gap-2 items-center relative group py-2 px-4 rounded-xl
                                    ${isActive ? "bg-black/30 border-l-4 border-essenza-background" : "bg-black/20"}
                                `}
                                >
                                    <p className="bg-black/20 rounded-2xl p-2">{link.icon}</p>
                                    <p
                                        className="transition-transform group-hover:translate-x-2 hover:opacity-80"
                                    >
                                        {link.name}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                    <LogoutButton>Salir</LogoutButton>
                </nav >
                {isMenuOpen && (
                    <button
                        type="button"
                        aria-label="Cerrar menu"
                        onClick={() => setIsMenuOpen(false)}
                        className="md:hidden fixed bg-black/50 w-full min-h-screen inset-0 z-30"
                    />
                )}
            </>
            <main className="md:ml-80">
                {children}
            </main>
        </>
    )
}
