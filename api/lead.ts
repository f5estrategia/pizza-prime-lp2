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

  // RD e CRM correm em paralelo com a planilha, mas só a planilha decide a resposta:
  // se um deles cair, o lead continua salvo e o formulário confirma o envio.
  const envios = Promise.all([enviarParaRd(lead), enviarParaCrm(lead)]);

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
    await envios;
    return json(req, 502, { ok: false });
  }

  await envios;
  return json(req, 200, { ok: true });
}

// ------------------------------------------------------------- CRM do cliente
// Mesmo endpoint que o formulário embedado do CRM usa (receive-lead, público).
// Envia daqui em vez de trocar o form pelo iframe: o iframe não aceita o visual
// das LPs e, depois do envio, leva a página para outro site, o que quebra o
// disparo das conversões. As opções seguem as do formulário do CRM.

const CRM_ENDPOINT =
  process.env.CRM_ENDPOINT || "https://mqkmmsrmauqebllmiikl.supabase.co/functions/v1/receive-lead";
const CRM_FORM_ID = process.env.CRM_FORM_ID || "90782e11-cdb3-4b81-9879-d6d65d3a40e1";

// source e form_name iguais aos do iframe (o CRM pode distribuir por eles, inclusive o
// espaço no fim do nome); a LP de origem vai em landing_page, como o iframe faz.
const PAGINA_CRM: Record<string, string> = {
  "formulario-lp-franquia": "/",
  "formulario-lp-franquia-folheto": "/franquia",
  "formulario-lp-negocio": "/negocio",
  "formulario-lp-oportunidade": "/oportunidade",
};

const OBJETIVO_CRM: Record<string, string> = {
  operar: "Quero abrir uma franquia e operar o negócio",
  investir: "Quero investir e contratar gestão e funcionários",
  mercado: "Buscar informações sobre o mercado de food service",
  outros: "Outros",
};

// LP principal já usa as faixas do CRM (sem o "De "); as LPs de negócio têm faixas próprias.
const CAPITAL_CRM: Record<string, string> = {
  "Ainda não tenho o capital": "Menos de R$ 100 mil",
  "Até R$ 199 mil": "De R$ 100 mil a R$ 200 mil",
  "R$ 200 a 250 mil": "De R$ 200 mil a R$ 300 mil",
  "R$ 250 a 350 mil": "De R$ 300 mil a R$ 400 mil",
  "Acima de R$ 350 mil": "De R$ 300 mil a R$ 400 mil",
};

const PRAZO_CRM: Record<string, string> = {
  "Até 3 meses": "Imediato",
  "3 a 6 meses": "3-6 meses",
  "6 a 12 meses": "6-12 meses",
};

const capitalCrm = (v: string) => CAPITAL_CRM[v] || (/^R\$ \d/.test(v) ? "De " + v : v);

async function enviarParaCrm(lead: Record<string, string>): Promise<void> {
  if (process.env.CRM_DESLIGADO === "1") return;

  const payload: Record<string, string> = {
    nome: lead.nome,
    email: lead.email,
    phone: lead.telefone.replace(/\D/g, ""),
    objetivo: OBJETIVO_CRM[lead.objetivo] || lead.objetivo,
    cidade: lead.cidade,
    capital_disponivel: capitalCrm(lead.capital),
    prazo: PRAZO_CRM[lead.prazo] || lead.prazo,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content,
    utm_term: lead.utm_term,
    gclid: lead.gclid,
    fbclid: lead.fbclid,
    landing_page: "https://lp.pizzaprime.com.br" + (PAGINA_CRM[lead.identificador] || "/"),
    source: "LP Seja um franqueado",
    form_id: CRM_FORM_ID,
    form_name: "Seja um franqueado ",
  };
  for (const k of Object.keys(payload)) if (!payload[k]) delete payload[k];

  try {
    const r = await fetch(CRM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) console.error("CRM respondeu", r.status, (await r.text()).slice(0, 300));
  } catch (err) {
    console.error("Falha ao enviar o lead ao CRM:", err);
  }
}

// ------------------------------------------------------------- RD Station
// Conversão direto no RD Station Marketing, já com a origem (traffic_*): é o
// que evita o lead entrar como "Desconhecido". Só para as LPs listadas aqui,
// para não duplicar o fluxo atual da LP principal. Sem RD_PUBLIC_TOKEN
// (token público da conta, cadastrado na Vercel), não faz nada.

const CONVERSOES_RD: Record<string, string> = {
  "formulario-lp-negocio": "lp-negocio-pizza-prime",
  "formulario-lp-oportunidade": "lp-oportunidade-pizza-prime",
  // A /franquia tem id próprio: "formulario-lp-franquia" é o da LP principal, que já
  // chega ao RD pelo fluxo atual e não pode entrar aqui (lead em dobro).
  "formulario-lp-franquia-folheto": "lp-franquia-pizza-prime",
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

  const tags = [conversao.replace("-pizza-prime", "")];
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
