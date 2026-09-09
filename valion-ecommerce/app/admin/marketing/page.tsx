import { supabase } from "@/lib/supabase";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";

export type Cupon = {
  id: number;
  codigo: string;
  tipo: string;
  valor: string;
  usos: number;
  limite_usos: number;
  expira: string | null;
  activo: boolean;
};

async function obtenerCupones(): Promise<Cupon[]> {
  const { data, error } = await supabase
    .from("cupones")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.error("Error cargando cupones:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function AdminMarketingPage() {
  const cupones = await obtenerCupones();
  return <MarketingClient cuponesIniciales={cupones} />;
}
