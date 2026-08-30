"use client";

const ventasPorMes = [
  { mes: "Mar", valor: 18200 },
  { mes: "Abr", valor: 21500 },
  { mes: "May", valor: 19800 },
  { mes: "Jun", valor: 25300 },
  { mes: "Jul", valor: 29100 },
  { mes: "Ago", valor: 34120 },
];

const masVendidos = [
  { nombre: "Audífonos Inalámbricos", categoria: "Electrónica", unidades: 412, ingresos: 8235.88 },
  { nombre: "Camiseta Algodón Premium", categoria: "Moda", unidades: 388, ingresos: 3877.12 },
  { nombre: "Zapatillas Running Pro", categoria: "Deportes", unidades: 265, ingresos: 10597.35 },
  { nombre: "Set de Ollas Antiadherentes", categoria: "Hogar", unidades: 140, ingresos: 12598.60 },
];

const rotacionInventario = [
  { nombre: "Audífonos Inalámbricos", rotacion: "Alta", indicador: "🟢" },
  { nombre: "Camiseta Algodón Premium", rotacion: "Alta", indicador: "🟢" },
  { nombre: "Cámara de Seguridad WiFi", rotacion: "Media", indicador: "🟡" },
  { nombre: "Robot de Cocina Multifunción", rotacion: "Baja", indicador: "🔴" },
  { nombre: "Set de Maquillaje Profesional", rotacion: "Baja", indicador: "🔴" },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminReportes() {
  const maxVenta = Math.max(...ventasPorMes.map((v) => v.valor));

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
          </div>
        </header>

        <main className="p-6">
          {/* Gráfico de ventas por mes */}
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-valion-ink">
              Ventas por mes
            </h2>
            <div className="mt-6 flex items-end justify-between gap-3" style={{ height: "180px" }}>
              {ventasPorMes.map((v) => (
                <div key={v.mes} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-medium text-valion-ink">
                    ${(v.valor / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t-md bg-valion-orange"
                    style={{ height: `${(v.valor / maxVenta) * 130}px` }}
                  />
                  <span className="text-xs text-slate-500">{v.mes}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Más vendidos */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-valion-ink">
                Productos más vendidos
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {masVendidos.map((p, i) => (
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
                ))}
              </div>
            </div>

            {/* Rotación de inventario */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-base font-bold text-valion-ink">
                Rotación de inventario
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {rotacionInventario.map((p) => (
                  <div key={p.nombre} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                    <span className="text-sm text-valion-ink">{p.nombre}</span>
                    <span className="flex items-center gap-1 text-sm text-slate-500">
                      {p.indicador} {p.rotacion}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categoría más rentable */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-valion-ink">
              Categoría más rentable del mes
            </h2>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-slate-500">Hogar</span>
              <span className="font-display text-xl font-extrabold text-valion-ink">$12,598.60</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
