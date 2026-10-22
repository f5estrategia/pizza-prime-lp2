import { motion } from "framer-motion";
import { Rocket, ChartNoAxesCombined, ClipboardCheck } from "lucide-react";

// Para quem é a franquia + as três objeções mais comuns de quem nunca teve pizzaria
// (vindos do folheto da Feira de Curitiba e das LPs da matéria, out/2026).
const perfis = [
  { icon: Rocket, tag: "Primeiro negócio", title: "Para quem sempre quis empreender", text: "e busca segurança para dar o primeiro passo, com suporte completo e sem precisar de experiência no setor de alimentação." },
  { icon: ChartNoAxesCombined, tag: "Diversificação", title: "Para quem já empreende e quer diversificar", text: "com um negócio físico e previsível, operação padronizada e uma rede que já provou que funciona." },
  { icon: ClipboardCheck, tag: "Negócio gerenciável", title: "Para quem quer um negócio conduzido por processos", text: "e indicadores, sem depender do know-how pessoal de cozinha." },
];

const objecoes = [
  { medo: "Não entendo de pizza", resposta: "Operação padronizada e insumos porcionados pela cozinha central." },
  { medo: "Não tenho experiência em gestão", resposta: "Metodologia de ensino e modelo de negócio comprovado." },
  { medo: "Tenho medo de empreender sozinho", resposta: "Acompanhamento em cada etapa, da escolha do ponto à operação do dia a dia." },
];

const ProfileSection = () => (
  <section className="py-20 lg:py-28 bg-[#F7F4EF]">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0E0E0E] leading-tight">
          Para quem é a <span className="text-[#861B15]">Pizza Prime?</span>
        </h2>
        <p className="text-lg text-[#0E0E0E]/60 mt-4">Um modelo de negócio pensado para quem quer investir com método, não para quem precisa saber fazer pizza.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {perfis.map(({ icon: Icon, tag, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white p-7 shadow-lg border-t-4 border-[#861B15]"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-full bg-[#861B15] flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-secondary" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#861B15]">{tag}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0E0E0E] leading-snug">{title}</h3>
            <p className="text-[#0E0E0E]/70 mt-2 leading-relaxed">{text}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto rounded-2xl bg-[#0E0E0E] text-white p-7 md:p-10">
        <h3 className="text-2xl md:text-3xl font-extrabold">
          Operação descomplicada. <span className="text-secondary">Empreenda sem medo.</span>
        </h3>
        <dl className="mt-6 divide-y divide-white/10">
          {objecoes.map((o) => (
            <div key={o.medo} className="grid sm:grid-cols-[1fr_1.4fr] gap-1 sm:gap-6 py-4">
              <dt className="italic font-bold text-secondary text-lg">"{o.medo}"</dt>
              <dd className="text-white/85 leading-relaxed">{o.resposta}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  </section>
);

export default ProfileSection;
