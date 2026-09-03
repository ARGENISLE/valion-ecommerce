"use client";

import { useMemo, useState } from "react";
import { Producto } from "@/lib/supabase";

const categorias = ["Todas", "Electrónica", "Hogar", "Moda", "Deportes", "Belleza"];

type RangoPrecio = "menos25" | "25a75" | "mas75";

export default function ProductosGrid({ productos }: { productos: Producto[] }) {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [rangosPrecio, setRangosPrecio] = useState<RangoPrecio[]>([]);
  const [orden, setOrden] = useState<"relevantes" | "menor" | "mayor">("relevantes");

  function toggleRango(rango: RangoPrecio) {
    setRangosPrecio((prev) =>
      prev.includes(rango) ? prev.filter((r) => r !== rango) : [...prev, rango]
    );
  }

  function precioEfectivo(p: Producto) {
    return p.precio_oferta ?? p.precio;
  }

  function cumpleRangoPrecio(p: Producto) {
    if (rangosPrecio.length === 0) return true;
    const precio = precioEfectivo(p);
    return rangosPrecio.some((r) => {
      if (r === "menos25") return precio < 25;
      if (r === "25a75") return precio >= 25 && precio <= 75;
      return precio > 75;
    });
  }

  const productosFiltrados = useMemo(() => {
    let resultado = productos.filter(
      (p) =>
        (categoriaActiva === "Todas" || p.categoria === categoriaActiva) &&
        cumpleRangoPrecio(p)
    );

    if (orden === "menor") {
      resultado = [...resultado].sort((a, b) => precioEfectivo(a) - precioEfectivo(b));
    } else if (orden === "mayor") {
      resultado = [...resultado].sort((a, b) => precioEfectivo(b) - precioEfectivo(a));
    }

    return resultado;
  }, [productos, categoriaActiva, rangosPrecio, orden]);

  return (
    <div className="mt-6 flex flex-col gap-6 md:flex-row">
      {/* Filtros */}
      <aside className="w-full shrink-0 md:w-56">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-display text-sm font-bold text-valion-ink">
            Categorías
          </h2>
          <ul className="space-y-2 text-sm">
            {categorias.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setCategoriaActiva(cat)}
                  className={
                    categoriaActiva === cat
                      ? "font-bold text-valion-orange"
                      : "text-slate-600 hover:text-valion-orange"
                  }
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <h2 className="mb-3 mt-6 font-display text-sm font-bold text-valion-ink">
            Precio
          </h2>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rangosPrecio.includes("menos25")}
                onChange={() => toggleRango("menos25")}
              />
              Menos de $25
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rangosPrecio.includes("25a75")}
                onChange={() => toggleRango("25a75")}
              />
              $25 - $75
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rangosPrecio.includes("mas75")}
                onChange={() => toggleRango("mas75")}
              />
              Más de $75
            </label>
          </div>
        </div>
      </aside>

      {/* Grid de productos */}
      <section className="flex-1">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span>{productosFiltrados.length} productos encontrados</span>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as typeof orden)}
            className="rounded border border-slate-200 px-2 py-1"
          >
            <option value="relevantes">Más relevantes</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </div>

        {productosFiltrados.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
            No se encontraron productos con estos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {productosFiltrados.map((p) => (
              <a
                key={p.id}
                href={`/productos/${p.id}`}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex h-32 items-center justify-center rounded bg-white">
                  <span className="text-4xl">📦</span>
                </div>
                <span className="text-xs text-slate-400">{p.categoria}</span>
                <span className="mt-1 text-sm font-medium text-valion-ink">
                  {p.nombre}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {p.precio_oferta ? (
                    <>
                      <span className="font-display text-lg font-extrabold text-valion-orange">
                        ${p.precio_oferta}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ${p.precio}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-lg font-extrabold text-valion-ink">
                      ${p.precio}
                    </span>
                  )}
                </div>
                <button className="btn-cta mt-3 text-xs">Agregar al carrito</button>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
