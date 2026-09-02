import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TestDB() {
  const urlConfigurada = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NO CONFIGURADA";
  const keyConfigurada = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "SÍ (oculta por seguridad, primeros 15 caracteres: " +
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 15) + "...)"
    : "NO CONFIGURADA";

  const { data, error } = await supabase.from("productos").select("*");

  return (
    <div style={{ padding: 30, fontFamily: "monospace", fontSize: 14 }}>
      <h1>Diagnóstico de conexión Supabase</h1>
      <p><strong>URL configurada:</strong> {urlConfigurada}</p>
      <p><strong>Key configurada:</strong> {keyConfigurada}</p>
      <hr />
      <p><strong>Error:</strong></p>
      <pre>{error ? JSON.stringify(error, null, 2) : "Ninguno"}</pre>
      <p><strong>Datos recibidos:</strong></p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
