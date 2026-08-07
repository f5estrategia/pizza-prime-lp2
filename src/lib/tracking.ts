// Correspondencia avancada (Advanced Matching) do Meta Pixel.
//
// O Pixel é disparado exclusivamente pelo GTM (GTM-PCL98LNF). Este módulo não
// dispara evento nenhum: ele só monta o objeto `user_data` e empurra na
// dataLayer para que as tags do GTM leiam. Sem mapear estas variáveis no GTM,
// nada disso chega na Meta.
//
// O bootstrap (external_id, fbc, fbp, cache de geo e do lead) roda inline no
// index.html ANTES do snippet do GTM, senão o PageView sai sem os parâmetros.
// Aqui ficam só as partes que dependem do React ou de rede.

const COOKIE_EXTERNAL_ID = "_f5eid";
const STORAGE_GEO = "pp_geo";
const STORAGE_LEAD = "pp_lead_ud";
const STORAGE_FBC = "pp_fbc";

const UM_DIA = 86_400_000;

export interface UserData {
  external_id?: string;
  em?: string;
  ph?: string;
  fn?: string;
  ct?: string;
  st?: string;
  country?: string;
  fbc?: string;
  fbp?: string;
}

// ------------------------------------------------------------------ helpers

const lerCookie = (nome: string): string => {
  const m = document.cookie.match("(^|;)\\s*" + nome + "\\s*=\\s*([^;]+)");
  return m ? decodeURIComponent(m[2]) : "";
};

const lerJson = <T,>(chave: string): T | null => {
  try {
    return JSON.parse(localStorage.getItem(chave) || "null") as T | null;
  } catch {
    return null;
  }
};

const gravarJson = (chave: string, valor: unknown) => {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* storage indisponivel (aba anonima / cota) */
  }
};

// ------------------------------------------------- normalizacao exigida pela Meta
// O Pixel do navegador faz o hash sozinho; o que precisamos entregar é o valor
// limpo. Valor sujo (telefone com mascara, e-mail com maiuscula) gera hash
// diferente do que a Meta tem no cadastro e a correspondencia falha.

export const normalizarEmail = (valor: string): string =>
  valor.trim().toLowerCase();

/** Telefone em E.164 sem o "+": so digitos, com DDI 55. */
export const normalizarTelefone = (valor: string): string => {
  let d = (valor || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length <= 11) d = "55" + d; // usuario digitou so DDD + numero
  return d;
};

/** Cidade/estado: minusculo, sem acento, sem espaco nem pontuacao. */
export const normalizarTexto = (valor: string): string =>
  (valor || "")
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/** Primeiro nome, normalizado. */
export const normalizarPrimeiroNome = (valor: string): string =>
  normalizarTexto((valor || "").trim().split(/\s+/)[0] || "");

// ------------------------------------------------------------------ leitura

export const getExternalId = (): string => lerCookie(COOKIE_EXTERNAL_ID);

export const getFbc = (): string =>
  lerCookie("_fbc") || localStorage.getItem(STORAGE_FBC) || "";

export const getFbp = (): string => lerCookie("_fbp");

/** Monta o user_data com tudo que existe no momento da chamada. */
export const buildUserData = (extra: Partial<UserData> = {}): UserData => {
  const { ts: _ts, ...geo } = lerJson<{ ts?: number } & Partial<UserData>>(STORAGE_GEO) || {};
  const lead = lerJson<Partial<UserData>>(STORAGE_LEAD) || {};

  const ud: UserData = {
    external_id: getExternalId(),
    ...geo,
    ...lead,
    ...extra,
  };

  const fbc = getFbc();
  const fbp = getFbp();
  if (fbc) ud.fbc = fbc;
  if (fbp) ud.fbp = fbp;

  // remove chaves vazias: parametro vazio conta como "nao enviado" e derruba a nota
  (Object.keys(ud) as (keyof UserData)[]).forEach((k) => {
    if (!ud[k]) delete ud[k];
  });

  return ud;
};

// ------------------------------------------------------------------ escrita

/** Persiste os dados do lead para enriquecer PageViews futuros do mesmo usuario. */
export const salvarLead = (dados: {
  nome?: string;
  email?: string;
  telefone?: string;
  cidade?: string;
}) => {
  const lead: Partial<UserData> = {};
  if (dados.email) lead.em = normalizarEmail(dados.email);
  if (dados.telefone) lead.ph = normalizarTelefone(dados.telefone);
  if (dados.nome) lead.fn = normalizarPrimeiroNome(dados.nome);
  if (dados.cidade) lead.ct = normalizarTexto(dados.cidade);
  if (Object.keys(lead).length) gravarJson(STORAGE_LEAD, lead);
};

/**
 * Geolocaliza por IP e guarda em cache (24h) para o proximo carregamento.
 * O PageView atual nao aproveita (a chamada e assincrona e o GTM ja disparou),
 * mas a partir da segunda pagina cidade/estado/pais passam a ir junto.
 */
export const carregarGeo = async (): Promise<void> => {
  const cache = lerJson<{ ts: number } & Partial<UserData>>(STORAGE_GEO);
  if (cache && Date.now() - (cache.ts || 0) < UM_DIA) return;

  try {
    const r = await fetch("https://ipwho.is/");
    const j = await r.json();
    if (!j || j.success === false) return;

    gravarJson(STORAGE_GEO, {
      ts: Date.now(),
      ct: normalizarTexto(j.city || ""),
      st: normalizarTexto(j.region_code || j.region || ""),
      country: (j.country_code || "").toLowerCase(),
    });
  } catch {
    /* falha de rede/adblock: segue sem geo */
  }
};

/** Empurra o user_data atualizado para as tags do GTM. */
export const pushUserData = (evento: string, extra: Record<string, unknown> = {}) => {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: evento, user_data: buildUserData(), ...extra });
};
