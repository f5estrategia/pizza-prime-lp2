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

// Aceita também o próprio domínio da requisição: as URLs de preview da Vercel
// (*.vercel.app) postam no mesmo endereço e não estão na lista fixa.
const origemPermitida = (req: Request, origem: string) => {
  if (ORIGENS.includes(origem)) return true;
  try {
    return new URL(origem).host === new URL(req.url).host;
  } catch {
    return false;
  }
};

const cors = (req: Request): Record<string, string> => {
  const origem = req.headers.get("origin") || "";
  if (!origemPermitida(req, origem)) return {};
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
  if (origem && !origemPermitida(req, origem)) return json(req, 403, { ok: false });

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

  // O RD corre em paralelo com a planilha, mas só a planilha decide a resposta:
  // se o RD cair, o lead continua salvo e o formulário confirma o envio.
  const rd = enviarParaRd(lead);

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
    await rd;
    return json(req, 502, { ok: false });
  }

  await rd;
  return json(req, 200, { ok: true });
}

// ------------------------------------------------------------- RD Station
// Conversão direto no RD Station Marketing, já com a origem (traffic_*): é o
// que evita o lead entrar como "Desconhecido". Só para as LPs listadas aqui,
// para não duplicar o fluxo atual da LP principal. Sem RD_PUBLIC_TOKEN
// (token público da conta, cadastrado na Vercel), não faz nada.

const CONVERSOES_RD: Record<string, string> = {
  "formulario-lp-negocio": "lp-negocio-pizza-prime",
};

const tag = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

async function enviarParaRd(lead: Record<string, string>): Promise<void> {
  const token = process.env.RD_PUBLIC_TOKEN;
  const conversao = CONVERSOES_RD[lead.identificador];
  if (!token || !conversao) return;

  const tags = ["lp-negocio"];
  if (lead.capital) tags.push("capital-" + tag(lead.capital));
  if (lead.prazo) tags.push("prazo-" + tag(lead.prazo));

  const payload: Record<string, unknown> = {
    conversion_identifier: conversao,
    name: lead.nome,
    email: lead.email,
    mobile_phone: lead.telefone,
    city: lead.cidade || undefined,
    tags,
    traffic_source: lead.utm_source || "direto",
    traffic_medium: lead.utm_medium || undefined,
    traffic_campaign: lead.utm_campaign || undefined,
    traffic_value: lead.utm_term || lead.utm_content || undefined,
    available_for_mailing: true,
    legal_bases: [{ category: "communications", type: "consent", status: "granted" }],
  };

  try {
    const r = await fetch(
      "https://api.rd.services/platform/conversions?api_key=" + encodeURIComponent(token),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_type: "CONVERSION", event_family: "CDP", payload }),
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!r.ok) console.error("RD Station respondeu", r.status, (await r.text()).slice(0, 300));
  } catch (err) {
    console.error("Falha ao enviar o lead ao RD Station:", err);
  }
}
