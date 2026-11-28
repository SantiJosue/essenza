import { Leaf, LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <div className="flex flex-col gap-2 justify-center items-center">
            <Leaf className="size-8 text-essenza-primary" />
            <h2 className="text-2xl">ESSENZA</h2>
            <p className="text-essenza-text/80">Preparando el contenido...</p>
        </div>
        <LoaderCircle className="size-8 animate-spin text-essenza-primary" />
    </div>
  )
}
