import { fetchProveedoresInvgate } from "../services/invgate.service.js";
import { fetchProveedoresProactivanet } from "../services/proactivanet.service.js";

export const obtenerProveedores = async (req, res) => {
  /**/
  try {
    const [invgateResult, proactivanetResult] = await Promise.allSettled([
      fetchProveedoresInvgate(),
      fetchProveedoresProactivanet()
    ]);

    let proveedores = [];

    if (invgateResult.status === "fulfilled") {
      const data = invgateResult.value.results || [];
      const formatInvgate = data.map((p) => ({
        nombre: p.company_name,
        legal_name: p.legal_name,
        status: p.status,
        billing_currency: p.billing_currency,
        tax_id: p.tax_id,
        origen: "InvGate",
        id_invgate: p.id,
        id_proctivanet: null
      }));
      proveedores = [...proveedores, ...formatInvgate];
    }

    if (proactivanetResult.status === "fulfilled") {
      const data = proactivanetResult.value || [];
      const formatProactivanet = data.map((p) => ({
        nombre: p.Name,
        legal_name: p.Name,
        status: null,
        billing_currency: null,
        tax_id: null,
        origen: "Proactivanet",
        id_invgate: null,
        id_proctivanet: p.Id
      }));
      proveedores = [...proveedores, ...formatProactivanet];
    }

    /** Agrupar por nombre (case-insensitive) para detectar duplicados y fusionar IDs */
    const mapa = new Map();

    proveedores.forEach((p) => {
      const key = p.nombre.toLowerCase();
      const existente = mapa.get(key);

      if (!existente) {
        mapa.set(key, { ...p, count: 1 });
      } else {
        existente.count += 1;
        if (existente.id_invgate === null) existente.id_invgate = p.id_invgate;
        if (existente.id_proctivanet === null) existente.id_proctivanet = p.id_proctivanet;
      }
    });

    /** Convertir mapa a array final */
    const resultado = Array.from(mapa.values()).map((item) => ({
      nombre: item.nombre,
      legal_name: item.legal_name,
      status: item.status,
      billing_currency: item.billing_currency,
      tax_id: item.tax_id,
      origen: item.origen,
      id_invgate: item.id_invgate,
      id_proctivanet: item.id_proctivanet,
      enAmbas: item.count > 1
    }));

    res.status(200).json({
      success: true,
      total: resultado.length,
      data: resultado
    });
  } catch (error) {
    console.error("Error en el controlador de proveedores:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};