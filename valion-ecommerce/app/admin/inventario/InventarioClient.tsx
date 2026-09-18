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

    const { data }
