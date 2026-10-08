(function () {
  "use strict";
  var B = window.BUNKER;
  var brl = function (v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  var $ = function (id) { return document.getElementById(id); };
  var zapLink = function (texto) {
    return "https://wa.me/" + B.whatsapp + (texto ? "?text=" + encodeURIComponent(texto) : "");
  };

  // Planos: mensalidades por frequência + fidelidade
  var planos = B.mensalidades.map(function (m) {
    return { id: m.id, nome: m.vezes + "x por semana", mensal: m.valor, tipo: "mensal" };
  }).concat(B.fidelidade.map(function (f) {
    return { id: f.id, nome: "Fidelidade " + f.nome, total: f.total, meses: f.meses, mensal: f.total / f.meses, tipo: "fidelidade" };
  }));
  $("tabela-mensal").innerHTML = B.mensalidades.map(function (m) {
    return '<tr><td class="vezes">' + m.vezes + 'x</td><td class="rot">por semana</td>' +
      '<td class="val">' + brl(m.valor) + ' <small>/mês</small></td>' +
      '<td><a href="#matricula" data-plano="' + m.id + '">Escolher</a></td></tr>';
  }).join("");
  $("lista-fid").innerHTML = B.fidelidade.map(function (f) {
    return '<div><h4>' + f.nome + '</h4><p class="total">' + brl(f.total) + '</p>' +
      '<p class="eq">equivale a ' + brl(f.total / f.meses) + '/mês · ' + f.meses + ' meses</p></div>';
  }).join("");
  $("pct-bim").textContent = B.descontoBimestral + "%";
  $("pct-grupo").textContent = B.descontoGrupo + "%";

  // Select de planos + resumo
  var sel = $("plano");
  planos.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p.id;
    o.textContent = p.tipo === "mensal" ? p.nome + " · " + brl(p.mensal) + "/mês" : p.nome + " · " + brl(p.total);
    sel.appendChild(o);
  });
  sel.value = "3x";
  var planoAtual = function () { return planos.filter(function (p) { return p.id === sel.value; })[0]; };
  var experimental = function () { return $("tipo-experimental").checked; };
  var calculo = function () {
    var p = planoAtual();
    var bim = p.tipo === "mensal" && $("bimestral").checked;
    var grupo = $("grupo").checked;
    var base = p.tipo === "mensal" ? p.mensal * (bim ? 2 : 1) : p.total;
    var desc = (bim ? B.descontoBimestral : 0) + (grupo ? B.descontoGrupo : 0);
    return { p: p, bim: bim, grupo: grupo, base: base, desc: desc, final: base * (1 - desc / 100),
      periodo: p.tipo === "mensal" ? (bim ? "2 meses" : "1 mês") : p.meses + " meses" };
  };
  var resumo = function () {
    var exp = experimental();
    $("campo-plano").hidden = exp;
    $("opcoes-desc").hidden = exp;
    $("btn-enviar").textContent = exp ? "Agendar aula pelo WhatsApp" : "Enviar matrícula pelo WhatsApp";
    if (exp) { $("resumo").innerHTML = "<span>Aula experimental <b>gratuita</b>. A equipe responde com os horários disponíveis.</span>"; return; }
    var c = calculo();
    $("op-bim").hidden = c.p.tipo !== "mensal";
    $("resumo").innerHTML =
      "<span>Plano <b>" + c.p.nome + "</b>" + (c.bim ? " · bimestral" : "") + "</span>" +
      (c.desc ? "<span>Desconto: <b>" + c.desc + "%</b>" + (c.grupo ? " (grupo sujeito a confirmação)" : "") + "</span>" : "") +
      "<span>Valor estimado: <b>" + brl(c.final) + "</b> por " + c.periodo + "</span>";
  };
  ["plano", "tipo-matricula", "tipo-experimental", "bimestral", "grupo"].forEach(function (id) {
    $(id).addEventListener("change", resumo);
  });
  resumo();
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-plano]");
    if (a) { sel.value = a.getAttribute("data-plano"); $("tipo-matricula").checked = true; resumo(); }
    var t = e.target.closest("[data-tipo=experimental]");
    if (t) { $("tipo-experimental").checked = true; resumo(); }
  });

  // Máscara simples de telefone
  $("whats").addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    var out = d;
    if (d.length > 2) out = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) out = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    e.target.value = out;
  });

  // Envio: monta a pré-matrícula e abre o WhatsApp da academia
  $("form-matricula").addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = $("nome").value.trim();
    var tel = $("whats").value.replace(/\D/g, "");
    var email = $("email").value.trim();
    var ok = true;
    var erro = function (id, msg) { $("erro-" + id).textContent = msg; if (msg) ok = false; };
    erro("nome", nome.split(/\s+/).length < 2 ? "Informe nome e sobrenome." : "");
    erro("whats", tel.length < 10 ? "Informe o WhatsApp com DDD, ex.: (11) 98765-4321." : "");
    erro("email", email && !/^\S+@\S+\.\S+$/.test(email) ? "Confira o e-mail, ex.: nome@gmail.com." : "");
    erro("lgpd", $("lgpd").checked ? "" : "Marque a autorização para podermos confirmar sua matrícula.");
    if (!ok) return;

    var c = calculo();
    var exp = experimental();
    var nasc = $("nascimento").value;
    var msg = [
      exp ? "Olá! Quero agendar uma aula experimental na " + B.marca + "." : "Olá! Quero fazer minha matrícula na " + B.marca + ".",
      "",
      "Nome: " + nome,
      "WhatsApp: " + $("whats").value,
      nasc ? "Nascimento: " + nasc.split("-").reverse().join("/") : null,
      email ? "E-mail: " + email : null,
      exp ? null : "Plano: " + c.p.nome + (c.bim ? " (bimestral)" : ""),
      exp || !c.grupo ? null : "Vou me matricular com casal/família/amigos",
      exp ? null : "Valor estimado: " + brl(c.final) + " por " + c.periodo,
      "Horário: " + $("turno").value,
      $("obs").value.trim() ? "Obs.: " + $("obs").value.trim() : null
    ].filter(function (l) { return l !== null; }).join("\n");

    var url = zapLink(msg);
    $("link-zap-form").href = url;
    $("msg-preview").textContent = msg;
    $("sucesso").hidden = false;
    window.open(url, "_blank", "noopener");
  });

  // Contato e horários
  $("tabela-horarios").innerHTML = B.horarios.map(function (h) {
    return "<tr><td>" + h.dias + "</td><td>" + h.horas + "</td></tr>";
  }).join("");
  $("endereco").textContent = B.endereco;
  $("zap-texto").textContent = B.whatsappExibicao;
  $("insta").textContent = "@" + B.instagram;
  $("insta").href = "https://www.instagram.com/" + B.instagram + "/";
  $("email-texto").textContent = B.email;
  $("link-mapa").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(B.endereco);
  var rt = B.responsavelTecnico;
  $("rt-nome").textContent = rt.nome;
  $("rt-formacao").textContent = rt.formacao;
  $("rt-cref").textContent = "CREF " + rt.cref;
  $("rodape-rt").textContent = "Responsável técnico: " + rt.nome + " · CREF " + rt.cref;
  $("zap-flutuante").href = zapLink("Olá! Quero saber mais sobre a " + B.marca + ".");
  $("cta-loja").href = zapLink("Quero ser avisado quando a loja " + B.loja.nome + " abrir.");
  $("cta-loja").target = "_blank";
  if (B.loja.ativa) { $("link-loja").href = B.loja.url; $("link-loja").innerHTML = "Loja"; }
  $("cnpj").textContent = B.cnpj;
  $("ano").textContent = new Date().getFullYear();

  // Fundo do topo: alterna imagens e vídeos de B.heroMidia
  (function () {
    var itens = B.heroMidia || [];
    var hero = $("hero"), caixa = $("hero-midia");
    if (!itens.length || !hero || !caixa) return;
    hero.classList.add("hero--midia");
    var reduz = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var multi = itens.length > 1 && !reduz;
    var slides = itens.map(function (it, i) {
      var el;
      if (it.tipo === "video") {
        el = document.createElement("video");
        el.muted = true; el.defaultMuted = true; el.playsInline = true; el.setAttribute("playsinline", "");
        el.preload = i === 0 ? "auto" : "metadata";
        el.loop = !multi;
        if (it.poster) el.poster = it.poster;
        el.src = it.arquivo;
      } else {
        el = document.createElement("img");
        el.alt = ""; el.decoding = "async";
        if (i > 0) el.loading = "lazy";
        el.src = it.arquivo;
      }
      el.className = "hero-slide";
      caixa.appendChild(el);
      return el;
    });
    var atual = 0, timer = null;
    var pontos = document.createElement("div");
    pontos.className = "hero-pontos";
    var mostrar = function (n) {
      clearTimeout(timer);
      slides[atual].classList.remove("ativo");
      if (slides[atual].pause) slides[atual].pause();
      atual = n;
      var el = slides[atual];
      el.classList.add("ativo");
      Array.prototype.forEach.call(pontos.children, function (b, i) {
        if (i === atual) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
      });
      if (el.play) { try { el.currentTime = 0; var r = el.play(); if (r && r.catch) r.catch(function () {}); } catch (e) {} }
      if (multi) {
        var espera = el.tagName === "VIDEO" ? 15000 : (B.heroIntervalo || 6000);
        timer = setTimeout(proximo, espera);
        if (el.tagName === "VIDEO") el.onended = function () { clearTimeout(timer); proximo(); };
      }
    };
    var proximo = function () { mostrar((atual + 1) % slides.length); };
    if (multi) {
      itens.forEach(function (it, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("aria-label", "Mostrar imagem " + (i + 1));
        b.addEventListener("click", function () { mostrar(i); });
        pontos.appendChild(b);
      });
      caixa.parentNode.appendChild(pontos);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) clearTimeout(timer); else mostrar(atual);
      });
    }
    slides[0].classList.add("ativo");
    mostrar(0);
  })();

  // Fatos do hero
  var menor = Math.min.apply(null, B.mensalidades.map(function (m) { return m.valor; }));
  $("fatos").innerHTML =
    "<div><b>Todas as idades</b>treino adaptado a cada fase</div>" +
    "<div><b>A partir de " + brl(menor) + "/mês</b>2x por semana</div>" +
    "<div><b>5h–10h · 15h–21h</b>segunda a sexta</div>" +
    "<div><b>Aula experimental</b>gratuita, com professor</div>";
})();
