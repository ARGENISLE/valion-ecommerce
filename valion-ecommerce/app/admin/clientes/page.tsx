"use client";

import { useState } from "react";
import BotonCerrarSesion from "../BotonCerrarSesion";
type Segmento = "Frecuente" | "Alto valor" | "Inactivo" | "Nuevo";

type Cliente = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  compras: number;
  totalGastado: number;
  segmento: Segmento;
  notas: string;
};

const coloresSegmento: Record<Segmento, string> = {
  "Frecuente": "bg-blue-100 text-blue-700",
  "Alto valor": "bg-purple-100 text-purple-700",
  "Inactivo": "bg-slate-100 text-slate-500",
  "Nuevo": "bg-green-100 text-green-700",
};

const clientesIniciales: Cliente[] = [
  { id: 1, nombre: "María Torres", email: "maria.torres@email.com", telefono: "+58 412-1234567", compras: 14, totalGastado: 892.5, segmento: "Alto valor", notas: "Prefiere contacto por WhatsApp." },
  { id: 2, nombre: "Carlos Pérez", email: "carlos.perez@email.com", telefono: "+58 414-2345678", compras: 6, totalGastado: 310.2, segmento: "Frecuente", notas: "" },
  { id: 3, nombre: "Ana Gómez", email: "ana.gomez@email.com", telefono: "+58 424-3456789", compras: 1, totalGastado: 39.99, segmento: "Nuevo", notas: "Primera compra hace 3 días." },
  { id: 4, nombre: "Luis Ramírez", email: "luis.ramirez@email.com", telefono: "+58 416-4567890", compras: 2, totalGastado: 129.98, segmento: "Nuevo", notas: "" },
  { id: 5, nombre: "Sofía Martínez", email: "sofia.martinez@email.com", telefono: "+58 412-5678901", compras: 22, totalGastado: 1450.75, segmento: "Alto valor", notas: "Cliente VIP, ofrecer descuentos exclusivos." },
  { id: 6, nombre: "Jorge Díaz", email: "jorge.diaz@email.com", telefono: "+58 424-6789012", compras: 3, totalGastado: 95.0, segmento: "Inactivo", notas: "Sin compras hace 5 meses." },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminClientes() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [filtro, setFiltro] = useState<"Todos" | Segmento>("Todos");
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);
  const [notaTemp, setNotaTemp] = useState("");

  const filtrados = filtro === "Todos" ? clientes : clientes.filter((c) => c.segmento === filtro);

  function abrirCliente(c: Cliente) {
    setSeleccionado(c);
    setNotaTemp(c.notas);
  }

  function guardarNota() {
    if (!seleccionado) return;
    setClientes((prev) =>
      prev.map((c) => (c.id === seleccionado.id ? { ...c, notas: notaTemp } : c))
    );
    setSeleccionado(null);
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
                item.nombre === "Clientes" ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Clientes</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Administrador</span>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
          <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {(["Todos", "Nuevo", "Frecuente", "Alto valor", "Inactivo"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFiltro(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filtro === s ? "bg-valion-navy text-white" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Compras</th>
                  <th className="px-4 py-3">Total gastado</th>
                  <th className="px-4 py-3">Segmento</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-valion-ink">{c.nombre}</td>
                    <td className="px-4 py-3 text-slate-500">
                      <div>{c.email}</div>
                      <div className="text-xs text-slate-400">{c.telefono}</div>
                    </td>
                    <td className="px-4 py-3 text-valion-ink">{c.compras}</td>
                    <td className="px-4 py-3 font-medium text-valion-ink">${c.totalGastado.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${coloresSegmento[c.segmento]}`}>
                        {c.segmento}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => abrirCliente(c)}
                        className="text-xs font-medium text-valion-orange hover:underline"
                      >
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">{seleccionado.nombre}</h2>
              <button onClick={() => setSeleccionado(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between"><span>Email</span><span className="text-valion-ink">{seleccionado.email}</span></div>
              <div className="flex justify-between"><span>Teléfono</span><span className="text-valion-ink">{seleccionado.telefono}</span></div>
              <div className="flex justify-between"><span>Compras totales</span><span className="text-valion-ink">{seleccionado.compras}</span></div>
              <div className="flex justify-between"><span>Total gastado</span><span className="font-display text-lg font-extrabold text-valion-orange">${seleccionado.totalGastado.toFixed(2)}</span></div>
              <div className="flex justify-between items-center"><span>Segmento</span><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${coloresSegmento[seleccionado.segmento]}`}>{seleccionado.segmento}</span></div>
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-valion-ink">Notas internas del equipo:</label>
              <textarea
                value={notaTemp}
                onChange={(e) => setNotaTemp(e.target.value)}
                rows={3}
                placeholder="Ej: prefiere contacto por WhatsApp, cliente sensible al precio, etc."
                className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setSeleccionado(null)} className="flex-1 rounded-md border border-slate-300 py-2 text-sm">
                Cancelar
              </button>
              <button onClick={guardarNota} className="flex-1 rounded-md bg-valion-orange py-2 text-sm font-medium text-white">
                Guardar nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
