import { supabase, Producto } from "@/lib/supabase";
import InventarioClient from "./InventarioClient";

export const dynamic = "force-dynamic";

async function obtenerProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error cargando inventario:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function AdminInventario() {
  const productos = await obtenerProductos();
  return <InventarioClient productosIniciales={productos} />;
}
