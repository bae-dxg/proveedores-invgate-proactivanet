import dotenv from "dotenv";

dotenv.config();

async function probarInvGate() {
  /**/
  console.log("--- BUSCANDO LA RUTA CORRECTA DEL TOKEN DE INVGATE ---\n");

  const credenciales = Buffer.from(`${process.env.INVGATE_CLIENT_ID}:${process.env.INVGATE_CLIENT_SECRET}`).toString('base64');
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  /** Rutas de Auth comunes en las distintas arquitecturas de InvGate */
  const posiblesRutas = [
    "/api/v1/oauth2/token/",
    "/api/v2/oauth2/token/",
    "/public-api/oauth2/token/",
    "/public-api/v2/oauth2/token/",
    "/oauth2/token/"
  ];

  let token = null;

  for (const ruta of posiblesRutas) {
    const tokenUrl = `${process.env.INVGATE_API_URL}${ruta}`;
    console.log(`Probando Auth en: ${ruta}`);
    
    try {
      const res = await fetch(tokenUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${credenciales}`
        },
        body: params.toString(),
      });

      if (res.ok) {
        console.log(`✅ ¡ÉXITO! La ruta correcta de Auth es: ${ruta}\n`);
        const data = await res.json();
        token = data.access_token;
        break;
      } else {
        console.log(`❌ Falló con HTTP ${res.status}`);
      }
    } catch (e) {
      console.error("Error de red:", e.message);
    }
  }

  if (!token) {
    console.error("\nNo se pudo obtener el token en ninguna ruta. Verifica tus credenciales.");
    return;
  }

  /** Si tenemos token, probamos la ruta de proveedores */
  console.log("Intentando obtener proveedores...");
  const resInvData = await fetch(`${process.env.INVGATE_API_URL}/public-api/v2/vendors/`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (resInvData.ok) {
      const dataInv = await resInvData.json();
      /** Accedemos a la propiedad .results confirmada en tu Swagger */
      const registros = dataInv.results || [];
      console.log("✅ InvGate OK: Recibidos", registros.length, "registros.\n");
      
      if (registros.length > 0) {
          console.log("Ejemplo del primer proveedor de InvGate:");
          console.log(`- ID Externo: ${registros[0].id}`);
          console.log(`- Nombre: ${registros[0].company_name}`);
          console.log(`- RFC/Tax ID: ${registros[0].tax_id}`);
      }
  } else {
      console.error(`❌ Error Data InvGate (${resInvData.status})`);
  }
}

probarInvGate();