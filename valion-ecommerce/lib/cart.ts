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
