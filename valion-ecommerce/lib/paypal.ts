// Sandbox por ahora. Cuando pases a producción real, cambia a:
// https://api-m.paypal.com
const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

export async function obtenerTokenPayPal() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_SECRET!;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error obteniendo token de PayPal: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token as string;
}

export { PAYPAL_API_BASE };
