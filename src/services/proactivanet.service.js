export const fetchProveedoresProactivanet = async () => {
  const endpoint = `${process.env.PROACTIVANET_API_URL}/vendors/`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${process.env.PROACTIVANET_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Error obteniendo datos de Proactivanet");
  return response.json();
};