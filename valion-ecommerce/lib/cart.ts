export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
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

export function agregarAlCarrito(producto: { id: number; nombre: string; precio: number }, cantidad: number = 1) {
  const items = obtenerCarrito();
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({ ...producto, cantidad });
  }
  guardarCarrito(items);
}

export function actualizarCantidad(id: number, cantidad: number) {
  const items = obtenerCarrito()
    .map((i) => (i.id === id ? { ...i, cantidad } : i))
    .filter((i) => i.cantidad > 0);
  guardarCarrito(items);
}

export function eliminarDelCarrito(id: number) {
  const items = obtenerCarrito().filter((i) => i.id !== id);
  guardarCarrito(items);
}

export function vaciarCarrito() {
  guardarCarrito([]);
}
