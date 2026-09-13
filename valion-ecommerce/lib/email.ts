import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Cambia esto por tu dominio verificado en Resend cuando lo tengas.
// Mientras tanto, puedes usar "onboarding@resend.dev" para pruebas.
const FROM_EMAIL = "VALION <onboarding@resend.dev>";

interface ItemPedido {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

interface DatosConfirmacionPedido {
  emailCliente: string;
  nombreCliente: string;
  numeroPedido: string;
  items: ItemPedido[];
  total: number;
}

export async function enviarConfirmacionPedido(datos: DatosConfirmacionPedido) {
  const { emailCliente, nombreCliente, numeroPedido, items, total } = datos;

  const filasProductos = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.nombre}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.cantidad}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.precioUnitario.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0F172A; padding: 24px; text-align: center;">
        <h1 style="color: #F59E0B; margin: 0;">VALION</h1>
        <p style="color: #F8FAFC; margin: 4px 0 0;">Todo lo que buscas, en un solo lugar</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #1E293B;">¡Gracias por tu compra, ${nombreCliente}!</h2>
        <p style="color: #1E293B;">Tu pedido <strong>#${numeroPedido}</strong> fue confirmado exitosamente.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background-color: #F8FAFC;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${filasProductos}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; margin-top: 16px; color: #1E293B;">
          <strong>Total: $${total.toFixed(2)}</strong>
        </p>
      </div>
      <div style="background-color: #F8FAFC; padding: 16px; text-align: center; color: #1E293B; font-size: 12px;">
        Este correo fue enviado por VALION
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailCliente,
      subject: `Confirmación de tu pedido #${numeroPedido} - VALION`,
      html,
    });

    if (error) {
      console.error("Error enviando email de confirmación:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error inesperado enviando email:", err);
    return { success: false, error: err };
  }
}
interface DatosRecordatorioCarrito {
  emailCliente: string;
  nombreCliente?: string;
  items: ItemPedido[];
  total: number;
}

export async function enviarRecordatorioCarrito(datos: DatosRecordatorioCarrito) {
  const { emailCliente, nombreCliente, items, total } = datos;

  const filasProductos = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.nombre}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.cantidad}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.precioUnitario.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0F172A; padding: 24px; text-align: center;">
        <h1 style="color: #F59E0B; margin: 0;">VALION</h1>
        <p style="color: #F8FAFC; margin: 4px 0 0;">Todo lo que buscas, en un solo lugar</p>
      </div>
      <div style="padding: 24px;">
        <h2 style="color: #1E293B;">${nombreCliente ? `¡Hola, ${nombreCliente}!` : "¡Olvidaste algo!"}</h2>
        <p style="color: #1E293B;">Dejaste estos productos en tu carrito. ¡Aún están disponibles!</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background-color: #F8FAFC;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${filasProductos}
          </tbody>
        </table>
        <p style="text-align: right; font-size: 18px; margin-top: 16px; color: #1E293B;">
          <strong>Total: $${total.toFixed(2)}</strong>
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="https://valion-ecommerce.vercel.app/carrito" style="background-color: #FF6B00; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Completar mi compra
          </a>
        </div>
      </div>
      <div style="background-color: #F8FAFC; padding: 16px; text-align: center; color: #1E293B; font-size: 12px;">
        Este correo fue enviado por VALION
      </div>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: emailCliente,
      subject: "¿Olvidaste algo en tu carrito? - VALION",
      html,
    });

    if (error) {
      console.error("Error enviando recordatorio:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error inesperado enviando recordatorio:", err);
    return { success: false, error: err };
  }
}
