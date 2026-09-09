import { supabase } from "@/lib/supabase";
import PedidosClient from "./PedidosClient";

export const dynamic = "force-dynamic";

export type PedidoConCliente = {
  id: number;
  total: number;
  metodo_pago: string;
  estado: string;
  creado_en: string;
  clientes: { nombre: string; email: string } | null;
};

async function obtenerPedidos(): Promise<PedidoConCliente[]> {
  const { data, error } = await supabase
    .from("pedidos")
    .select("id, total, metodo_pago, estado, creado_en, clientes(nombre, email)")
    .order("creado_en", { ascending: false });
  if (error) {
    console.error("Error cargando pedidos:", error.message);
    return [];
  }
  return (data as any) ?? [];
}

export default async function AdminPedidosPage() {
  const pedidos = await obtenerPedidos();
  return <PedidosClient pedidosIniciales={pedidos} />;
}
