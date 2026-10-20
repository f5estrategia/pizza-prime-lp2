import { beforeEach, describe, expect, it, vi } from "vitest";
import { origemDaVisita } from "@/lib/tracking";

const irPara = (busca: string) => window.history.replaceState({}, "", "/" + busca);

describe("origemDaVisita", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it("lê da URL e guarda", () => {
    irPara("?utm_source=google&utm_medium=cpc&gclid=abc");
    expect(origemDaVisita()).toMatchObject({ utm_source: "google", utm_medium: "cpc", gclid: "abc" });
    expect(localStorage.getItem("pp_origem")).toContain("google");
  });

  it("sem parâmetro na URL, devolve a origem guardada", () => {
    irPara("?utm_source=google&gclid=abc");
    origemDaVisita();
    irPara("");
    expect(origemDaVisita()).toMatchObject({ utm_source: "google", gclid: "abc" });
  });

  it("visita nova com parâmetro substitui a guardada", () => {
    irPara("?utm_source=google");
    origemDaVisita();
    irPara("?utm_source=ig&utm_medium=paid");
    origemDaVisita();
    irPara("");
    expect(origemDaVisita()).toMatchObject({ utm_source: "ig", utm_medium: "paid" });
  });

  it("descarta depois de 30 dias", () => {
    irPara("?utm_source=google");
    origemDaVisita();
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 31 * 86_400_000);
    irPara("");
    expect(origemDaVisita().utm_source).toBe("");
  });
});
