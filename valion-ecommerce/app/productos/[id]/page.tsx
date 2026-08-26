const productos = [
  { id: 1, nombre: "Audífonos Inalámbricos", categoria: "Electrónica", precio: 29.99, oferta: 19.99, descripcion: "Audífonos inalámbricos con cancelación de ruido, batería de 20 horas y estuche de carga rápida.", variaciones: ["Negro", "Blanco", "Azul"] },
  { id: 2, nombre: "Set de Ollas Antiadherentes", categoria: "Hogar", precio: 89.99, oferta: null, descripcion: "Set de 8 piezas antiadherentes, aptas para inducción, con mangos ergonómicos resistentes al calor.", variaciones: ["6 piezas", "8 piezas", "12 piezas"] },
  { id: 3, nombre: "Zapatillas Running Pro", categoria: "Deportes", precio: 54.99, oferta: 39.99, descripcion: "Zapatillas ligeras para running con suela de alta amortiguación y malla transpirable.", variaciones: ["38", "39", "40", "41", "42"] },
  { id: 4, nombre: "Cámara de Seguridad WiFi", categoria: "Electrónica", precio: 45.0, oferta: null, descripcion: "Cámara WiFi con visión nocturna, detección de movimiento y grabación en la nube.", variaciones: ["1 cámara", "2 cámaras"] },
  { id: 5, nombre: "Camiseta Algodón Premium", categoria: "Moda", precio: 15.0, oferta: 9.99, descripcion: "Camiseta 100% algodón, corte regular, disponible en varias tallas y colores.", variaciones: ["S", "M", "L", "XL"] },
  { id: 6, nombre: "Set de Maquillaje Profesional", categoria: "Belleza", precio: 34.99, oferta: null, descripcion: "Set completo de maquillaje profesional con paleta de sombras, labiales y brochas.", variaciones: ["Set básico", "Set completo"] },
  { id: 7, nombre: "Bicicleta Montaña 21V", categoria: "Deportes", precio: 210.0, oferta: 179.99, descripcion: "Bicicleta de montaña con 21 velocidades, cuadro de aluminio y frenos de disco.", variaciones: ["Rin 26", "Rin 27.5", "Rin 29"] },
  { id: 8, nombre: "Robot de Cocina Multifunción", categoria: "Hogar", precio: 120.0, oferta: null, descripcion: "Robot de cocina multifunción: licúa, pica, amasa y cocina al vapor.", variaciones: ["1.5L", "2.5L"] },
];

export default function FichaProducto({ params }: { params: { id: string } }) {
  const producto = productos.find((p) => p.id === Number(params.id)) ?? productos[0];

  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-valion-bg">
      {/* Header */}
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </a>
          <input
            type="text"
            placeholder="Buscar productos..."
            className="hidden w-80 rounded-md px-3 py-2 text-sm text-valion-ink sm:block"
          />
          <button className="btn-cta text-sm">Carrito (0)</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/" className="hover:text-valion-orange">Inicio</a>
          {" / "}
          <a href="/productos" className="hover:text-valion-orange">Productos</a>
          {" / "}
          <span className="text-valion-ink">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* Galería */}
          <div>
            <div className="flex h-96 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <span className="text-8xl">📦</span>
            </div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex h-16 w-16 items-center justify-center rounded border border-slate-200 bg-white"
                >
                  <span className="text-xl">📦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info del producto */}
          <div>
            <span className="text-xs uppercase tracking-wide text-slate-400">
              {producto.categoria}
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-valion-ink">
              {producto.nombre}
            </h1>

            <div className="mt-1 flex items-center gap-1 text-amber-500">
              {"★★★★☆"}
              <span className="ml-2 text-sm text-slate-400">(128 reseñas)</span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              {producto.oferta ? (
                <>
                  <span className="font-display text-3xl font-extrabold text-valion-orange">
                    ${producto.oferta}
                  </span>
                  <span className="text-lg text-slate-400 line-through">
                    ${producto.precio}
                  </span>
                </>
              ) : (
                <span className="font-display text-3xl font-extrabold text-valion-ink">
                  ${producto.precio}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {producto.descripcion}
            </p>

            {/* Variaciones */}
            <div className="mt-6">
              <span className="text-sm font-medium text-valion-ink">Opciones:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {producto.variaciones.map((v) => (
                  <button
                    key={v}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-valion-ink hover:border-valion-orange hover:text-valion-orange"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Cantidad + acciones */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-slate-300">
                <button className="px-3 py-2 text-slate-500">-</button>
                <span className="px-4 text-sm">1</span>
                <button className="px-3 py-2 text-slate-500">+</button>
              </div>
              <span className="text-sm text-green-600">✔ En stock</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="btn-cta flex-1 text-sm">Agregar al carrito</button>
              <button className="flex-1 rounded-lg border-2 border-valion-navy py-3 text-sm font-bold text-valion-navy hover:bg-valion-navy hover:text-white">
                Comprar ahora
              </button>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
              🚚 Envío gratis en compras mayores a $50 · Entrega estimada 2-4 días hábiles
            </div>
          </div>
        </div>

        {/* Productos relacionados */}
        {relacionados.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold text-valion-ink">
              También te puede interesar
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relacionados.map((p) => (
                <a
                  key={p.id}
                  href={`/productos/${p.id}`}
                  className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex h-32 items-center justify-center rounded bg-white">
                    <span className="text-4xl">📦</span>
                  </div>
                  <span className="text-sm font-medium text-valion-ink">{p.nombre}</span>
                  <span className="mt-2 font-display text-lg font-extrabold text-valion-ink">
                    ${p.oferta ?? p.precio}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
