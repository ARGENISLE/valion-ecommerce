"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser as supabase } from "@/lib/supabase-browser";

export default function BotonCerrarSesion() {
  const router = useRouter();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={cerrarSesion}
      className="text-xs font-medium text-slate-400 hover:text-red-500"
    >
      Cerrar sesión
    </button>
  );
}
