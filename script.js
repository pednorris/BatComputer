
// =====================
// CANVAS STARS (upgraded)
// =====================
(function() {
  // Keep legacy div stars for compat
  const container = document.getElementById('stars');
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    const dur = (4 + Math.random() * 8).toFixed(1) + 's';
    const delay = (Math.random() * 8).toFixed(1) + 's';
    s.style.animation = `fall ${dur} ${delay} linear infinite`;
    container.appendChild(s);
  }

  // Canvas particle stars
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.6 + 0.1,
      opacity: Math.random() * 0.7 + 0.1,
      flicker: Math.random() * Math.PI * 2
    });
  }

  function drawStars(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forçach(p => {
      p.y += p.speed;
      p.flicker += 0.03;
      if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; }
      const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.flicker));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,200,${alpha})`;
      ctx.fill();
    });
    requestááAnimationFrame(drawStars);
  }
  requestááAnimationFrame(drawStars);
})();

// =====================
// WELCOME TYPEWRITER
// =====================
(function() {
  const el = document.getElementById('welcome-typing');
  if (!el) return;
  const lines = ['Sistema BatComputer ativo.', 'Use os botões para abrir modulos.', 'Gotham estááá segura.'];
  let li = 0, ci = 0;
  function type() {
    if (!el) return;
    if (ci < lines[li].length) {
      el.textContent = lines[li].slice(0, ++ci);
      setTimeout(type, 45);
    } else {
      setTimeout(() => {
        ci = 0;
        li = (li + 1) % lines.length;
        type();
      }, 2200);
    }
  }
  setTimeout(type, 800);
})();

// =====================
// SCREEN FLASH
// =====================
function flashScreen() {
  const el = document.getElementById('flash-overlay');
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

// =====================
// RIPPLE EFFECT
// =====================
document.addEventListener('click', function(e) {
  const btn = e.target.closestáá('.ripple-host, .dock-btn, .calc-btn, .dcgame-key');
  if (!btn) return;
  const r = document.createElement('span');
  r.className = 'ripple-ring';
  const rect = btn.getBoundingClientRect();
  r.style.left = (e.clientX - rect.left) + 'px';
  r.style.top  = (e.clientY - rect.top)  + 'px';
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 520);
});

// =====================
// DOCK PAGE SWITCHING
// =====================
let dockPage = 1;
document.getElementById('dock-arrow').addEventListener('click', function() {
  const p1 = document.getElementById('dock-page1');
  const p2 = document.getElementById('dock-page2');
  if (dockPage === 1) {
    p1.classList.add('hidden-left');
    p2.classList.remove('hidden-right');
    p2.classList.remove('hidden-left');
    this.textContent = '◀';
    dockPage = 2;
  } else {
    p2.classList.add('hidden-right');
    p1.classList.remove('hidden-left');
    p1.classList.remove('hidden-right');
    this.textContent = '▶';
    dockPage = 1;
  }
  flashScreen();
});

// =====================
// CLOCK
// =====================
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  // Indicador de crimes ativos
  const ind = document.getElementById('crime-indicator');
  if (ind && window.gothamCrimes) {
    const ativos = window.gothamCrimes.filter(c => !c.resolvido).length;
    if (ativos > 0) {
      ind.style.display = 'block';
      ind.textContent = '● ' + ativos + ' CRIME' + (ativos>1?'S':'') + ' ATIVO' + (ativos>1?'S':'');
    } else {
      ind.style.display = 'block';
      ind.style.color = '#00ff88';
      ind.style.textShadow = '0 0 6px #00ff88';
      ind.textContent = '● GOTHAM SEGURA';
    }
  }
}
updateClock();
setInterval(updateClock, 1000);

// =====================
// WINDOW MANAGER
// =====================
let windowZ = 10;
const windows = new Map(); // id -> {el, minimized}
const taskbar = document.getElementById('taskbar');

function makeWindow(id, title, contentFn, w, h) {
  if (windows.has(id)) {
    const entry = windows.get(id);
    if (entry.minimized) {
      restááore(id);
    } else {
      focus(id);
    }
    return;
  }

  const main = document.getElementById('main');
  const maxW = main.clientWidth;
  const maxH = main.clientHeight;

  const winW = Math.min(w || 320, maxW - 20);
  const winH = Math.min(h || 380, maxH - 20);

  const el = document.createElement('div');
  el.className = 'window';
  el.id = 'win-' + id;
  el.style.width = winW + 'px';
  el.style.height = winH + 'px';
  el.style.left = Math.max(0, Math.floor(Math.random() * (maxW - winW - 10))) + 'px';
  el.style.top = Math.max(0, Math.floor(Math.random() * (maxH - winH - 20))) + 'px';
  el.style.zIndex = ++windowZ;

  // Bar
  const bar = document.createElement('div');
  bar.className = 'window-bar';

  const titleEl = document.createElement('span');
  titleEl.className = 'win-title';
  titleEl.textContent = title;

  const btnMin = document.createElement('div');
  btnMin.className = 'btn-win btn-min';
  btnMin.textContent = '—';
  btnMin.addEventListener('pointerdown', e => e.stopPropagation());
  btnMin.addEventListener('touchstart', e => e.stopPropagation(), {passive:true});
  btnMin.addEventListener('click', (e) => { e.stopPropagation(); minimize(id); });

  const btnClose = document.createElement('div');
  btnClose.className = 'btn-win btn-close';
  btnClose.textContent = '✕';
  btnClose.addEventListener('pointerdown', e => e.stopPropagation());
  btnClose.addEventListener('touchstart', e => e.stopPropagation(), {passive:true});
  btnClose.addEventListener('click', (e) => { e.stopPropagation(); closeWin(id); });

  bar.appendChild(titleEl);
  bar.appendChild(btnMin);
  bar.appendChild(btnClose);

  // Body
  const body = document.createElement('div');
  body.className = 'window-body';
  body.id = 'body-' + id;

  // Resize handle
  const resize = document.createElement('div');
  resize.className = 'resize-handle';

  el.appendChild(bar);
  el.appendChild(body);
  el.appendChild(resize);
  main.appendChild(el);

  // Content
  contentFn(body);

  // Drag
  makeDraggable(el, bar);
  makeResizable(el, resize);

  // Focus on click
  el.addEventListener('pointerdown', () => focus(id));

  // Taskbar entry
  const tb = document.createElement('button');
  tb.className = 'taskbar-btn';
  tb.textContent = title;
  tb.id = 'tb-' + id;
  tb.addEventListener('click', () => {
    const entry = windows.get(id);
    if (entry.minimized) restááore(id);
    else focus(id);
  });
  taskbar.appendChild(tb);

  windows.set(id, { el, tb, minimized: false, title });

  // Hide welcome
  document.getElementById('welcome').style.display = 'none';
  flashScreen();
}

function focus(id) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.el.style.zIndex = ++windowZ;
  // glow focused window
  windows.forçach((e, k) => e.el.classList.remove('focused'));
  entry.el.classList.add('focused');
}

function minimize(id) {
  const entry = windows.get(id);
  if (!entry) return;
  // animate shrink then hide
  entry.el.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
  entry.el.style.transform = 'scale(0.75) translateY(20px)';
  entry.el.style.opacity = '0';
  setTimeout(() => {
    entry.el.style.display = 'none';
    entry.el.style.transform = '';
    entry.el.style.opacity = '';
    entry.el.style.transition = '';
  }, 200);
  entry.minimized = true;
  entry.tb.classList.add('minimized');
}

function restááore(id) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.el.style.display = 'flex';
  entry.el.classList.remove('closing');
  entry.el.style.animation = 'none';
  void entry.el.offsetWidth;
  entry.el.style.animation = '';
  entry.minimized = false;
  entry.tb.classList.remove('minimized');
  focus(id);
  flashScreen();
}

function closeWin(id) {
  const entry = windows.get(id);
  if (!entry) return;
  entry.el.classList.add('closing');
  setTimeout(() => {
    entry.el.remove();
    entry.tb.remove();
    windows.delete(id);
    if (windows.size === 0) {
      document.getElementById('welcome').style.display = 'flex';
    }
  }, 220);
}

// =====================
// DRAG
// =====================
function makeDraggable(el, handle) {
  let startX, startY, startL, startT, dragging = false;

  function onStart(e) {
    dragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX;
    startY = pt.clientY;
    startL = parseInt(el.style.left) || 0;
    startT = parseInt(el.style.top) || 0;
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    const pt = e.touches ? e.touches[0] : e;
    const dx = pt.clientX - startX;
    const dy = pt.clientY - startY;
    const main = document.getElementById('main');
    const newL = Math.max(0, Math.min(startL + dx, main.clientWidth - el.offsetWidth));
    const newT = Math.max(0, Math.min(startT + dy, main.clientHeight - 40));
    el.style.left = newL + 'px';
    el.style.top = newT + 'px';
    e.preventDefault();
  }

  function onEnd() { dragging = false; }

  handle.addEventListener('touchstart', onStart, { passive: false });
  handle.addEventListener('touchmove', onMove, { passive: false });
  handle.addEventListener('touchend', onEnd);
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
}

// =====================
// RESIZE
// =====================
function makeResizable(el, handle) {
  let dragging = false, startX, startY, startW, startH;

  function onStart(e) {
    dragging = true;
    const pt = e.touches ? e.touches[0] : e;
    startX = pt.clientX; startY = pt.clientY;
    startW = el.offsetWidth; startH = el.offsetHeight;
    e.preventDefault(); e.stopPropagation();
  }

  function onMove(e) {
    if (!dragging) return;
    const pt = e.touches ? e.touches[0] : e;
    const main = document.getElementById('main');
    const newW = Math.max(240, Math.min(startW + pt.clientX - startX, main.clientWidth - parseInt(el.style.left)));
    const newH = Math.max(160, Math.min(startH + pt.clientY - startY, main.clientHeight - parseInt(el.style.top)));
    el.style.width = newW + 'px';
    el.style.height = newH + 'px';
    e.preventDefault();
  }

  function onEnd() { dragging = false; }

  handle.addEventListener('touchstart', onStart, { passive: false });
  handle.addEventListener('touchmove', onMove, { passive: false });
  handle.addEventListener('touchend', onEnd);
  handle.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
}

// =====================
// CALCULADORA
// =====================
function openCalc() {
  logAtividade('CALC', 'Calculadora aberta');
  makeWindow('calc', '🔢 BAT-CALC', function(body) {
    body.style.gap = '0';

    const display = document.createElement('div');
    display.className = 'calc-display';

    const exprEl = document.createElement('div');
    exprEl.className = 'calc-expr';
    exprEl.textContent = '';

    const resEl = document.createElement('div');
    resEl.className = 'calc-result';
    resEl.textContent = '0';

    display.appendChild(exprEl);
    display.appendChild(resEl);

    const grid = document.createElement('div');
    grid.className = 'calc-grid';
    grid.style.flex = '1';

    let expr = '';

    const btns = [
      ['C','cls'],['(',null],[')',null],['÷','op'],
      ['7',null],['8',null],['9',null],['×','op'],
      ['4',null],['5',null],['6',null],['−','op'],
      ['1',null],['2',null],['3',null],['+','op'],
      ['0',null],['.',null],['⌫','back'],['=','eq']
    ];

    btns.forçach(([label, type]) => {
      const btn = document.createElement('button');
      btn.className = 'calc-btn' + (type ? ' ' + type : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        if (label === 'C') { expr = ''; exprEl.textContent = ''; resEl.textContent = '0'; }
        else if (label === '⌫') { expr = expr.slice(0,-1); exprEl.textContent = expr; }
        else if (label === '=') {
          try {
            const safe = expr.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
            const r = Function('"use strict"; return (' + safe + ')')();
            resEl.textContent = parseFloat(r.toFixed(10)).toString();
            exprEl.textContent = expr + ' =';
            expr = parseFloat(r.toFixed(10)).toString();
          } catch { resEl.textContent = 'ERRO'; }
        }
        else {
          expr += label.replace(/÷/,'/').replace(/×/,'*').replace(/−/,'-');
          exprEl.textContent = expr;
          try {
            const safe = expr.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
            const r = Function('"use strict"; return (' + safe + ')')();
            if (isFinite(r)) resEl.textContent = parseFloat(r.toFixed(10)).toString();
          } catch {}
        }
      });
      grid.appendChild(btn);
    });

    body.appendChild(display);
    body.appendChild(grid);
  }, 300, 440);
}

// =====================
// NOTAS
// =====================
function openNotas() {
  logAtividade('NOTAS', 'Notas abertas');
  makeWindow('notas', '📝 BAT-NOTAS', function(body) {
    const saved = localStorage.getItem('batnotas') || '';
    body.style.gap = '6px';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;flex-shrink:0;';
    header.innerHTML = '<div style="font-size:9px;color:#005544;letter-spacing:2px;">ARQUIVO CONFIDENCIAL — WAYNE ENTERPRISES</div>';
    const counter = document.createElement('div');
    counter.style.cssText = 'font-size:9px;color:#005544;letter-spacing:1px;';
    header.appendChild(counter);

    const ta = document.createElement('textarea');
    ta.className = 'notes-area';
    ta.placeholder = '> INSERIR DADOS CONFIDENCIAIS...';
    ta.value = saved;
    ta.style.flex = '1';

    function updateCounter() {
      const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
      counter.textContent = ta.value.length + ' CHARS · ' + words + ' PALAVRAS';
    }
    updateCounter();

    ta.addEventListener('input', () => {
      localStorage.setItem('batnotas', ta.value);
      updateCounter();
    });

    const row = document.createElement('div');
    row.className = 'bat-btn-row';
    row.style.marginTop = '2px';

    const btnClear = document.createElement('button');
    btnClear.className = 'bat-btn danger';
    btnClear.textContent = '🗑 🗑️ LIMPAR';
    btnClear.addEventListener('click', () => {
      if (ta.value && !confirm('Apagar todas as notas?')) return;
      ta.value = ''; localStorage.removeItem('batnotas'); updateCounter();
    });

    const btnCopy = document.createElement('button');
    btnCopy.className = 'bat-btn';
    btnCopy.textContent = '📋 📋 COPIAR';
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(ta.value).then(() => {
        btnCopy.textContent = '✅ COPIADO';
        setTimeout(() => btnCopy.textContent = '📋 📋 COPIAR', 1500);
      }).catch(() => { ta.select(); document.execCommand('copy'); });
    });

    const btnShare = document.createElement('button');
    btnShare.className = 'bat-btn gold';
    btnShare.textContent = '⬆ EXPORTAR';
    btnShare.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: 'BatNotas', text: ta.value }).catch(()=>{});
      } else {
        const blob = new Blob([ta.value], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'batnotas.txt';
        a.click();
      }
    });

    row.appendChild(btnClear);
    row.appendChild(btnCopy);
    row.appendChild(btnShare);
    body.appendChild(header);
    body.appendChild(ta);
    body.appendChild(row);
    setTimeout(() => ta.focus(), 200);
  }, 310, 370);
}

// =====================
// RADAR / STATUS
// =====================
function openRadar() {
  logAtividade('RADAR', 'Radar aberto');
  makeWindow('radar', '📡 BATCOMPUTER STATUS', function(body) {
    body.style.gap = '0';
    body.style.padding = '10px';

    const wrap = document.createElement('div');
    wrap.className = 'radar-wrap';
    body.appendChild(wrap);

    const titulo = document.createElement('div');
    titulo.style.cssText = 'text-align:center;font-size:9px;letter-spacing:3px;color:#005544;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(0,255,200,0.1);';
    titulo.innerHTML = '🦇 SISTEMAS DE GOTHAM — AO VIVO';
    wrap.appendChild(titulo);

    function addStatus(label, val, cls, icon) {
      const row = document.createElement('div');
      row.className = 'status-row';
      const l = document.createElement('span');
      l.className = 'status-label';
      l.textContent = (icon||'') + ' ' + label;
      const v = document.createElement('span');
      v.className = 'status-val ' + (cls || '');
      v.textContent = val;
      row.appendChild(l);
      row.appendChild(v);
      wrap.appendChild(row);
      return v;
    }

    const onlineStatus = navigator.onLine;
    addStatus('SISTEMA', 'ONLINE ●', 'status-ok', '⚡');
    addStatus('BAT-IA', 'CONECTADA', 'status-ok', '🦇');
    addStatus('VERSAO', 'v3.0 FINAL PWA', '', '&#128214;');
    addStatus('IDIOMA', navigator.lanáguage || 'pt-BR', '', '🌐');
    addStatus('PLATAforça', (navigator.userAgent.includes('Android') ? 'Android' : navigator.userAgent.includes('iPhone') ? 'iOS' : 'Desktop'), '', '📱');

    const separator = document.createElement('div');
    separator.style.cssText = 'border-top:1px solid rgba(0,255,200,0.08);margin:6px 0;';
    wrap.appendChild(separator);

    const timeEl = addStatus('SESSAO ATIVA', '0s', '', '&#9201;');
    const batEl  = addStatus('BATERIA', 'Verificando...', '', '🔋');
    const netEl  = addStatus('conexão', onlineStatus ? 'ONLINE' : 'OFFLINE', onlineStatus ? 'status-ok' : 'status-warn', '&#128246;');
    const memEl  = addStatus('MEMÓRIA JS', '...', '', '💾');

    const separator2 = document.createElement('div');
    separator2.style.cssText = 'border-top:1px solid rgba(0,255,200,0.08);margin:6px 0;';
    wrap.appendChild(separator2);

    const crimeEl = addStatus('CRIMES RESOLVIDOS', '0', 'status-ok', '✅');
    const modulosEl = addStatus('modulos ABERTOS', '1', '', '🗂');

    // Hora de Gotham
    const horaEl = addStatus('HORA DE GOTHAM', '--:--', '', '🌃');

    const start = Date.now();
    let sessaoAberta = 1;

    const interval = setInterval(() => {
      if (!document.getElementById('win-radar')) { clearInterval(interval); return; }
      const sec = Math.floor((Date.now() - start) / 1000);
      const m = Math.floor(sec/60), s = sec%60;
      timeEl.textContent = (m>0 ? m+'m ' : '') + s + 's';
      netEl.textContent = navigator.onLine ? 'ONLINE ●' : 'OFFLINE ✗';
      netEl.className = 'status-val ' + (navigator.onLine ? 'status-ok' : 'status-warn');
      crimeEl.textContent = (window.gothamCrimes || []).filter(c=>c.resolvido).length + ' / ' + (window.gothamCrimes||[]).length;
      modulosEl.textContent = (typeof windows !== 'undefined' ? windows.size : 1) + ' janela(s)';
      const now = new Date();
      horaEl.textContent = now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit',second:'2-digit'}) + ' 🌃';
      if (perforçance.memory) {
        const mb = Math.round(perforçance.memory.usedJSHeapSize/1048576);
        memEl.textContent = mb + ' MB';
        memEl.className = 'status-val ' + (mb > 80 ? 'status-warn' : '');
      }
    }, 1000);

    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        function updateBat() {
          const pct = Math.round(b.level*100);
          batEl.textContent = pct + '%' + (b.charging ? ' ⚡ CARREGANDO' : '');
          batEl.className = 'status-val ' + (pct < 20 ? 'status-warn' : 'status-ok');
        }
        updateBat();
        b.addEventListener('levelchange', updateBat);
        b.addEventListener('chargingchange', updateBat);
      });
    } else {
      batEl.textContent = 'N/D';
    }

    if (perforçance.memory) {
      memEl.textContent = Math.round(perforçance.memory.usedJSHeapSize/1048576) + ' MB';
    } else {
      memEl.textContent = 'N/D';
    }

  }, 290, 400);
}

// =====================
// BAT-IA TERMINAL
// =====================
function openBatIA() {
  logAtividade('BAT-IA', 'Terminal aberto');
  makeWindow('batia', 'BAT-IA', function(body) {
    const output = document.createElement('div');
    output.className = 'terminal-output';

    function addMsg(text, cls) {
      const p = document.createElement('p');
      p.className = cls;
      p.textContent = text;
      output.appendChild(p);
      output.scrollTop = output.scrollHeight;
      return p;
    }

    addMsg('🦇 BAT-IA v3.0 FINAL ONLINE', 'msg-sys');
    addMsg('Sistema inicializado. Como posso ajudar, Bruce?', 'msg-ia');

    const row = document.createElement('div');
    row.className = 'terminal-input-row';

    const input = document.createElement('input');
    input.className = 'terminal-input';
    input.type = 'text';
    input.placeholder = 'Digite para a BatIA...';
    input.autocomplete = 'off';

    const sendBtn = document.createElement('button');
    sendBtn.className = 'terminal-send';
    sendBtn.textContent = 'ENVIAR';

    row.appendChild(input);
    row.appendChild(sendBtn);
    body.appendChild(output);
    body.appendChild(row);

    let GROQ_KEY = localStorage.getItem('GROQ_API_KEY');
    if (!GROQ_KEY) {
      const ask = prompt('Digite sua GROQ API KEY para usar a BatIA:');
      if (ask) { GROQ_KEY = ask; localStorage.setItem('GROQ_API_KEY', ask); }
    }
    let memoria = [];
    let processando = false;

    // Prompt digno do Batman — preciso, inteligente, sem erros
        const BATMAN_SYSTEM = `Você é a BatIA - inteligência artificial do BatComputer, sistema pessoal de Bruce Wayne (Batman).

PERSONALIDADE:
- Fale como um computador super inteligente digno de Batman: direto, preciso, eficiente, sem enrolação
- Use lináguagem técnica quando cabível, mas sempre compreensível
- Pode usar termos de Gotham, DC Comics e universo Batman quando relevante
- Nunca invente fatos. Se não souber algo, diga claramente: "Dados insuficientes."
- Seja útil de verdade - não apenas estááiloso

REGRAS ABSOLUTAS:
1. NUNCA invente inforçações, datas, nomes ou fatos
2. NUNCA responda com conteúdo errado para parecer confiante - prefira admitir incerteza
3. Para matemática e lógica: calcule com precisão absoluta, mostre o raciocínio
4. Para código: escreva código funcional e correto, sem atalhos
5. Para perguntas factuais: seja preciso ou admita limitação de conhecimento
6. Respostas em português do Brasil, claras e organizadas`;

    async function enviar() {
      if (processando) return;
      const msg = input.value.trim();
      if (!msg) return;

      input.value = '';
      addMsg('> ' + msg, 'msg-user');
      logAtividade('BAT-IA', 'Pergunta: ' + msg.slice(0,60) + (msg.length>60?'...':''));
      processando = true;
      sendBtn.disabled = true;

      const thinking = addMsg('BatIA processando...', 'msg-sys');
      const dots = setInterval(() => {
        const base = 'BatIA processando';
        thinking.textContent = thinking.textContent.endsWith('...') ?
          base : thinking.textContent + '.';
      }, 350);

      try {
        if (memoria.length > 16) memoria = memoria.slice(-16);

        const messages = [
          { role: 'system', content: BATMAN_SYSTEM },
          ...memoria,
          { role: 'user', content: msg }
        ];

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + GROQ_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versútile',
            messages,
            max_tokens: 1024,
            temperature: 0.4,
            top_p: 0.9
          })
        });

        clearInterval(dots);
        thinking.remove();

        if (!res.ok) {
          const errBody = await res.text().catch(() => '');
          throw new Error('HTTP ' + res.status + (errBody ? ': ' + errBody.slice(0,120) : ''));
        }

        const data = await res.json();
        const resp = data.choices[0].message.content;

        memoria.push({ role: 'user', content: msg });
        memoria.push({ role: 'assistant', content: resp });

        // Typewriter effect for IA response
        const respEl = addMsg('', 'msg-ia');
        let ri = 0;
        const typeResp = setInterval(() => {
          ri = Math.min(ri + 4, resp.length);
          respEl.textContent = resp.slice(0, ri);
          output.scrollTop = output.scrollHeight;
          if (ri >= resp.length) clearInterval(typeResp);
        }, 14);

        // TTS via Web Speech API
        try {
          if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const clean = resp.replace(/[*#_`>]/g, '').replace(/\n+/g,' ').slice(0, 300);
            const utter = new SpeechSynthesisUtterance(clean);
            utter.lang = 'pt-BR';
            utter.rate = 1.0;
            utter.pitch = 0.85;
            const voices = speechSynthesis.getVoices();
            const ptVoice = voices.find(v => v.lang === 'pt-BR') ||
                            voices.find(v => v.lang.startsWith('pt'));
            if (ptVoice) utter.voice = ptVoice;
            speechSynthesis.speak(utter);
          }
        } catch {}

      } catch (err) {
        clearInterval(dots);
        thinking.remove();
        addMsg('⚠ ERRO: ' + err.message, 'msg-sys');
      }

      processando = false;
      sendBtn.disabled = false;
      input.focus();
    }

    sendBtn.addEventListener('click', enviar);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') enviar(); });

    setTimeout(() => input.focus(), 300);

  }, 340, 420);
}

// =====================
// HISTÓRICO DE ATIVIDADES
// =====================
const historicoLog = JSON.parse(localStorage.getItem('bat-historico') || '[]');

function logAtividade(modulo, acao) {
  const entry = {
    t: new Date().toISOString(),
    m: modulo,
    a: acao
  };
  historicoLog.unshift(entry);
  if (historicoLog.length > 200) historicoLog.pop();
  localStorage.setItem('bat-historico', JSON.stringify(historicoLog));
}

// =====================
// BAT-AGENDA
// =====================
function openAgenda() {
  logAtividade('AGENDA', 'modulo aberto');
  makeWindow('agenda', '📅 MISSÕES', function(body) {

    const missoes = JSON.parse(localStorage.getItem('bat-agenda') || '[]');

    function salvar() {
      localStorage.setItem('bat-agenda', JSON.stringify(missoes));
    }

    function statusMissao(dt) {
      const agora = new Date();
      const data = new Date(dt);
      const diff = data - agora;
      if (diff < 0) return 'vencida';
      if (diff < 86400000) return 'hoje';
      return 'proxima';
    }

    function renderLista() {
      lista.innerHTML = '';
      if (missoes.length === 0) {
        const vazio = document.createElement('div');
        vazio.style.cssText = 'color:var(--bat-dim);font-size:12px;text-align:center;margin-top:20px;';
        vazio.textContent = '[ Nenhuma missão cadastrada ]';
        lista.appendChild(vazio);
        return;
      }
      const sorted = [...missoes].sort((a,b) => new Date(a.dt) - new Date(b.dt));
      sorted.forçach((m, i) => {
        const st = statusMissao(m.dt);
        const item = document.createElement('div');
        item.className = 'agenda-item ' + st;

        const nome = document.createElement('div');
        nome.className = 'agenda-missao';
        nome.textContent = '🎯 ' + m.nome + (m.alarme ? '  🔔' : '');

        const hora = document.createElement('div');
        hora.className = 'agenda-hora';
        hora.textContent = new Date(m.dt).toLocaleString('pt-BR');

        const badge = document.createElement('div');
        badge.className = 'agenda-badge badge-' + st;
        badge.textContent = st === 'vencida' ? '⚠ VENCIDA' : st === 'hoje' ? '⚡ HOJE' : '● AGENDADA';

        const del = document.createElement('button');
        del.className = 'agenda-del';
        del.textContent = '✕';
        del.addEventListener('click', () => {
          const idx = missoes.findIndex(x => x.dt === m.dt && x.nome === m.nome);
          if (idx > -1) {
            logAtividade('AGENDA', 'Missão removida: ' + m.nome);
            missoes.splice(idx, 1);
            salvar();
            renderLista();
          }
        });

        item.appendChild(nome);
        item.appendChild(hora);
        item.appendChild(badge);
        item.appendChild(del);
        lista.appendChild(item);
      });
    }

    // Form
    const form = document.createElement('div');
    form.className = 'agenda-form';

    const inputNome = document.createElement('input');
    inputNome.className = 'agenda-input';
    inputNome.type = 'text';
    inputNome.placeholder = '🎯 Nome da missão...';

    const inputDt = document.createElement('input');
    inputDt.className = 'agenda-input';
    inputDt.type = 'datetime-local';

    // Set min to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    inputDt.min = now.toISOString().slice(0,16);

    // Alarm toggle row
    const alarmRow = document.createElement('div');
    alarmRow.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 0;';
    const alarmCheck = document.createElement('input');
    alarmCheck.type = 'checkbox';
    alarmCheck.id = 'agenda-alarm-check';
    alarmCheck.style.cssText = 'width:18px;height:18px;accent-color:var(--bat-gold);cursor:pointer;';
    const alarmLabel = document.createElement('label');
    alarmLabel.htmlFor = 'agenda-alarm-check';
    alarmLabel.textContent = '🔔 Ativar alarme (vibração + som Batman)';
    alarmLabel.style.cssText = 'font-size:12px;color:var(--bat-gold);cursor:pointer;';
    alarmRow.appendChild(alarmCheck);
    alarmRow.appendChild(alarmLabel);

    const btnAdd = document.createElement('button');
    btnAdd.className = 'terminal-send';
    btnAdd.textContent = '+ ADICIONAR MISSAO';
    btnAdd.style.width = '100%';
    btnAdd.addEventListener('click', () => {
      const nome = inputNome.value.trim();
      const dt = inputDt.value;
      if (!nome || !dt) return;
      missoes.push({ nome, dt, alarme: alarmCheck.checked });
      salvar();
      logAtividade('AGENDA', 'Missão adicionada: ' + nome);
      inputNome.value = '';
      inputDt.value = '';
      renderLista();
    });

    form.appendChild(inputNome);
    form.appendChild(inputDt);
    form.appendChild(alarmRow);
    form.appendChild(btnAdd);

    const lista = document.createElement('div');
    lista.className = 'agenda-list';

    body.appendChild(form);
    body.appendChild(lista);
    renderLista();

    // Auto-refresh badges
    setInterval(() => {
      if (document.getElementById('win-agenda')) renderLista();
    }, 30000);

  }, 320, 480);
}

// =====================
// HISTÓRICO
// =====================
function openHistorico() {
  logAtividade('HISTÓRICO', 'modulo aberto');
  makeWindow('historico', '🕐 BAT-LOG', function(body) {

    let filtroAtivo = 'TODOS';
    const modulos = ['TODOS', 'AGENDA', 'NOTAS', 'BAT-IA', 'CALC', 'RADAR', 'HISTÓRICO', 'SISTEMA'];

    const filterRow = document.createElement('div');
    filterRow.className = 'hist-filter';

    const lista = document.createElement('div');
    lista.className = 'hist-list';

    function renderHist() {
      lista.innerHTML = '';
      const dados = filtroAtivo === 'TODOS'
        ? historicoLog
        : historicoLog.filter(h => h.m === filtroAtivo);

      if (dados.length === 0) {
        const vazio = document.createElement('div');
        vazio.style.cssText = 'color:var(--bat-dim);font-size:12px;text-align:center;margin-top:20px;';
        vazio.textContent = '[ Nenhuma atividade registrada ]';
        lista.appendChild(vazio);
        return;
      }

      dados.forçach(h => {
        const item = document.createElement('div');
        item.className = 'hist-item';

        const time = document.createElement('div');
        time.className = 'hist-time';
        time.textContent = new Date(h.t).toLocaleString('pt-BR');

        const mod = document.createElement('div');
        mod.className = 'hist-mod';
        mod.textContent = '[ ' + h.m + ' ]';

        const act = document.createElement('div');
        act.className = 'hist-action';
        act.textContent = h.a;

        item.appendChild(time);
        item.appendChild(mod);
        item.appendChild(act);
        lista.appendChild(item);
      });
    }

    modulos.forçach(m => {
      const tag = document.createElement('button');
      tag.className = 'hist-tag' + (m === filtroAtivo ? ' active' : '');
      tag.textContent = m;
      tag.addEventListener('click', () => {
        filtroAtivo = m;
        filterRow.querySelectorAll('.hist-tag').forçach(t => t.classList.remove('active'));
        tag.classList.add('active');
        renderHist();
      });
      filterRow.appendChild(tag);
    });

    const btn🗑️ LIMPAR = document.createElement('button');
    btn🗑️ LIMPAR.className = 'terminal-send';
    btn🗑️ LIMPAR.textContent = '🗑️ LIMPAR HISTÓRICO';
    btn🗑️ LIMPAR.style.cssText = 'width:100%;margin-bottom:8px;flex-shrink:0;';
    btn🗑️ LIMPAR.addEventListener('click', () => {
      historicoLog.length = 0;
      localStorage.removeItem('bat-historico');
      renderHist();
    });

    body.appendChild(filterRow);
    body.appendChild(btn🗑️ LIMPAR);
    body.appendChild(lista);
    renderHist();

  }, 320, 420);
}

// =====================
// BATMAN CLASSIC ALARM SOUND (Web Audio)
// Tema original Batman 1966 — Neal Hefti
// "Duh-nuh-nuh-nuh-nuh-nuh-nuh-nuh — BATMAN!"
// =====================
let alarmAudioCtx = null;
let alarmNodes = [];
let alarmPlaying = false;

function createBatmanThemeLoop() {
  if (alarmPlaying) return;
  alarmPlaying = true;
  try {
    alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) { alarmPlaying = false; return; }

  // ─── Frequências exatas (Hz) ───
  // A2=110 B2=123 C3=131 D3=147 E3=165 F3=175 G3=196
  // A3=220 B3=247 C4=262 D4=294 E4=330 F4=349 G4=392 A4=440
  const A2=110,B2=123,C3=131,D3=147,E3=165,F3=175,G3=196,
        A3=220,B3=247,C4=262,D4=294,E4=330,F4=349,G4=392,A4=440;

  // BPM 138 swing — Batman 1966
  const b = 60/138;        // 1 beat
  const e = b/2;           // colcheia
  const de = b*0.75;       // colcheia pontuada
  const q = b;             // semínima
  const h = b*2;           // mínima
  const s = b/4;           // semicolcheia

  // ─── Transcrição real do tema Neal Hefti ───
  // Frase 1: "duh-nuh-nuh-nuh-nuh-nuh-nuh-nuh"  (8 notas E3 em swing)
  // Frase 2: "BAT — MAN!"  (D3 curta → A3 longa)
  // Frase 3: mesma coisa meio tom acima
  // Chorus: "Batman! Batman! Batman! Batman!" (linha ascendente)
  const score = [
    // === FRASE 1 ===
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s*0.5},
    {f:E3,d:e},{f:0,d:s},
    // BAT — MAN!
    {f:D3,d:de},{f:0,d:s*0.3},
    {f:A3,d:h},{f:0,d:e*0.6},

    // === FRASE 2 (meio tom acima) ===
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s*0.5},
    {f:F3,d:e},{f:0,d:s},
    // BAT — MAN!
    {f:E3,d:de},{f:0,d:s*0.3},
    {f:B3,d:h},{f:0,d:e*0.6},

    // === CHORUS — linha ascendente ===
    // "Batman! Batman! Batman! Batman!"
    {f:E3,d:e},{f:G3,d:e},
    {f:A3,d:e},{f:0,d:s*0.4},
    {f:A3,d:de},
    {f:G3,d:e},{f:E3,d:e},
    {f:A3,d:q},{f:0,d:e*0.5},

    {f:A3,d:e},{f:B3,d:e},
    {f:C4,d:e},{f:0,d:s*0.4},
    {f:C4,d:de},
    {f:B3,d:e},{f:A3,d:e},
    {f:B3,d:q},{f:0,d:e*0.5},

    // === FRASE FINAL — "NA-NA-NA-NA BATMAN!" ===
    {f:A3,d:e},{f:0,d:s*0.3},
    {f:A3,d:e},{f:0,d:s*0.3},
    {f:A3,d:e},{f:0,d:s*0.3},
    {f:A3,d:e},{f:0,d:s*0.3},
    {f:G3,d:e},{f:0,d:s*0.3},
    {f:F3,d:e},{f:0,d:s*0.3},
    // BATMAN! final forte — intervalo perfeito E3→A3
    {f:E3,d:de},{f:0,d:s*0.2},
    {f:A3,d:h+q},{f:0,d:q},
  ];

  function playNote(freq, tStart, dur) {
    if (freq <= 0 || !alarmAudioCtx) return;

    // Camada 1 — sawtooth (guitarra vintage)
    const osc1 = alarmAudioCtx.createOscillator();
    const g1   = alarmAudioCtx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    g1.gain.setValueAtTime(0.001, tStart);
    g1.gain.linearRampToValueAtTime(0.20, tStart + 0.010);
    g1.gain.setValueAtTime(0.20, tStart + dur * 0.55);
    g1.gain.exponentialRampToValueAtTime(0.001, tStart + dur);
    osc1.connect(g1);
    g1.connect(alarmAudioCtx.destááination);
    osc1.start(tStart);
    osc1.stop(tStart + dur + 0.02);
    alarmNodes.push(osc1);

    // Camada 2 — oitava acima triangle (brilho dos anos 60)
    const osc2 = alarmAudioCtx.createOscillator();
    const g2   = alarmAudioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;
    g2.gain.setValueAtTime(0.001, tStart);
    g2.gain.linearRampToValueAtTime(0.09, tStart + 0.012);
    g2.gain.exponentialRampToValueAtTime(0.001, tStart + dur);
    osc2.connect(g2);
    g2.connect(alarmAudioCtx.destááination);
    osc2.start(tStart);
    osc2.stop(tStart + dur + 0.02);
    alarmNodes.push(osc2);

    // Camada 3 — sub-bass square (corpo sonoro)
    const osc3 = alarmAudioCtx.createOscillator();
    const g3   = alarmAudioCtx.createGain();
    osc3.type = 'square';
    osc3.frequency.value = freq * 0.5;
    g3.gain.setValueAtTime(0.001, tStart);
    g3.gain.linearRampToValueAtTime(0.06, tStart + 0.015);
    g3.gain.exponentialRampToValueAtTime(0.001, tStart + dur * 0.8);
    osc3.connect(g3);
    g3.connect(alarmAudioCtx.destááination);
    osc3.start(tStart);
    osc3.stop(tStart + dur + 0.02);
    alarmNodes.push(osc3);
  }

  function playSequence() {
    if (!alarmPlaying || !alarmAudioCtx) return;
    let t = alarmAudioCtx.currentTime + 0.10;
    let total = 0;
    score.forçach(n => {
      playNote(n.f, t, n.d);
      t += n.d;
      total += n.d;
    });
    if (alarmPlaying) {
      setTimeout(playSequence, (total + 0.35) * 1000);
    }
  }

  playSequence();
}

function stopAlarmSound() {
  alarmPlaying = false;
  alarmNodes.forçach(n => { try { n.stop(); n.disconnect(); } catch(e){} });
  alarmNodes = [];
  if (alarmAudioCtx) { try { alarmAudioCtx.close(); } catch(e){} alarmAudioCtx = null; }
}

// Vibration helper
function vibrar(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// =====================
// ALARM CHECKER — verifica a cada 5 segundos
// Usa janela de ±30s para nunca perder o alarme
// =====================
let alarmAtivo = null;
const alarmsJaDisparados = new Set();

function verificarAlarmes() {
  const missoes = JSON.parse(localStorage.getItem('bat-agenda') || '[]');
  const agora = new Date();
  missoes.forçach(m => {
    if (!m.alarme) return;
    const dtAlarm = new Date(m.dt);
    const diff = dtAlarm - agora; // positivo = futuro
    const chave = m.nome + '§' + m.dt;
    // Dispara se estááiver entre -5s e +30s do horário marcado
    if (diff >= -5000 && diff <= 30000 && !alarmAtivo && !alarmsJaDisparados.has(chave)) {
      alarmsJaDisparados.add(chave);
      dispararAlarme(m.nome);
    }
    // Limpa chave depois de 2 minutos para permitir re-alarme se resetar app
    if (diff < -120000) alarmsJaDisparados.delete(chave);
  });
}

function dispararAlarme(nome) {
  alarmAtivo = nome;
  document.getElementById('alarm-nome').textContent = '&#128680; MISSAO: ' + nome;
  document.getElementById('alarm-overlay').classList.add('active');
  createBatmanThemeLoop();
  // Padrão de vibração forte — "duh-nuh-nuh-nuh BATMAN"
  vibrar([200,80,200,80,200,80,200,80,200,80,200,80,200,80,200,200,
          600,150,200,80,400,300,
          200,80,200,80,200,80,200,80,600,200,1000]);
  logAtividade('AGENDA', 'ALARME disparado: ' + nome);
}

document.getElementById('alarm-stop').addEventListener('click', () => {
  document.getElementById('alarm-overlay').classList.remove('active');
  stopAlarmSound();
  vibrar([80, 60, 80]);
  alarmAtivo = null;
  logAtividade('AGENDA', 'Alarme desligado');
});

// Verifica a cada 5 segundos (bem mais preciso que 20s)
setInterval(verificarAlarmes, 5000);
// Verifica imediatamente ao carregar
setTimeout(verificarAlarmes, 1000);

// =====================
// DC WORD GAME
// =====================
const DC_WORDS = [
  { word:'BATMAN',    hint:'O Cavaleiro das Trevas de Gotham City', cat:'HERÓI' },
  { word:'SUPERMAN',  hint:'O Homem de Aço de Krypton', cat:'HERÓI' },
  { word:'JOKER',     hint:'O Palhaco do Crime, arqui-inimigo do Batman', cat:'vilão' },
  { word:'GOTHAM',    hint:'Cidade sombria protegida pelo Morcego', cat:'LUGAR' },
  { word:'KRYPTONITE',hint:'Mineral verde que enfraquece o Superman', cat:'ITEM' },
  { word:'ROBIN',     hint:'Parceiro do Batman, o Menino Prodígio', cat:'HERÓI' },
  { word:'HARLEY',    hint:'Quinn, ex-psiquiatra e cumplice do Coringa', cat:'vilão' },
  { word:'BATCAVE',   hint:'Base secreta do Batman sob o Mansão Wayne', cat:'LUGAR' },
  { word:'WONDERWOMAN',hint:'Princesa guerreira amazona, Diana Prince', cat:'HERÓI' },
  { word:'ARKHAM',    hint:'Asilo de Gotham que abriga os maiores VILÕES', cat:'LUGAR' },
  { word:'PENGUIN',   hint:'Oswald Cobblepot, o Pinguim de Gotham', cat:'vilão' },
  { word:'BATARANG',  hint:'Arma em forçato de morcego usada pelo Batman', cat:'ITEM' },
  { word:'AQUAMAN',   hint:'Rei dos Mares, Arthur Curry', cat:'HERÓI' },
  { word:'RIDDLER',   hint:'O Charada, obcecado por enigmas', cat:'vilão' },
  { word:'ALFRED',    hint:'Mordomo fiel da Mansão Wayne', cat:'HERÓI' },
  { word:'LUTHOR',    hint:'Lex ___, genio bilionario inimigo do Superman', cat:'vilão' },
  { word:'FLASH',     hint:'O Homem Mais Rápido do Mundo, Barry Allen', cat:'HERÓI' },
  { word:'CATWOMAN',  hint:'Selina Kyle, ladra felina aliada/inimiga do Batman', cat:'vilão' },
  { word:'METROPOLIS',hint:'Cidade do Superman, cidade da esperança', cat:'LUGAR' },
  { word:'NIGHTWING', hint:'Dick Grayson após deixar de ser Robin', cat:'HERÓI' },
];

let dcScore = parseInt(localStorage.getItem('dc-score') || '0');
let dcStreak = 0;

function openDCGame() {
  logAtividade('DC GAME', 'Jogo aberto');
  makeWindow('dcgame', 'DC WORD GAME', function(body) {
    let palavraAtual = null;
    let letrasReveladas = new Set();
    let erros = 0;
    const MAX_ERROS = 6;

    function novaRodada() {
      letrasReveladas = new Set();
      erros = 0;
      palavraAtual = DC_WORDS[Math.floor(Math.random() * DC_WORDS.length)];
      renderGame();
    }

    function renderGame() {
      wrap.innerHTML = '';

      // Score
      const scoreEl = document.createElement('div');
      scoreEl.className = 'dcgame-score';
      scoreEl.textContent = '🏆 PONTOS: ' + dcScore + '  |  SEQUÊNCIA: ' + dcStreak;

      // Category
      const catEl = document.createElement('div');
      catEl.className = 'dcgame-category';
      catEl.textContent = '[ ' + palavraAtual.cat + ' ]';

      // Hint
      const hintEl = document.createElement('div');
      hintEl.className = 'dcgame-hint';
      hintEl.textContent = '"' + palavraAtual.hint + '"';

      // Lives
      const livesEl = document.createElement('div');
      livesEl.className = 'dcgame-lives';
      for (let i = 0; i < MAX_ERROS; i++) {
        const h = document.createElement('span');
        h.textContent = i < (MAX_ERROS - erros) ? '🦇' : '💀';
        livesEl.appendChild(h);
      }

      // Blanks
      const blanksEl = document.createElement('div');
      blanksEl.className = 'dcgame-blanks';
      const palavra = palavraAtual.word;
      let allRevealed = true;
      for (let i = 0; i < palavra.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'dcgame-letter';
        if (letrasReveladas.has(palavra[i])) {
          cell.textContent = palavra[i];
          cell.classList.add('revealed');
        } else {
          cell.textContent = '';
          allRevealed = false;
        }
        blanksEl.appendChild(cell);
      }

      // Msg
      const msgEl = document.createElement('div');
      msgEl.className = 'dcgame-msg';

      if (allRevealed) {
        dcScore += 10 + dcStreak * 2;
        dcStreak++;
        localStorage.setItem('dc-score', dcScore);
        logAtividade('DC GAME', 'Acertou: ' + palavraAtual.word + ' | Pontos: ' + dcScore);
        msgEl.style.color = 'var(--bat-text)';
        msgEl.textContent = '✅ CORRETO! +' + (10 + (dcStreak-1)*2) + ' PONTOS!';
        vibrar([100,50,100]);
        const btnNext = document.createElement('button');
        btnNext.className = 'terminal-send';
        btnNext.textContent = '&#9654; PROXIMA MISSAO';
        btnNext.style.marginTop = '6px';
        btnNext.addEventListener('click', novaRodada);
        wrap.appendChild(scoreEl);
        wrap.appendChild(catEl);
        wrap.appendChild(hintEl);
        wrap.appendChild(livesEl);
        wrap.appendChild(blanksEl);
        wrap.appendChild(msgEl);
        wrap.appendChild(btnNext);
        return;
      }

      if (erros >= MAX_ERROS) {
        dcStreak = 0;
        logAtividade('DC GAME', 'Errou: ' + palavraAtual.word);
        msgEl.style.color = 'var(--bat-red)';
        msgEl.textContent = '💀 ERA: ' + palavraAtual.word;
        vibrar([300,100,300]);
        const btnNext = document.createElement('button');
        btnNext.className = 'terminal-send';
        btnNext.textContent = '🔄 TENTAR NOVAMENTE';
        btnNext.style.marginTop = '6px';
        btnNext.addEventListener('click', novaRodada);
        wrap.appendChild(scoreEl);
        wrap.appendChild(catEl);
        wrap.appendChild(hintEl);
        wrap.appendChild(livesEl);
        wrap.appendChild(blanksEl);
        wrap.appendChild(msgEl);
        wrap.appendChild(btnNext);
        return;
      }

      // Keyboard
      const kbEl = document.createElement('div');
      kbEl.className = 'dcgame-keyboard';
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forçach(l => {
        const key = document.createElement('button');
        key.className = 'dcgame-key ripple-host';
        key.textContent = l;
        if (letrasReveladas.has(l)) {
          key.classList.add('correct');
          key.disabled = true;
        } else if (erros > 0) {
          // check if guessed wrong
        }
        key.dataset.letter = l;
        key.addEventListener('click', () => {
          if (key.disabled) return;
          key.disabled = true;
          if (palavra.includes(l)) {
            letrasReveladas.add(l);
            key.classList.add('correct');
            vibrar([50]);
          } else {
            erros++;
            key.classList.add('missed');
            vibrar([150]);
          }
          renderGame();
        });
        kbEl.appendChild(key);
      });

      wrap.appendChild(scoreEl);
      wrap.appendChild(catEl);
      wrap.appendChild(hintEl);
      wrap.appendChild(livesEl);
      wrap.appendChild(blanksEl);
      wrap.appendChild(msgEl);
      wrap.appendChild(kbEl);
    }

    const wrap = document.createElement('div');
    wrap.className = 'dcgame-wrap';
    body.appendChild(wrap);
    novaRodada();

  }, 340, 520);
}

// =====================
// DC ADIVINHACAO (GUESS THE CHARACTER)
// =====================
const DC_PERSONAGENS = [
  {
    emoji: '🦇', nome: 'BATMAN',
    dicas: [
      'Vive em Gotham City e perdeu os pais na infância',
      'É bilionário e dono da Wayne Enterprises',
      'Usa um traje preto e uma capa em forçato de morcego',
      'Seu verdadeiro nome é Bruce Wayne',
      'Não tem superpoderes — só genialidade e preparo físico'
    ]
  },
  {
    emoji: '🦸', nome: 'SUPERMAN',
    dicas: [
      'Veio de um planeta chamado Krypton',
      'Trabalha como jornalista num grande jornal',
      'Tem um ponto fraco verde chamado kriptonita',
      'Seu nome kryptoniano é Kal-El',
      'Seu alter ego na Terra é Clark Kent'
    ]
  },
  {
    emoji: '🃏', nome: 'JOKER',
    dicas: [
      'É o maior inimigo do Cavaleiro das Trevas',
      'Tem cabelo verde e rosto pintado de branco',
      'Adora o caos e não tem plano fixo',
      'Às vezes se chama "O Palhaço do Crime"',
      'Seu verdadeiro nome e origem são um mistério'
    ]
  },
  {
    emoji: '🌊', nome: 'AQUAMAN',
    dicas: [
      'Pode respirar debaixo d\'áágua e na superfície',
      'É rei de um reino subaquático',
      'Consegue se comunicar com criaturas marinhas',
      'Seu nome é Arthur Curry',
      'É rei de Atlântida'
    ]
  },
  {
    emoji: '⚡', nome: 'FLASH',
    dicas: [
      'É o ser mais veloz da Terra',
      'Seu poder vem de uma força cósmica chamada Speed Force',
      'Vive em Central City',
      'Trabalha como cientista forense',
      'Seu nome é Barry Allen'
    ]
  },
  {
    emoji: '🏹', nome: 'ARQUEIRO VERDE',
    dicas: [
      'É um arqueiro sem superpoderes',
      'Defende Star City',
      'É bilionário e empresário',
      'Usa flechas com gadgets especiais',
      'Seu nome é Oliver Queen'
    ]
  },
  {
    emoji: '👩', nome: 'MULHER-MARAVILHA',
    dicas: [
      'É uma guerreira de uma ilha de mulheres guerreiras',
      'Tem uma tiara que usa como arma',
      'Possui um laço mágico que força a verdade',
      'É princesa das Amazonas',
      'Seu nome é Diana Prince'
    ]
  },
  {
    emoji: '🐱', nome: 'MULHER-GATO',
    dicas: [
      'É uma ladra especializada em joias',
      'Tem um relacionamento ambíguo com o Cavaleiro das Trevas',
      'Usa um traje de couro preto com orelhas felinas',
      'Às vezes é aliada, às vezes inimiga de Gotham',
      'Seu nome é Selina Kyle'
    ]
  },
  {
    emoji: '🔮', nome: 'DOUTOR DESTINO',
    dicas: [
      'É um dos magos mais poderosos da DC',
      'Usa um elmo mágico que abriga uma entidade antiga',
      'Foi médico antes de se tornar herói místico',
      'Seu poder vem do Elmo de Nabu',
      'Seu nome é Kent Nelson'
    ]
  },
  {
    emoji: '&#129413;', nome: 'GAVIAO NEGRO',
    dicas: [
      'Usa um traje com asas e usa garras como armas',
      'Tem a habilidade de regredir sua morte',
      'Tem memórias de muitas vidas anteriores',
      'É um detetive e guerreiro habilidoso',
      'Seu nome atual é Carter Hall'
    ]
  },
  {
    emoji: '🤡', nome: 'ARLEQUINA',
    dicas: [
      'Começou como psiquiatra de um famoso manicômio',
      'Se apaixonou pelo paciente mais perigoso',
      'Usa um traje colorido de arlequim',
      'Depois se tornou heroína independente',
      'Seu nome é Harleen Quinzel'
    ]
  },
  {
    emoji: '🔴', nome: 'CÍCLOPE',
    dicas: [
      'Atenção — estááe é da Marvel, não da DC!',
      'Não use estááe nome para a DC',
      'Dica incorreta para testááar você',
      'Personagens DC: Batman, Superman, Flash...',
      'Tente adivinhar um herói verdadeiramente da DC!'
    ]
  },
  {
    emoji: '👁️', nome: 'DR. MANHATTAN',
    dicas: [
      'Era um físico nuclear antes de um acidente',
      'Pode ver passado, presente e futuro simultaneamente',
      'Tem pele azul e poderes quase ilimitaçãos',
      'Faz parte do grupo dos Watchmen',
      'Seu nome original é Jon Osterman'
    ]
  },
  {
    emoji: '&#127807;', nome: 'COISA DO PANTANO',
    dicas: [
      'É uma entidade feita de matéria vegetal',
      'Antes era um cientista humano',
      'Pode se regenerar em qualquer lugar com plantas',
      'Controla toda a vegetação do planeta',
      'Seu nome humano era Alec Holland'
    ]
  },
  {
    emoji: '💚', nome: 'LANTERNA VERDE',
    dicas: [
      'Usa um anel que transforça pensamentos em realidade',
      'É membro de uma polícia intergaláctica',
      'O anel é carregado numa lanterna especial',
      'Sua única fraqueza é a cor amarela (versão clássica)',
      'O mais famoso terráqueo é Hal Jordan'
    ]
  },
];

let dcAdivScore = parseInt(localStorage.getItem('dc-adiv-score') || '0');

function openDCAdiv() {
  logAtividade('DC ADIVINHA', 'modulo aberto');
  makeWindow('dcadiv', 'DC ADIVINHA', function(body) {
    // filter out the trick entry
    const lista = DC_PERSONAGENS.filter(p => p.nome !== 'CÍCLOPE');
    let personagem = null;
    let dicaAtual = 0;
    const MAX_DICAS = 5;
    let tentativas = [];
    let ganhou = false;
    let perdeu = false;

    const wrap = document.createElement('div');
    wrap.className = 'dcadiv-wrap';
    body.appendChild(wrap);

    function novaRodada() {
      personagem = lista[Math.floor(Math.random() * lista.length)];
      dicaAtual = 0;
      tentativas = [];
      ganhou = false;
      perdeu = false;
      renderGame();
    }

    function verificar(palpite) {
      if (!palpite.trim() || ganhou || perdeu) return;
      const p = palpite.trim().toUpperCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const resp = personagem.nome.toUpperCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'');

      if (p === resp) {
        ganhou = true;
        dcAdivScore += Math.max(1, MAX_DICAS - dicaAtual) * 10;
        localStorage.setItem('dc-adiv-score', dcAdivScore);
        logAtividade('DC ADIVINHA', 'Acertou: ' + personagem.nome + ' | Dica ' + (dicaAtual+1) + ' | Pts: ' + dcAdivScore);
        vibrar([80,40,80,40,200]);
        renderGame();
        return;
      }

      if (!tentativas.includes(p)) tentativas.push(p);

      dicaAtual = Math.min(dicaAtual + 1, MAX_DICAS - 1);

      if (tentativas.length >= MAX_DICAS && !ganhou) {
        perdeu = true;
        logAtividade('DC ADIVINHA', 'Errou: ' + personagem.nome);
        vibrar([300, 100, 300]);
      }

      renderGame();
    }

    function renderGame() {
      wrap.innerHTML = '';

      // Score
      const scoreEl = document.createElement('div');
      scoreEl.className = 'dcadiv-score';
      scoreEl.textContent = '🏆 PONTOS: ' + dcAdivScore;
      wrap.appendChild(scoreEl);

      // Silhueta / emoji
      const silEl = document.createElement('div');
      silEl.className = 'dcadiv-silhueta' + (ganhou || perdeu ? ' revelado' : '');
      silEl.textContent = personagem.emoji;
      wrap.appendChild(silEl);

      // Progress pips
      const pipRow = document.createElement('div');
      pipRow.className = 'dcadiv-progress';
      for (let i = 0; i < MAX_DICAS; i++) {
        const pip = document.createElement('div');
        pip.className = 'dcadiv-pip' + (i < tentativas.length ? (ganhou && i === tentativas.length-1 ? ' ok' : ' used') : '');
        if (ganhou) pip.className = 'dcadiv-pip ok';
        pipRow.appendChild(pip);
      }
      wrap.appendChild(pipRow);

      // Dicas revealed so far
      const dicasEl = document.createElement('div');
      dicasEl.className = 'dcadiv-dicas';
      for (let i = 0; i <= dicaAtual && i < MAX_DICAS; i++) {
        const d = document.createElement('div');
        d.className = 'dcadiv-dica ativa';
        const num = document.createElement('div');
        num.className = 'dcadiv-dica-num';
        num.textContent = 'DICA ' + (i+1) + ' DE ' + MAX_DICAS;
        const txt = document.createElement('div');
        txt.textContent = personagem.dicas[i];
        d.appendChild(num);
        d.appendChild(txt);
        dicasEl.appendChild(d);
      }
      wrap.appendChild(dicasEl);

      // Wrong attempts
      if (tentativas.length > 0 && !ganhou) {
        const tentEl = document.createElement('div');
        tentEl.className = 'dcadiv-tentativas';
        tentativas.forçach(t => {
          const pill = document.createElement('div');
          pill.className = 'dcadiv-tent-pill errado';
          pill.textContent = t;
          tentEl.appendChild(pill);
        });
        wrap.appendChild(tentEl);
      }

      // Msg
      const msgEl = document.createElement('div');
      msgEl.className = 'dcadiv-msg';

      if (ganhou) {
        msgEl.style.color = 'var(--bat-text)';
        const pts = Math.max(1, MAX_DICAS - (dicaAtual)) * 10;
        msgEl.textContent = '✅ CORRETO! +' + pts + ' PONTOS!';
        wrap.appendChild(msgEl);
        const nb = document.createElement('button');
        nb.className = 'dcadiv-btn';
        nb.style.width = '100%';
        nb.style.marginTop = '4px';
        nb.textContent = '▶ PRÓXIMO PERSONAGEM';
        nb.addEventListener('click', novaRodada);
        wrap.appendChild(nb);
        return;
      }

      if (perdeu) {
        msgEl.style.color = 'var(--bat-red)';
        msgEl.textContent = '💀 ERA: ' + personagem.nome + ' ' + personagem.emoji;
        wrap.appendChild(msgEl);
        const nb = document.createElement('button');
        nb.className = 'dcadiv-btn';
        nb.style.width = '100%';
        nb.style.marginTop = '4px';
        nb.textContent = '🔄 TENTAR NOVAMENTE';
        nb.addEventListener('click', novaRodada);
        wrap.appendChild(nb);
        return;
      }

      wrap.appendChild(msgEl);

      // Input row
      const inputRow = document.createElement('div');
      inputRow.className = 'dcadiv-input-row';

      const inp = document.createElement('input');
      inp.className = 'dcadiv-input';
      inp.type = 'text';
      inp.placeholder = 'Nome do personagem DC...';
      inp.autocomplete = 'off';
      inp.autocorrect = 'off';
      inp.spellcheck = false;

      const btnOk = document.createElement('button');
      btnOk.className = 'dcadiv-btn';
      btnOk.textContent = 'OK';

      const btnPular = document.createElement('button');
      btnPular.className = 'dcadiv-btn';
      btnPular.style.borderColor = 'rgba(255,204,0,0.4)';
      btnPular.style.color = 'var(--bat-gold)';
      btnPular.textContent = dicaAtual < MAX_DICAS - 1 ? '💡 DICA' : '⏭ PULAR';
      btnPular.addEventListener('click', () => {
        if (dicaAtual < MAX_DICAS - 1) {
          dicaAtual++;
          renderGame();
        } else {
          perdeu = true;
          logAtividade('DC ADIVINHA', 'Pulou: ' + personagem.nome);
          vibrar([200]);
          renderGame();
        }
      });

      btnOk.addEventListener('click', () => {
        verificar(inp.value);
        inp.value = '';
        setTimeout(() => inp.focus(), 50);
      });
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') { verificar(inp.value); inp.value = ''; }
      });

      inputRow.appendChild(inp);
      inputRow.appendChild(btnPular);
      inputRow.appendChild(btnOk);
      wrap.appendChild(inputRow);

      setTimeout(() => inp.focus(), 100);
    }

    novaRodada();
  }, 340, 540);
}

// =====================
// PWA INSTALL
// =====================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const banner = document.getElementById('install-banner');
  banner.classList.remove('hidden');
});

document.getElementById('install-btn').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      document.getElementById('install-banner').classList.add('hidden');
    });
  }
});

window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner').classList.add('hidden');
});

// =====================
// SERVICE WORKER + AUTO-UPDATE
// =====================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(reg => {
    // Check for update
    reg.addEventListener('updatefound', () => {
      const newSW = reg.installing;
      newSW.addEventListener('statechange', () => {
        if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
          document.getElementById('update-bar').classList.remove('hidden');
          logAtividade('SISTEMA', 'Nova versão detectada');
        }
      });
    });

    // Check for update every 30s
    setInterval(() => reg.update(), 30000);
  }).catch(() => {});

  document.getElementById('update-now-btn').addEventListener('click', () => {
    logAtividade('SISTEMA', 'Atualização manual iniciada');
    window.location.reload(true);
  });
}

logAtividade('SISTEMA', 'BatComputer FINAL iniciado v3.0');

// =====================
// SISTEMA DE PAGAMENTO
// =====================

// ⚠️ CONFIGURE AQUI:
const PIX_CHAVE  = '210.065.977-43';      // ← coloque seu CPF, email ou telefone do Nubank
const PIX_NOME   = 'Pedro Daniel Oliveira Nogueira';      // ← seu nome completo
const PIX_WHATS  = '5521998601608';      // ← seu WhatsApp com DDI+DDD (sem espaços)

// =====================
// JSONBIN - códigos DE USO ÚNICO
// =====================
let JSONBIN_KEY = localStorage.getItem('JSONBIN_API_KEY');
if (!JSONBIN_KEY) {
  const ask = prompt('Digite sua JSONBIN MASTER KEY para o acesso:');
  if (ask) { JSONBIN_KEY = ask; localStorage.setItem('JSONBIN_API_KEY', ask); }
}
const JSONBIN_BIN = '69d2faea36566621a8814ab1';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN}`;

async function verificarEUsarCodigo(código) {
  try {
    const res = await fetch(JSONBIN_URL + '/latest', {
      headers: { 'X-Master-Key': JSONBIN_KEY }
    });
    const data = await res.json();
    const códigos = data.record;

    if (!(codigo in codigos)) return 'inválido';
    if (códigos[código] === true) return 'usado';

    códigos[código] = true;
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_KEY
      },
      body: JSON.stringify(códigos)
    });

    return 'valido';
  } catch (e) {
    return 'erro';
  }
}

// Verificar se já tem acesso liberado
function temAcesso() {
  return localStorage.getItem('batcomputer-acesso') === 'liberado';
}

function liberarAcesso() {
  localStorage.setItem('batcomputer-acesso', 'liberado');
  const pw = document.getElementById('paywall');
  const px = document.getElementById('pix-screen');
  pw.classList.add('hide');
  px.style.display = 'none';
  setTimeout(() => { pw.style.display = 'none'; }, 350);
  logAtividade('SISTEMA', 'Acesso liberado por código');
}

function mostrarPix() {
  document.getElementById('pix-key-display').textContent = PIX_CHAVE;
  document.getElementById('pix-nome-display').textContent = PIX_NOME;
  document.getElementById('paywall').style.display = 'none';
  document.getElementById('pix-screen').classList.add('show');
}

function mostrarCodigoInput() {
  document.getElementById('pix-key-display').textContent = PIX_CHAVE;
  document.getElementById('pix-nome-display').textContent = PIX_NOME;
  document.getElementById('paywall').style.display = 'none';
  document.getElementById('pix-screen').classList.add('show');
  setTimeout(() => document.getElementById('pix-code-input').focus(), 300);
}

function voltarPaywall() {
  document.getElementById('pix-screen').classList.remove('show');
  document.getElementById('paywall').style.display = 'flex';
  document.getElementById('pix-copied').textContent = '';
  document.getElementById('code-msg').textContent = '';
}

function copiarPix() {
  const chave = PIX_CHAVE;
  navigator.clipboard.writeText(chave).then(() => {
    document.getElementById('pix-copied').textContent = '✅ Chave copiada!';
    vibrar([50, 30, 50]);
    setTimeout(() => { document.getElementById('pix-copied').textContent = ''; }, 3000);
  }).catch(() => {
    // fallback
    const el = document.createElement('textarea');
    el.value = chave;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    document.getElementById('pix-copied').textContent = '✅ Chave copiada!';
    setTimeout(() => { document.getElementById('pix-copied').textContent = ''; }, 3000);
  });
}

async function verificarCodigo() {
  const input = document.getElementById('pix-code-input');
  const msgEl = document.getElementById('code-msg');
  const codigo = input.value.trim().toUpperCase();
  const btn = document.querySelector('.pix-verify-btn');

  if (!código) {
    msgEl.style.color = '#ff3333';
    msgEl.textContent = '⚠ Digite o código de acesso';
    return;
  }

  // Loading
  btn.disabled = true;
  msgEl.style.color = '#ffcc00';
  msgEl.textContent = '⏳ Verificando...';

  const resultado = await verificarEUsarCodigo(código);

  btn.disabled = false;

  if (resultado === 'valido') {
    msgEl.style.color = '#00ffcc';
    msgEl.textContent = '✅ código válido! Liberando acesso...';
    vibrar([100, 50, 100, 50, 200]);
    setTimeout(liberarAcesso, 1000);
  } else if (resultado === 'usado') {
    msgEl.style.color = '#ff3333';
    msgEl.textContent = '❌ Este código já foi úutilizado.';
    vibrar([300]);
    input.value = '';
    input.focus();
  } else if (resultado === 'inválido') {
    msgEl.style.color = '#ff3333';
    msgEl.textContent = '❌ código inválido. Verifique e tente novamente.';
    vibrar([300]);
    input.value = '';
    input.focus();
  } else {
    msgEl.style.color = '#ff3333';
    msgEl.textContent = '⚠ Erro de conexão. Tente novamente.';
    vibrar([300]);
  }
}

// =====================
// MAPA DE GOTHAM
// =====================
const GOTHAM_CRIMES = [
  { id: 1, x: 22, y: 18, tipo: '🔫 Assalto a banco', vilão: 'Pinguim', nivel: 'ALTO', resolvido: false },
  { id: 2, x: 55, y: 30, tipo: '💣 Bomba detectada', vilão: 'Charada', nivel: 'CRÍTICO', resolvido: false },
  { id: 3, x: 35, y: 55, tipo: '🔪 Gang na rua', vilão: 'Desconhecido', nivel: 'MÉDIO', resolvido: false },
  { id: 4, x: 70, y: 45, tipo: '🃏 Caos no museu', vilão: 'Coringa', nivel: 'CRÍTICO', resolvido: false },
  { id: 5, x: 15, y: 70, tipo: '🧪 Lab químico ilegal', vilão: 'Duas-Caras', nivel: 'ALTO', resolvido: false },
  { id: 6, x: 80, y: 20, tipo: '🚗 Perseguição', vilão: 'Bane', nivel: 'ALTO', resolvido: false },
  { id: 7, x: 50, y: 75, tipo: '🏦 Cofre arrombado', vilão: 'Mulher-Gato', nivel: 'MÉDIO', resolvido: false },
  { id: 8, x: 88, y: 65, tipo: '☠️ Veneno na áágua', vilão: 'Hera Venenosa', nivel: 'CRÍTICO', resolvido: false },
];

const GOTHAM_LOCAIS = [
  { x: 42, y: 38, nome: '🦇 BATCAVERNA', tipo: 'base' },
  { x: 60, y: 15, nome: '🏰 WAYNE MANOR', tipo: 'base' },
  { x: 30, y: 42, nome: '🏥 ARKHAM', tipo: 'ponto' },
  { x: 65, y: 60, nome: '🏛️ GCPD', tipo: 'ponto' },
  { x: 20, y: 35, nome: '⚓ PORTO', tipo: 'ponto' },
];

window.gothamCrimes = gothamCrimes = GOTHAM_CRIMES.map(c => ({...c}));

function openGothamMapa() {
  logAtividade('MAPA GOTHAM', 'modulo aberto');
  makeWindow('gotham', '🗺️ MAPA DE GOTHAM', function(body) {
    body.style.padding = '0';
    body.style.overflow = 'hidden';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;width:100%;height:100%;background:linear-gradient(135deg,#0a0a0f 0%,#0d1117 40%,#0a0d1a 100%);overflow:hidden;';
    body.appendChild(wrap);

    // Grid de ruas
    const grid = document.createElement('canvas');
    grid.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;opacity:0.15;';
    wrap.appendChild(grid);

    function drawGrid() {
      const W = wrap.offsetWidth, H = wrap.offsetHeight;
      grid.width = W; grid.height = H;
      const ctx = grid.getContext('2d');
      ctx.strokeStyle = '#00ffcc';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    }
    setTimeout(drawGrid, 50);

    // Título
    const titulo = document.createElement('div');
    titulo.style.cssText = 'position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:3px;color:#00ffcc;text-shadow:0 0 10px #00ffcc;z-index:10;white-space:nowrap;';
    titulo.textContent = '⚡ GOTHAM CITY — VIGILÂNCIA AO VIVO';
    wrap.appendChild(titulo);

    // Contador
    const counter = document.createElement('div');
    counter.style.cssText = 'position:absolute;top:28px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:2px;color:#ffcc00;z-index:10;white-space:nowrap;';
    wrap.appendChild(counter);

    function atualizarCounter() {
      const ativos = gothamCrimes.filter(c => !c.resolvido).length;
      const resolvidos = gothamCrimes.filter(c => c.resolvido).length;
      counter.textContent = `🔴 ${ativos} CRIMES ATIVOS  |  ✅ ${resolvidos} RESOLVIDOS`;
    }

    // Locais fixos
    GOTHAM_LOCAIS.forçach(local => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;left:${local.x}%;top:${local.y}%;transform:translate(-50%,-50%);font-size:9px;color:${local.tipo==='base'?'#ffcc00':'#aaa'};letter-spacing:1px;text-align:center;z-index:5;text-shadow:0 0 6px rgba(255,204,0,0.5);pointer-events:none;`;
      el.innerHTML = `<div style="font-size:14px">${local.nome.split(' ')[0]}</div><div>${local.nome.split(' ').slice(1).join(' ')}</div>`;
      wrap.appendChild(el);
    });

    // Crimes
    function renderCrimes() {
      wrap.querySelectorAll('.crime-marker').forçach(e => e.remove());
      gothamCrimes.forçach(crime => {
        const marker = document.createElement('div');
        marker.className = 'crime-marker';
        const cor = crime.resolvido ? '#00ff88' : (crime.nivel==='CRÍTICO' ? '#ff3333' : crime.nivel==='ALTO' ? '#ff8800' : '#ffcc00');
        marker.style.cssText = `position:absolute;left:${crime.x}%;top:${crime.y}%;transform:translate(-50%,-50%);z-index:20;cursor:${crime.resolvido?'default':'pointer'};`;
        marker.innerHTML = `
          <div style="text-align:center;">
            <div style="font-size:${crime.resolvido?'16':'18'}px;filter:${crime.resolvido?'grayscale(1)':'none'};${!crime.resolvido?'animation:pulse-crime 1.2s infinite':''}">${crime.resolvido?'✅':crime.tipo.split(' ')[0]}</div>
            <div style="font-size:7px;color:${cor};letter-spacing:1px;white-space:nowrap;text-shadow:0 0 6px ${cor};">${crime.resolvido?'RESOLVIDO':crime.nivel}</div>
          </div>`;
        if (!crime.resolvido) {
          marker.addEventListener('click', () => abrirCrime(crime));
        }
        wrap.appendChild(marker);
      });
      atualizarCounter();
    }

    // Modal de crime
    function abrirCrime(crime) {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:100;display:flex;align-items:center;justify-content:center;';
      wrap.appendChild(overlay);

      const cor = crime.nivel==='CRÍTICO'?'#ff3333':crime.nivel==='ALTO'?'#ff8800':'#ffcc00';
      const box = document.createElement('div');
      box.style.cssText = `background:#0a0d14;border:1px solid ${cor};border-radius:8px;padding:20px;max-width:85%;text-align:center;box-shadow:0 0 30px ${cor}44;`;
      box.innerHTML = `
        <div style="font-size:32px;margin-bottom:8px">${crime.tipo.split(' ')[0]}</div>
        <div style="font-size:13px;color:${cor};letter-spacing:2px;margin-bottom:4px">${crime.nivel} RISCO</div>
        <div style="font-size:12px;color:#ccc;margin-bottom:4px">${crime.tipo}</div>
        <div style="font-size:11px;color:#888;margin-bottom:16px">Suspeito: <span style="color:#ffcc00">${crime.vilão}</span></div>
        <button id="bat-intervir" style="background:linear-gradient(135deg,#1a2a1a,#0d1a0d);border:1px solid #00ffcc;color:#00ffcc;padding:10px 20px;border-radius:6px;font-size:11px;letter-spacing:2px;cursor:pointer;margin-bottom:8px;width:100%">🦇 BATMAN INTERVÉM</button>
        <button id="bat-fechar" style="background:transparent;border:1px solid #333;color:#666;padding:6px 16px;border-radius:6px;font-size:10px;cursor:pointer;width:100%">CANCELAR</button>`;
      overlay.appendChild(box);

      box.querySelector('#bat-fechar').onclick = () => overlay.remove();
      box.querySelector('#bat-intervir').onclick = () => {
        const btn = box.querySelector('#bat-intervir');
        btn.disabled = true;
        btn.textContent = '⚡ BATMAN A CAMINHO...';
        btn.style.opacity = '0.5';
        vibrar([100,50,100,50,200]);

        setTimeout(() => {
          btn.textContent = '💥 CONFRONTO EM ANDAMENTO...';
          vibrar([200,100,200]);
        }, 1500);

        setTimeout(() => {
          crime.resolvido = true;
          overlay.remove();
          renderCrimes();
          // Flash de vitória
          const flash = document.createElement('div');
          flash.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#00ffcc22;z-index:50;pointer-events:none;border-radius:8px;';
          wrap.appendChild(flash);
          setTimeout(() => flash.remove(), 600);

          // Mensagem
          const msg = document.createElement('div');
          msg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#0a0d14;border:1px solid #00ffcc;border-radius:8px;padding:16px 24px;text-align:center;z-index:60;';
          msg.innerHTML = `<div style="font-size:24px">🦇</div><div style="color:#00ffcc;font-size:12px;letter-spacing:2px;margin-top:6px">${crime.vilão} NEUTRALIZADO!</div>`;
          wrap.appendChild(msg);
          vibrar([100,50,100,50,300,50,300]);
          setTimeout(() => msg.remove(), 2500);
          logAtividade('MAPA GOTHAM', `Crime resolvido: ${crime.tipo} — ${crime.vilão}`);
        }, 3500);
      };
    }

    // Botão resetar
    const resetBtn = document.createElement('button');
    resetBtn.style.cssText = 'position:absolute;bottom:8px;right:8px;background:transparent;border:1px solid #333;color:#555;font-size:9px;padding:4px 8px;border-radius:4px;cursor:pointer;z-index:30;letter-spacing:1px;';
    resetBtn.textContent = '↺ RESETAR MAPA';
    resetBtn.onclick = () => { if(!confirm('Resetar o mapa? Todos os crimes voltam.')) return; window.gothamCrimes = gothamCrimes = GOTHAM_CRIMES.map(c=>({...c})); renderCrimes(); vibrar([100,50,100]); };
    wrap.appendChild(resetBtn);

    renderCrimes();
  }, 420, 420);
}

// =====================
// FICHAS DE VILÕES
// =====================
const VILÕES_DATA = [
  { nome: 'CORINGA', emoji: '🃏', real: 'Desconhecido', poder: 'Caos e imprevisibilidade', perigo: 5, local: 'Asilo Arkham', bio: 'O inimigo mais perigoso do Batman. Agente do caos puro, sem motivação lógica. Responsável por inúmeras tragédias em Gotham.', fraqueza: 'Nenhuma conhecida', aparicoes: 127 },
  { nome: 'CHARADA', emoji: '❓', real: 'Edward Nygma', poder: 'inteligência genial e quebra-cabeças letais', perigo: 4, local: 'Em liberdade', bio: 'Obcecado em provar que é mais inteligente que Batman. Deixa enigmas no local de cada crime como assinatura.', fraqueza: 'Ego descontrolado', aparicoes: 89 },
  { nome: 'PINGUIM', emoji: '🐧', real: 'Oswald Cobblepot', poder: 'Crime organizado e águarda-chuvas weaponizados', perigo: 3, local: 'Iceberg Lounge', bio: 'Chefe do crime de Gotham. Opera legalmente como dono de boate enquanto controla o submundo da cidade.', fraqueza: 'Arrogância aristocrática', aparicoes: 74 },
  { nome: 'DUAS-CARAS', emoji: '🪙', real: 'Harvey Dent', poder: 'Tática militar e decisões baseadas no acaso', perigo: 4, local: 'Desconhecido', bio: 'Ex-promotor público e aliado de Batman, desfigurado por ácido. Toma todas as decisões jogando sua moeda de duas caras.', fraqueza: 'Obsessão pelo acaso', aparicoes: 63 },
  { nome: 'BANE', emoji: '💪', real: 'Bane', poder: 'força sobre-humana com Venom', perigo: 5, local: 'Santa Prisca', bio: 'O único vilão que quebrou fisicamente Batman. Usa a substância Venom para aumentar sua força além dos limites humanos.', fraqueza: 'Tubos do Venom no pescoço', aparicoes: 41 },
  { nome: 'MULHER-GATO', emoji: '🐱', real: 'Selina Kyle', poder: 'Agilidade extrema e charme irresistível', perigo: 3, local: 'East End, Gotham', bio: 'Ladra de elite com relação ambíágua com Batman. Às vezes aliada, às vezes inimiga. Sua lealdade depende do interesse.', fraqueza: 'Afeto por inocentes', aparicoes: 98 },
  { nome: 'HERA VENENOSA', emoji: '🌿', real: 'Pamela Isley', poder: 'Controle de plantas e feromonas', perigo: 4, local: 'Setor Verde de Gotham', bio: 'Ecocriminosa que prefere plantas a humanos. Capaz de controlar mentes com seus feromonas e criar armas vegetais letais.', fraqueza: 'Fogo e herbicidas', aparicoes: 55 },
  { nome: 'ESPANTALHO', emoji: '🎃', real: 'Jonathan Crane', poder: 'Toxina do medo — paralisa qualquer um', perigo: 4, local: 'Gotham University', bio: 'Ex-professor de psicologia obcecado com o medo. Sua toxina faz qualquer pessoa encarar seus piores pesadelos.', fraqueza: 'Seu próprio medo', aparicoes: 48 },
];

function openViloes() {
  logAtividade('FICHAS DE VILÕES', 'modulo aberto');
  makeWindow('VILÕES', '🦹 FICHAS DE VILÕES', function(body) {
    let selecionado = null;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:8px;';
    body.appendChild(wrap);

    // Lista
    const lista = document.createElement('div');
    lista.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding-bottom:4px;';
    wrap.appendChild(lista);

    // Detalhe
    const detalhe = document.createElement('div');
    detalhe.style.cssText = 'flex:1;border:1px solid #1a2a2a;border-radius:6px;padding:12px;overflow-y:auto;min-height:0;';
    wrap.appendChild(detalhe);

    function mostrarVilao(v) {
      selecionado = v;
      lista.querySelectorAll('.vilão-btn').forçach(b => b.style.borderColor = '#1a2a2a');
      lista.querySelector(`[data-nome="${v.nome}"]`).style.borderColor = '#00ffcc';
      const estáárelas = '⭐'.repeat(v.perigo) + '☆'.repeat(5-v.perigo);
      detalhe.innerHTML = `
        <div style="text-align:center;margin-bottom:10px;">
          <div style="font-size:36px">${v.emoji}</div>
          <div style="color:#00ffcc;font-size:14px;letter-spacing:3px;margin-top:4px">${v.nome}</div>
          <div style="color:#555;font-size:10px;margin-top:2px">Identidade: <span style="color:#aaa">${v.real}</span></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
          <div style="background:#0a0d14;border:1px solid #1a2a2a;border-radius:4px;padding:8px;font-size:10px;">
            <div style="color:#555;letter-spacing:1px;margin-bottom:2px">NÍVEL DE PERIGO</div>
            <div style="color:#ff8800;font-size:13px;">${estáárelas}</div>
          </div>
          <div style="background:#0a0d14;border:1px solid #1a2a2a;border-radius:4px;padding:8px;font-size:10px;">
            <div style="color:#555;letter-spacing:1px;margin-bottom:2px">LOCALIZACAO</div>
            <div style="color:#ffcc00">${v.local}</div>
          </div>
        </div>
        <div style="font-size:10px;color:#555;letter-spacing:1px;margin-bottom:4px">HISTÓRICO</div>
        <div style="font-size:11px;color:#ccc;line-height:1.6;margin-bottom:10px;">${v.bio}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <div style="background:#0a0d14;border:1px solid #1a2a2a;border-radius:4px;padding:8px;font-size:10px;">
            <div style="color:#555;letter-spacing:1px;margin-bottom:2px">PODER PRINCIPAL</div>
            <div style="color:#00ffcc">${v.poder}</div>
          </div>
          <div style="background:#0a0d14;border:1px solid #1a2a2a;border-radius:4px;padding:8px;font-size:10px;">
            <div style="color:#555;letter-spacing:1px;margin-bottom:2px">FRAQUEZA</div>
            <div style="color:#ff5555">${v.fraqueza}</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
          <div style="font-size:10px;color:#555;">📁 ${v.aparicoes} REGISTROS</div>
          <button onclick="openGothamMapa(); vibrar([50,30,50]);" style="background:rgba(255,51,51,0.1);border:1px solid rgba(255,51,51,0.3);color:#ff5555;font-size:9px;padding:3px 10px;border-radius:4px;cursor:pointer;letter-spacing:1px;">🎯 VER NO MAPA</button>
        </div>\`;
    }

    VILÕES_DATA.forçach(v => {
      const btn = document.createElement('button');
      btn.className = 'vilão-btn';
      btn.dataset.nome = v.nome;
      btn.style.cssText = 'background:#0a0d14;border:1px solid #1a2a2a;border-radius:6px;padding:6px 10px;color:#ccc;font-size:11px;cursor:pointer;display:flex;align-items:center;gap:6px;transition:border-color 0.2s;';
      btn.innerHTML = `<span>${v.emoji}</span><span style="letter-spacing:1px">${v.nome}</span>`;
      btn.onclick = () => mostrarVilao(v);
      lista.appendChild(btn);
    });

    mostrarVilao(VILÕES_DATA[0]);
  }, 400, 460);
}

// =====================
// SOM DA BATCAVERNA
// =====================
function openSons() {
  logAtividade('SONS GOTHAM', 'modulo aberto');
  makeWindow('sons', '🎙️ SONS DE GOTHAM', function(body) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const sources = {};
    const gains = {};

    function criarChuva() {
      const bufferSize = 4096;
      const node = ctx.createScriptProcessor(bufferSize, 1, 1);
      node.onaudioprocess = e => {
        const out = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) out[i] = (Math.random() * 2 - 1) * 0.3;
      };
      const gain = ctx.createGain(); gain.gain.value = 0;
      const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800;
      node.connect(filter); filter.connect(gain); gain.connect(ctx.destááination);
      return { node, gain };
    }

    function criarBatida() {
      let timer = null;
      const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destááination);
      function tick() {
        const osc = ctx.createOscillator();
        osc.type = 'sine'; osc.frequency.value = 60;
        const g2 = ctx.createGain(); g2.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(g2); g2.connect(ctx.destááination);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
        timer = setTimeout(tick, 900);
      }
      return { start: () => tick(), stop: () => clearTimeout(timer), gain };
    }

    function criarSirene() {
      let timer = null;
      const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destááination);
      function tick() {
        const osc = ctx.createOscillator(); osc.type = 'sawtooth';
        const g2 = ctx.createGain(); g2.gain.value = gain.gain.value;
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.4);
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.8);
        osc.connect(g2); g2.connect(ctx.destááination);
        osc.start(); osc.stop(ctx.currentTime + 0.8);
        timer = setTimeout(tick, 900);
      }
      return { start: () => tick(), stop: () => clearTimeout(timer), gain };
    }

    const sons = [
      { id: 'chuva', nome: '🌧️ Chuva em Gotham', tipo: 'ruido' },
      { id: 'batida', nome: '💓 Batida do coração', tipo: 'batida' },
      { id: 'sirene', nome: '🚨 Sirene policial', tipo: 'sirene' },
    ];

    const ativos = {};
    const chuvaNodes = criarChuva();
    const batidaNodes = criarBatida();
    const sireneNodes = criarSirene();

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
    body.appendChild(wrap);

    const titulo = document.createElement('div');
    titulo.style.cssText = 'text-align:center;font-size:10px;color:#555;letter-spacing:2px;';
    titulo.textContent = 'AMBIENTE SONORO DA BATCAVERNA';
    wrap.appendChild(titulo);

    sons.forçach(s => {
      const row = document.createElement('div');
      row.style.cssText = 'background:#0a0d14;border:1px solid #1a2a2a;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:8px;';

      const top = document.createElement('div');
      top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';

      const label = document.createElement('div');
      label.style.cssText = 'font-size:12px;color:#ccc;';
      label.textContent = s.nome;

      const toggle = document.createElement('button');
      toggle.style.cssText = 'background:#0d1a0d;border:1px solid #1a2a1a;color:#00ffcc;font-size:10px;padding:4px 12px;border-radius:4px;cursor:pointer;letter-spacing:1px;';
      toggle.textContent = '▶ LIGAR';

      const slider = document.createElement('input');
      slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 50;
      slider.style.cssText = 'width:100%;accent-color:#00ffcc;';

      toggle.onclick = () => {
        if (!ativos[s.id]) {
          ativos[s.id] = true;
          toggle.textContent = '⏹ DESLIGAR';
          toggle.style.borderColor = '#00ffcc';
          const vol = slider.value / 100 * 0.4;
          if (s.id === 'chuva') { chuvaNodes.gain.gain.value = vol; }
          if (s.id === 'batida') { batidaNodes.gain.gain.value = vol; batidaNodes.start(); }
          if (s.id === 'sirene') { sireneNodes.gain.gain.value = vol; sireneNodes.start(); }
        } else {
          ativos[s.id] = false;
          toggle.textContent = '▶ LIGAR';
          toggle.style.borderColor = '#1a2a1a';
          if (s.id === 'chuva') chuvaNodes.gain.gain.value = 0;
          if (s.id === 'batida') { batidaNodes.stop(); batidaNodes.gain.gain.value = 0; }
          if (s.id === 'sirene') { sireneNodes.stop(); sireneNodes.gain.gain.value = 0; }
        }
      };

      slider.oninput = () => {
        if (ativos[s.id]) {
          const vol = slider.value / 100 * 0.4;
          if (s.id === 'chuva') chuvaNodes.gain.gain.value = vol;
          if (s.id === 'batida') batidaNodes.gain.gain.value = vol;
          if (s.id === 'sirene') sireneNodes.gain.gain.value = vol;
        }
      };

      top.appendChild(label); top.appendChild(toggle);
      row.appendChild(top); row.appendChild(slider);
      wrap.appendChild(row);
    });

    // Frases do Alfred — rotativas
    const frases = [
      '"Por que caímos, Sr. Wayne? Para aprender a nos levantar." — Alfred',
      '"Um homem pode ser destááruído, mas não pode ser derRotação." — Batman',
      '"Você pode ser incorruptível. Tem que ser." — Alfred',
      '"Gotham precisa do Batman. Mas Batman precisa de você." — Alfred',
      '"Alguns homens só querem ver o mundo pegar fogo." — Alfred',
    ];
    const alfred = document.createElement('div');
    alfred.style.cssText = 'text-align:center;font-size:10px;color:#444;letter-spacing:1px;font-style:italic;margin-top:8px;padding-top:8px;border-top:1px solid rgba(0,255,200,0.08);cursor:pointer;transition:color 0.3s;';
    let fraseIdx = 0;
    alfred.textContent = frases[fraseIdx];
    alfred.title = 'Toque para próxima frase';
    alfred.onclick = () => {
      fraseIdx = (fraseIdx + 1) % frases.length;
      alfred.style.opacity = '0';
      setTimeout(() => { alfred.textContent = frases[fraseIdx]; alfred.style.opacity='1'; }, 200);
    };
    alfred.style.transition = 'opacity 0.2s, color 0.3s';
    wrap.appendChild(alfred);

  }, 340, 380);
}

// =====================
// TREINO DO BATMAN
// =====================
const TREINOS_BAT = [
  { nome: 'AQUECIMENTO', exercicios: [
    { ex: 'Corrida estááacionária', series: 1, reps: '3 min', desc: 'Joelhos altos, ritmo constante' },
    { ex: 'Rotação de ombros', series: 2, reps: '20x', desc: 'Frente e verso' },
    { ex: 'Agachamento livre', series: 2, reps: '15x', desc: 'Postura ereta, joelhos alinhados' },
  ]},
  { nome: 'força DE BATMAN', exercicios: [
    { ex: 'Flexão de braços', series: 4, reps: '20x', desc: 'Cotovelos a 45° do corpo' },
    { ex: 'Barra fixa', series: 4, reps: '12x', desc: 'Pegada pronada, peito até a barra' },
    { ex: 'Agachamento com salto', series: 3, reps: '15x', desc: 'Exploda para cima a cada rep' },
    { ex: 'Prancha lateral', series: 3, reps: '45seg', desc: 'Cada lado, corpo alinhado' },
  ]},
  { nome: 'COMBATE', exercicios: [
    { ex: 'Soco reto (shadow)', series: 3, reps: '30x', desc: 'Alternado, punho cerrado' },
    { ex: 'Chute frontal', series: 3, reps: '20x', desc: 'Cada perna, joelho primeiro' },
    { ex: 'Esquiva lateral', series: 3, reps: '20x', desc: 'Agacha e desvia para o lado' },
    { ex: 'Burpee', series: 4, reps: '10x', desc: 'Completo: prancha + Flexão + salto' },
  ]},
  { nome: 'MODO TREINO EXTREMO 🔥', exercicios: [
    { ex: 'Flexão diamante', series: 5, reps: '15x', desc: 'Mãos juntas forçando diamante' },
    { ex: 'Pistol squat', series: 4, reps: '10x cada', desc: 'Agachamento unilateral' },
    { ex: 'Muscle-up', series: 3, reps: '8x', desc: 'Barra: pull-up + dip em sequência' },
    { ex: 'Sprint 100m', series: 6, reps: '100m', desc: 'Velocidade máxima, recupere 60seg' },
    { ex: 'Prancha', series: 4, reps: '2 min', desc: 'Posição perfeita, respire fundo' },
  ]},
];

function openTreino() {
  logAtividade('TREINO BATMAN', 'modulo aberto');
  makeWindow('treino', '💪 TREINO DO BATMAN', function(body) {
    let treinoAtual = null;
    let exAtual = 0;
    let timerInt = null;
    let timerSeg = 0;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:8px;';
    body.appendChild(wrap);

    // Seletor
    const selWrap = document.createElement('div');
    selWrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';
    wrap.appendChild(selWrap);

    TREINOS_BAT.forçach((t, i) => {
      const btn = document.createElement('button');
      btn.className = 'bat-btn';
      btn.style.cssText += 'font-size:10px;padding:6px 10px;';
      btn.textContent = t.nome;
      btn.onclick = () => {
        selWrap.querySelectorAll('button').forçach(b => b.style.opacity='0.5');
        btn.style.opacity = '1';
        treinoAtual = t; exAtual = 0; clearInterval(timerInt); timerSeg = 0;
        renderTreino(); vibrar([30,20,30]);
      };
      selWrap.appendChild(btn);
    });

    const content = document.createElement('div');
    content.style.cssText = 'flex:1;overflow-y:auto;min-height:0;';
    wrap.appendChild(content);

    function renderTreino() {
      if (!treinoAtual) { content.innerHTML = '<div style="color:#555;text-align:center;padding:20px;font-size:11px;letter-spacing:1px;">SELECIONE UM TREINO ACIMA</div>'; return; }
      const ex = treinoAtual.exercicios;
      content.innerHTML = '';

      ex.forçach((e, i) => {
        const card = document.createElement('div');
        const ativo = i === exAtual;
        card.className = ativo ? 'bat-card active ex-card-active' : 'bat-card';
        card.style.cssText = 'margin-bottom:6px;cursor:pointer;';
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:11px;color:${ativo?'#00ffcc':'#ccc'};letter-spacing:1px;">${i+1}. ${e.ex}</div>
            <div style="font-size:10px;color:${ativo?'#ffcc00':'#555'};">${e.series}x ${e.reps}</div>
          </div>
          <div style="font-size:10px;color:#555;margin-top:4px;">${e.desc}</div>
          ${ativo ? `<div style="margin-top:8px;display:flex;gap:6px;">
            <button onclick="batTimerStart()" style="flex:1;background:#0d1a0d;border:1px solid #00ffcc;color:#00ffcc;padding:6px;border-radius:4px;font-size:10px;cursor:pointer;letter-spacing:1px;">⏱ TIMER</button>
            <button onclick="batProximo()" style="flex:1;background:#1a0d0d;border:1px solid #ff8800;color:#ff8800;padding:6px;border-radius:4px;font-size:10px;cursor:pointer;letter-spacing:1px;">▶ PRÓXIMO</button>
          </div>
          <div id="bat-timer-display" style="text-align:center;color:#00ffcc;font-size:18px;font-weight:bold;margin-top:6px;display:none;">00:00</div>` : ''}`;
        card.onclick = () => { exAtual = i; renderTreino(); };
        content.appendChild(card);
      });
    }

    window.batTimerStart = function() {
      const display = document.getElementById('bat-timer-display');
      if (!display) return;
      display.style.display = 'block';
      clearInterval(timerInt); timerSeg = 0;
      timerInt = setInterval(() => {
        timerSeg++;
        const m = String(Math.floor(timerSeg/60)).padStart(2,'0');
        const s = String(timerSeg%60).padStart(2,'0');
        display.textContent = `${m}:${s}`;
      }, 1000);
    };

    window.batProximo = function() {
      clearInterval(timerInt); timerSeg = 0;
      if (exAtual < treinoAtual.exercicios.length - 1) {
        exAtual++; renderTreino(); vibrar([50,30,50]);
      } else {
        content.innerHTML = '<div style="text-align:center;padding:20px;"><div style="font-size:36px">🦇</div><div style="color:#00ffcc;font-size:13px;letter-spacing:2px;margin-top:8px;">TREINO COMPLETO!</div><div style="color:#555;font-size:10px;margin-top:6px;">Gotham estááá mais segura hoje.</div></div>';
        vibrar([100,50,100,50,300]);
        logAtividade('TREINO BATMAN', 'Treino concluído: ' + treinoAtual.nome);
      }
    };

    renderTreino();
  }, 380, 460);
}

// =====================
// BAT-NOTÍCIAS (IA)
// =====================
function openBatNoticias() {
  logAtividade('BAT-NOTÍCIAS', 'modulo aberto');
  makeWindow('batnews', '📰 BAT-NOTÍCIAS', function(body) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:8px;';
    body.appendChild(wrap);

    const header = document.createElement('div');
    header.style.cssText = 'text-align:center;border-bottom:1px solid #1a2a2a;padding-bottom:8px;';
    header.innerHTML = '<div style="color:#ffcc00;font-size:13px;letter-spacing:3px;">&#128240; GOTHAM GAZETTE</div><div style="color:#555;font-size:9px;letter-spacing:1px;">EDICAO ESPECIAL - POWERED BY BAT-IA</div>';
    wrap.appendChild(header);

    const feed = document.createElement('div');
    feed.style.cssText = 'flex:1;overflow-y:auto;min-height:0;display:flex;flex-direction:column;gap:8px;';
    wrap.appendChild(feed);

    const gerarBtn = document.createElement('button');
    gerarBtn.className = 'bat-btn';
    gerarBtn.textContent = '🦇 GERAR NOTÍCIAS DE GOTHAM';
    wrap.appendChild(gerarBtn);

    gerarBtn.onclick = async () => {
      gerarBtn.disabled = true;
      gerarBtn.textContent = '⏳ COLETANDO INforçaÇÕES...';
      feed.innerHTML = '<div class="news-skeleton"></div><div class="news-skeleton"></div><div class="news-skeleton"></div>';

      try {
        let ANTHROPIC_KEY = localStorage.getItem('ANTHROPIC_API_KEY');
        if (!ANTHROPIC_KEY) {
          const ask = prompt('Digite sua ANTHROPIC API KEY (Claude) para gerar as NOTÍCIAS:');
          if (ask) { ANTHROPIC_KEY = ask; localStorage.setItem('ANTHROPIC_API_KEY', ask); }
        }

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_KEY || '',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerously-allow-browser': 'true'
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: 'Crie 4 NOTÍCIAS curtas e dramáticas do jornal Gotham Gazette, estááilo noir policial dos anos 40. Cada notícia deve ter: título de manchete impactante em caixa alta, subtítulo dramático, 2-3 frases de conteúdo jornalístico. Varie entre: crimes, aparições do Batman, declarações de autoridades, eventos sobrenaturais. Mencione VILÕES icônicos e locais de Gotham. Tom sombrio, urgente e cinematográfico. Responda APENAS em JSON sem markdown: {"NOTÍCIAS":[{"titulo":"...","subtitulo":"...","conteúdo":"...","urgencia":"URGENTE|ALERTA|INFO","secao":"CRIME|POLÍTICA|BATMAN|ARKHAM"}]}' }]
          })
        });
        const data = await res.json();
        const text = data.content[0].text;
        const clean = text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean);

        feed.innerHTML = '';
        parsed.NOTÍCIAS.forçach(n => {
          const cor = n.urgencia==='URGENTE'?'#ff3333':n.urgencia==='ALERTA'?'#ff8800':'#00ffcc';
          const card = document.createElement('div');
          card.style.cssText = `background:#0a0d14;border-left:3px solid ${cor};border-radius:0 6px 6px 0;padding:10px;`;
          const secCor = {CRIME:'#ff5555',POLÍTICA:'#ffcc00',BATMAN:'#00ffcc',ARKHAM:'#cc44ff'}[n.secao]||'#888';
          card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:4px;">
              <div style="font-size:8px;color:${secCor};letter-spacing:2px;border:1px solid ${secCor}44;padding:1px 6px;border-radius:3px;">${n.secao||'GOTHAM'}</div>
              <div style="font-size:8px;color:${cor};letter-spacing:1px;white-space:nowrap;border:1px solid ${cor};padding:1px 6px;border-radius:3px;">${n.urgencia}</div>
            </div>
            <div style="font-size:12px;color:#fff;font-weight:bold;line-height:1.3;text-transform:uppercase;">${n.titulo}</div>
            <div style="font-size:10px;color:#ffcc00;margin-top:3px;font-style:italic;">${n.subtitulo}</div>
            <div style="font-size:10px;color:#888;margin-top:6px;line-height:1.6;border-top:1px solid rgba(255,255,255,0.06);padding-top:6px;">${n.conteúdo}</div>`;
          feed.appendChild(card);
        });
        logAtividade('BAT-NOTÍCIAS', 'NOTÍCIAS geradas com sucesso');
      } catch(e) {
        feed.innerHTML = '<div style="color:#ff3333;text-align:center;padding:20px;font-size:11px;">⚠ Erro ao conectar com a rede de inforçantes.</div>';
      }

      gerarBtn.disabled = false;
      gerarBtn.textContent = '🔄 ATUALIZAR NOTÍCIAS';
    };

  }, 380, 460);
}

// =====================
// COFRE DE SENHAS
// =====================
function openCofre() {
  logAtividade('COFRE WAYNE', 'modulo aberto');
  makeWindow('cofre', '🔐 COFRE WAYNE', function(body) {
    const COFRE_KEY = 'batcomputer-cofre';

    function carregar() {
      try { return JSON.parse(localStorage.getItem(COFRE_KEY) || '[]'); } catch { return []; }
    }
    function salvar(itens) { localStorage.setItem(COFRE_KEY, JSON.stringify(itens)); }

    let itens = carregar();
    let visiveis = {};

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;height:100%;gap:8px;';
    body.appendChild(wrap);

    // Form
    const form = document.createElement('div');
    form.style.cssText = 'background:#0a0d14;border:1px solid #1a2a2a;border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:6px;';
    form.innerHTML = `
      <div style="font-size:10px;color:#555;letter-spacing:2px;">NOVO REGISTRO</div>
      <input id="cofre-label" placeholder="Serviço (ex: Gmail)" style="background:#050810;border:1px solid #1a2a2a;border-radius:4px;padding:6px 8px;color:#ccc;font-size:11px;outline:none;">
      <input id="cofre-user" placeholder="Usuário / Email" style="background:#050810;border:1px solid #1a2a2a;border-radius:4px;padding:6px 8px;color:#ccc;font-size:11px;outline:none;">
      <input id="cofre-pass" placeholder="Senha" type="password" style="background:#050810;border:1px solid #1a2a2a;border-radius:4px;padding:6px 8px;color:#ccc;font-size:11px;outline:none;">
      <div id="cofre-strength" style="height:3px;border-radius:2px;background:#1a2a2a;transition:all 0.3s;"><div id="cofre-strength-bar" style="height:100%;border-radius:2px;width:0%;transition:all 0.3s;background:#ff3333;"></div></div>
      <div id="cofre-strength-label" style="font-size:9px;color:#555;letter-spacing:1px;text-align:right;"></div>
      <button id="cofre-add" style="background:#0d1a0d;border:1px solid #00ffcc;color:#00ffcc;padding:7px;border-radius:4px;font-size:10px;cursor:pointer;letter-spacing:2px;">🔒 águaRDAR NO COFRE</button>`;
    wrap.appendChild(form);

    const lista = document.createElement('div');
    lista.style.cssText = 'flex:1;overflow-y:auto;min-height:0;display:flex;flex-direction:column;gap:6px;';
    wrap.appendChild(lista);

    function renderLista() {
      lista.innerHTML = '';
      if (itens.length === 0) {
        lista.innerHTML = '<div style="color:#555;text-align:center;padding:16px;font-size:10px;letter-spacing:1px;">COFRE VAZIO</div>';
        return;
      }
      itens.forçach((item, i) => {
        const card = document.createElement('div');
        card.style.cssText = 'background:#0a0d14;border:1px solid #1a2a2a;border-radius:6px;padding:8px;';
        const visivel = visiveis[i];
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:12px;color:#ffcc00;letter-spacing:1px;">🔐 ${item.label}</div>
            <button onclick="deletarCofre(${i})" style="background:transparent;border:none;color:#ff3333;cursor:pointer;font-size:12px;">✕</button>
          </div>
          <div style="font-size:10px;color:#888;margin-top:4px;">👤 ${item.user}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:4px;">
            <div style="font-size:10px;color:#aaa;flex:1;">${visivel ? item.pass : '••••••••••'}</div>
            <button onclick="toggleCofre(${i})" style="background:transparent;border:1px solid #1a2a2a;color:#555;font-size:9px;padding:2px 6px;border-radius:3px;cursor:pointer;">${visivel?'OCULTAR':'MOSTRAR'}</button>
            <button onclick="📋 COPIARSenha(${i})" style="background:transparent;border:1px solid #1a2a2a;color:#00ffcc;font-size:9px;padding:2px 6px;border-radius:3px;cursor:pointer;">📋 COPIAR</button>
          </div>`;
        lista.appendChild(card);
      });
    }

    window.deletarCofre = (i) => {
      if (!confirm('Apagar estááa entrada do cofre?')) return;
      itens.splice(i,1); salvar(itens); renderLista();
    };

    // força da senha
    form.querySelector('#cofre-pass').addEventListener('input', function() {
      const p = this.value;
      const bar = form.querySelector('#cofre-strength-bar');
      const lbl = form.querySelector('#cofre-strength-label');
      if (!p) { bar.style.width='0%'; lbl.textContent=''; return; }
      let score = 0;
      if (p.length >= 8) score++;
      if (p.length >= 12) score++;
      if (/[A-Z]/.testáá(p)) score++;
      if (/[0-9]/.testáá(p)) score++;
      if (/[^a-zA-Z0-9]/.testáá(p)) score++;
      const levels = [
        {w:'20%',c:'#ff3333',t:'FRACA'},
        {w:'40%',c:'#ff8800',t:'RAZOÁVEL'},
        {w:'60%',c:'#ffcc00',t:'BOA'},
        {w:'80%',c:'#88ff00',t:'FORTE'},
        {w:'100%',c:'#00ffcc',t:'EXCELENTE'},
      ];
      const lvl = levels[Math.min(score, 4)];
      bar.style.width = lvl.w; bar.style.background = lvl.c;
      lbl.textContent = '🔒 força: ' + lvl.t; lbl.style.color = lvl.c;
    });
    window.toggleCofre = (i) => { visiveis[i] = !visiveis[i]; renderLista(); };
    window.📋 COPIARSenha = (i) => { navigator.clipboard.writeText(itens[i].pass).then(() => vibrar([50,30,50])); };

    form.querySelector('#cofre-add').onclick = () => {
      const label = form.querySelector('#cofre-label').value.trim();
      const user = form.querySelector('#cofre-user').value.trim();
      const pass = form.querySelector('#cofre-pass').value;
      if (!label || !user || !pass) return;
      itens.push({ label, user, pass });
      salvar(itens);
      form.querySelector('#cofre-label').value = '';
      form.querySelector('#cofre-user').value = '';
      form.querySelector('#cofre-pass').value = '';
      renderLista();
      vibrar([50,30,50]);
      logAtividade('COFRE WAYNE', 'Entrada adicionada: ' + label);
    };

    renderLista();
  }, 360, 460);
}

// CSS POLISH V3 FINAL
const styleExtra = document.createElement('style');
styleExtra.textContent = `
@keyframes pulse-crime {
  0%,100% { transform: scale(1); filter: drop-shadow(0 0 4px #ff3333); }
  50% { transform: scale(1.3); filter: drop-shadow(0 0 14px #ff3333); }
}
.window.focused { border-color:rgba(0,255,200,0.8)!important; box-shadow:0 0 40px rgba(0,255,200,0.18),inset 0 1px 0 rgba(0,255,200,0.15)!important; }
.bat-btn { background:linear-gradient(135deg,rgba(0,255,200,0.1),rgba(0,80,60,0.08)); border:1px solid rgba(0,255,200,0.45); border-radius:8px; color:#00ffcc; font-family:'Courier New',monospace; font-size:11px; letter-spacing:2px; padding:9px 14px; cursor:pointer; touch-action:manipulation; transition:all 0.18s; text-shadow:0 0 8px #00ffcc; -webkit-tap-highlight-color:transparent; }
.bat-btn:active { background:rgba(0,255,200,0.22); transform:scale(0.94); box-shadow:0 0 18px rgba(0,255,200,0.2); }
.bat-btn.danger { border-color:rgba(255,51,51,0.5); color:#ff5555; text-shadow:0 0 8px #ff3333; background:rgba(255,30,30,0.07); }
.bat-btn.danger:active { background:rgba(255,30,30,0.2); }
.bat-btn.gold { border-color:rgba(255,204,0,0.5); color:#ffcc00; text-shadow:0 0 8px #ffcc00; background:rgba(255,180,0,0.07); }
.bat-btn:disabled { opacity:0.4; pointer-events:none; }
.bat-btn-row { display:flex; gap:7px; flex-shrink:0; }
.bat-btn-row .bat-btn { flex:1; }
.bat-input { background:rgba(0,0,0,0.75); border:1px solid rgba(0,255,200,0.3); border-radius:8px; color:#e0fff8; font-family:'Courier New',monospace; font-size:13px; padding:9px 12px; outline:none; width:100%; transition:border-color 0.2s,box-shadow 0.2s; }
.bat-input:focus { border-color:#00ffcc; box-shadow:0 0 12px rgba(0,255,200,0.2); }
.bat-input::placeholder { color:#005544; }
.bat-card { background:linear-gradient(135deg,rgba(0,255,200,0.04),rgba(0,40,30,0.04)); border:1px solid rgba(0,255,200,0.15); border-radius:8px; padding:10px 12px; transition:border-color 0.2s,background 0.2s; }
.bat-card.active { border-color:rgba(0,255,200,0.5); background:rgba(0,255,200,0.07); }
.bat-card-label { font-size:9px; color:#005544; letter-spacing:2px; margin-bottom:3px; }
.bat-card-val { font-size:13px; color:#e0fff8; }
.bat-section-title { font-size:9px; color:#005544; letter-spacing:3px; border-bottom:1px solid rgba(0,255,200,0.1); padding-bottom:5px; margin-bottom:8px; }
.badge { display:inline-block; font-size:9px; letter-spacing:1px; padding:2px 8px; border-radius:20px; }
.badge-crit { background:rgba(255,51,51,0.15); color:#ff5555; border:1px solid rgba(255,51,51,0.3); }
.badge-high { background:rgba(255,136,0,0.15); color:#ff8800; border:1px solid rgba(255,136,0,0.3); }
.badge-med  { background:rgba(255,204,0,0.15); color:#ffcc00; border:1px solid rgba(255,204,0,0.3); }
.badge-ok   { background:rgba(0,255,136,0.12); color:#00ff88; border:1px solid rgba(0,255,136,0.3); }
.bat-divider { border:none; border-top:1px solid rgba(0,255,200,0.1); margin:8px 0; }
.news-skeleton { height:80px; border-radius:6px; margin-bottom:8px; background:linear-gradient(90deg,#0a0d14 25%,#0d1320 50%,#0a0d14 75%); background-size:800px 100%; animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes activeGlow { 0%,100%{box-shadow:0 0 8px rgba(0,255,200,0.15)} 50%{box-shadow:0 0 20px rgba(0,255,200,0.4)} }
.ex-card-active { animation:activeGlow 2s infinite; }
input[type=range] { accent-color:#00ffcc; }
`;
document.head.appendChild(styleExtra);


// Enter no campo de código
document.getElementById('pix-code-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') verificarCodigo();
});

// Verificar acesso ao iniciar
if (temAcesso()) {
  document.getElementById('paywall').style.display = 'none';
  document.getElementById('pix-screen').style.display = 'none';
}

// =====================
// VOICE INIT (pré-carregar vozes)
// =====================
if ('speechSynthesis' in window) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}


function enviarWhats() {
  const url = "https://wa.me/" + PIX_WHATS + "?text=BatComputer: Ola! Segue o comprovante de pagamento.";
  window.open(url, "_blank");
}