import { NextRequest, NextResponse } from "next/server";
import { enviarConfirmacionPedido } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailCliente, nombreCliente, numeroPedido, items, total } = body;

    if (!emailCliente || !numeroPedido || !items) {
      return NextResponse.json(
        { success: false, error: "Faltan datos requeridos." },
        { status: 400 }
      );
    }

    const resultado = await enviarConfirmacionPedido({
      emailCliente,
      nombreCliente,
      numeroPedido,
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
