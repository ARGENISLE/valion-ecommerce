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

const categoriasDisponibles = ["Electrónicos", "Hogar", "Moda", "Deportes", "Belleza", "Juguetes", "Otros"];

type ProductoFormulario = {
  id?: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  precio_oferta: number | null;
  descripcion: string;
  stock: number;
  umbral_stock_bajo: number;
  imagen_url: string | null;
  video_url: string | null;
};

const productoVacio: ProductoFormulario = {
  nombre: "",
  sku: "",
  categoria: categoriasDisponibles[0],
  precio: 0,
  precio_oferta: null,
  descripcion: "",
  stock: 0,
  umbral_stock_bajo: 5,
  imagen_url: null,
  video_url: null,
};

export default function InventarioClient({
  productosIniciales,
}: {
  productosIniciales: Producto[];
}) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [editando, setEditando] = useState<ProductoFormulario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
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

  async function subirImagen(archivo: File) {
    setSubiendoImagen(true);
    setErrorMsg("");
    const nombreArchivo = `${Date.now()}-${archivo.name.replace(/\s+/g, "-")}`;
    const { error: errorSubida } = await supabase.storage
      .from("productos")
      .upload(nombreArchivo, archivo);

    if (errorSubida) {
      setErrorMsg("Error al subir la imagen: " + errorSubida.message);
      setSubiendoImagen(false);
      return;
    }

    const { data } = supabase.storage.from("productos").getPublicUrl(nombreArchivo);
    setEditando((prev) => (prev ? { ...prev, imagen_url: data.publicUrl } : prev));
    setSubiendoImagen(false);
  }

  async function guardarEdicion() {
    if (!editando) return;
    if (!editando.nombre.trim()) {
      setErrorMsg("El nombre es obligatorio.");
      return;
    }
    setGuardando(true);
    setErrorMsg("");

    if (editando.id) {
      const { error } = await supabase
        .from("productos")
        .update({
          nombre: editando.nombre,
          sku: editando.sku,
          categoria: editando.categoria,
          precio: editando.precio,
          precio_oferta: editando.precio_oferta,
          descripcion: editando.descripcion,
          stock: editando.stock,
          umbral_stock_bajo: editando.umbral_stock_bajo,
          imagen_url: editando.imagen_url,
          video_url: editando.video_url,
        })
        .eq("id", editando.id);

      setGuardando(false);
      if (error) {
        setErrorMsg("Error al guardar: " + error.message);
        return;
      }
      setProductos((prev) =>
        prev.map((p) => (p.id === editando.id ? ({ ...p, ...editando } as Producto) : p))
      );
    } else {
      const { data, error } = await supabase
        .from("productos")
        .insert({
          nombre: editando.nombre,
          sku: editando.sku,
          categoria: editando.categoria,
          precio: editando.precio,
          precio_oferta: editando.precio_oferta,
          descripcion: editando.descripcion,
          stock: editando.stock,
          umbral_stock_bajo: editando.umbral_stock_bajo,
          imagen_url: editando.imagen_url,
          video_url: editando.video_url,
        })
        .select()
        .single();

      setGuardando(false);
      if (error || !data) {
        setErrorMsg("Error al crear: " + (error?.message ?? "desconocido"));
        return;
      }
      setProductos((prev) => [data as Producto, ...prev]);
    }

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
              <button
                onClick={() => setEditando({ ...productoVacio })}
                className="rounded-md bg-valion-orange px-3 py-2 text-sm font-medium text-white"
              >
                + Agregar producto
              </button>
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
                  <th className="px-4 py-3">Foto</th>
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
                      <td className="px-4 py-3">
                        {p.imagen_url ? (
                          <img src={p.imagen_url} alt={p.nombre} className="h-10 w-10 rounded object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-slate-300">
                            📦
                          </div>
                        )}
                      </td>
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
                            onClick={() => setEditando({ ...p })}
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
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-valion-ink">
                {editando.id ? "Editar producto" : "Agregar producto"}
              </h2>
              <button onClick={() => setEditando(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Foto del producto</label>
                <div className="flex items-center gap-3">
                  {editando.imagen_url ? (
                    <img src={editando.imagen_url} alt="Vista previa" className="h-16 w-16 rounded object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-100 text-2xl text-slate-300">
                      📦
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const archivo = e.target.files?.[0];
                      if (archivo) subirImagen(archivo);
                    }}
                    className="text-xs"
                  />
                </div>
                {subiendoImagen && <p className="mt-1 text-xs text-slate-400">Subiendo imagen...</p>}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Nombre</label>
                <input
                  value={editando.nombre}
                  onChange={(e) => setEditando({ ...editando, nombre: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Descripción</label>
                <textarea
                  value={editando.descripcion}
                  onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">SKU</label>
                  <input
                    value={editando.sku}
                    onChange={(e) => setEditando({ ...editando, sku: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    placeholder="SKU"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Categoría</label>
                  <select
                    value={editando.categoria}
                    onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    {categoriasDisponibles.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
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

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  Video (link de YouTube, opcional)
                </label>
                <input
                  value={editando.video_url ?? ""}
                  onChange={(e) => setEditando({ ...editando, video_url: e.target.value || null })}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
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
                disabled={guardando || subiendoImagen}
                className="flex-1 rounded-md bg-valion-orange py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
