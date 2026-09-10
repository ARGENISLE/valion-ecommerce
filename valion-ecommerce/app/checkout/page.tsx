"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ItemCarrito, obtenerCarrito, vaciarCarrito, obtenerCuponAplicado, quitarCuponAplicado, CuponAplicado } from "@/lib/cart";

const pasos = ["Envío", "Pago", "Confirmación"];

export default function Checkout() {
  const [pasoActual, setPasoActual] = useState(0);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");
    const [numeroPedido, setNumeroPedido] = useState("");
  const [cupon, setCupon] = useState<CuponAplicado | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [telefono, setTelefono] = useState("");

    useEffect(() => {
    setItems(obtenerCarrito());
    setCupon(obtenerCuponAplicado());
  }, []);

    const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const descuento = cupon ? subtotal * (cupon.descuentoPorcentaje / 100) : 0;
  const envioBase: number = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const envio: number = cupon?.envioGratis ? 0 : envioBase;
  const total = Math.max(0, subtotal - descuento + envio);

  function siguientePaso() {
    if (pasoActual === 0) {
      if (!nombre || !email || !direccion || !telefono) {
        setError("Por favor completa todos los campos obligatorios.");
        return;
      }
    }
    setError("");
    setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
  }

  function pasoAnterior() {
    setPasoActual((p) => Math.max(p - 1, 0));
  }

  async function confirmarPedido() {
    setError("");
    setProcesando(true);
    try {
      let clienteId: number;
      const { data: clienteExistente } = await supabase
        .from("clientes")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
        await supabase
          .from("clientes")
          .update({
            nombre,
            telefono,
            direccion: `${direccion}, ${ciudad} ${codigoPostal}`.trim(),
          })
          .eq("id", clienteId);
      } else {
        const { data: nuevoCliente, error: errorCliente } = await supabase
          .from("clientes")
          .insert({
            nombre,
            email,
            telefono,
            direccion: `${direccion}, ${ciudad} ${codigoPostal}`.trim(),
            segmento: "Nuevo",
          })
          .select("id")
          .single();
        if (errorCliente || !nuevoCliente) throw new Error(errorCliente?.message || "No se pudo crear el cliente.");
        clienteId = nuevoCliente.id;
      }

            const { data: pedido, error: errorPedido } = await supabase
        .from("pedidos")
        .insert({
          cliente_id: clienteId,
          total: total,
          metodo_pago: metodoPago,
          estado: "Pendiente",
        })
        .select("id")
        .single();
      if (errorPedido || !pedido) throw new Error(errorPedido?.message || "No se pudo crear el pedido.");

      if (cupon) {
        const { data: cuponActual } = await supabase
          .from("cupones")
          .select("id, usos")
          .eq("codigo", cupon.codigo)
          .maybeSingle();
        if (cuponActual) {
          await supabase
            .from("cupones")
            .update({ usos: (cuponActual.usos ?? 0) + 1 })
            .eq("id", cuponActual.id);
        }
      }
      const itemsParaInsertar = items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      }));
      const { error: errorItems } = await supabase
        .from("pedido_items")
        .insert(itemsParaInsertar);
      if (errorItems) throw new Error(errorItems.message);

      for (const item of items) {
        const { data: productoActual } = await supabase
          .from("productos")
          .select("stock")
          .eq("id", item.id)
          .single();
        if (productoActual) {
          const nuevoStock = Math.max(0, productoActual.stock - item.cantidad);
          await supabase
            .from("productos")
            .update({ stock: nuevoStock })
            .eq("id", item.id);
        }
      }

           setNumeroPedido(`VAL-${pedido.id.toString().padStart(5, "0")}`);
      vaciarCarrito();
      quitarCuponAplicado();
      setProcesando(false);
      setPasoActual(2);
    } catch (err: any) {
      setProcesando(false);
      setError("Error al procesar el pedido: " + (err?.message ?? String(err)));
    }
  }

  if (items.length === 0 && pasoActual < 2) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-valion-bg px-4">
        <div className="text-center">
          <p className="text-slate-500">Tu carrito está vacío.</p>
          <a href="/productos" className="mt-3 inline-block text-valion-orange hover:underline">
            Explorar productos
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-valion-bg">
      <header className="bg-valion-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="font-display text-2xl font-extrabold tracking-tight">
            VALION
          </a>
          <a href="/carrito" className="text-sm text-white/70 hover:text-white">
            ← Volver al carrito
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-center gap-4">
          {pasos.map((paso, i) => (
            <div key={paso} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                    i <= pasoActual
                      ? "bg-valion-orange text-white"
                      : "bg-white text-slate-400 border border-slate-300"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-xs ${
                    i <= pasoActual ? "text-valion-ink font-medium" : "text-slate-400"
                  }`}
                >
                  {paso}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div
                  className={`h-0.5 w-12 ${
                    i < pasoActual ? "bg-valion-orange" : "bg-slate-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              {pasoActual === 0 && (
                <>
                  <h2 className="font-display text-lg font-bold text-valion-ink">
                    Datos de envío
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      placeholder="Nombre completo"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Correo electrónico"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Dirección"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                    <input
                      placeholder="Ciudad"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Código postal"
                      value={codigoPostal}
                      onChange={(e) => setCodigoPostal(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      placeholder="Teléfono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                    />
                  </div>
                  {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
                </>
              )}

              {pasoActual === 1 && (
                <>
                  <h2 className="font-display text-lg font-bold text-valion-ink">
                    Método de pago
                  </h2>
                  <div className="mt-4 flex flex-col gap-3">
                    {[
                      { id: "tarjeta", label: "💳 Tarjeta de crédito/débito" },
                      { id: "paypal", label: "🅿️ PayPal" },
                      { id: "movil", label: "📱 Pago Móvil" },
                    ].map((op) => (
                      <label
                        key={op.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                          metodoPago === op.id
                            ? "border-valion-orange bg-valion-orange/5"
                            : "border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="pago"
                          checked={metodoPago === op.id}
                          onChange={() => setMetodoPago(op.id)}
                        />
                        {op.label}
                      </label>
                    ))}
                  </div>

                  {metodoPago === "tarjeta" && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        placeholder="Número de tarjeta"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
                      />
                      <input
                        placeholder="MM/AA"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="CVV"
                        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>
                  )}
                  {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
                </>
              )}

              {pasoActual === 2 && (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✅
                  </div>
                  <h2 className="font-display text-xl font-bold text-valion-ink">
                    ¡Pedido confirmado!
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Tu pedido #{numeroPedido} fue recibido y está siendo procesado.
                    Te enviaremos un correo con el número de seguimiento.
                  </p>
                  <a href="/" className="btn-cta mt-6 inline-block text-sm">
                    Volver al inicio
                  </a>
                </div>
              )}

              {pasoActual < 2 && (
                <div className="mt-6 flex justify-between">
                  {pasoActual > 0 ? (
                    <button
                      onClick={pasoAnterior}
                      className="rounded-md border border-slate-300 px-4 py-2 text-sm text-valion-ink"
                    >
                      Atrás
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    onClick={pasoActual === 1 ? confirmarPedido : siguientePaso}
                    disabled={procesando}
                    className="btn-cta text-sm disabled:opacity-50"
                  >
                    {procesando ? "Procesando..." : pasoActual === 1 ? "Confirmar pedido" : "Continuar"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {pasoActual < 2 && (
            <div>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="font-display text-lg font-bold text-valion-ink">
                  Resumen
                </h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {cupon && (
                    <div className="flex justify-between text-valion-orange">
                      <span>Descuento ({cupon.codigo})</span>
                      <span>-${descuento.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-display text-lg font-extrabold text-valion-ink">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-valion-navy py-8 text-center text-sm text-white/60">
        © 2026 VALION. Todos los derechos reservados.
      </footer>
    </main>
  );
}
