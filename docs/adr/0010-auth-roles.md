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

## Fonte
- https://supabase.com/docs/guides/auth/managing-user-data
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/auth/server-side/nextjs
