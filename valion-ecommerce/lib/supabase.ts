import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" }),
  },
});

export type Producto = {
  id: number;
  nombre: string;
  sku: string;
  categoria: string;
  precio: number;
  precio_oferta: number | null;
  descripcion: string;
  stock: number;
  umbral_stock_bajo: number;
  imagen_url: string | null;
  variaciones: { tallas?: string[]; colores?: string[] } | null;
};
