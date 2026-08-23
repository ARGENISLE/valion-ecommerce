# VALION — E-commerce

Proyecto base generado con Next.js + Tailwind, usando la identidad de marca VALION
(colores, tipografía y guía visual definidos).

## Cómo subir esto a GitHub (sin usar comandos)

1. Descomprime el archivo `valion-ecommerce.zip` en tu computadora.
2. Entra a **github.com**, inicia sesión, y haz clic en el botón verde **"New"** (o el símbolo "+" arriba a la derecha → "New repository").
3. Ponle de nombre `valion-ecommerce`, déjalo en **Public** (o Private si prefieres), NO marques "Add a README" (ya tenemos uno), y haz clic en **"Create repository"**.
4. En la página del repositorio recién creado, busca el enlace que dice **"uploading an existing file"**.
5. Arrastra TODA la carpeta descomprimida `valion-ecommerce` (o selecciona todos sus archivos) hacia esa zona de carga.
6. Espera a que termine de subir, escribe un mensaje corto como "Primera versión de VALION" y haz clic en **"Commit changes"**.

## Cómo publicarlo en Vercel

1. Entra a **vercel.com** (ya tienes tu cuenta vinculada a GitHub).
2. Haz clic en **"Add New..." → "Project"**.
3. Busca y selecciona el repositorio `valion-ecommerce`.
4. Vercel detectará automáticamente que es un proyecto **Next.js** — no cambies ninguna configuración.
5. Haz clic en **"Deploy"**.
6. En 1-2 minutos tendrás una URL como `valion-ecommerce.vercel.app` con tu web en línea.

## Qué sigue

Esta es solo la página de inicio (Home) con la marca aplicada. Los próximos pasos (que iremos generando juntos aquí en el chat):
- Página de listado de productos y ficha de producto individual.
- Carrito de compras y checkout.
- Conexión a base de datos (Supabase) para productos reales.
- Panel de administrador.
- Integración de pagos (Stripe).

Cada vez que generemos archivos nuevos, los subes a GitHub reemplazando/agregando
los archivos correspondientes, y Vercel actualizará tu web automáticamente.
