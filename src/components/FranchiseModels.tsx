import { motion } from "framer-motion";
import { MapPin, Truck, Store, ChefHat, Check, X as XIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import mogiPhoto from "@/assets/mogi-das-cruzes.jpg";

const models = [
  {
    id: "smart",
    name: "Smart Delivery",
    icon: Truck,
    subtitle: "Delivery + Retirada (Take Away)",
    investment: "R$ 199 mil",
    area: "Compacto",
    salao: false,
    rodizio: false,
    alacarte: false,
    delivery: true,
    retirada: true,
    lucratividade: "12% a 16%",
    payback: "18 a 24 meses",
    extras: "R$ 50k (capital de giro + estoque inicial)",
    total: "R$ 250k",
    featured: true,
    highlights: [
      "Formato compacto, econômico, altamente eficiente e rentável",
      "Lucratividade de 12% a 16% (muito lucrativo)",
      "Sem necessidade de mão de obra especializada",
      "Payback estimado: 18 a 24 meses",
    ],
  },
  {
    id: "express",
    name: "Express Delivery",
    icon: Store,
    subtitle: "Delivery + Retirada + Salão até 29 lugares + Rodízio Inteligente",
    investment: "R$ 269 mil",
    area: "Acima de 70 m²",
    salao: true,
    rodizio: true,
    alacarte: false,
    delivery: true,
    retirada: true,
    lucratividade: "—",
    payback: "24 a 36 meses",
    extras: "R$ 20k (estoque) + R$ 50k (capital de giro)",
    total: "R$ 339k",
    featured: false,
    highlights: [
      "Área: acima de 70 m²",
      "Salão para até 29 lugares + delivery e retirada",
      "Inclui Rodízio Inteligente — serviço exclusivo Pizza Prime",
      "Payback estimado: 24 a 36 meses",
      "Ideal para cidades médias e grandes",
    ],
  },
  {
    id: "salao",
    name: "Salão Delivery",
    icon: ChefHat,
    subtitle: "Salão amplo + Delivery + Rodízio + À la carte",
    investment: "R$ 349 mil",
    area: "Acima de 120 m²",
    salao: true,
    rodizio: true,
    alacarte: true,
    delivery: true,
    retirada: true,
    lucratividade: "—",
    payback: "24 a 36 meses",
    extras: "R$ 20k (estoque) + R$ 50k (capital de giro)",
    total: "R$ 419k",
    featured: false,
    highlights: [
      "Área: acima de 120 m²",
      "Salão acima de 30 lugares + delivery e retirada",
      "Maior capacidade: rodízio e à la carte",
      "Payback estimado: 24 a 36 meses",
      "Experiência completa, versatilidade para o franqueado",
    ],
  },
];

const comparisonRows: { label: string; key: string; boolean?: boolean }[] = [
  { label: "Investimento inicial", key: "investment" },
  { label: "Investimento total estimado", key: "total" },
  { label: "Área mínima", key: "area" },
  { label: "Delivery", key: "delivery", boolean: true },
  { label: "Retirada", key: "retirada", boolean: true },
  { label: "Salão", key: "salao", boolean: true },
  { label: "Rodízio", key: "rodizio", boolean: true },
  { label: "À la carte", key: "alacarte", boolean: true },
  { label: "Lucratividade", key: "lucratividade" },
  { label: "Payback estimado", key: "payback" },
  { label: "Despesas extras", key: "extras" },
];

const FranchiseModels = () => {
  const scrollToForm = () => {
    document.getElementById("formulario")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="py-20 lg:py-28 bg-brand-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-2">
              Modelos de Franquia
            </p>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-2 text-white">
              Três formatos, um padrão: resultado.
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Cada modelo foi desenhado para se adaptar ao seu perfil de investimento, ao tamanho da
              sua cidade e ao seu nível de envolvimento na operação.
            </p>
            <img
              src={mogiPhoto}
              alt="Unidade Pizza Prime Mogi das Cruzes"
              className="mx-auto mt-8 rounded-xl max-w-3xl w-full object-cover"
            />
          </motion.div>

          {/* ── Tabela comparativa (desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden md:block mb-12"
          >
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/50 font-medium w-1/4">Característica</th>
                    {models.map((m) => (
                      <th
                        key={m.id}
                        className={`p-4 text-center font-extrabold text-lg relative ${
                          m.featured ? "bg-primary/20" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {m.featured && (
                            <Badge className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 mb-1">
                              ⭐ Mais vendido
                            </Badge>
                          )}
                          <m.icon className="w-6 h-6 text-secondary" />
                          {m.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr
                      key={row.key}
                      className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                    >
                      <td className="p-4 text-white/70 font-medium">{row.label}</td>
                      {models.map((m) => {
                        const val = (m as any)[row.key];
                        return (
                          <td
                            key={m.id}
                            className={`p-4 text-center ${m.featured ? "bg-primary/10" : ""}`}
                          >
                            {row.boolean ? (
                              val ? (
                                <Check className="w-5 h-5 text-secondary mx-auto" />
                              ) : (
                                <XIcon className="w-5 h-5 text-white/20 mx-auto" />
                              )
                            ) : (
                              <span
                                className={`${
                                  row.key === "investment" || row.key === "total"
                                    ? "text-secondary font-extrabold text-base"
                                    : "text-white/80"
                                }`}
                              >
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-4"></td>
                    {models.map((m) => (
                      <td key={m.id} className={`p-4 text-center ${m.featured ? "bg-primary/10" : ""}`}>
                        <button
                          onClick={scrollToForm}
                          className={`w-full py-3 rounded-lg font-bold transition-all ${
                            m.featured
                              ? "bg-secondary text-secondary-foreground hover:bg-whatsapp hover:text-whatsapp-foreground"
                              : "bg-white/10 text-white hover:bg-whatsapp hover:text-whatsapp-foreground"
                          }`}
                        >
                          Quero este modelo
                        </button>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>

          {/* ── Tabs (mobile) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:hidden mb-12"
          >
            <Tabs defaultValue="smart" className="w-full">
              <TabsList className="w-full bg-white/[0.06] border border-white/10 h-auto p-1 flex">
                {models.map((m) => (
                  <TabsTrigger
                    key={m.id}
                    value={m.id}
                    className="flex-1 text-xs py-2.5 text-white/60 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-none relative"
                  >
                    {m.featured && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                        ⭐ Mais vendido
                      </span>
                    )}
                    {m.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {models.map((m) => (
                <TabsContent key={m.id} value={m.id}>
                  <div className={`rounded-xl border p-6 mt-4 ${m.featured ? "bg-[#861B15] border-[#861B15]" : "bg-white/[0.04] border-white/10"}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <m.icon className="w-8 h-8 text-secondary" />
                      <div>
                        <h3 className="text-xl font-extrabold text-white">{m.name}</h3>
                        <p className="text-white/60 text-sm">{m.subtitle}</p>
                      </div>
                    </div>

                    <div className="text-3xl font-extrabold text-secondary mb-4">{m.investment}</div>

                    <ul className="space-y-3 mb-6">
                      {m.highlights.map((h, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                          <span className="text-white/80">{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="text-xs border-t border-white/10 pt-4 space-y-1 text-white/60">
                      <p>Despesas extras: {m.extras}</p>
                      <p className="font-bold text-secondary">Investimento total estimado: {m.total}</p>
                    </div>

                    <button
                      onClick={scrollToForm}
                      className={`w-full mt-6 py-3 rounded-lg font-bold transition-all ${
                        m.featured
                          ? "bg-secondary text-secondary-foreground hover:bg-whatsapp hover:text-whatsapp-foreground"
                          : "bg-white/10 text-white hover:bg-whatsapp hover:text-whatsapp-foreground"
                      }`}
                    >
                      Quero este modelo
                    </button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </section>

    </>
  );
};

export default FranchiseModels;
