import { supabase } from "@/lib/supabase";
import ClientesClient from "./ClientesClient";

export const dynamic = "force-dynamic";

export type ClienteConStats = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  segmento: string;
  notas: string | null;
  compras: number;
  totalGastado: number;
};

async function obtenerClientes(): Promise<ClienteConStats[]> {
  const { data: clientes, error } = await supabase
    .from("clientes")
    .select("id, nombre, email, telefono, segmento, notas")
    .order("id", { ascending: true });

  if (error || !clientes) {
    console.error("Error cargando clientes:", error?.message);
    return [];
  }

  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("cliente_id, total");

  return clientes.map((c) => {
    const pedidosCliente = (pedidos ?? []).filter((p) => p.cliente_id === c.id);
    return {
      ...c,
      compras: pedidosCliente.length,
      totalGastado: pedidosCliente.reduce((acc, p) => acc + Number(p.total), 0),
    };
  });
}

export default async function AdminClientesPage() {
  const clientes = await obtenerClientes();
  return <ClientesClient clientesIniciales={clientes} />;
}
