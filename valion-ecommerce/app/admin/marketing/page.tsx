"use client";

import { useState } from "react";
import BotonCerrarSesion from "../BotonCerrarSesion";
type Cupon = {
  id: number;
  codigo: string;
  tipo: "Porcentaje" | "Monto fijo" | "Envío gratis";
  valor: string;
  usos: number;
  limiteUsos: number;
  expira: string;
  activo: boolean;
};

const cuponesIniciales: Cupon[] = [
  { id: 1, codigo: "VALION10", tipo: "Porcentaje", valor: "10%", usos: 84, limiteUsos: 500, expira: "31 Dic 2026", activo: true },
  { id: 2, codigo: "ENVIOGRATIS", tipo: "Envío gratis", valor: "—", usos: 210, limiteUsos: 1000, expira: "30 Sep 2026", activo: true },
  { id: 3, codigo: "BIENVENIDA5", tipo: "Monto fijo", valor: "$5.00", usos: 320, limiteUsos: 300, expira: "15 Ago 2026", activo: false },
];

type CarritoAbandonado = {
  id: number;
  cliente: string;
  email: string;
  productos: string;
  total: number;
  horas: number;
  recordatorioEnviado: boolean;
};

const carritosIniciales: CarritoAbandonado[] = [
  { id: 1, cliente: "Pedro Salazar", email: "pedro.salazar@email.com", productos: "Bicicleta Montaña 21V", total: 179.99, horas: 3, recordatorioEnviado: false },
  { id: 2, cliente: "Laura Fernández", email: "laura.fernandez@email.com", productos: "Set de Maquillaje + Camiseta", total: 44.98, horas: 8, recordatorioEnviado: false },
  { id: 3, cliente: "Diego Morales", email: "diego.morales@email.com", productos: "Robot de Cocina Multifunción", total: 120.0, horas: 20, recordatorioEnviado: true },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminMarketing() {
  const [cupones, setCupones] = useState<Cupon[]>(cuponesIniciales);
  const [carritos, setCarritos] = useState<CarritoAbandonado[]>(carritosIniciales);
  const [mostrarNuevoCupon, setMostrarNuevoCupon] = useState(false);
  const [nuevoCodigo, setNuevoCodigo] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState<Cupon["tipo"]>("Porcentaje");
  const [nuevoValor, setNuevoValor] = useState("");

  function toggleActivo(id: number) {
    setCupones((prev) => prev.map((c) => (c.id === id ? { ...c, activo: !c.activo } : c)));
  }

  function crearCupon() {
    if (!nuevoCodigo.trim()) return;
    setCupones((prev) => [
      ...prev,
      {
        id: Date.now(),
        codigo: nuevoCodigo.toUpperCase(),
        tipo: nuevoTipo,
        valor: nuevoValor || "—",
        usos: 0,
        limiteUsos: 100,
        expira: "Sin definir",
        activo: true,
      },
    ]);
    setNuevoCodigo("");
    setNuevoValor("");
    setMostrarNuevoCupon(false);
  }

  function enviarRecordatorio(id: number) {
    setCarritos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, recordatorioEnviado: true } : c))
    );
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
                item.nombre === "Marketing" ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Marketing</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Administrador</span>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
          <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          {/* Cupones */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-valion-ink">
                Cupones y descuentos
              </h2>
              <button onClick={() => setMostrarNuevoCupon(true)} className="btn-cta text-sm">
                + Nuevo cupón
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Código</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3">Usos</th>
                    <th className="px-4 py-3">Expira</th>
                    <th className="px-4 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cupones.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-mono font-medium text-valion-ink">{c.codigo}</td>
                      <td className="px-4 py-3 text-slate-500">{c.tipo}</td>
                      <td className="px-4 py-3 text-valion-ink">{c.valor}</td>
                      <td className="px-4 py-3 text-slate-500">{c.usos} / {c.limiteUsos}</td>
                      <td className="px-4 py-3 text-slate-500">{c.expira}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActivo(c.id)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            c.activo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {c.activo ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Carritos abandonados */}
          <section className="mt-8">
            <h2 className="mb-3 font-display text-base font-bold text-valion-ink">
              Recuperación de carritos abandonados
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Productos</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Abandonado hace</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {carritos.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3">
                        <div className="font-medium text-valion-ink">{c.cliente}</div>
                        <div className="text-xs text-slate-400">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{c.productos}</td>
                      <td className="px-4 py-3 font-medium text-valion-ink">${c.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-500">{c.horas} h</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => enviarRecordatorio(c.id)}
                          disabled={c.recordatorioEnviado}
                          className={`text-xs font-medium ${
                            c.recordatorioEnviado
                              ? "text-slate-400"
                              : "text-valion-orange hover:underline"
                          }`}
                        >
                          {c.recordatorioEnviado ? "Recordatorio enviado ✓" : "Enviar recordatorio"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {mostrarNuevoCupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">Nuevo cupón</h2>
              <button onClick={() => setMostrarNuevoCupon(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <input
                placeholder="Código (ej: VERANO20)"
                value={nuevoCodigo}
                onChange={(e) => setNuevoCodigo(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
              <select
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value as Cupon["tipo"])}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option>Porcentaje</option>
                <option>Monto fijo</option>
                <option>Envío gratis</option>
              </select>
              {nuevoTipo !== "Envío gratis" && (
                <input
                  placeholder={nuevoTipo === "Porcentaje" ? "Ej: 15%" : "Ej: $10.00"}
                  value={nuevoValor}
                  onChange={(e) => setNuevoValor(e.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              )}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setMostrarNuevoCupon(false)} className="flex-1 rounded-md border border-slate-300 py-2 text-sm">
                Cancelar
              </button>
              <button onClick={crearCupon} className="flex-1 rounded-md bg-valion-orange py-2 text-sm font-medium text-white">
                Crear cupón
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
