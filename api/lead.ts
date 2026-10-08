// Recebe o lead do formulario e repassa para o Apps Script da planilha.
//
// O form posta no proprio dominio (lp.pizzaprime.com.br/api/lead) em vez de
// mandar os dados pessoais direto para script.google.com: formulario que envia
// nome/e-mail/telefone para outro dominio e o padrao que o Google Ads trata como
// "site comprometido". A URL do Apps Script fica so aqui, fora do bundle.
//
// A copia no GitHub Pages (f5estrategia.github.io) tambem posta aqui, via CORS.

const SHEET_ENDPOINT =
  process.env.SHEET_ENDPOINT ||
  "https://script.google.com/macros/s/AKfycbwW2C1Ue0bp9-ok-kVmN3fGCstoFIZoynt31AKAxjjLKQ8yC9FJRTVBpTpO3pqTydj7/exec";

const ORIGENS = ["https://lp.pizzaprime.com.br", "https://f5estrategia.github.io"];

// Mesmos campos que o form ja mandava; qualquer outra chave e descartada.
const CAMPOS = [
  "nome", "email", "telefone", "objetivo", "cidade", "capital", "prazo",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "data_conversao", "identificador", "fbclid", "gclid", "fbc", "fbp", "external_id",
];

const cors = (req: Request): Record<string, string> => {
  const origem = req.headers.get("origin") || "";
  if (!ORIGENS.includes(origem)) return {};
  return {
    "Access-Control-Allow-Origin": origem,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
};

const json = (req: Request, status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...cors(req) },
  });

export function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: cors(req) });
}

export async function POST(req: Request) {
  const origem = req.headers.get("origin");
  if (origem && !ORIGENS.includes(origem)) return json(req, 403, { ok: false });

  const texto = await req.text();
  if (texto.length > 10_000) return json(req, 413, { ok: false });

  let entrada: Record<string, unknown>;
  try {
    entrada = JSON.parse(texto);
  } catch {
    return json(req, 400, { ok: false });
  }

  const lead: Record<string, string> = {};
  for (const campo of CAMPOS) {
    const v = entrada[campo];
    lead[campo] = typeof v === "string" ? v.slice(0, 500) : "";
  }
  if (!lead.nome || !lead.email || !lead.telefone) return json(req, 400, { ok: false });

  try {
    // text/plain: o Apps Script le o corpo via e.postData.contents, como antes.
    const r = await fetch(SHEET_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(lead),
    });
    if (!r.ok) throw new Error("Apps Script respondeu " + r.status);
  } catch (err) {
    console.error("Falha ao gravar o lead na planilha:", err);
    return json(req, 502, { ok: false });
  }

  return json(req, 200, { ok: true });
}
