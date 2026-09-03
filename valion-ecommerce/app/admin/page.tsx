import BotonCerrarSesion from "./BotonCerrarSesion";

const kpis = [
  { label: "Ventas hoy", valor: "$1,248.90", cambio: "+12%" },
  { label: "Ventas esta semana", valor: "$8,930.40", cambio: "+8%" },
  { label: "Ventas este mes", valor: "$34,120.75", cambio: "+15%" },
  { label: "Ticket promedio", valor: "$42.30", cambio: "+3%" },
];

const alertas = [
  { tipo: "Nuevo pedido", detalle: "Pedido #VAL-10238 recién recibido", hora: "hace 5 min", color: "bg-blue-100 text-blue-700" },
  { tipo: "Stock bajo", detalle: "Cámara de Seguridad WiFi — quedan 3 unidades", hora: "hace 32 min", color: "bg-amber-100 text-amber-700" },
  { tipo: "Pago pendiente", detalle: "Pedido #VAL-10235 esperando verificación", hora: "hace 1 h", color: "bg-red-100 text-red-700" },
  { tipo: "Producto agotado", detalle: "Set de Maquillaje Profesional sin stock", hora: "hace 2 h", color: "bg-amber-100 text-amber-700" },
];

const resumenConversion = [
  { label: "Visitantes activos", valor: "142" },
  { label: "Tasa de conversión", valor: "3.4%" },
  { label: "Carritos abandonados hoy", valor: "18" },
];

const menuAdmin = [
  { nombre: "Dashboard", href: "/admin", icono: "📊" },
  { nombre: "Pedidos", href: "/admin/pedidos", icono: "🧾" },
  { nombre: "Inventario", href: "/admin/inventario", icono: "📦" },
  { nombre: "Clientes", href: "/admin/clientes", icono: "👥" },
  { nombre: "Marketing", href: "/admin/marketing", icono: "📣" },
  { nombre: "Reportes", href: "/admin/reportes", icono: "📈" },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-valion-bg">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 bg-valion-navy text-white md:block">
        <div className="px-5 py-5 font-display text-xl font-extrabold">
          VALION <span className="text-xs font-normal text-white/50">Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {menuAdmin.map((item, i) => (
            <a
              key={item.nombre}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                i === 0 ? "bg-white/10 font-medium" : "text-white/70 hover:bg-white/5"
              }`}
            >
              <span>{item.icono}</span> {item.nombre}
            </a>
          ))}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="font-display text-lg font-bold text-valion-ink">Dashboard</h1>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>Administrador</span>
            <div className="h-8 w-8 rounded-full bg-valion-orange" />
            <BotonCerrarSesion />
          </div>
        </header>

        <main className="p-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-slate-200 bg-white p-4">
                <span className="text-xs text-slate-500">{kpi.label}</span>
                <div className="mt-1 flex items-end justify-between">
                  <span className="font-display text-xl font-extrabold text-valion-ink">
                    {kpi.valor}
                  </span>
                  <span className="text-xs font-medium text-green-600">{kpi.cambio}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Alertas */}
            <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
              <h2 className="font-display text-sm font-bold text-valion-ink">
                Alertas recientes
              </h2>
              <div className="mt-3 flex flex-col gap-2">
                {alertas.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-slate-100 p-3"
                  >
                    <div>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${a.color}`}>
                        {a.tipo}
                      </span>
                      <p className="mt-1 text-sm text-valion-ink">{a.detalle}</p>
                    </div>
                    <span className="text-xs text-slate-400">{a.hora}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de conversión */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="font-display text-sm font-bold text-valion-ink">
                Resumen de conversión (hoy)
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                {resumenConversion.map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{r.label}</span>
                    <span className="font-display text-lg font-extrabold text-valion-ink">
                      {r.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
