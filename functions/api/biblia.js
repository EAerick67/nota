export async function onRequestPost({ request, env }) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (!env.GEMINI_API_KEY) return new Response(JSON.stringify({error:"Integração desativada: configure GEMINI_API_KEY em Settings → Variables and Secrets no Cloudflare Pages."}),{status:503,headers});
  let body; try { body=await request.json(); } catch { return new Response(JSON.stringify({error:"Envie uma busca válida."}),{status:400,headers}); }
  const query=typeof body.query==="string" ? body.query.trim().slice(0,300) : "";
  if (!query) return new Response(JSON.stringify({error:"Digite uma referência ou tema bíblico."}),{status:400,headers});
  const prompt=`Você ajuda a preparar uma nota de falecimento respeitosa em português brasileiro. Busca do usuário: "${query}". Retorne de 3 a 5 sugestões bíblicas relevantes, com referências exatas e sem inventar versículos. Para cada item: reference (livro, capítulo e versículos), text (paráfrase breve em português, máximo 35 palavras; não reproduza longos trechos de traduções protegidas), note (frase curta sobre consolo, esperança, saudade ou sabedoria). Se for uma referência específica, priorize-a e sugira passagens relacionadas. Responda somente JSON válido: {"results":[{"reference":"...","text":"...","note":"..."}]}.`;
  try {
    const model=env.GEMINI_MODEL || "gemini-2.5-flash";
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",temperature:0.3}})});
    const payload=await r.json();
    if(!r.ok) return new Response(JSON.stringify({error:"Gemini não concluiu a busca. Confira a chave e os limites da API."}),{status:502,headers});
    const raw=payload?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("").trim(); if(!raw) return new Response(JSON.stringify({error:"O Gemini retornou resposta vazia."}),{status:502,headers});
    let parsed; try{parsed=JSON.parse(raw)}catch{return new Response(JSON.stringify({error:"Resposta do Gemini em formato inesperado."}),{status:502,headers})}
    const results=Array.isArray(parsed.results)?parsed.results.slice(0,5).map(x=>({reference:String(x.reference||"").slice(0,120),text:String(x.text||"").slice(0,700),note:String(x.note||"").slice(0,240)})).filter(x=>x.reference&&x.text):[];
    return new Response(JSON.stringify({results}),{status:200,headers});
  } catch { return new Response(JSON.stringify({error:"Falha de conexão com o serviço bíblico. Tente novamente mais tarde."}),{status:502,headers}); }
}
