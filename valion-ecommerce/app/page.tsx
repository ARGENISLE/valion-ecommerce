import { supabase, Producto } from "@/lib/supabase";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

async function obtenerDestacados(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("id", { ascending: true })
    .limit(4);
  if (error) {
    console.error("Error cargando destacados:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function Home() {
  const destacados = await obtenerDestacados();
  return <HomeClient destacados={destacados} />;
}
