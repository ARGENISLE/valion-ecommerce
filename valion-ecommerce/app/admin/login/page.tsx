"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setCargando(false);

    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-valion-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8">
        <div className="text-center">
          <span className="font-display text-2xl font-extrabold text-valion-navy">
            VALION
          </span>
          <p className="mt-1 text-sm text-slate-500">Panel de administración</p>
        </div>

        <form onSubmit={iniciarSesion} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="admin@valion.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={cargando}
            className="btn-cta mt-2 w-full text-sm disabled:opacity-50"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
