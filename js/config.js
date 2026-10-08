/*
 * Dados do negócio. Edite AQUI: preços, contato, horários.
 * Itens marcados com "EXEMPLO" ainda precisam do valor real.
 */
window.BUNKER = {
  marca: "Bunker Black Gym",
  dominio: "https://www.bunkersn.com.br",
  cnpj: "58.812.254/0001-94",
  responsavelTecnico: {
    nome: "Divino Batista da Silva",
    cref: "022001",                       // confirmar sufixo (ex.: 022001-G/MG)
    formacao: "Responsável técnico · Musculação"
  },
  // WhatsApp no formato internacional, só dígitos: 55 + DDD + número
  whatsapp: "5535997757577",
  whatsappExibicao: "(35) 9 9775-7577",
  email: "sportnutritionbunker@gmail.com",
  instagram: "bunker_sn",
  endereco: "Rua Delfim Moreira, 553, Centro, Nova Resende/MG",
  horarios: [
    { dias: "Seg a Sex", horas: "05h às 10h" },
    { dias: "Seg a Sex", horas: "15h às 21h" },
    { dias: "Sábado",    horas: "Em breve" },  // atualizar quando abrir
    { dias: "Domingo",   horas: "Fechado" }
  ],
  // Tabela "Valores de acesso 2026"
  mensalidades: [
    { id: "6x", vezes: 6, valor: 120 },
    { id: "5x", vezes: 5, valor: 110 },
    { id: "4x", vezes: 4, valor: 105 },
    { id: "3x", vezes: 3, valor: 100 },
    { id: "2x", vezes: 2, valor: 95 }
  ],
  fidelidade: [                            // todos os dias, pacotes limitados
    { id: "anual",     nome: "Anual",     meses: 12, total: 985 },
    { id: "semestral", nome: "Semestral", meses: 6,  total: 610 }
  ],
  descontoBimestral: 5,                    // % sobre a mensalidade do plano
  descontoGrupo: 5,                        // % para cada participante (casal, família, amigos)
  // Fundo do topo: imagens e vídeos que se alternam. Vazio = topo sem mídia.
  // Coloque os arquivos em img/ e liste aqui, na ordem de exibição:
  //   { tipo: "imagem", arquivo: "img/topo-1.jpg", alt: "Descrição curta" }
  //   { tipo: "video",  arquivo: "img/topo-2.mp4", poster: "img/topo-2.jpg" }
  // Imagens: 1920 px de largura, até 300 KB cada. Vídeos: MP4 sem áudio, até 10 s e 3 MB.
  heroMidia: [],
  heroIntervalo: 6000,                     // ms que cada imagem fica na tela
  // A loja entra depois: ao ativar, o link do menu aponta para /loja/
  loja: { ativa: false, nome: "Bunker Sport Nutrition", url: "loja/" }
};
