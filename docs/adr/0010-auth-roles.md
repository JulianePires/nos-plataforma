# 0010 · Autenticação e papéis

**Status:** Aceita · **Data:** 2026-11-12

## Contexto
A plataforma tem dois públicos: a equipe da Nós, no console, e os clientes, no portal. Cada um precisa entrar sem senha para gerir e só pode ver o que é seu (ADR 0001). O Supabase Auth já está no stack.

## Decisão
- **Login:** magic link por e-mail para clientes (card 04) e Google para a equipe (card 07). Nenhum fluxo com senha.
- **Papel global** em `public.profiles.role` (`admin`, `team` ou `client`), criado por trigger em `auth.users`. Todo usuário novo nasce `client`.
- **Promoção** só por SQL no painel do `nos-prod` (`update public.profiles set role = ... where id = ...`). Não há tela para isso, e a API não deixa mudar o `role`: o GRANT de `update` cobre só a coluna `full_name`.
- **Autorização** nos layouts do App Router: `getClaims()` identifica o usuário, e `profiles.role` decide o acesso ao console ou ao portal (card 05). O `proxy.ts` só renova a sessão (NOS-13).
- **Leitura do profile:** cada usuário lê só o próprio. A equipe ler perfis de clientes entra com `project_members` (S2).

## Alternativas descartadas
- Papel em `app_metadata` do JWT (custom claims): evita uma consulta por requisição, mas exige um hook de Auth e um novo login para o papel mudar. Com poucos usuários, a consulta ao `profiles` é barata e reflete a promoção na hora.
- Tela de administração de papéis: superfície de ataque e trabalho a mais para promoções raras, feitas por uma pessoa só.
- Login com senha: mais um segredo para o cliente esquecer e para a gente proteger.

## Consequências
- Promover alguém exige acesso ao painel do `nos-prod`, o que hoje é aceitável (dev solo).
- Cada layout protegido faz uma consulta a `profiles`. Se pesar, o papel vai para custom claims num ADR novo.
- O trigger roda como `security definer` no schema `private`, fora da API; qualquer mudança nele precisa manter o `search_path` vazio.

## Adendo · Magic link e allow-list de redirect (NOS-15, 2026-11-12)
- **Link do e-mail:** o template usa `{{ .RedirectTo }}/auth/confirm?token_hash=…&type=email`, e o app manda a origem do request em `emailRedirectTo`. Assim o link de um preview volta ao próprio preview. Com `{{ .SiteURL }}`, ele abriria a sessão em produção.
- **A allow-list é a fronteira de segurança.** A publishable key é pública: qualquer pessoa pode chamar `/auth/v1/otp` com o e-mail de outra e escolher o `redirect_to`. Se a lista aceitar um domínio de terceiros, o token da vítima vai para esse domínio.
- **Regra para Auth → URL Configuration → Redirect URLs do `nos-prod`:** só o domínio de produção e URLs de preview fixas (alias de branch ou domínio próprio). Nunca curinga em `vercel.app`, nem `*-<slug>.vercel.app`, porque o `*` casa hífens e aceita deploys de outros times. Se precisar de curinga, só num subdomínio nosso.
- **Sem enumeração de usuários:** `requestMagicLink` responde igual a qualquer erro do Supabase. O limite de frequência por usuário só atinge quem tem conta, então avisar sobre ele revelaria quem é cliente.

## Adendo · Guardas de área (NOS-16, 2026-11-12)
- **Uma regra só:** `resolveAccess` em `features/auth/access.ts` decide quem entra em cada área. Os layouts de `(console)` e `(portal)` só a aplicam. O proxy não decide acesso.
- **Caminho pedido:** layout não enxerga a URL, então o proxy repassa `x-pathname` como header de request. O proxy sempre sobrescreve esse header, então um valor mandado pelo cliente não chega ao servidor. Ele só vira o `next` do login, e o `safeNext` filtra o `next` de novo.
- **`safeNext` resolve a URL como o navegador:** ele descarta tab e quebra de linha e lê `\` como `/`, então `next=/%09/evil.example` chega decodificado com um tab e viraria `//evil.example`. O destino só passa se a URL resolvida continuar na mesma origem e fora de `/auth/`, comparado já decodificado e sem diferenciar maiúsculas: um `/auth/confirm` plantado faria a vítima entrar na conta do atacante.
- **Destino depois do magic link:** o proxy guarda o `next` de `/login?next=…` num cookie `httpOnly`, `SameSite=Lax`, de 1 h (o mesmo `otp_expiry`) e restrito a `/auth/confirm`. O `/auth/confirm` usa o cookie e o apaga. Foi escolhido em vez de pôr o `next` na URL do e-mail, que obrigaria a mudar o template e dependeria da allow-list aceitar caminho e query.

## Fonte
- https://nextjs.org/docs/app/api-reference/functions/next-response
- https://supabase.com/docs/guides/auth/redirect-urls
- https://supabase.com/docs/guides/auth/managing-user-data
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/server-side/nextjs
