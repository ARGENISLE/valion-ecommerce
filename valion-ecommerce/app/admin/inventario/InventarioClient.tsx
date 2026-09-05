"use client";

import { useState } from "react";
import { supabase, Producto } from "@/lib/supabase";
import BotonCerrarSesion from "../BotonCerrarSesion";
const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function InventarioClient({
  productosIniciales,
}: {
  productosIniciales: Producto[];
}) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  function estadoStock(p: Producto) {
    if (p.stock === 0) return { texto: "Agotado", color: "bg-red-100 text-red-700" };
    if (p.stock <= p.umbral_stock_bajo) return { texto: "Stock bajo", color: "bg-amber-100 text-amber-700" };
    return { texto: "Disponible", color: "bg-green-100 text-green-700" };
  }

  async function eliminarProducto(id: number) {
    if (!confirm("¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.")) return;
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  async function guardarEdicion() {
    if (!editando) return;
    setGuardando(true);
    setErrorMsg("");

    const { error } = await supabase
      .from("productos")
      .update({
        nombre: editando.nombre,
        precio: editando.precio,
        stock: editando.stock,
        umbral_stock_bajo: editando.umbral_stock_bajo,
      })
      .eq("id", editando.id);

    setGuardando(false);

    if (error) {
      setErrorMsg("Error al guardar: " + error.message);
      return;
    }

    setProductos((prev) => prev.map((p) => (p.id === editando.id ? editando : p)));
    setEditando(null);
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
                item.nombre === "Inventario" ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Inventario</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Administrador</span>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
          <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <input
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <div className="flex gap-2">
              <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-valion-ink">
                Importar CSV
              </button>
              <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-valion-ink">
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => {
                  const estado = estadoStock(p);
                  return (
                    <tr key={p.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3 font-medium text-valion-ink">{p.nombre}</td>
                      <td className="px-4 py-3 text-slate-500">{p.sku}</td>
                      <td className="px-4 py-3 text-slate-500">{p.categoria}</td>
                      <td className="px-4 py-3 text-valion-ink">${p.precio.toFixed(2)}</td>
                      <td className="px-4 py-3 text-valion-ink">{p.stock} u.</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estado.color}`}>
                          {estado.texto}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setEditando(p)}
                            className="text-xs font-medium text-valion-orange hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(p.id)}
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      No se encontraron productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">Editar producto</h2>
              <button onClick={() => setEditando(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nombre</label>
                <input
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Nombre"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Precio ($)</label>
                  <input
                    type="number"
                    value={editando.precio}
                    onChange={(e) => setEditando({ ...editando, precio: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Precio"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Stock (unidades)</label>
                  <input
                    type="number"
                    value={editando.stock}
                    onChange={(e) => setEditando({ ...editando, stock: Number(e.target.value) })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="Stock"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Umbral de stock bajo (unidades)
                </label>
                <input
                  type="number"
                  value={editando.umbral_stock_bajo}
                  onChange={(e) => setEditando({ ...editando, umbral_stock_bajo: Number(e.target.value) })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Umbral de stock bajo"
                />
              </div>
            </div>
            {errorMsg && <p className="mt-2 text-xs text-red-500">{errorMsg}</p>}
            <div className="mt-6 flex gap-2">
              <button onClick={() => setEditando(null)} className="flex-1 rounded-md border border-slate-300 py-2 text-sm">
                Cancelar
              </button>
              <button
                onClick={guardarEdicion}
                disabled={guardando}
                className="flex-1 rounded-md bg-valion-orange py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
