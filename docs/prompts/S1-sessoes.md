# S1 · Sessões (16 a 22 de novembro) · Acesso

A S1 entrega o acesso e a observabilidade: sessão, perfis, login sem senha, a regra de quem entra em cada área, o layout base, erros e traces no Sentry e métricas no Grafana Cloud. São 8 cards, cerca de 13,5 h, em 3 sessões. A ordem segue as dependências: CI do banco → sessão → Sentry → perfis → login → acesso → layout → métricas.

O login com Google (NOS-18) saiu para a S2 para abrir espaço para a observabilidade. Mesmo assim a sprint passa das 10 h: se apertar, o NOS-20 (métricas) é o próximo a ir para a S2. O Sentry fica, porque é ele que mostra os erros em produção.

Ciclo de cada card, igual ao da S0: `/card` → você aprova → `/tdd` → `/review` → `/pr`. Entre cards, `/clear`.

| Card | Spec | h |
| --- | --- | --- |
| NOS-12 · pgTAP no CI e finais de linha | `docs/specs/S1/01-pgtap-ci.md` | 1 |
| NOS-13 · Sessão: publishable key e proxy | `docs/specs/S1/02-session-publishable-key.md` | 1,5 |
| NOS-14 · `profiles`, papéis e seed | `docs/specs/S1/03-profiles.md` | 1,5 |
| NOS-15 · Login por magic link e logout | `docs/specs/S1/04-magic-link-login.md` | 2 |
| NOS-16 · Acesso por área | `docs/specs/S1/05-route-guards.md` | 1,5 |
| NOS-17 · Layout base | `docs/specs/S1/06-app-shell.md` | 2 |
| NOS-19 · Sentry: erros, traces e logs | `docs/specs/S1/08-sentry.md` | 2 |
| NOS-20 · Métricas OpenTelemetry no Grafana Cloud | `docs/specs/S1/09-otel-metrics.md` | 2 |
| ~~NOS-18 · Login com Google~~ (movido para a S2) | `docs/specs/S1/07-google-login.md` | — |

## Antes da sessão 1 (você, fora do repo)
- [ ] Copiar a publishable key do `nos-prod` (Settings → API Keys) e criar `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` na Vercel em Production e Preview. A `ANON_KEY` só sai depois do merge do NOS-13.
- [ ] No `nos-prod`, Auth → URL Configuration: Site URL de produção e `https://*-<seu-time>.vercel.app/**` nos redirects.
- [ ] No `.env.local`, trocar `NEXT_PUBLIC_SUPABASE_ANON_KEY` por `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com o valor do `bunx supabase status` (local).
- [ ] Para o NOS-19: criar a conta gratuita do Sentry (plano Developer, **sem cadastrar cartão**), o projeto Next.js `nos-plataforma` e um token de organização para o upload de source maps. Na Vercel: `NEXT_PUBLIC_SENTRY_DSN` (Production e Preview) e `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (só build, Production e Preview).
- [ ] Para o NOS-20: criar a stack gratuita do Grafana Cloud (**sem cartão**), gerar o token de OTLP e criar na Vercel `OTEL_EXPORTER_OTLP_ENDPOINT` e `OTEL_EXPORTER_OTLP_HEADERS` (Production e Preview, secretas). Passo a passo no card "Contas e chaves de observabilidade" do Notion.

---

## Sessão 1 · CI do banco, sessão e Sentry (≈ 4,5 h)

**Planejamento da sprint** (só desta vez, antes do primeiro card):
```text
Leia docs/prompts/S1-sessoes.md, docs/specs/backlog.md e os títulos das specs em docs/specs/S1/. Não abra código.
Confirme em até 8 linhas: a ordem dos cards, que os 4 itens do backlog com destino S1 (ou "S2 (auth)") estão cobertos por algum card, e se alguma spec conflita com um ADR. Me pergunte o que estiver ambíguo.
```

**Card 01 · pgTAP no CI**
```text
/card docs/specs/S1/01-pgtap-ci.md
```
Para provar os bloqueios sem sujar a `main`:
```text
Crie 2 branches de teste a partir da main (migration com SQL inválido; GRANT a anon no teste de privilégios), abra PRs de rascunho pelo MCP github, confirme que o job "db" falha em cada uma, feche as PRs e apague as branches. Me mostre só o link de cada run.
```
Depois do merge: marque `db` como check obrigatório na `main`.

**Card 02 · Sessão e publishable key**
```text
/clear
/card docs/specs/S1/02-session-publishable-key.md
```
Se ele quiser redirecionar no proxy:
```text
Proxy só renova sessão. Autorização fica nos layouts (card 05), conforme a spec. Remova o redirect.
```

**Card 08 · Sentry**
```text
/clear
/card docs/specs/S1/08-sentry.md
```
Para provar o envio sem deixar rota de teste na `main`:
```text
Crie uma branch descartável a partir da sua branch do card com um botão que lança erro no cliente e um Server Component que lança no servidor. Abra uma PR de rascunho, espere o preview, dispare os dois erros, me mostre os links dos eventos no Sentry (com stack trace original) e depois feche a PR e apague a branch.
```
Se ele sugerir mandar e-mail ou nome do usuário para o Sentry:
```text
Só o id do Supabase. Sem PII, conforme a spec e o ADR 0011.
```

---

## Sessão 2 · Perfis e login (≈ 3,5 h)

**Card 03 · `profiles` e seed**
```text
/clear
/card docs/specs/S1/03-profiles.md
```
Na revisão do plano, confira a tripla do ADR 0007 (RLS + policy + GRANT) e o `grant update (full_name)`. Se ele propuser uma função `is_staff()` agora:
```text
Ainda não há segundo uso. Fica para a S2, com project_members. Siga a spec.
```
Depois do merge (você): `bunx supabase link` e `bunx supabase db push` no `nos-prod`, e a promoção do seu usuário:
```sql
update public.profiles set role = 'admin' where id = (select id from auth.users where email = '<seu e-mail>');
```

**Card 04 · Magic link e logout**
```text
/clear
/card docs/specs/S1/04-magic-link-login.md
```
Para testar no local:
```text
Rode o fluxo com cliente@nos.local: peça o link, leia o e-mail no Mailpit (http://127.0.0.1:54324) pelo terminal ou me passe o link, abra e confirme a sessão. Me mostre só o resultado de cada cenário.
```
Depois do merge (você): colar o template `supabase/templates/magic-link.html` no painel do `nos-prod` e testar no preview com o seu e-mail.

---

## Sessão 3 · Acesso, layout e métricas (≈ 5,5 h)

**Card 05 · Acesso por área**
```text
/clear
/card docs/specs/S1/05-route-guards.md
```
Se ele espalhar regra de acesso pelos layouts:
```text
A regra mora só em resolveAccess. Os layouts chamam a função e fazem o redirect, nada mais.
```

**Card 06 · Layout base**
```text
/clear
/card docs/specs/S1/06-app-shell.md
```
Se quiser conferir a referência visual sem gastar contexto:
```text
Não abra o protótipo inteiro. Siga a spec: sidebar de 232 px, marcador lateral no item ativo, gaveta abaixo de 760 px, só tokens do Seixu.
```

**Card 09 · Métricas OpenTelemetry** (segundo a cortar; se a semana apertar, vai para a S2)
```text
/clear
/card docs/specs/S1/09-otel-metrics.md
```
Se ele quiser usar e-mail, id de usuário ou URL como atributo de métrica:
```text
Só valores de conjunto fechado. Cada valor novo vira uma série e o plano gratuito tem 10 mil. Siga a tabela da spec.
```
Se ele quiser trocar o tracer do Sentry por um provider OTel próprio:
```text
Traces ficam com o Sentry (ADR 0011). Registre só o MeterProvider e confirme no context7 que isso não interfere no setup do Sentry.
```
Para cortar:
```text
Vamos cortar o NOS-20. Adicione ao docs/specs/backlog.md: "Métricas OpenTelemetry no Grafana Cloud | NOS-20 | S2 | Spec docs/specs/S1/09-otel-metrics.md". Não mexa em código.
```

---

## Fora do código nesta sprint
- [ ] **Cliente piloto:** escolher o piloto e um reserva até o fim da S2. O convite real só acontece na S7, mas a escolha define com que dados testar o portal.
- [ ] **SMTP próprio** (Resend, Brevo ou similar): o SMTP padrão do Supabase só entrega para o time do projeto e tem limite de 2 e-mails por hora. Precisa estar pronto antes do primeiro convite a cliente (backlog, S2).

## Fechamento da sprint
A S1 só fecha com todos os itens abaixo marcados. O que não for da S1 vai para `docs/specs/backlog.md`, com sprint de destino.

- [ ] Cards 12 a 17 e 19 (e 20, se não for cortado) com todos os critérios de aceite marcados
- [ ] Um erro de produção aparece no Sentry com stack trace original, e o alerta de erro novo chega no seu e-mail
- [ ] Sentry e Grafana Cloud sem cartão cadastrado
- [ ] Nenhuma PR aberta e nenhuma branch além da `main` (local e remota)
- [ ] ADRs 0010 e 0011 com status Aceita; ADRs 0004 e 0009 citando a publishable key
- [ ] `main` verde nos jobs `ci` e `db`; deploy de produção `READY`
- [ ] `bunx supabase db reset && bunx supabase test db` verdes; `nos-prod` com as mesmas migrations do local
- [ ] Você entra no preview e na produção pelo magic link, como `admin`, e cai no console
- [ ] `cliente@nos.local` (local) não abre `/console/seixu`
- [ ] `CLAUDE.md`, `README.md` e `docs/context/INDEX.md` citam `features/auth`, `components/shell`, `proxy.ts` e a publishable key

```text
/clear
Leia `git log --oneline main` desta semana, os critérios de aceite das specs em docs/specs/S1/ e o checklist de fechamento em docs/prompts/S1-sessoes.md. Me diga em até 10 linhas o que fechou, o que ficou pendente e confirme que todo item fora da S1 está em docs/specs/backlog.md com destino. Não abra código.
```
Depois, mova os cards no quadro do Notion.

## Frases úteis no meio do caminho
| Situação | Diga |
| --- | --- |
| Ele começou a codar sem plano | `Pare. Volte ao /card e espere aprovação.` |
| Usou `getSession()` no servidor | `getSession não valida o token. Troque por getClaims, conforme a spec.` |
| Tabela sem GRANT ou sem teste | `Falta a tripla do ADR 0007 e o pgTAP. Sem isso não tem merge.` |
| Abstração demais | `Isso tem um uso só. Inline e remova a abstração.` |
| Duplicou algo | `Já existe <arquivo>. Reutilize e apague a cópia.` |
| PR passou de 20 arquivos | `Divida em duas PRs pela fronteira <x>. Me proponha os dois conjuntos.` |
| Contexto pesado | `/compact mantenha o plano aprovado e os cenários que faltam` |
| Dúvida sobre uma lib | `Consulte o context7 para <lib> e cite o trecho.` |
