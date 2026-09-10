"use client";

import { useEffect, useState } from "react";
import { obtenerCarrito } from "@/lib/cart";

export default function ContadorCarrito() {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    function actualizar() {
      const items = obtenerCarrito();
      setCantidad(items.reduce((acc, i) => acc + i.cantidad, 0));
    }
    actualizar();
    window.addEventListener("carrito-actualizado", actualizar);
    return () => window.removeEventListener("carrito-actualizado", actualizar);
  }, []);

  return (
    <a href="/carrito" className="btn-cta text-sm">
      Carrito ({cantidad})
    </a>
  );
}
