"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  ItemCarrito,
  obtenerCarrito,
  actualizarCantidad,
  eliminarDelCarrito,
  guardarCuponAplicado,
  obtenerCuponAplicado,
  quitarCuponAplicado,
  guardarEmailCarrito,
  obtenerEmailCarrito,
  sincronizarCarritoAbandonado,
} from "@/lib/cart";
export default function Carrito() {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cupon, setCupon] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [envioGratisCupon, setEnvioGratisCupon] = useState(false);
    const [mensajeCupon, setMensajeCupon] = useState("");
  const [emailCarrito, setEmailCarrito] = useState("");
  const [emailGuardado, setEmailGuardado] = useState(false);
    useEffect(() => {
    function cargar() {
      setItems(obtenerCarrito());
    }
    cargar();
    const emailPrevio = obtenerEmailCarrito();
    if (emailPrevio) {
      setEmailCarrito(emailPrevio);
      setEmailGuardado(true);
    }
    window.addEventListener("carrito-actualizado", cargar);
    return () => window.removeEventListener("carrito-actualizado", cargar);
  }, []);

  useEffect(() => {
    if (emailGuardado) {
      sincronizarCarritoAbandonado();
    }
  }, [items, emailGuardado]);

  function handleGuardarEmail() {
    const email = emailCarrito.trim();
    if (!email || !email.includes("@")) return;
    guardarEmailCarrito(email);
    setEmailGuardado(true);
    sincronizarCarritoAbandonado();
  }

  function cambiarCantidad(id: number, delta: number, variacion?: string) {
    const item = items.find((i) => i.id === id && i.variacion === variacion);
    if (!item) return;
    actualizarCantidad(id, Math.max(1, item.cantidad + delta), variacion);
  }

  function eliminarItem(id: number, variacion?: string) {
    eliminarDelCarrito(id, variacion);
  }

  async function aplicarCupon() {
    const codigo = cupon.trim().toUpperCase();
    if (!codigo) return;

    const { data, error } = await supabase
      .from("cupones")
      .select("*")
      .eq("codigo", codigo)
      .eq("activo", true)
      .maybeSingle();

    if (error || !data) {
      setDescuentoAplicado(0);
      setEnvioGratisCupon(false);
      quitarCuponAplicado();
      setMensajeCupon("Cupón no válido.");
      return;
    }

    if (data.usos >= data.limite_usos) {
      setDescuentoAplicado(0);
      setEnvioGratisCupon(false);
      quitarCuponAplicado();
      setMensajeCupon("Este cupón ya alcanzó su límite de usos.");
      return;
    }

    let porcentaje = 0;
    let envioGratis = false;

    if (data.tipo === "Porcentaje") {
      porcentaje = parseFloat(data.valor.replace("%", "")) / 100;
    } else if (data.tipo === "Envío gratis") {
      envioGratis = true;
    }

    setDescuentoAplicado(porcentaje);
    setEnvioGratisCupon(envioGratis);
    guardarCuponAplicado({
      codigo: data.codigo,
      tipo: data.tipo,
      valor: data.valor,
      descuentoPorcentaje: porcentaje,
      envioGratis,
    });
    setMensajeCupon(`¡Cupón aplicado! ${data.tipo === "Envío gratis" ? "Envío gratis" : data.valor + " de descuento"}.`);
  }

  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const descuento = subtotal * descuentoAplicado;
  const envio = subtotal > 50 || envioGratisCupon ? 0 : 5.99;
  const total = subtotal - descuento + (items.length > 0 ? envio : 0);

  function irAlCheckout() {
    window.location.href = "/checkout";
  }

  return (
    <main className="min-h-screen bg-valion-bg">
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
            <div className="md:col-span-2">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.variacion ?? "base"}`}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded bg-valion-bg">
                      <span className="text-3xl">📦</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-valion-ink">
                        {item.nombre}
                      </span>
                      {item.variacion && (
                        <div className="text-xs text-slate-400">{item.variacion}</div>
                      )}
                      <div className="mt-1 font-display text-lg font-extrabold text-valion-orange">
                        ${item.precio.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center rounded-md border border-slate-300">
                      <button
                        onClick={() => cambiarCantidad(item.id, -1, item.variacion)}
                        className="px-3 py-1.5 text-slate-500 hover:text-valion-orange"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm">{item.cantidad}</span>
                      <button
                        onClick={() => cambiarCantidad(item.id, 1, item.variacion)}
                        className="px-3 py-1.5 text-slate-500 hover:text-valion-orange"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => eliminarItem(item.id, item.variacion)}
                      className="ml-2 text-sm text-slate-400 hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-display text-lg font-bold text-valion-ink">
                  Resumen del pedido
                </h2>

                                {!emailGuardado && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="email"
                      placeholder="Tu email (para guardar tu carrito)"
                      value={emailCarrito}
                      onChange={(e) => setEmailCarrito(e.target.value)}
                      className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <button
                      onClick={handleGuardarEmail}
                      className="rounded-md border border-valion-navy px-3 py-2 text-sm font-medium text-valion-navy hover:bg-valion-navy hover:text-white"
                    >
                      Guardar
                    </button>
                  </div>
                )}

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

                <button onClick={irAlCheckout} className="btn-cta mt-5 w-full text-sm">
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
