(function () {
  "use strict";
  var ZAP = "5535997757577";
  function link(texto) { return "https://wa.me/" + ZAP + "?text=" + encodeURIComponent(texto); }
  var $ = function (id) { return document.getElementById(id); };
  $("zap-flutuante").href = link("Olá! Quero saber mais sobre a Arena Bunker.");
  ["cta-aviso-3"].forEach(function (id) {
    $(id).href = link("Quero ser avisado sobre a Arena Bunker (corrida de obstáculos).");
    $(id).target = "_blank"; $(id).rel = "noopener";
  });
  $("cta-patro").href = link("Olá! Tenho interesse em apoiar ou patrocinar a Arena Bunker.");
  $("cta-patro").target = "_blank"; $("cta-patro").rel = "noopener";
  $("ano").textContent = new Date().getFullYear();
})();
