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

export type CarritoAbandonado = {
  id: number;
  email: string;
  nombre: string | null;
  items: { nombre: string; cantidad: number }[];
  total: number;
  estado: string;
  actualizado_en: string;
  recordatorio_enviado: boolean;
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

async function obtenerCarritosAbandonados(): Promise<CarritoAbandonado[]> {
  const { data, error } = await supabase
    .from("carritos_abandonados")
    .select("*")
    .eq("estado", "activo")
    .order("actualizado_en", { ascending: false });
  if (error) {
    console.error("Error cargando carritos abandonados:", error.message);
    return [];
  }
  return data ?? [];
}

export default async function AdminMarketingPage() {
  const cupones = await obtenerCupones();
  const carritos = await obtenerCarritosAbandonados();
  return <MarketingClient cuponesIniciales={cupones} carritosIniciales={carritos} />;
}
