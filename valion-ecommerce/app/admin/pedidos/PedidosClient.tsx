"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import BotonCerrarSesion from "../BotonCerrarSesion";
import { PedidoConCliente } from "./page";

const estados = ["Pendiente", "Pagado", "En preparación", "Enviado", "Entregado", "Cancelado"];

const coloresEstado: Record<string, string> = {
  "Pendiente": "bg-slate-100 text-slate-600",
  "Pagado": "bg-blue-100 text-blue-700",
  "En preparación": "bg-amber-100 text-amber-700",
  "Enviado": "bg-purple-100 text-purple-700",
  "Entregado": "bg-green-100 text-green-700",
  "Cancelado": "bg-red-100 text-red-700",
};

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

type ItemDetalle = {
  cantidad: number;
  precio_unitario: number;
  productos: { nombre: string } | null;
};

export default function PedidosClient({
  pedidosIniciales,
}: {
  pedidosIniciales: PedidoConCliente[];
}) {
  const [pedidos, setPedidos] = useState<PedidoConCliente[]>(pedidosIniciales);
  const [filtro, setFiltro] = useState<"Todos" | string>("Todos");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoConCliente | null>(null);
  const [items, setItems] = useState<ItemDetalle[]>([]);
  const [cargandoItems, setCargandoItems] = useState(false);

  const pedidosFiltrados =
    filtro === "Todos" ? pedidos : pedidos.filter((p) => p.estado === filtro);

  async function abrirDetalle(p: PedidoConCliente) {
    setPedidoSeleccionado(p);
    setCargandoItems(true);
    const { data } = await supabase
      .from("pedido_items")
      .select("cantidad, precio_unitario, productos(nombre)")
      .eq("pedido_id", p.id);
    setItems((data as any) ?? []);
    setCargandoItems(false);
  }

  async function cambiarEstado(id: number, nuevoEstado: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
    setPedidoSeleccionado((prev) => (prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev));
    await supabase.from("pedidos").update({ estado: nuevoEstado }).eq("id", id);
  }

    function formatearFecha(fechaIso: string) {
    return new Date(fechaIso).toLocaleDateString("es-VE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  async function generarFacturaPDF() {
    if (!pedidoSeleccionado) return;

    if (!(window as any).jspdf) {
      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    }

    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    const numeroPedido = `VAL-${pedidoSeleccionado.id.toString().padStart(5, "0")}`;

    doc.setFontSize(20);
    doc.setTextColor(20, 30, 60);
    doc.text("VALION", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Factura de venta", 14, 27);

    doc.setDrawColor(230, 230, 230);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(`Pedido: #${numeroPedido}`, 14, 42);
    doc.text(`Fecha: ${formatearFecha(pedidoSeleccionado.creado_en)}`, 14, 49);
    doc.text(`Cliente: ${pedidoSeleccionado.clientes?.nombre ?? "—"}`, 14, 56);
    doc.text(`Correo: ${pedidoSeleccionado.clientes?.email ?? "—"}`, 14, 63);
    doc.text(`Método de pago: ${pedidoSeleccionado.metodo_pago}`, 14, 70);

    let y = 85;
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("Producto", 14, y);
    doc.text("Cant.", 130, y);
    doc.text("Subtotal", 165, y);
    y += 3;
    doc.line(14, y, 196, y);
    y += 8;

    doc.setTextColor(30, 30, 30);
    items.forEach((it) => {
      doc.text(it.productos?.nombre ?? "Producto", 14, y);
      doc.text(String(it.cantidad), 130, y);
      doc.text(`$${(it.precio_unitario * it.cantidad).toFixed(2)}`, 165, y);
      y += 8;
    });

    y += 4;
    doc.line(14, y, 196, y);
    y += 10;
    doc.setFontSize(13);
    doc.setTextColor(20, 30, 60);
    doc.text(`Total: $${pedidoSeleccionado.total.toFixed(2)}`, 140, y);

    doc.save(`factura-${numeroPedido}.pdf`);
  }

 

  return (
    <div className="flex min-h-screen bg-valion-bg">
      <aside className="hidden w-56 shrink-0 bg-valion-navy text-white md:block">
        <div className="px-5 py-5 font-display text-xl font-extrabold">
          VALION <span className="text-xs font-normal text-white/50">Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {menuAdmin.map((item) => (
            <a
              key={item.nombre}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                item.nombre === "Pedidos" ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Pedidos</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Administrador</span>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
            <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFiltro("Todos")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                filtro === "Todos" ? "bg-valion-navy text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Todos ({pedidos.length})
            </button>
            {estados.map((e) => (
              <button
                key={e}
                onClick={() => setFiltro(e)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filtro === e ? "bg-valion-navy text-white" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {e} ({pedidos.filter((p) => p.estado === e).length})
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Pago</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-valion-ink">
                      #VAL-{p.id.toString().padStart(5, "0")}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.clientes?.nombre ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{formatearFecha(p.creado_en)}</td>
                    <td className="px-4 py-3 font-medium text-valion-ink">${p.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-500 capitalize">{p.metodo_pago}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${coloresEstado[p.estado] ?? "bg-slate-100 text-slate-600"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => abrirDetalle(p)}
                        className="text-xs font-medium text-valion-orange hover:underline"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
                {pedidosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No hay pedidos con este estado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">
                Pedido #VAL-{pedidoSeleccionado.id.toString().padStart(5, "0")}
              </h2>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Cliente</span><span className="font-medium text-valion-ink">{pedidoSeleccionado.clientes?.nombre ?? "—"}</span></div>
              <div className="flex justify-between"><span>Correo</span><span>{pedidoSeleccionado.clientes?.email ?? "—"}</span></div>
              <div className="flex justify-between"><span>Fecha</span><span>{formatearFecha(pedidoSeleccionado.creado_en)}</span></div>
              <div className="flex justify-between"><span>Método de pago</span><span className="capitalize">{pedidoSeleccionado.metodo_pago}</span></div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-valion-ink">Productos:</span>
              {cargandoItems ? (
                <p className="mt-2 text-xs text-slate-400">Cargando...</p>
              ) : (
                <div className="mt-2 space-y-1 text-sm text-slate-600">
                  {items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.productos?.nombre ?? "Producto"} x{it.cantidad}</span>
                      <span>${(it.precio_unitario * it.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm">
              <span className="font-medium text-valion-ink">Total</span>
              <span className="font-display text-lg font-extrabold text-valion-orange">${pedidoSeleccionado.total.toFixed(2)}</span>
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-valion-ink">Cambiar estado:</span>
              <select
                value={pedidoSeleccionado.estado}
                onChange={(e) => cambiarEstado(pedidoSeleccionado.id, e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
                        </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={generarFacturaPDF}
                className="flex-1 rounded-md border border-valion-navy py-2 text-sm font-medium text-valion-navy hover:bg-valion-navy hover:text-white"
              >
                Generar factura PDF
              </button>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="rounded-md bg-valion-orange px-4 py-2 text-sm font-medium text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
