"use client"

import ProductManager from "./ProductManager";
import { Edit2Icon, Package, Trash } from "lucide-react";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { Product } from "@/src/types/product";
import { useCallback, useState } from "react";
import Notification from "@/components/common/Notification";
import { useRouter } from "next/navigation";
import { Category } from "@/src/generated/prisma/client";
import { normalizeText } from "@/src/utils/normalizeText";

type ProductAdminProps = {
  products: Product[]
  categories: Category[]
}

export default function ProductAdmin({ products, categories }: ProductAdminProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isClosing, setIsClosing] = useState(false)
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState("default")

  const productSelected = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleDelete = async (product: Product) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        console.error(data.error)
        setShowMessage(true)
        setMessage(data.error)
        setMessageType("error")
        return
      }

      setShowMessage(true)
      setMessage(data.message)
      setMessageType("success")
      setProductToDelete(null)

      router.refresh()
    } catch (error) {
      console.error(error)
      const errorMessage = "Hubo un error al intentar borrar el producto"
      setShowMessage(true)
      setMessage(errorMessage)
      setMessageType("error")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseNotification = useCallback(() => setIsClosing(true), [])

  const handleExitNotification = useCallback(() => {
    setShowMessage(false)
    setIsClosing(false)
  }, [])

  const handleCloseModal = () => {
    setProductToDelete(null)
  }

  const filteredProducts = products.filter(product => {
    const matchesName = normalizeText(product.name).includes(normalizeText(search))

    const matchesCategory = product.categoryId === Number(selectedCategory) || selectedCategory === "all"

    return matchesName && matchesCategory
  })

  const sortedProducts = sortOrder === "asc"
    ? [...filteredProducts].sort((a, b) => a.price - b.price)
    : sortOrder === "desc"
      ? [...filteredProducts].sort((a, b) => b.price - a.price)
      : filteredProducts

  return (
    <>
      {showMessage && (
        <Notification
          message={message}
          type={messageType}
          isClosing={isClosing}
          onClose={handleCloseNotification}
          onExitComplete={handleExitNotification}
        />
      )}

      <ProductManager
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        categories={categories}
      />

      <div className="mt-5
       flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Buscar productos..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl text-sm border border-essenza-text/15 bg-essenza-surface px-4 py-3 outline-none focus:border-essenza-primary sm:flex-1"
        />

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="rounded-xl text-sm border border-essenza-text/15 bg-essenza-surface px-4 py-3 outline-none focus:border-essenza-primary"
        >
          <option value="all">Todas las categorías</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          className="rounded-xl text-sm border border-essenza-text/15 bg-essenza-surface px-4 py-3 outline-none focus:border-essenza-primary"
        >
          <option value="default">Orden original</option>
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
        <button
          type="button"
          aria-label="Limpiar filtros"
          title="Limpiar filtros"
          onClick={() => {
            setSearch('')
            setSelectedCategory('all')
            setSortOrder('default')
          }}
          className="text-sm font-display font-medium text-essenza-primary cursor-pointer hover:underline"
        >
          <Trash size={20} />
        </button>
      </div>
      <p className="mt-4 text-sm">
        Mostrando:
        <span className="font-medium"> {sortedProducts.length} de {products.length} productos</span>
      </p>

      <ul className="mt-4 space-y-4">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <li
              key={product.id}
              className="rounded-xl border border-essenza-text/10 bg-essenza-surface p-4 sm:p-5"
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Información del producto */}
                <div className="min-w-0 flex-1 sm:pr-8 lg:pr-12">
                  <div className="flex flex-wrap items-center justify-between md:flex-col md:items-baseline gap-1">
                    <h2 className="font-medium text-essenza-text">
                      {product.name}
                    </h2>

                    <p className="shrink-0 font-semibold text-essenza-text">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-essenza-text/70">
                    {product.description}
                  </p>

                  <p className="mt-1 text-sm text-essenza-text/60">
                    Categoría: {product.category.name}
                  </p>
                </div>

                {/* Precio, stock y acciones */}
                <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Package size={18} className="text-essenza-text/60" />

                    <div>
                      <p className="text-xs text-essenza-text/60">
                        Stock disponible
                      </p>

                      <p className="text-sm font-semibold text-essenza-text">
                        {product.stock} unidades
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${product.stock > 0
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-red-500/10 text-red-600"
                        }`}
                    >
                      {product.stock > 0 ? "Disponible" : "Agotado"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 *:cursor-pointer">
                    <button
                      onClick={() => productSelected(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-essenza-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                    >
                      Editar
                      <Edit2Icon size={16} />
                    </button>

                    <button
                      onClick={() => setProductToDelete(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-80"
                    >
                      Eliminar
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-sm font-medium text-essenza-text/50">No se encontraron productos</li>
        )}
      </ul>

      {productToDelete && (
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal()
            }
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-md rounded-3xl border border-essenza-text/10 bg-essenza-background p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <Trash size={24} />
            </div>

            <h2
              id="delete-dialog-title"
              className="text-2xl font-semibold tracking-tight text-essenza-text"
            >
              Eliminar producto
            </h2>

            <p className="mt-2 wrap-break-word text-lg font-medium text-essenza-text">
              {productToDelete.name}
            </p>

            <p className="mt-4 text-sm leading-6 text-essenza-text/70">
              ¿Estás seguro de que querés eliminar este producto?
            </p>

            <p className="mt-1 text-sm text-essenza-text/60">
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end *:cursor-pointer">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="rounded-xl border border-essenza-text/15 px-5 py-3 text-sm font-medium text-essenza-text transition-colors hover:bg-essenza-text/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={() => handleDelete(productToDelete)}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
