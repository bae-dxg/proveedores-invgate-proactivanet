export const getInvgateToken = async () => {
  const tokenUrl = `${process.env.INVGATE_API_URL}/oauth2/token/`;
  
  const credenciales = Buffer.from(`${process.env.INVGATE_CLIENT_ID}:${process.env.INVGATE_CLIENT_SECRET}`).toString('base64');
  
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${credenciales}`
    },
    body: params.toString(),
  });

  if (!response.ok) throw new Error(`Error autenticando con InvGate: ${response.status}`);
  
  const data = await response.json();
  return data.access_token;
};

export const fetchProveedoresInvgate = async () => {
  const token = await getInvgateToken();
  const endpoint = `${process.env.INVGATE_API_URL}/public-api/v2/vendors/`;
  
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`Error obteniendo datos de InvGate: ${response.status}`);
  return response.json();
};