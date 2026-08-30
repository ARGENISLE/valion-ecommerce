"use client";

import { useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  stock: number;
  umbralBajo: number;
};

const productosIniciales: Producto[] = [
  { id: 1, nombre: "Audífonos Inalámbricos", sku: "ELEC-001", categoria: "Electrónica", precio: 19.99, stock: 42, umbralBajo: 10 },
  { id: 2, nombre: "Set de Ollas Antiadherentes", sku: "HOG-014", categoria: "Hogar", precio: 89.99, stock: 15, umbralBajo: 5 },
  { id: 3, nombre: "Zapatillas Running Pro", sku: "DEP-022", categoria: "Deportes", precio: 39.99, stock: 8, umbralBajo: 10 },
  { id: 4, nombre: "Cámara de Seguridad WiFi", sku: "ELEC-009", categoria: "Electrónica", precio: 45.0, stock: 3, umbralBajo: 10 },
  { id: 5, nombre: "Camiseta Algodón Premium", sku: "MOD-031", categoria: "Moda", precio: 9.99, stock: 60, umbralBajo: 15 },
  { id: 6, nombre: "Set de Maquillaje Profesional", sku: "BEL-005", categoria: "Belleza", precio: 34.99, stock: 0, umbralBajo: 8 },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminInventario() {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  function estadoStock(p: Producto) {
    if (p.stock === 0) return { texto: "Agotado", color: "bg-red-100 text-red-700" };
    if (p.stock <= p.umbralBajo) return { texto: "Stock bajo", color: "bg-amber-100 text-amber-700" };
    return { texto: "Disponible", color: "bg-green-100 text-green-700" };
  }

  function eliminarProducto(id: number) {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  function guardarEdicion() {
    if (!editando) return;
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
              <button
                onClick={() => setMostrarNuevo(true)}
                className="btn-cta text-sm"
              >
                + Nuevo producto
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

      {/* Modal editar */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">Editar producto</h2>
              <button onClick={() => setEditando(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <input
                value={editando.nombre}
                onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Nombre"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={editando.precio}
                  onChange={(e) => setEditando({ ...editando, precio: Number(e.target.value) })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Precio"
                />
                <input
                  type="number"
                  value={editando.stock}
                  onChange={(e) => setEditando({ ...editando, stock: Number(e.target.value) })}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Stock"
                />
              </div>
              <input
                type="number"
                value={editando.umbralBajo}
                onChange={(e) => setEditando({ ...editando, umbralBajo: Number(e.target.value) })}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder="Umbral de stock bajo"
              />
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setEditando(null)} className="flex-1 rounded-md border border-slate-300 py-2 text-sm">
                Cancelar
              </button>
              <button onClick={guardarEdicion} className="flex-1 rounded-md bg-valion-orange py-2 text-sm font-medium text-white">
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo producto (simplificado) */}
      {mostrarNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">Nuevo producto</h2>
              <button onClick={() => setMostrarNuevo(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Esta ventana se conectará a la base de datos en el siguiente paso, para guardar productos reales con imágenes, variaciones y categorías.
            </p>
            <button onClick={() => setMostrarNuevo(false)} className="btn-cta mt-5 w-full text-sm">
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
