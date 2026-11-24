"use client"
import BackLink from "@/components/common/BackLink"
import Notification from "@/components/common/Notification"
import { Product } from "@/src/types/product"
import { formatCurrency } from "@/src/utils/formatCurrency"
import { MinusCircle, Package, PlusCircle, PlusIcon, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

type SaleFormProps = {
  products: Product[]
}

type SelectedProduct = {
  product: Product
  quantity: number
}

export default function SaleForm({ products }: SaleFormProps) {
  const router = useRouter()
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [isClosing, setIsClosing] = useState(false)

  const handleSubmit = async () => {
    if (selectedProducts.length === 0 || isSubmitting) return

    try {
      setIsSubmitting(true)

      const items = selectedProducts.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.error)
        setMessageType("error")
        setShowMessage(true)
        setIsClosing(false)
        return
      }

      setSelectedProducts([])
      setMessage(data.message)
      setMessageType("success")
      setShowMessage(true)
      setIsClosing(false)

      router.refresh()
    } catch (error) {
      console.error(error)
      setMessage("Hubo un problema al intentar registrar la venta")
      setMessageType("error")
      setShowMessage(true)
      setIsClosing(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addProduct = (product: Product) => {
    setSelectedProducts(prev => {
      const existingProduct = prev.find(prev => prev.product.id === product.id)
      if (existingProduct === undefined) {
        return [
          ...prev,
          {
            product: product,
            quantity: 1
          }
        ]
      } else {
        return prev.map(item => item.product.id === product.id && item.quantity < item.product.stock ? { ...item, quantity: item.quantity + 1 } : item)
      }
    })
  }

  const total = selectedProducts.reduce((acc, item) => {
    return acc + item.product.price * item.quantity
  }, 0)

  const increaseQuantity = (productId: Product['id']) => {
    setSelectedProducts(prev => {
      return prev.map(item => item.product.id === productId && item.quantity < item.product.stock ? { ...item, quantity: item.quantity + 1 } : item)
    })
  }

  const decreaseQuantity = (productId: Product['id']) => {
    setSelectedProducts(prev => {
      return prev.map(item => item.product.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
    })
  }

  const removeSelectedProduct = (productId: Product["id"]) => {
    setSelectedProducts(prev => {
      return prev.filter(item => item.product.id !== productId)
    })
  }

  const handleCloseNotification = useCallback(() => setIsClosing(true), [])

  const handleExitNotification = useCallback(() => {
    setShowMessage(false)
    setIsClosing(false)
  }, [])

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-4 py-24">
      {showMessage &&
        <Notification
          message={message}
          type={messageType}
          isClosing={isClosing}
          onClose={handleCloseNotification}
          onExitComplete={handleExitNotification}
        />
      }
      <BackLink href="/admin">
        Volver atrás
      </BackLink>

      <h2 className="mt-8 font-medium text-2xl">
        Agregar nueva venta
      </h2>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_350px]">

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.length > 0 ? (
            products.map(product => (
              <article
                key={product.id}
                className="space-y-2 rounded-2xl bg-white p-4 shadow"
              >
                <h3 className="font-medium">{product.name}</h3>

                <p className="text-sm text-essenza-text/90">
                  {product.category.name}
                </p>

                <p className="inline-flex items-center gap-2 text-sm font-medium">
                  <Package size={16} />
                  Stock: {product.stock}
                </p>

                <p className="font-medium">{formatCurrency(product.price)}</p>

                <button
                  type="button"
                  aria-label="agregar al resumen"
                  title="agregar al resumen"
                  onClick={() => addProduct(product)}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center items-center gap-2 bg-essenza-primary/90 disabled:cursor-not-allowed disabled:opacity-30
                 text-white rounded-xl px-6 py-2 transition-all hover:opacity-90 cursor-pointer active:scale-90"
                >
                  Agregar
                  <PlusIcon size={14} />
                </button>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-sm text-essenza-text/90">
              No hay productos para mostrar...
            </p>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-white p-5 shadow">
          <h2 className="text-lg font-medium">
            Resumen de venta
          </h2>
          <div>
            {selectedProducts.length > 0 ? (
              <div className="mt-4 space-y-4">
                {selectedProducts.map(product => (
                  <ul
                    key={product.product.id}
                    className="flex flex-col gap-2 border border-gray-200 shadow p-4 rounded-2xl"
                  >
                    <li className="font-medium">
                      <div className="w-full inline-flex justify-between">
                        <p>{product.product.name}</p>
                        <button
                          type="button"
                          aria-label="remover producto"
                          title="remover producto"
                          onClick={() => removeSelectedProduct(product.product.id)}
                          disabled={isSubmitting}
                          className="cursor-pointer transition-transform hover:scale-110 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash size={20} color="red" />
                        </button>
                      </div>
                    </li>
                    <li className="text-sm text-essenza-text/90">{product.product.category.name}</li>
                    <li className="font-medium">
                      <p>Cantidad: {product.quantity}</p>
                      <p className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="aumentar cantidad"
                          title="aumentar cantidad"
                          onClick={() => increaseQuantity(product.product.id)}
                          disabled={product.product.stock <= product.quantity || isSubmitting}
                          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <PlusCircle size={24} color="green" className="transition-transform hover:scale-105 active:scale-90" />
                        </button>
                        <button
                          type="button"
                          aria-label="disminuir cantidad"
                          title="disminuir cantidad"
                          onClick={() => decreaseQuantity(product.product.id)}
                          disabled={product.quantity <= 1 || isSubmitting}
                          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <MinusCircle size={24} color="red" className="transition-transform hover:scale-105 active:scale-90" />
                        </button>
                      </p>
                    </li>
                    <li className="text-sm font-medium">Precio unitario: {formatCurrency(product.product.price)}</li>
                    <li className="py-1 border-t border-gray-200 font-medium">Subtotal: {formatCurrency(product.product.price * product.quantity)}</li>
                  </ul>
                ))}
                <p className="mt-4 text-lg font-medium">Total: {formatCurrency(total)}</p>
                <button
                  type="submit"
                  aria-label="confirmar ventas"
                  title="confirmar ventas"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-essenza-primary/90 disabled:opacity-50 disabled:cursor-not-allowed
                 text-white rounded-xl px-6 py-2 transition-all hover:opacity-90 cursor-pointer active:scale-90"
                >
                  {isSubmitting ? "Registrando venta..." : "Confirmar venta"}
                </button>
              </div>
            ) : (
              <p className="mt-2 text-sm text-essenza-text/80">Todavía no has agregado productos...</p>
            )}
          </div>
        </aside>

      </div>
    </section>
  )
}