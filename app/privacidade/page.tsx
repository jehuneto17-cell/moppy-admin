export const metadata = {
  title: "Política de Privacidade — Moppy",
};

export default function PrivacidadePage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-16 text-ink">
      <div className="mb-10 flex items-center gap-2.5">
        <img src="/logo.png" alt="Moppy" width={36} height={36} className="rounded-lg" />
        <h1 className="text-2xl font-bold">Moppy — Política de Privacidade</h1>
      </div>

      <p className="mb-6 text-sm text-ink/60">Última atualização: 5 de setembro de 2026.</p>

      <Section title="1. Quem somos">
        <p>
          O Moppy é um aplicativo que conecta clientes a faxineiras autônomas para contratação de serviços de
          limpeza residencial. O Moppy é operado, até o momento, por Mateus Vilera, pessoa física, na qualidade
          de responsável pelo tratamento dos dados descritos nesta política.
        </p>
        <p>
          Dúvidas, solicitações ou reclamações sobre seus dados pessoais podem ser enviadas para{" "}
          <a href="mailto:jehuneto17@gmail.com" className="text-brand underline">
            jehuneto17@gmail.com
          </a>
          .
        </p>
      </Section>

      <Section title="2. Quais dados coletamos">
        <p>Coletamos os dados abaixo, sempre relacionados ao uso do aplicativo:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Cadastro:</b> nome, e-mail, telefone e senha (ou login via conta Google), ao criar sua conta.
          </li>
          <li>
            <b>CPF:</b> exigido para processar pagamentos e repasses via nosso parceiro de pagamentos.
          </li>
          <li>
            <b>Endereço:</b> endereço do serviço (para clientes) ou área de atuação (para faxineiras), incluindo
            coordenadas de localização aproximada, usados para calcular distância e localizar o serviço no mapa.
          </li>
          <li>
            <b>Localização do dispositivo:</b> usada, com sua permissão, para mostrar a distância entre você e os
            pedidos ou faxineiras disponíveis.
          </li>
          <li>
            <b>Fotos e documentos:</b> foto de documento de identidade e selfie (apenas para faxineiras, na
            verificação de identidade), fotos de confirmação de chegada e fotos enviadas em caso de disputa sobre
            um serviço.
          </li>
          <li>
            <b>Dados de pagamento:</b> ao cadastrar um cartão, os dados (número, validade, CVV) são enviados
            diretamente ao nosso parceiro de pagamentos e nunca são armazenados pelo Moppy — guardamos apenas um
            token de referência, os últimos 4 dígitos e a bandeira do cartão.
          </li>
          <li>
            <b>Uso do aplicativo:</b> histórico de pedidos, avaliações, mensagens de suporte e identificador de
            notificação push do dispositivo (para enviar avisos sobre seus pedidos).
          </li>
        </ul>
      </Section>

      <Section title="3. Para que usamos seus dados">
        <ul className="list-disc space-y-2 pl-5">
          <li>Viabilizar a contratação e execução do serviço de limpeza (conectar cliente e faxineira);</li>
          <li>Processar cobranças, repasses e estornos;</li>
          <li>Verificar a identidade de faxineiras, por segurança de todos os usuários;</li>
          <li>Enviar notificações sobre o andamento do seu pedido;</li>
          <li>Resolver disputas entre cliente e faxineira;</li>
          <li>Cumprir obrigações legais e fiscais.</li>
        </ul>
      </Section>

      <Section title="4. Com quem compartilhamos seus dados">
        <p>Não vendemos seus dados. Compartilhamos apenas com prestadores de serviço que operam o próprio app:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Google Firebase</b> — autenticação de conta e banco de dados;
          </li>
          <li>
            <b>Asaas</b> — processamento de pagamentos, cobranças e repasses;
          </li>
          <li>
            <b>Cloudinary</b> — armazenamento de fotos e documentos enviados no app;
          </li>
          <li>
            <b>Mapbox</b> — cálculo de distância e exibição de mapas.
          </li>
        </ul>
        <p>
          Entre cliente e faxineira, compartilhamos apenas o necessário para a execução do serviço (nome, foto de
          perfil, endereço do serviço, telefone quando aplicável).
        </p>
      </Section>

      <Section title="5. Por quanto tempo guardamos seus dados">
        <p>
          Mantemos seus dados enquanto sua conta estiver ativa e pelo prazo exigido por lei após o encerramento
          (por exemplo, obrigações fiscais e financeiras relacionadas a pagamentos). Você pode solicitar a
          exclusão da sua conta a qualquer momento pelo e-mail de contato acima.
        </p>
      </Section>

      <Section title="6. Seus direitos">
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você pode solicitar a qualquer momento: acesso
          aos seus dados, correção de dados incorretos, exclusão da sua conta e dos seus dados, portabilidade dos
          seus dados e informações sobre com quem seus dados foram compartilhados. Basta enviar a solicitação
          para o e-mail de contato acima.
        </p>
      </Section>

      <Section title="7. Segurança">
        <p>
          Usamos práticas de mercado para proteger seus dados, incluindo conexão criptografada (HTTPS) em todo o
          aplicativo, e nunca armazenamos números completos de cartão de crédito.
        </p>
      </Section>

      <Section title="8. Alterações nesta política">
        <p>
          Podemos atualizar esta política eventualmente. Mudanças relevantes serão comunicadas dentro do próprio
          aplicativo.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}
