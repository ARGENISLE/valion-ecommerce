import { supabase } from "@/lib/supabase";
export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  variacion?: string;
};

const CART_KEY = "valion_carrito";

export function obtenerCarrito(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function guardarCarrito(items: ItemCarrito[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("carrito-actualizado"));
}

export function agregarAlCarrito(producto: { id: number; nombre: string; precio: number; variacion?: string }, cantidad: number = 1) {
  const items = obtenerCarrito();
  const existente = items.find((i) => i.id === producto.id && i.variacion === producto.variacion);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({ ...producto, cantidad });
  }
  guardarCarrito(items);
}

export function actualizarCantidad(id: number, cantidad: number, variacion?: string) {
  const items = obtenerCarrito()
    .map((i) => (i.id === id && i.variacion === variacion ? { ...i, cantidad } : i))
    .filter((i) => i.cantidad > 0);
  guardarCarrito(items);
}
export function eliminarDelCarrito(id: number, variacion?: string) {
  const items = obtenerCarrito().filter((i) => !(i.id === id && i.variacion === variacion));
  guardarCarrito(items);
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

const CUPON_KEY = "valion_cupon_aplicado";

export type CuponAplicado = {
  codigo: string;
  tipo: string;
  valor: string;
  descuentoPorcentaje: number;
  envioGratis: boolean;
};

export function guardarCuponAplicado(cupon: CuponAplicado) {
  localStorage.setItem(CUPON_KEY, JSON.stringify(cupon));
}

export function obtenerCuponAplicado(): CuponAplicado | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(CUPON_KEY);
  return data ? JSON.parse(data) : null;
}

export function quitarCuponAplicado() {
  localStorage.removeItem(CUPON_KEY);
}
const EMAIL_KEY = "valion_email_carrito";

export function guardarEmailCarrito(email: string) {
  localStorage.setItem(EMAIL_KEY, email);
}

export function obtenerEmailCarrito(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(EMAIL_KEY);
}

export function quitarEmailCarrito() {
  localStorage.removeItem(EMAIL_KEY);
}

export async function sincronizarCarritoAbandonado(nombre?: string) {
  const email = obtenerEmailCarrito();
  if (!email) return;

  const items = obtenerCarrito();
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  if (items.length === 0) return;

  const { data: existente } = await supabase
    .from("carritos_abandonados")
    .select("id")
    .eq("email", email)
    .eq("estado", "activo")
    .maybeSingle();

  if (existente) {
    await supabase
      .from("carritos_abandonados")
      .update({ items, total, nombre, actualizado_en: new Date().toISOString() })
      .eq("id", existente.id);
  } else {
    await supabase
      .from("carritos_abandonados")
      .insert({ email, nombre, items, total, estado: "activo" });
  }
}

export async function marcarCarritoRecuperado() {
  const email = obtenerEmailCarrito();
  if (!email) return;

  await supabase
    .from("carritos_abandonados")
    .update({ estado: "recuperado", actualizado_en: new Date().toISOString() })
    .eq("email", email)
    .eq("estado", "activo");
}
