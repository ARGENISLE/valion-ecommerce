"use client";

import BotonCerrarSesion from "../BotonCerrarSesion";

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

type Pedido = { id: number; total: number; creado_en: string };
type Item = {
  cantidad: number;
  precio_unitario: number;
  producto_id: number;
  productos: { nombre: string; categoria: string; stock: number } | null;
};

const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function ReportesClient({ pedidos, items }: { pedidos: Pedido[]; items: Item[] }) {
  const ventasPorMesMap = new Map<string, number>();
  pedidos.forEach((p) => {
    const fecha = new Date(p.creado_en);
    const clave = `${fecha.getFullYear()}-${fecha.getMonth()}`;
    ventasPorMesMap.set(clave, (ventasPorMesMap.get(clave) ?? 0) + Number(p.total));
  });
  const ventasPorMes = Array.from(ventasPorMesMap.entries())
    .map(([clave, valor]) => {
      const [anio, mes] = clave.split("-").map(Number);
      return { mes: nombresMeses[mes], valor, orden: anio * 12 + mes };
    })
    .sort((a, b) => a.orden - b.orden)
    .slice(-6);
  const maxVenta = Math.max(1, ...ventasPorMes.map((v) => v.valor));

  const ventasPorProducto = new Map<number, { nombre: string; categoria: string; unidades: number; ingresos: number }>();
  items.forEach((it) => {
    if (!it.productos) return;
    const actual = ventasPorProducto.get(it.producto_id) ?? {
      nombre: it.productos.nombre,
      categoria: it.productos.categoria,
      unidades: 0,
      ingresos: 0,
    };
    actual.unidades += it.cantidad;
    actual.ingresos += it.cantidad * Number(it.precio_unitario);
    ventasPorProducto.set(it.producto_id, actual);
  });
  const masVendidos = Array.from(ventasPorProducto.values())
    .sort((a, b) => b.ingresos - a.ingresos)
    .slice(0, 4);

  const rotacionInventario = Array.from(ventasPorProducto.entries())
    .map(([id, v]) => {
      const item = items.find((it) => it.producto_id === id);
      const stock = item?.productos?.stock ?? 0;
      let rotacion = "Baja";
      let indicador = "🔴";
      if (v.unidades >= stock) {
        rotacion = "Alta";
        indicador = "🟢";
      } else if (v.unidades >= stock / 3) {
        rotacion = "Media";
        indicador = "🟡";
      }
      return { nombre: v.nombre, rotacion, indicador };
    })
    .slice(0, 5);

  const ingresosPorCategoria = new Map<string, number>();
  ventasPorProducto.forEach((v) => {
    ingresosPorCategoria.set(v.categoria, (ingresosPorCategoria.get(v.categoria) ?? 0) + v.ingresos);
  });
  const categoriaTop = Array.from(ingresosPorCategoria.entries()).sort((a, b) => b[1] - a[1])[0];

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
                item.nombre === "Reportes" ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Reportes</h1>
          <div className="flex items-center gap-3">
            <button className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-valion-ink">
              Exportar Excel
            </button>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
            <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-valion-ink">
              Ventas por mes
            </h2>
            {ventasPorMes.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">Todavía no hay ventas registradas.</p>
            ) : (
              <div className="mt-6 flex items-end justify-between gap-3" style={{ height: "180px" }}>
                {ventasPorMes.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-medium text-valion-ink">
                      ${(v.valor / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full rounded-t-md bg-valion-orange"
                      style={{ height: `${Math.max(4, (v.valor / maxVenta) * 130)}px` }}
                    />
                    <span className="text-xs text-slate-500">{v.mes}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-valion-ink">
                Productos más vendidos
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {masVendidos.length === 0 ? (
                  <p className="text-sm text-slate-400">Todavía no hay ventas registradas.</p>
                ) : (
                  masVendidos.map((p, i) => (
                    <div key={p.nombre} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                      <div>
                        <span className="text-sm font-medium text-valion-ink">
                          {i + 1}. {p.nombre}
                        </span>
                        <div className="text-xs text-slate-400">{p.categoria} · {p.unidades} unidades</div>
                      </div>
                      <span className="font-display text-sm font-extrabold text-valion-orange">
                        ${p.ingresos.toLocaleString("es-VE", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-valion-ink">
                Rotación de inventario
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {rotacionInventario.length === 0 ? (
                  <p className="text-sm text-slate-400">Todavía no hay ventas registradas.</p>
                ) : (
                  rotacionInventario.map((p) => (
                    <div key={p.nombre} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                      <span className="text-sm text-valion-ink">{p.nombre}</span>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        {p.indicador} {p.rotacion}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-valion-ink">
              Categoría más rentable del mes
            </h2>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">{categoriaTop ? categoriaTop[0] : "—"}</span>
              <span className="font-display text-xl font-extrabold text-valion-ink">
                {categoriaTop ? `$${categoriaTop[1].toLocaleString("es-VE", { minimumFractionDigits: 2 })}` : "$0.00"}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
