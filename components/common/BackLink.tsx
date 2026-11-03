import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
    href: string
    children: React.ReactNode
}

export default function BackLink({href, children} : BackLinkProps) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-essenza-primary transition hover:opacity-70"
        >
            <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
            />
            {children}
        </Link>
    )
}
