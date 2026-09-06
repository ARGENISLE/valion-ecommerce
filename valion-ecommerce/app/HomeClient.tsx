"use client";

import { useEffect, useState } from "react";
import { Producto } from "@/lib/supabase";
import { agregarAlCarrito, obtenerCarrito } from "@/lib/cart";

const categorias = [
  { nombre: "Electrónica", emoji: "📱" },
  { nombre: "Hogar", emoji: "🛋️" },
  { nombre: "Moda", emoji: "👕" },
  { nombre: "Deportes", emoji: "🏀" },
  { nombre: "Belleza", emoji: "💄" },
  { nombre: "Juguetes", emoji: "🧸" },
];

export default function HomeClient({ destacados }: { destacados: Producto[] }) {
  const [totalCarrito, setTotalCarrito] = useState(0);

  useEffect(() => {
    function actualizarContador() {
      const items = obtenerCarrito();
      setTotalCarrito(items.reduce((acc, i) => acc + i.cantidad, 0));
    }
    actualizarContador();
    window.addEventListener("carrito-actualizado", actualizarContador);
    return () => window.removeEventListener("carrito-actualizado", actualizarContador);
  }, []);

  function handleAgregar(producto: Producto) {
    agregarAlCarrito(
      {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio_oferta ?? producto.precio,
      },
      1
    );
  }

  return (
    <main className="min-h-screen bg-valion-bg">
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </span>
          <nav className="hidden gap-6 text-sm font-medium text-white/80 sm:flex">
            <a href="/productos" className="hover:text-white">Categorías</a>
            <a href="/productos" className="hover:text-white">Ofertas</a>
            <a href="#" className="hover:text-white">Mi cuenta</a>
          </nav>
          <a href="/carrito" className="btn-cta text-sm">Carrito ({totalCarrito})</a>
        </div>
      </header>

      <section className="bg-valion-navy pb-16 pt-10 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-display text-3xl font-extrabold sm:text-5xl">
            Todo lo que buscas,
            <span className="text-valion-amber"> en un solo lugar.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            Miles de productos, envíos rápidos y compra 100% segura.
          </p>
          <a href="/productos" className="btn-cta mt-8 inline-block text-base">
            Explorar ofertas
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-xl font-bold text-valion-ink">
          Categorías populares
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categorias.map((cat) => (
            
              key={cat.nombre}
              href={`/productos?categoria=${encodeURIComponent(cat.nombre)}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:shadow-md"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-sm font-medium text-valion-ink">
                {cat.nombre}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-display text-xl font-bold text-valion-ink">
          Ofertas del día
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {destacados.map((prod) => (
            <div
              key={prod.id}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <a href={`/productos/${prod.id}`} className="mb-3 flex h-32 items-center justify-center rounded bg-white">
                <span className="text-4xl">📦</span>
              </a>
              <a href={`/productos/${prod.id}`} className="text-sm font-medium text-valion-ink hover:text-valion-orange">
                {prod.nombre}
              </a>
              <div className="mt-2 flex items-center gap-2">
                {prod.precio_oferta ? (
                  <>
                    <span className="font-display text-lg font-extrabold text-valion-orange">
                      ${prod.precio_oferta}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ${prod.precio}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-lg font-extrabold text-valion-ink">
                    ${prod.precio}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleAgregar(prod)}
                disabled={prod.stock <= 0}
                className="btn-cta mt-3 text-xs disabled:opacity-50"
              >
                {prod.stock > 0 ? "Agregar al carrito" : "Agotado"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
