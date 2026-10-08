# Site Bunker Black Gym

Site estático (HTML, CSS e JS puros, sem build). Abra `index.html` no navegador ou hospede em qualquer serviço de site estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages).

## Onde editar
- `js/config.js`: preços dos planos, taxa de matrícula, WhatsApp, endereço, horários, Instagram. Tudo marcado EXEMPLO precisa do valor real.
- `index.html`: textos das seções.
- `img/`: coloque logo e fotos; troque os blocos `.foto` em "Estrutura" por `<img>`.

## Matrícula
O formulário valida os dados e abre o WhatsApp da academia com a pré-matrícula preenchida. Não há pagamento online nem banco de dados nesta versão.

## Loja (próxima fase)
`css/base.css` tem a identidade compartilhada. A loja entra em `loja/` reaproveitando essa base; ative o link em `config.js` (`loja.ativa`).
