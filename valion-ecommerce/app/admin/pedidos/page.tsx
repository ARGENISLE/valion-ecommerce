"use client";

import { useState } from "react";

type Estado = "Pendiente" | "Pagado" | "En preparación" | "Enviado" | "Entregado" | "Cancelado";

const estados: Estado[] = ["Pendiente", "Pagado", "En preparación", "Enviado", "Entregado", "Cancelado"];

const coloresEstado: Record<Estado, string> = {
  "Pendiente": "bg-slate-100 text-slate-600",
  "Pagado": "bg-blue-100 text-blue-700",
  "En preparación": "bg-amber-100 text-amber-700",
  "Enviado": "bg-purple-100 text-purple-700",
  "Entregado": "bg-green-100 text-green-700",
  "Cancelado": "bg-red-100 text-red-700",
};

type Pedido = {
  id: string;
  cliente: string;
  fecha: string;
  total: number;
  metodoPago: string;
  estado: Estado;
};

const pedidosIniciales: Pedido[] = [
  { id: "VAL-10238", cliente: "María Torres", fecha: "26 Ago 2026", total: 59.98, metodoPago: "Tarjeta", estado: "Pendiente" },
  { id: "VAL-10237", cliente: "Carlos Pérez", fecha: "26 Ago 2026", total: 179.99, metodoPago: "PayPal", estado: "Pagado" },
  { id: "VAL-10236", cliente: "Ana Gómez", fecha: "25 Ago 2026", total: 39.99, metodoPago: "Pago Móvil", estado: "En preparación" },
  { id: "VAL-10235", cliente: "Luis Ramírez", fecha: "25 Ago 2026", total: 89.99, metodoPago: "Tarjeta", estado: "Pendiente" },
  { id: "VAL-10234", cliente: "Sofía Martínez", fecha: "24 Ago 2026", total: 19.99, metodoPago: "Tarjeta", estado: "Enviado" },
  { id: "VAL-10233", cliente: "Jorge Díaz", fecha: "23 Ago 2026", total: 120.0, metodoPago: "PayPal", estado: "Entregado" },
  { id: "VAL-10232", cliente: "Valeria Ruiz", fecha: "22 Ago 2026", total: 45.0, metodoPago: "Tarjeta", estado: "Cancelado" },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminPedidos() {
  const [filtro, setFiltro] = useState<"Todos" | Estado>("Todos");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);

  const pedidosFiltrados =
    filtro === "Todos" ? pedidos : pedidos.filter((p) => p.estado === filtro);

  function cambiarEstado(id: string, nuevoEstado: Estado) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    );
    setPedidoSeleccionado((prev) => (prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev));
  }

  return (
    <div className="flex min-h-screen bg-valion-bg">
      {/* Sidebar */}
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
          </div>
        </header>

        <main className="p-6">
          {/* Filtros por estado */}
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

          {/* Tabla de pedidos */}
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
                    <td className="px-4 py-3 font-medium text-valion-ink">#{p.id}</td>
                    <td className="px-4 py-3 text-slate-600">{p.cliente}</td>
                    <td className="px-4 py-3 text-slate-500">{p.fecha}</td>
                    <td className="px-4 py-3 font-medium text-valion-ink">${p.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-500">{p.metodoPago}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${coloresEstado[p.estado]}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setPedidoSeleccionado(p)}
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

      {/* Modal de detalle */}
      {pedidoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">
                Pedido #{pedidoSeleccionado.id}
              </h2>
              <button
                onClick={() => setPedidoSeleccionado(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Cliente</span><span className="font-medium text-valion-ink">{pedidoSeleccionado.cliente}</span></div>
              <div className="flex justify-between"><span>Fecha</span><span>{pedidoSeleccionado.fecha}</span></div>
              <div className="flex justify-between"><span>Método de pago</span><span>{pedidoSeleccionado.metodoPago}</span></div>
              <div className="flex justify-between"><span>Total</span><span className="font-display text-lg font-extrabold text-valion-orange">${pedidoSeleccionado.total.toFixed(2)}</span></div>
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-valion-ink">Cambiar estado:</span>
              <select
                value={pedidoSeleccionado.estado}
                onChange={(e) => cambiarEstado(pedidoSeleccionado.id, e.target.value as Estado)}
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {estados.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 rounded-md border border-valion-navy py-2 text-sm font-medium text-valion-navy hover:bg-valion-navy hover:text-white">
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
