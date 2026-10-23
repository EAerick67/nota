(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const fields = ['fullName','birthDate','deathDate','wakeTime','burialTime','wakePlace','burialPlace','messageText'];
  const note = $('memorialNote');
  let photoUrl = '';
  let zoom = 1;
  let currentLayout = 'classic';
  const messages = [
    'Com profundo pesar, comunicamos a partida de alguém muito especial. Que as lembranças, o amor e os momentos compartilhados permaneçam para sempre nos corações de todos.',
    'Sua presença foi um presente, seu carinho deixou marcas eternas e sua memória seguirá viva em cada coração que teve a alegria de conhecê-lo(a). Descanse em paz.',
    'Neste momento de despedida, ficam a gratidão por tudo o que foi vivido e a saudade que o tempo não apaga. Que familiares e amigos encontrem conforto e serenidade.',
    'Algumas pessoas deixam luz por onde passam. A luz de sua vida continuará brilhando nas histórias, nos ensinamentos e no amor que deixou como legado.'
  ];
  const presets = {
    male: {fullName:'Antônio Carlos da Silva',birthDate:'1948-03-12',deathDate:'2026-10-22',wakeTime:'A partir das 14h',burialTime:'23/10, às 10h',wakePlace:'Sala Memorial Esperança — endereço a confirmar',burialPlace:'Cemitério Jardim da Paz',messageText:messages[1]},
    female: {fullName:'Maria Helena Oliveira',birthDate:'1952-07-08',deathDate:'2026-10-22',wakeTime:'A partir das 15h',burialTime:'23/10, às 9h30',wakePlace:'Capela Memorial — endereço a confirmar',burialPlace:'Cemitério Parque das Flores',messageText:messages[2]}
  };
  function toast(message) {
    const el = $('toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 3000);
  }
  function setText(id, value, fallback) { $(id).textContent = value || fallback; }
  function formatDate(value) {
    if (!value) return '';
    const d = new Date(`${value}T12:00:00`);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('pt-BR');
  }
  function updatePreview() {
    setText('previewName', $('fullName').value.trim(), 'Nome do(a) homenageado(a)');
    setText('previewBirth', formatDate($('birthDate').value), 'Nascimento');
    setText('previewDeath', formatDate($('deathDate').value), 'Falecimento');
    setText('previewWakeTime', $('wakeTime').value.trim(), 'A confirmar');
    setText('previewWakePlace', $('wakePlace').value.trim(), 'Local a confirmar');
    setText('previewBurialTime', $('burialTime').value.trim(), 'A confirmar');
    setText('previewBurialPlace', $('burialPlace').value.trim(), 'Local a confirmar');
    setText('previewMessage', $('messageText').value.trim(), 'Com profundo pesar, comunicamos a partida de alguém muito especial. Que as lembranças e o amor permaneçam para sempre.');
  }
  function applyPreset(which) {
    const data = presets[which];
    fields.forEach(key => { if ($(key)) $(key).value = data[key] || ''; });
    updatePreview(); toast('Exemplar carregado. Edite os dados para personalizar.');
  }
  fields.forEach(id => $(id).addEventListener('input', updatePreview));
  $('presetMale').addEventListener('click', () => applyPreset('male'));
  $('presetFemale').addEventListener('click', () => applyPreset('female'));
  messages.forEach((message, i) => {
    const option = document.createElement('option'); option.value = String(i); option.textContent = `Homenagem ${i + 1}`; $('messagePreset').appendChild(option);
  });
  $('messagePreset').addEventListener('change', e => {
    if (e.target.value !== '') { $('messageText').value = messages[Number(e.target.value)]; updatePreview(); }
  });

  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === button));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === `pane-${button.dataset.tab}`));
  }));
  $('themeSelect').addEventListener('change', e => { document.body.dataset.theme = e.target.value; });
  $('modeToggle').addEventListener('click', () => {
    const dark = document.body.dataset.mode !== 'dark';
    document.body.dataset.mode = dark ? 'dark' : 'light';
    $('modeToggle').innerHTML = `<i class="fa-solid fa-${dark ? 'sun' : 'moon'}"></i><span class="sr-only">Alternar modo</span>`;
  });
  document.querySelectorAll('[data-accent]').forEach(button => button.addEventListener('click', () => {
    document.body.dataset.accent = button.dataset.accent;
    document.querySelectorAll('.color-dot').forEach(b => b.classList.toggle('active', b === button));
  }));
  document.querySelectorAll('[data-frame]').forEach(button => button.addEventListener('click', () => {
    ['classic','black','gold','floral'].forEach(v => note.classList.remove(`frame-${v}`));
    note.classList.add(`frame-${button.dataset.frame}`);
    document.querySelectorAll('[data-frame]').forEach(b => b.classList.toggle('active', b === button));
  }));
  document.querySelectorAll('[data-paper]').forEach(button => button.addEventListener('click', () => {
    ['ivory','white','sage','rose','slate'].forEach(v => note.classList.remove(`paper-${v}`));
    note.classList.add(`paper-${button.dataset.paper}`);
    document.querySelectorAll('[data-paper]').forEach(b => b.classList.toggle('active', b === button));
  }));
  document.querySelectorAll('[data-font]').forEach(button => button.addEventListener('click', () => {
    ['serif','sans','script'].forEach(v => note.classList.remove(`font-${v}`));
    note.classList.add(`font-${button.dataset.font}`);
    document.querySelectorAll('[data-font]').forEach(b => b.classList.toggle('active', b === button));
  }));
  document.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click', () => {
    ['classic','minimal','memorial','modern'].forEach(v => note.classList.remove(`layout-${v}`));
    currentLayout = button.dataset.layout; note.classList.add(`layout-${currentLayout}`);
    document.querySelectorAll('[data-layout]').forEach(b => b.classList.toggle('selected', b === button));
  }));
  $('portraitUpload').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Selecione um arquivo de imagem.'); return; }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(file);
    const img = $('portraitImage'); img.src = photoUrl; img.hidden = false;
    $('portraitPlaceholder').hidden = true; zoom = 1; img.style.transform = `scale(${zoom})`;
  });
  function setZoom(next) {
    zoom = Math.max(1, Math.min(2.5, next));
    $('portraitImage').style.transform = `scale(${zoom})`;
    toast(zoom === 1 ? 'Foto centralizada.' : `Zoom da foto: ${Math.round(zoom * 100)}%`);
  }
  $('zoomIn').addEventListener('click', () => setZoom(zoom + .15));
  $('zoomOut').addEventListener('click', () => setZoom(zoom - .15));
  $('zoomReset').addEventListener('click', () => setZoom(1));

  $('mockupUpload').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { toast('Selecione uma imagem válida.'); return; }
    const url = URL.createObjectURL(file);
    $('mockupPreview').src = url; $('mockupPreview').hidden = false;
    $('mockupStatus').textContent = `${file.name} selecionado. Prévia disponível; reconhecimento automático ainda não conectado.`;
    toast('Mockup carregado para referência.');
    // Extensão Gemini: envie o arquivo para um endpoint seguro no servidor.
    // Exemplo: POST /api/analyze-mockup com multipart/form-data.
    // O endpoint Cloudflare Pages Function chama Gemini usando GEMINI_API_KEY
    // configurada como secret no painel Cloudflare, nunca exposta no browser.
  });

  async function renderCanvas() {
    if (!window.html2canvas) throw new Error('A biblioteca de imagem não carregou. Verifique sua conexão.');
    await document.fonts.ready;
    return window.html2canvas(note, {scale: 3, useCORS: true, backgroundColor: null, logging: false});
  }
  function safeFilename() {
    const name = $('fullName').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'');
    return `nota-memorial-${name || 'homenagem'}`;
  }
  $('downloadJpg').addEventListener('click', async () => {
    try {
      toast('Preparando JPG em alta resolução…');
      const canvas = await renderCanvas();
      const link = document.createElement('a'); link.download = `${safeFilename()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', .96); link.click(); toast('JPG gerado.');
    } catch (err) { console.error(err); toast(err.message || 'Não foi possível gerar o JPG.'); }
  });
  $('downloadPdf').addEventListener('click', async () => {
    try {
      toast('Preparando PDF…');
      const canvas = await renderCanvas(); const image = canvas.toDataURL('image/jpeg', .96);
      if (!window.jspdf?.jsPDF) throw new Error('A biblioteca PDF não carregou. Verifique sua conexão.');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      let w = pageW - 20, h = w / ratio;
      if (h > pageH - 20) { h = pageH - 20; w = h * ratio; }
      pdf.addImage(image, 'JPEG', (pageW-w)/2, (pageH-h)/2, w, h, undefined, 'FAST');
      pdf.save(`${safeFilename()}.pdf`); toast('PDF gerado.');
    } catch (err) { console.error(err); toast(err.message || 'Não foi possível gerar o PDF.'); }
  });
  $('printNote').addEventListener('click', () => window.print());
  function shareText() {
    const name = $('fullName').value.trim() || 'uma pessoa querida';
    return `Nota de falecimento — ${name}\nNascimento: ${formatDate($('birthDate').value) || 'não informado'}\nFalecimento: ${formatDate($('deathDate').value) || 'não informado'}\nVelório: ${$('wakeTime').value || 'a confirmar'} — ${$('wakePlace').value || 'local a confirmar'}\nSepultamento/cremação: ${$('burialTime').value || 'a confirmar'} — ${$('burialPlace').value || 'local a confirmar'}\n\n${$('messageText').value.trim()}\n\nNota preparada pelo Painel Memorial.`;
  }
  $('shareWhatsapp').addEventListener('click', () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText())}`, '_blank', 'noopener,noreferrer'));
  $('shareEmail').addEventListener('click', () => {
    const subject = `Nota de falecimento — ${$('fullName').value.trim() || 'Homenagem memorial'}`;
    // mailto abre o aplicativo de e-mail do usuário; não envia automaticamente nem define remetente.
    window.location.href = `mailto:toymaster2025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareText())}`;
  });
  updatePreview();
})();