"use client";

import { useState } from "react";

type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

const itemsIniciales: ItemCarrito[] = [
  { id: 1, nombre: "Audífonos Inalámbricos", precio: 19.99, cantidad: 1 },
  { id: 3, nombre: "Zapatillas Running Pro", precio: 39.99, cantidad: 2 },
];

export default function Carrito() {
  const [items, setItems] = useState<ItemCarrito[]>(itemsIniciales);
  const [cupon, setCupon] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState("");

  function cambiarCantidad(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function aplicarCupon() {
    if (cupon.trim().toUpperCase() === "VALION10") {
      setDescuentoAplicado(0.1);
      setMensajeCupon("¡Cupón aplicado! 10% de descuento.");
    } else {
      setDescuentoAplicado(0);
      setMensajeCupon("Cupón no válido.");
    }
  }

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const descuento = subtotal * descuentoAplicado;
  const envio = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - descuento + (items.length > 0 ? envio : 0);

  return (
    <main className="min-h-screen bg-valion-bg">
      {/* Header */}
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </a>
          <a href="/productos" className="text-sm text-white/70 hover:text-white">
            ← Seguir comprando
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-valion-ink">
          Tu carrito
        </h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
            Tu carrito está vacío.{" "}
            <a href="/productos" className="text-valion-orange hover:underline">
              Explorar productos
            </a>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Lista de productos */}
            <div className="md:col-span-2">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-valion-bg">
                      <span className="text-3xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-valion-ink">
                        {item.nombre}
                      </span>
                      <div className="mt-1 font-display text-lg font-extrabold text-valion-orange">
                        ${item.precio.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center rounded-md border border-slate-300">
                      <button
                        onClick={() => cambiarCantidad(item.id, -1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-valion-orange"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm">{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.id, 1)}
                        className="px-3 py-1.5 text-slate-500 hover:text-valion-orange"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="ml-2 text-sm text-slate-400 hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen */}
            <div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-display text-lg font-bold text-valion-ink">
                  Resumen del pedido
                </h2>

                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Código de cupón"
                    value={cupon}
                    onChange={(e) => setCupon(e.target.value)}
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={aplicarCupon}
                    className="rounded-md border border-valion-navy px-3 py-2 text-sm font-medium text-valion-navy hover:bg-valion-navy hover:text-white"
                  >
                    Aplicar
                  </button>
                </div>
                {mensajeCupon && (
                  <p
                    className={`mt-2 text-xs ${
                      descuentoAplicado > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {mensajeCupon}
                  </p>
                )}

                <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {descuentoAplicado > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento (10%)</span>
                      <span>-${descuento.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-display text-lg font-extrabold text-valion-ink">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button className="btn-cta mt-5 w-full text-sm">
                  Proceder al pago
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  Prueba el cupón: <strong>VALION10</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
