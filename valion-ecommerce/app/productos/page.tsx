import { supabase, Producto } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const categorias = ["Todas", "Electrónica", "Hogar", "Moda", "Deportes", "Belleza"];

async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error cargando productos:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function Productos() {
  const productos = await obtenerProductos();

  return (
    <main className="min-h-screen bg-valion-bg">
      {/* Header simple */}
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
          <button className="btn-cta text-sm">Carrito (0)</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-valion-ink">
          Todos los productos
        </h1>

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
                    <button className="text-slate-600 hover:text-valion-orange">
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
                  <input type="checkbox" /> Menos de $25
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> $25 - $75
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Más de $75
                </label>
              </div>
            </div>
          </aside>

          {/* Grid de productos */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>{productos.length} productos encontrados</span>
              <select className="rounded border border-slate-200 px-2 py-1">
                <option>Más relevantes</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
              </select>
            </div>

            {productos.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
                No hay productos disponibles en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {productos.map((p) => (
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
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
