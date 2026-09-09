"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-black/5 bg-essenza-surface">
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
          <Link
            href="/"
            className="text-sm transition hover:text-essenza-primary"
          >
            Inicio
          </Link>

          <Link
            href="/catalogo"
            className="text-sm transition hover:text-essenza-primary"
          >
            Catálogo
          </Link>

          <Link
            href="/sobre-mi"
            className="text-sm transition hover:text-essenza-primary"
          >
            Sobre mí
          </Link>

          <Link
            href="/contacto"
            className="text-sm transition hover:text-essenza-primary"
          >
            Contacto
          </Link>
        </div>

        {/* Botón desktop */}
        <Link
          href="/catalogo"
          className="hidden rounded-full bg-essenza-primary px-5 py-2.5 text-sm text-white transition hover:opacity-90 md:block"
        >
          Ver catálogo
        </Link>

        {/* Botón menú mobile */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl md:hidden"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? "×" : "☰"}
        </button>

      </nav>

      {/* Menú mobile */}
      {isOpen && (
        <div className="border-t border-black/5 bg-essenza-surface px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-5 pt-5">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              Inicio
            </Link>

            <Link
              href="/catalogo"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              Catálogo
            </Link>

            <Link
              href="/sobre-mi"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              Sobre mí
            </Link>

            <Link
              href="/contacto"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              Contacto
            </Link>

            <Link
              href="/catalogo"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-essenza-primary px-5 py-3 text-center text-sm text-white"
            >
              Ver catálogo
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}