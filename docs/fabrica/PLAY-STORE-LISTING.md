# Moppy — Ficha da Loja (Google Play Console)

Rascunho pronto pra colar direto na Play Console (`Presença na loja → Ficha principal da loja`).
Ajuste o que quiser — texto solto, sem compromisso de aprovação automática do Google.

---

## Nome do app

```
Moppy — Faxina sob demanda
```

(máx. 30 caracteres — esse tem 27)

## Descrição curta (máx. 80 caracteres)

```
Contrate faxineiras de confiança perto de você, com pagamento pelo app.
```

(72 caracteres)

## Descrição completa (máx. 4000 caracteres)

```
Moppy conecta você a faxineiras autônomas da sua região, de forma rápida e segura — tudo pelo celular.

COMO FUNCIONA
• Descreva o que precisa: tipo de limpeza, tamanho do imóvel e data
• Faxineiras da sua região se candidatam ao pedido
• Você escolhe com quem quer trabalhar, vendo avaliações de outros clientes
• O pagamento é feito com segurança pelo app — sem dinheiro na mão, sem combinação por fora
• Depois do serviço, avalie e ajude a manter a qualidade da comunidade

PRA QUEM PRECISA DE LIMPEZA
• Encontre faxineiras avaliadas por outros clientes
• Acompanhe o pedido do início ao fim, com chat direto
• Pagamento automático pelo cartão, sem burocracia
• Em caso de problema, conte com nosso suporte para resolver

PRA QUEM É FAXINEIRA
• Receba pedidos de limpeza perto de você
• Veja o valor que vai receber antes de aceitar o serviço
• Receba o pagamento direto na sua carteira do app, com saque via PIX
• Construa sua reputação com avaliações reais de clientes

SEGURANÇA EM PRIMEIRO LUGAR
Verificamos a identidade de todas as faxineiras antes de liberarem o perfil na plataforma.

O Moppy é um app de intermediação: conectamos clientes e faxineiras autônomas, mas não somos empregadores nem
oferecemos seguro trabalhista de nenhuma das partes.

Dúvidas ou sugestões? Fale com a gente: jehuneto17@gmail.com
```

(aprox. 1450 caracteres — bem abaixo do limite, dá pra crescer depois com prints reais e números "X faxineiras cadastradas" quando tiver)

## Categoria

**Categoria do app:** Estilo de vida (Lifestyle) — alternativa: Casa e decoração (House & Home), se o Google separar essa opção pro Brasil.

## Ícone

Já existe em `moppy-mobile/assets/images/icon.png` (mesmo usado no app). Confirmar que está em 512x512px, PNG, sem
transparência nas bordas (exigência da Play Store) antes de subir.

## Capturas de tela (obrigatório: mínimo 2, recomendado 4-8)

**Ainda não temos.** Precisa gerar depois que o app rodar numa build de verdade (celular real ou emulador estável).
Sugestão de telas pra capturar (retrato, celular):
1. Tela de login/cadastro (mostra a marca)
2. Home do cliente com pedidos
3. Tela de criar pedido (mostra o mapa/endereço)
4. Feed de pedidos da faxineira
5. Tela de pagamento/cartão
6. Perfil com avaliações

Tamanho exigido pelo Google: telefone — mínimo 320px, máximo 3840px no lado maior, proporção entre 16:9 e 9:16.

## Gráfico de destaque (feature graphic — obrigatório)

1024x500px, PNG ou JPG. Ainda não existe — precisa ser desenhado (pode ser feito no Canva/Figma, é só uma imagem
de banner com o logo + nome do app).

## Classificação de conteúdo (Content rating)

Preencher o questionário oficial da Play Console (não tem como eu preencher por você, é formulário oficial do
Google). Respostas esperadas para o Moppy: sem violência, sem conteúdo adulto, sem apostas — deve sair como
"Livre" ou equivalente.

## E-mail de contato (obrigatório, público na ficha)

```
jehuneto17@gmail.com
```

## Política de Privacidade (obrigatório, URL pública)

```
https://moppy-admin.vercel.app/privacidade
```

Já está no ar — testado e funcionando.

## Formulário de Segurança de Dados (Data Safety) — resumo pra preencher na Play Console

O Google exige um formulário próprio (não é texto livre) declarando o que o app coleta. Baseado no que o
Moppy realmente coleta (ver `docs/fabrica/` e a política de privacidade acima):

| Tipo de dado | Coletado? | Compartilhado com terceiros? | Finalidade |
|---|---|---|---|
| Nome | Sim | Não | Funcionalidade do app / conta |
| E-mail | Sim | Não | Conta, autenticação |
| Telefone | Sim | Não | Contato entre cliente/faxineira |
| Endereço | Sim | Sim (processador de pagamento) | Funcionalidade do app |
| Localização aproximada | Sim | Não | Funcionalidade do app (distância) |
| Fotos | Sim | Sim (armazenamento em nuvem) | Verificação de identidade, disputas |
| Informação de pagamento | Sim | Sim (processador de pagamento) | Processar cobrança |
| ID do dispositivo / token push | Sim | Não | Notificações |

Todos os dados são criptografados em trânsito (HTTPS). O usuário pode pedir exclusão da conta pelo e-mail de
contato.

---

**Pendências que só o Jehu resolve:** conta de desenvolvedor Google Play (US$25, taxa única), capturas de tela
reais, gráfico de destaque (arte 1024x500), preencher o questionário oficial de classificação de conteúdo e o
formulário de Data Safety dentro da própria Play Console (usando a tabela acima como referência).
