// Cidade/estado/pais do visitante a partir dos headers de geolocalizacao da
// Vercel. Substitui a chamada ao ipwho.is no navegador: consulta de IP em
// servico de terceiro e outro padrao que o Google Ads associa a phishing.

const ORIGENS = ["https://lp.pizzaprime.com.br", "https://f5estrategia.github.io"];

const header = (req: Request, nome: string) => {
  const v = req.headers.get(nome) || "";
  try {
    return decodeURIComponent(v); // x-vercel-ip-city vem url-encoded
  } catch {
    return v;
  }
};

export function GET(req: Request) {
  const origem = req.headers.get("origin") || "";
  const cors: Record<string, string> = ORIGENS.includes(origem)
    ? { "Access-Control-Allow-Origin": origem, Vary: "Origin" }
    : {};

  return new Response(
    JSON.stringify({
      city: header(req, "x-vercel-ip-city"),
      region: header(req, "x-vercel-ip-country-region"),
      country: header(req, "x-vercel-ip-country"),
    }),
    {
      headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store", ...cors },
    },
  );
}
