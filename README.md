# Painel Memorial — Notas e Homenagens

## Deploy no Cloudflare Pages
1. Extraia o ZIP e publique a pasta no Cloudflare Pages.
2. Não é necessário comando de build; o site estático usa uma Pages Function em `functions/api/biblia.js`.
3. Em Settings → Variables and Secrets, adicione `GEMINI_API_KEY` como secret com sua chave Gemini.
4. Opcionalmente, defina `GEMINI_MODEL`; o padrão é `gemini-2.5-flash`. Faça novo deploy.

## Busca bíblica
Na aba Dados, use “Buscar passagem bíblica com Gemini”. Digite uma referência (ex.: “Provérbios 3:5-6”) ou um tema. Escolha “Usar na homenagem” para inserir o resultado na mensagem. A função mantém a chave no servidor; nunca coloque a chave no HTML ou JavaScript público. As respostas são sugestões geradas por IA: confira as referências em uma Bíblia confiável antes de publicar.

## Observações
- Exemplares masculino e feminino usam dados fictícios.
- O botão de e-mail abre o aplicativo padrão com a mensagem pré-preenchida para `toymaster2025@gmail.com`; envio automático exige backend/serviço de e-mail.
- Tailwind CDN, Font Awesome, html2canvas e jsPDF exigem conexão à internet.
