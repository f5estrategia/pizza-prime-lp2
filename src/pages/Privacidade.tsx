import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-pizza-prime.webp";
import Footer from "@/components/Footer";

const EMPRESA = "PIZZA PRIME FRANCHISING LTDA";
const CNPJ = "31.906.844/0001-20";
const ENDERECO = "Avenida Conceição, 2940, Cidade Nova II, Indaiatuba - SP, CEP 13334-345";
const CONTATO = "expansao@pizzaprime.com.br";
const ATUALIZACAO = "8 de outubro de 2026";

const Secao = ({ titulo, children }: { titulo: string; children: ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-extrabold text-foreground mb-3">{titulo}</h2>
    <div className="space-y-3 text-foreground/80 leading-relaxed">{children}</div>
  </section>
);

const Privacidade = () => {
  useEffect(() => {
    document.title = "Política de Privacidade | Pizza Prime Franchising";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-white flex flex-col">
      <header className="bg-brand-red py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" aria-label="Voltar para a página inicial">
            <img src={logo} alt="Pizza Prime" className="w-16" />
          </Link>
          <Link to="/" className="text-white/90 hover:text-white underline underline-offset-4 text-sm">
            Voltar para o site
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl flex-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">Política de Privacidade</h1>
        <p className="text-sm text-foreground/60 mb-10">Última atualização: {ATUALIZACAO}</p>

        <Secao titulo="1. Quem somos">
          <p>
            Esta página é mantida pela {EMPRESA}, pessoa jurídica de direito privado, inscrita no CNPJ sob o
            nº {CNPJ}, com sede na {ENDERECO} ("Pizza Prime"). A Pizza Prime é a controladora dos dados pessoais
            coletados nesta página, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, "LGPD").
          </p>
        </Secao>

        <Secao titulo="2. Quais dados coletamos">
          <p>
            <strong>Dados que você informa no formulário:</strong> nome, e-mail, telefone, objetivo do contato e,
            quando preenchidos, cidade de interesse, capital disponível e prazo para abrir a franquia.
          </p>
          <p>
            <strong>Dados de navegação:</strong> páginas visitadas, origem do acesso (por exemplo, o anúncio ou o
            link que trouxe você até aqui e os parâmetros de campanha da URL), identificadores de cookies, tipo de
            dispositivo e navegador, e localização aproximada (cidade e estado) obtida a partir do endereço IP.
          </p>
        </Secao>

        <Secao titulo="3. Para que usamos os dados">
          <ul className="list-disc pl-5 space-y-2">
            <li>Entrar em contato com você e enviar informações sobre a franquia Pizza Prime que você solicitou.</li>
            <li>Avaliar o seu perfil e a região de interesse para a abertura de uma unidade.</li>
            <li>Medir o desempenho das nossas campanhas e saber quais canais trazem contatos.</li>
            <li>Melhorar esta página e a sua experiência de navegação.</li>
          </ul>
          <p>
            As bases legais são o seu consentimento, ao enviar o formulário, e o nosso legítimo interesse em
            responder ao seu pedido e medir as nossas campanhas de divulgação (art. 7º, I e IX, da LGPD).
          </p>
        </Secao>

        <Secao titulo="4. Cookies e ferramentas de medição">
          <p>
            Usamos cookies e tecnologias semelhantes, próprios e de parceiros, para medir audiência e o resultado
            de anúncios: Google Tag Manager, Google Analytics e Google Ads (Google), Meta Pixel (Meta) e Microsoft
            Clarity (Microsoft). Esses parceiros tratam os dados conforme as suas próprias políticas de privacidade.
          </p>
          <p>
            Você pode bloquear ou apagar cookies nas configurações do seu navegador. Algumas medições deixam de
            funcionar, mas a página continua acessível.
          </p>
        </Secao>

        <Secao titulo="5. Com quem compartilhamos">
          <p>Não vendemos seus dados. Eles podem ser compartilhados apenas com:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>a equipe de expansão da Pizza Prime e a agência de marketing que nos presta serviço;</li>
            <li>
              fornecedores de tecnologia que armazenam ou processam os dados em nosso nome (hospedagem do site,
              planilhas e ferramentas de gestão de contatos);
            </li>
            <li>as plataformas de anúncio e medição citadas no item 4;</li>
            <li>autoridades públicas, quando exigido por lei ou ordem judicial.</li>
          </ul>
          <p>
            Alguns desses fornecedores podem armazenar dados fora do Brasil, sempre com as garantias previstas
            na LGPD.
          </p>
        </Secao>

        <Secao titulo="6. Por quanto tempo guardamos">
          <p>
            Mantemos os dados enquanto forem necessários para responder ao seu contato e conduzir o processo de
            avaliação da franquia, ou pelo prazo exigido por lei. Depois disso, eles são excluídos ou anonimizados.
          </p>
        </Secao>

        <Secao titulo="7. Seus direitos">
          <p>
            Você pode, a qualquer momento, pedir a confirmação de que tratamos seus dados, o acesso, a correção, a
            anonimização, a portabilidade ou a exclusão deles, informações sobre o compartilhamento e a revogação
            do consentimento (art. 18 da LGPD). Para isso, escreva para{" "}
            <a href={`mailto:${CONTATO}`} className="underline">{CONTATO}</a>.
          </p>
          <p>
            Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
        </Secao>

        <Secao titulo="8. Segurança">
          <p>
            A página é servida apenas por conexão segura (HTTPS) e os dados do formulário são enviados ao nosso
            próprio servidor antes de seguir para as ferramentas de gestão. Adotamos medidas técnicas e
            administrativas para proteger os dados contra acesso não autorizado.
          </p>
        </Secao>

        <Secao titulo="9. Alterações">
          <p>
            Esta política pode ser atualizada. A data da última versão fica sempre indicada no topo da página.
          </p>
        </Secao>
      </main>

      <Footer />
    </div>
  );
};

export default Privacidade;
