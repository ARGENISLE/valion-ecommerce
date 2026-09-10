import { supabase } from "@/lib/supabase";
import ReportesClient from "./ReportesClient";

export const dynamic = "force-dynamic";

async function obtenerDatosReportes() {
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("id, total, creado_en");

  const { data: items } = await supabase
    .from("pedido_items")
    .select("cantidad, precio_unitario, producto_id, productos(nombre, categoria, stock)");

  return {
    pedidos: pedidos ?? [],
    items: (items as any) ?? [],
  };
}

export default async function AdminReportesPage() {
  const { pedidos, items } = await obtenerDatosReportes();
  return <ReportesClient pedidos={pedidos} items={items} />;
}
