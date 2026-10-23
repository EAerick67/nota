# Painel Memorial — Notas e Homenagens

## Deploy no Cloudflare Pages
1. Extraia o ZIP.
2. No Cloudflare Pages, crie um projeto por upload direto ou conecte o repositório.
3. Envie os três arquivos (`index.html`, `styles.css`, `script.js`) na raiz.
4. Não é necessário comando de build; é um site estático.
5. As bibliotecas Tailwind CDN, Font Awesome, html2canvas e jsPDF exigem conexão à internet.

## Observações importantes
- Os exemplares masculino e feminino usam dados fictícios para demonstração; substitua-os antes de compartilhar.
- O botão de e-mail abre o aplicativo de e-mail padrão com mensagem pré-preenchida para `toymaster2025@gmail.com`. Um site estático não envia e-mail sozinho. Para envio real, conecte um backend ou serviço transacional.
- A área Gemini está preparada como ponto de extensão. Para reconhecimento automático, implemente `/api/analyze-mockup` em uma Cloudflare Pages Function e armazene `GEMINI_API_KEY` como secret. Nunca coloque a chave no JavaScript público.
- Para impressão, a folha é isolada via CSS de impressão. Confira a prévia do navegador antes de imprimir.
