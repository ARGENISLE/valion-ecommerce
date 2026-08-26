"use client";

import { useState } from "react";

const pasos = ["Envío", "Pago", "Confirmación"];

export default function Checkout() {
  const [pasoActual, setPasoActual] = useState(0);
  const [metodoPago, setMetodoPago] = useState("tarjeta");

  const subtotal = 99.97;
  const envio = 0;
  const total = subtotal + envio;

  function siguientePaso() {
    setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
  }

  function pasoAnterior() {
    setPasoActual((p) => Math.max(p - 1, 0));
  }

  return (
    <main className="min-h-screen bg-valion-bg">
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </a>
          <a href="/carrito" className="text-sm text-white/70 hover:text-white">
            ← Volver al carrito
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Indicador de pasos */}
        <div className="mb-8 flex items-center justify-center gap-4">
          {pasos.map((paso, i) => (
            <div key={paso} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    i <= pasoActual
                      ? "bg-valion-orange text-white"
                      : "bg-white text-slate-400 border border-slate-300"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs ${
                    i <= pasoActual ? "text-valion-ink font-medium" : "text-slate-400"
                  }`}
                >
                  {paso}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div
                  className={`h-0.5 w-12 ${
                    i < pasoActual ? "bg-valion-orange" : "bg-slate-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Formulario según el paso */}
          <div className="md:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              {pasoActual === 0 && (
                <>
                  <h2 className="font-display text-lg font-bold text-valion-ink">
                    Datos de envío
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Nombre completo"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Correo electrónico"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Dirección"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Ciudad"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Código postal"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Teléfono"
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                  </div>
                </>
              )}

              {pasoActual === 1 && (
                <>
                  <h2 className="font-display text-lg font-bold text-valion-ink">
                    Método de pago
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {[
                      { id: "tarjeta", label: "💳 Tarjeta de crédito/débito" },
                      { id: "paypal", label: "🅿️ PayPal" },
                      { id: "movil", label: "📱 Pago Móvil" },
                    ].map((op) => (
                      <label
                        key={op.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                          metodoPago === op.id
                            ? "border-valion-orange bg-valion-orange/5"
                            : "border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pago"
                          checked={metodoPago === op.id}
                          onChange={() => setMetodoPago(op.id)}
                        />
                        {op.label}
                      </label>
                    ))}
                  </div>

                  {metodoPago === "tarjeta" && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        placeholder="Número de tarjeta"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                      />
                      <input
                        placeholder="MM/AA"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="CVV"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                </>
              )}

              {pasoActual === 2 && (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✅
                  </div>
                  <h2 className="font-display text-xl font-bold text-valion-ink">
                    ¡Pedido confirmado!
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Tu pedido #VAL-10234 fue recibido y está siendo procesado.
                    Te enviaremos un correo con el número de seguimiento.
                  </p>
                  <a
                    href="/"
                    className="btn-cta mt-6 inline-block text-sm"
                  >
                    Volver al inicio
                  </a>
                </div>
              )}

              {pasoActual < 2 && (
                <div className="mt-6 flex justify-between">
                  {pasoActual > 0 ? (
                    <button
                      onClick={pasoAnterior}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm text-valion-ink"
                    >
                      Atrás
                    </button>
                  ) : (
                    <span />
                  )}
                  <button onClick={siguientePaso} className="btn-cta text-sm">
                    {pasoActual === 1 ? "Confirmar pedido" : "Continuar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          {pasoActual < 2 && (
            <div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-display text-lg font-bold text-valion-ink">
                  Resumen
                </h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-display text-lg font-extrabold text-valion-ink">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
