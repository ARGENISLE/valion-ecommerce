import { supabase, Producto } from "@/lib/supabase";
import FichaProductoClient from "./FichaProductoClient";

export const dynamic = "force-dynamic";

async function obtenerProducto(id: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error cargando producto:", error.message);
    return null;
  }
  return data;
}

async function obtenerRelacionados(categoria: string, idActual: number): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria", categoria)
    .neq("id", idActual)
    .limit(4);
  if (error) return [];
  return data ?? [];
}

export default async function FichaProducto({ params }: { params: { id: string } }) {
  const producto = await obtenerProducto(params.id);

  if (!producto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-valion-bg">
        <p className="text-slate-500">Producto no encontrado.</p>
      </main>
    );
  }

  const relacionados = await obtenerRelacionados(producto.categoria, producto.id);

  return <FichaProductoClient producto={producto} relacionados={relacionados} />;
}
