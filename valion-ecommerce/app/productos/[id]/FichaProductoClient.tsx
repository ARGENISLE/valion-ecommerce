"use client";

import { useEffect, useState } from "react";
import { Producto } from "@/lib/supabase";
import { agregarAlCarrito, obtenerCarrito } from "@/lib/cart";

export default function FichaProductoClient({
  producto,
  relacionados,
}: {
  producto: Producto;
  relacionados: Producto[];
}) {
      const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const [totalCarrito, setTotalCarrito] = useState(0);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);
  const [errorVariacion, setErrorVariacion] = useState("");

  const tieneTallas = !!producto.variaciones?.tallas?.length;
  const tieneColores = !!producto.variaciones?.colores?.length;

  function obtenerVariacionTexto(): string | undefined {
    const partes = [];
    if (tallaSeleccionada) partes.push(`Talla: ${tallaSeleccionada}`);
    if (colorSeleccionado) partes.push(`Color: ${colorSeleccionado}`);
    return partes.length > 0 ? partes.join(" / ") : undefined;
  }

  function variacionValida(): boolean {
    if (tieneTallas && !tallaSeleccionada) {
      setErrorVariacion("Selecciona una talla.");
      return false;
    }
    if (tieneColores && !colorSeleccionado) {
      setErrorVariacion("Selecciona un color.");
      return false;
    }
    setErrorVariacion("");
    return true;
  }

  useEffect(() => {
    function actualizarContador() {
      const items = obtenerCarrito();
      setTotalCarrito(items.reduce((acc, i) => acc + i.cantidad, 0));
    }
    actualizarContador();
    window.addEventListener("carrito-actualizado", actualizarContador);
    return () => window.removeEventListener("carrito-actualizado", actualizarContador);
  }, []);

  const precioFinal = producto.precio_oferta ?? producto.precio;

    function handleAgregar() {
    if (!variacionValida()) return;
    agregarAlCarrito(
      { id: producto.id, nombre: producto.nombre, precio: precioFinal, variacion: obtenerVariacionTexto() },
      cantidad
    );
    setMensaje("¡Producto agregado al carrito!");
    setTimeout(() => setMensaje(""), 2000);
  }

  function handleComprarAhora() {
    if (!variacionValida()) return;
    agregarAlCarrito(
      { id: producto.id, nombre: producto.nombre, precio: precioFinal, variacion: obtenerVariacionTexto() },
      cantidad
    );
    window.location.href = "/carrito";
  }
  return (
    <main className="min-h-screen bg-valion-bg">
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </a>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="hidden w-80 rounded-md px-3 py-2 text-sm text-valion-ink sm:block"
          />
                    <a href="/carrito" className="btn-cta text-sm">Carrito ({totalCarrito})</a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/" className="hover:text-valion-orange">Inicio</a>
          {" / "}
          <a href="/productos" className="hover:text-valion-orange">Productos</a>
          {" / "}
          <span className="text-valion-ink">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <span className="text-8xl">📦</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {producto.categoria}
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-valion-ink">
              {producto.nombre}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              {producto.precio_oferta ? (
                <>
                  <span className="font-display text-3xl font-extrabold text-valion-orange">
                    ${producto.precio_oferta}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    ${producto.precio}
                  </span>
                </>
              ) : (
                <span className="font-display text-3xl font-extrabold text-valion-ink">
                  ${producto.precio}
                </span>
              )}
            </div>

                        <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {producto.descripcion}
            </p>

            {tieneTallas && (
              <div className="mt-4">
                <span className="text-sm font-medium text-valion-ink">Talla</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {producto.variaciones!.tallas!.map((talla) => (
                    <button
                      key={talla}
                      onClick={() => setTallaSeleccionada(talla)}
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        tallaSeleccionada === talla
                          ? "border-valion-orange bg-valion-orange/10 font-bold text-valion-orange"
                          : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tieneColores && (
              <div className="mt-4">
                <span className="text-sm font-medium text-valion-ink">Color</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {producto.variaciones!.colores!.map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorSeleccionado(color)}
                      className={`rounded-md border px-3 py-1.5 text-sm ${
                        colorSeleccionado === color
                          ? "border-valion-orange bg-valion-orange/10 font-bold text-valion-orange"
                          : "border-slate-300 text-slate-600"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorVariacion && (
              <p className="mt-2 text-xs text-red-500">{errorVariacion}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-slate-300">
                <button
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  className="px-3 py-2 text-slate-500"
                >
                  -
                </button>
                <span className="px-4 text-sm">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="px-3 py-2 text-slate-500"
                >
                  +
                </button>
              </div>
              {producto.stock > 0 ? (
                <span className="text-sm text-green-600">✔ En stock ({producto.stock})</span>
              ) : (
                <span className="text-sm text-red-500">✘ Agotado</span>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAgregar}
                disabled={producto.stock <= 0}
                className="btn-cta flex-1 text-sm disabled:opacity-50"
              >
                Agregar al carrito
              </button>
              <button
                onClick={handleComprarAhora}
                disabled={producto.stock <= 0}
                className="flex-1 rounded-lg border-2 border-valion-navy py-3 text-sm font-bold text-valion-navy hover:bg-valion-navy hover:text-white disabled:opacity-50"
              >
                Comprar ahora
              </button>
            </div>

            {mensaje && (
              <p className="mt-3 text-sm text-green-600">{mensaje}</p>
            )}

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              🚚 Envío gratis en compras mayores a $50 · Entrega estimada 2-4 días hábiles
            </div>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold text-valion-ink">
              También te puede interesar
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relacionados.map((p) => (
                <a
                  key={p.id}
                  href={`/productos/${p.id}`}
                  className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex h-32 items-center justify-center rounded bg-white">
                    <span className="text-4xl">📦</span>
                  </div>
                  <span className="text-sm font-medium text-valion-ink">{p.nombre}</span>
                  <span className="mt-2 font-display text-lg font-extrabold text-valion-ink">
                    ${p.precio_oferta ?? p.precio}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
