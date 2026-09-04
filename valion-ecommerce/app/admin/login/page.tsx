"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [contador, setContador] = useState(0);

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Prueba de interactividad v4</h1>
      <p>Contador: {contador}</p>
      <button
        onClick={() => {
          alert("¡El botón funciona!");
          setContador((c) => c + 1);
        }}
        style={{
          background: "#FF6B00",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Click aquí para probar
      </button>
    </main>
  );
}
