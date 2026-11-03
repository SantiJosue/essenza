import Link from "next/link";

const navLink = [
    {href: '/', label: 'Inicio'},
    {href: '/catalogo', label: 'Catalogo'},
    {href: '/sobre-mi', label: 'Sobre mi'},
    {href: '/contacto', label: 'Contacto'},
]

export default function Footer() {
    return (
        <footer className="bg-essenza-primary px-6 py-10 md:py-12 text-white">
            <div className="mx-auto max-w-7xl">

                <div className="grid gap-5 md:gap-10 md:grid-cols-3">

                    <div>
                        <Link
                            href="/"
                            className="font-display text-2xl tracking-[0.15em]"
                        >
                            ESSENZA
                        </Link>

                        <p className="mt-2 md:mt-4 max-w-xs text-sm leading-relaxed text-white/70">Belleza en cada elección. Productos seleccionados y atención personalizada.</p>
                    </div>

                    <div>
                        <h3 className="font-medium">Navegación</h3>

                        <nav className="mt-2 md:mt-4 flex flex-col gap-2 md:gap-3 text-sm text-white/70">
                            {navLink.map(link => (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    className="transition-colors hover:text-white"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h3 className="font-medium">Contacto</h3>

                        <div className="mt-2 md:mt-4 flex flex-col gap-1 text-sm text-white/70">
                            <p>Atención personalizada</p>
                            <p>Consultá por nuestros productos</p>
                        </div>
                    </div>

                </div>

                <div className="mt-6 md:mt-12 border-t border-white/10 pt-6 text-center text-sm text-white/50">
                    <p>© {new Date().getFullYear()} Essenza. Todos los derechos reservados.</p>
                </div>

            </div>
        </footer>
    )
}
