"use client"

import Notification from "@/components/common/Notification"
import { Category } from "@/src/generated/prisma/client"
import { Product } from "@/src/types/product"
import { PlusIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

type ProductManagerProps = {
    selectedProduct: Product | null
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>
    categories: Category[]
}

export default function ProductManager({ selectedProduct, setSelectedProduct, categories }: ProductManagerProps) {
    const router = useRouter()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<"success" | "error">("success")
    const [isClosing, setIsClosing] = useState(false)

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const name = formData.get('name')
        const description = formData.get('description')
        const price = formData.get('price')
        const stock = formData.get('stock')
        const categoryId = formData.get('categoryId')
        const isActive = formData.get("isActive") === "on"
        const isFeatured = formData.get("isFeatured") === "on"
        const image = formData.get('image')

        if (typeof name !== 'string' || name.trim() === '') {
            setMessage("Ingresá un nombre válido.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (typeof description !== 'string' || description.trim() === '') {
            setMessage("Ingresá una descripción válida.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (description.length > 500) {
            setMessage("La descripción no puede contener más de 500 caracteres.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (typeof price !== "string" || price.trim() === "") {
            setMessage("Ingresá un precio válido.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        const priceValue = Number(price)

        if (!Number.isInteger(priceValue) || priceValue < 1) {
            setMessage("El precio debe ser mayor a 0.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (typeof stock !== "string" || stock.trim() === "") {
            setMessage("Ingresá una cantidad de stock válida.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        const stockValue = Number(stock)

        if (!Number.isSafeInteger(stockValue) || stockValue < 0) {
            setMessage("El stock debe ser un número entero mayor o igual a 0.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (typeof categoryId !== "string" || categoryId.trim() === "") {
            setMessage("Ingresá una categoria.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        const categoryIdValue = Number(categoryId)

        if (!Number.isInteger(categoryIdValue) || categoryIdValue < 1 || !categories.some(category => category.id === categoryIdValue)) {
            setMessage("Ingresá una categoria válida.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (typeof image !== "string" || image.trim() === "") {
            setMessage("Ingresá una imagen.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (!image.startsWith("/products/") || !image.endsWith(".webp")) {
            setMessage("Ingresá una imagen válida.")
            setMessageType("error")
            setShowMessage(true)
            setIsClosing(false)
            return
        }

        if (selectedProduct) {
            const hasChanges =
                name.trim() !== selectedProduct.name ||
                description.trim() !== selectedProduct.description ||
                priceValue !== selectedProduct.price ||
                stockValue !== selectedProduct.stock ||
                categoryIdValue !== selectedProduct.categoryId ||
                isActive !== selectedProduct.isActive ||
                isFeatured !== selectedProduct.isFeatured ||
                image !== selectedProduct.image;

            if (!hasChanges) {
                setMessage("No realizaste ningún cambio en el producto.")
                setMessageType("error")
                setShowMessage(true)
                setIsClosing(false)
                return
            }

            const response = await fetch(`/api/products/${selectedProduct.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: priceValue,
                    stock: stockValue,
                    categoryId: categoryIdValue,
                    isActive,
                    isFeatured,
                    image,
                }),
            });

            const data = await response.json()

            if (!response.ok) {
                setMessage(data.error)
                setMessageType("error")
                setShowMessage(true)
                setIsClosing(false)
                return
            }

            setMessage(data.message)
            setMessageType("success")
            setShowMessage(true)
            setIsClosing(false)
            setIsFormOpen(false)
            setSelectedProduct(null)
            router.refresh()

        } else {

            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                    price: priceValue,
                    stock: stockValue,
                    categoryId: categoryIdValue,
                    isActive,
                    isFeatured,
                    image,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error)
                setMessageType("error")
                setShowMessage(true)
                setIsClosing(false)
                return
            }

            setMessage(data.message)
            setMessageType("success")
            setShowMessage(true)
            setIsClosing(false)
            setIsFormOpen(false)

            router.refresh()
        }
    }

    const handleCloseNotification = useCallback(() => setIsClosing(true), [])

    const handleExitNotification = useCallback(() => {
        setShowMessage(false)
        setIsClosing(false)
    }, [])

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setSelectedProduct(null)
    }

    return (
        <section>
            {showMessage &&
                <Notification
                    message={message}
                    type={messageType}
                    isClosing={isClosing}
                    onClose={handleCloseNotification}
                    onExitComplete={handleExitNotification}
                />
            }

            <button
                type="button"
                onClick={() => {
                    setIsFormOpen(true)
                    setSelectedProduct(null)
                }}
                className="mt-6 inline-flex gap-2 items-center justify-center rounded-xl bg-essenza-primary px-5 py-3 font-medium text-white cursor-pointer transition-opacity hover:opacity-90"
            >
                Agregar producto
                <PlusIcon size={16} />
            </button>

            {(isFormOpen || selectedProduct) && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        handleCloseForm()
                    }
                }}>
                    <form
                        onSubmit={handleSubmit}
                        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-essenza-primary/10 bg-essenza-background p-6 shadow-xl sm:p-8"
                    >
                        <div className="mb-7 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium uppercase tracking-wider text-essenza-primary">
                                    Administración
                                </p>

                                <h2 className="mt-2 font-display text-3xl text-essenza-text">
                                    {selectedProduct ? "Editar producto" : "Nuevo producto"}
                                </h2>

                                <p className="mt-2 text-sm leading-relaxed text-essenza-text/70">
                                    Completá los datos para agregar un producto
                                    al catálogo de Essenza.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setSelectedProduct(null)
                                }}
                                aria-label="Cerrar formulario"
                                className="rounded-full p-3 text-xl text-essenza-text/60 transition-colors cursor-pointer hover:bg-essenza-primary/10 hover:text-essenza-primary"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-essenza-text"
                                >
                                    Nombre del producto
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Ej. Crema hidratante"
                                    defaultValue={selectedProduct ? selectedProduct.name : ''}
                                    required
                                    className="w-full rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-essenza-text"
                                >
                                    Descripción
                                </label>

                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describí brevemente el producto..."
                                    defaultValue={selectedProduct ? selectedProduct.description : ''}
                                    rows={3}
                                    required
                                    className="w-full resize-y rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="price"
                                        className="mb-2 block text-sm font-medium text-essenza-text"
                                    >
                                        Precio (ARS)
                                    </label>

                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="15000"
                                        defaultValue={selectedProduct ? selectedProduct.price : ""}
                                        required
                                        className="w-full rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="stock"
                                        className="mb-2 block text-sm font-medium text-essenza-text"
                                    >
                                        Stock disponible
                                    </label>

                                    <input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="0"
                                        defaultValue={selectedProduct?.stock ?? 1}
                                        required
                                        className="w-full rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                    />
                                </div>
                            </div>


                            <div>
                                <label
                                    htmlFor="categoryId"
                                    className="mb-2 block text-sm font-medium text-essenza-text"
                                >
                                    Categoría
                                </label>

                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    defaultValue={selectedProduct?.categoryId ?? ""}
                                    required
                                    className="w-full rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                >
                                    <option value="" disabled>
                                        Seleccioná una categoría
                                    </option>

                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div className="flex items-center gap-3 rounded-xl border border-essenza-primary/15 bg-essenza-surface p-4">
                                    <input
                                        id="isActive"
                                        name="isActive"
                                        type="checkbox"
                                        defaultChecked={selectedProduct?.isActive ?? true}
                                        className="size-5 accent-essenza-primary"
                                    />

                                    <label
                                        htmlFor="isActive"
                                        className="cursor-pointer text-sm font-medium text-essenza-text"
                                    >
                                        Mostrar producto
                                    </label>
                                </div>

                                <div className="flex items-center gap-3 rounded-xl border border-essenza-primary/15 bg-essenza-surface p-4">
                                    <input
                                        id="isFeatured"
                                        name="isFeatured"
                                        type="checkbox"
                                        defaultChecked={selectedProduct?.isFeatured ?? false}
                                        className="size-5 accent-essenza-primary"
                                    />

                                    <label
                                        htmlFor="isFeatured"
                                        className="cursor-pointer text-sm font-medium text-essenza-text"
                                    >
                                        Mostrar en productos destacados
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="image"
                                    className="mb-2 block text-sm font-medium text-essenza-text"
                                >
                                    Ruta de la imagen
                                </label>

                                <input
                                    id="image"
                                    name="image"
                                    type="text"
                                    placeholder="/products/crema-hidratante.webp"
                                    defaultValue={selectedProduct ? selectedProduct.image : ""}
                                    required
                                    className="w-full rounded-xl border border-essenza-primary/20 bg-essenza-surface px-4 py-3 text-sm outline-none transition focus:border-essenza-primary focus:ring-2 focus:ring-essenza-primary/10"
                                />

                                <p className="mt-2 text-xs text-essenza-text/60">
                                    Ingresá la ruta de una imagen ubicada en
                                    la carpeta public.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end *:hover:cursor-pointer">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setSelectedProduct(null)
                                }}
                                className="rounded-xl border border-essenza-primary/20 px-5 py-3 text-sm font-medium text-essenza-text transition-colors hover:bg-essenza-primary/5"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="rounded-xl bg-essenza-primary px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                            >
                                {selectedProduct ? "Actualizar producto" : "Agregar producto"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    )
}