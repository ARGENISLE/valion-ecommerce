 import { supabase, Producto } from "@/lib/supabase";
import FichaProductoClient from "./FichaProductoClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function obtenerProducto(id: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error cargando producto:", error.message);
    return null;
  }
  return data;
}

async function obtenerRelacionados(categoria: string, idActual: number): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria", categoria)
    .neq("id", idActual)
    .limit(4);
  if (error) return [];
  return data ?? [];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const producto = await obtenerProducto(params.id);

  if (!producto) {
    return { title: "Producto no encontrado" };
  }

  const descripcionCorta = producto.descripcion
    ? producto.descripcion.slice(0, 155)
    : `Compra ${producto.nombre} en VALION al mejor precio.`;

  return {
    title: producto.nombre,
    description: descripcionCorta,
    openGraph: {
      title: producto.nombre,
      description: descripcionCorta,
      images: producto.imagen_url ? [{ url: producto.imagen_url }] : undefined,
      type: "website",
    },
  };
}

export default async function FichaProducto({ params }: { params: { id: string } }) {
  const producto = await obtenerProducto(params.id);

  if (!producto) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-valion-bg">
        <p className="text-slate-500">Producto no encontrado.</p>
      </main>
    );
  }

  const relacionados = await obtenerRelacionados(producto.categoria, producto.id);

  const datosEstructurados = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion || producto.nombre,
    image: producto.imagen_url || undefined,
    sku: producto.sku || undefined,
    category: producto.categoria,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: producto.precio_oferta ?? producto.precio,
      availability:
        producto.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://valion-ecommerce.vercel.app/productos/${producto.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datosEstructurados) }}
      />
      <FichaProductoClient producto={producto} relacionados={relacionados} />
    </>
  );
}
