"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()

  return (
    <header className="sticky top-0 w-full z-10 border-b border-black/5 bg-essenza-surface">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl tracking-[0.15em]"
          onClick={() => setIsOpen(false)}
        >
          ESSENZA
        </Link>

        {/* Navegación desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(link => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href)

            return (
              <Link
                href={link.href}
                key={link.href}
                className={`
                  border-b-2 text-sm transition-all
                  ${isActive
                    ? "border-essenza-primary text-essenza-primary"
                    : "border-transparent hover:border-essenza-primary hover:text-essenza-primary hover:-translate-y-px"
                  }  
                `}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Botón desktop */}
        <div className="flex gap-2 flex-col md:flex-row items-center justify-center">
          <Link
            href="/catalogo"
            className="hidden rounded-full bg-essenza-primary px-5 py-2.5 text-sm text-white transition hover:opacity-90 md:block"
          >
            Ver catálogo
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-essenza-primary/20 px-6 py-3 text-sm font-medium text-essenza-text transition hover:bg-essenza-primary/5"
          >
            Administración
          </Link>
        </div>

        {/* Botón menú mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl md:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>

      </nav>

      {/* Menú mobile */}
      <div
        className={`
            overflow-hidden border-t border-black/5 bg-essenza-surface
            transition-all duration-300 ease-in-out md:hidden
            ${isOpen ? "max-h-96 opacity-100 px-6 pb-6" : "max-h-0 opacity-0"}
          `}
      >
        <div className="flex flex-col gap-5 pt-5">

          {navLinks.map(link => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)

            return (
              <Link
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
                className={`
                    text-sm border-b-2 py-1 transition-all
                    ${isActive
                    ? "border-essenza-primary text-essenza-primary"
                    : "border-transparent hover:border-essenza-primary hover:text-essenza-primary"
                  }
                  `}
              >
                {link.label}
              </Link>
            )
          })}

          <div className="flex flex-col gap-2">
            <Link
              href="/catalogo"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-essenza-primary px-5 py-3 text-center text-sm text-white"
            >
              Ver catálogo
            </Link>
            <Link
              href="/admin"
              className="rounded-full border border-essenza-primary/20 px-5 py-3 text-center text-sm font-medium text-essenza-text transition hover:bg-essenza-primary/5"
            >
              Administración
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}