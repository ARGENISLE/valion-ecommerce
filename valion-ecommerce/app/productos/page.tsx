import { supabase, Producto } from "@/lib/supabase";
import ProductosGrid from "./ProductosGrid";

export const dynamic = "force-dynamic";

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

        <ProductosGrid productos={productos} />
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
