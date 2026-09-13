import { NextRequest, NextResponse } from "next/server";
import { enviarRecordatorioCarrito } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailCliente, nombreCliente, items, total } = body;

    if (!emailCliente || !items) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos." },
        { status: 400 }
      );
    }

    const resultado = await enviarRecordatorioCarrito({
      emailCliente,
      nombreCliente,
      items,
      total,
    });

    if (!resultado.success) {
      return NextResponse.json(resultado, { status: 500 });
    }

    return NextResponse.json(resultado);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
