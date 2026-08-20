// Base de dados de Produtos
const produtos = [
    { id: 1, nome: "Caneca Luppyvara e Capizoro", preco: 49.90, imagem: "imagens/caneca.cappiece.webp", categoria: "canecas" },
    { id: 2, nome: "Caneca Gengar Pokemon", preco: 54.60, imagem: "imagens/pokemon.png", categoria: "canecas" },
    { id: 3, nome: "Caneca Vegeta", preco: 59.95, imagem: "imagens/caneca_vegeta.jpeg", categoria: "canecas" },
    { id: 4, nome: "Caneca Baby Yoda", preco: 22.23, imagem: "imagens/babycoffee.jpeg", categoria: "canecas" },
    { id: 5, nome: "Action Figure Roger", preco: 199.90, imagem: "imagens/roger.png", categoria: "ac" },
    { id: 6, nome: "Action Figure Sukuna Era Heian", preco: 103.19, imagem: "imagens/sukuna era hein.webp", categoria: "ac" },
    { id: 7, nome: "Action Figure Nefetpitou", preco: 216.70, imagem: "imagens/nefetpitou.jfif.jpeg", categoria: "ac" },
    { id: 8, nome: "Action Figure Irmão do Jorel", preco: 99.99, imagem: "imagens/ac-do-irmão-do-Jorel.jpg", categoria: "ac" },
    { id: 9, nome: "Cosplay Tanjiro Demon Slayer", preco: 415.84, imagem: "imagens/imagem.png", categoria: "roupas" },
    { id: 10, nome: "Cosplay Frieren", preco: 224.05, imagem: "imagens/frieren cosplay.jpeg", categoria: "roupas" },
    { id: 11, nome: "Cosplay Spy X Family Anya", preco: 314.90, imagem: "imagens/anya-cosplay.webp", categoria: "roupas" },
    { id: 12, nome: "Manto da Akatsuki", preco: 199.99, imagem: "imagens/akatsuki.webp", categoria: "roupas" },
    { id: 13, nome: "Quadro Luffy", preco: 40.99, imagem: "imagens/quadro.luffy.jpeg", categoria: "quadros" },
    { id: 14, nome: "Quadro Escanor", preco: 99.18, imagem: "imagens/Escanor.jpeg", categoria: "quadros" },
    { id: 15, nome: "Demon Slayer Mangá Vol. 1", preco: 34.90, imagem: "imagens/demon-slayer.jpeg", categoria: "mangas" },
    { id: 16, nome: "Jujutsu Kaisen Mangá Vol. 1", preco: 27.90, imagem: "imagens/Jujutsu Kaisen vol 1.jpeg", categoria: "mangas" },
    { id: 17, nome: "Re:Zero Vol. 1", preco: 42.90, imagem: "imagens/re_zero.jpeg", categoria: "ln" },
    { id: 18, nome: "Aventuras Marvel #1", preco: 9.90, imagem: "imagens/miranha.webp", categoria: "hq" },
    { id: 19, nome: "Super Smash Bros", preco: 367.03, imagem: "imagens/ssb.jpeg", categoria: "games" },
    { id: 20, nome: "Funko Pop James Minions", preco: 115.10, imagem: "imagens/minions.webp", categoria: "colecionaveis" }
];

// ESTADO DA APLICAÇÃO (SPA)
let estado = {
    telaAtual: 'home', // 'home' | 'carrinho' | 'cadastro'
    categoriaFiltro: 'todos',
    descontoPercentual: 0,
    freteValor: 0
};

// PERSISTÊNCIA NO LOCALSTORAGE
function getCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho_hub")) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho_hub", JSON.stringify(carrinho));
    atualizarBadge();
}

function atualizarBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (badge) {
        const carrinho = getCarrinho();
        const total = carrinho.reduce((acc, item) => acc + item.qtd, 0);
        badge.textContent = total;
    }
}

// ROUTER E RENDERIZADOR DE TELAS
function navegaPara(tela) {
    estado.telaAtual = tela;
    render();
}

function render() {
    const main = document.getElementById('app');
    if (!main) return;

    atualizarBadge();

    if (estado.telaAtual === 'home') {
        renderHome(main);
    } else if (estado.telaAtual === 'carrinho') {
        renderCarrinho(main);
    } else if (estado.telaAtual === 'cadastro') {
        renderCadastro(main);
    }
}

// 1. TELA DA LOJA / VITRINE
function renderHome(container) {
    const listaFiltrada = estado.categoriaFiltro === 'todos' 
        ? produtos 
        : produtos.filter(p => p.categoria === estado.categoriaFiltro);

    container.innerHTML = `
        <div class="cards">
            ${listaFiltrada.map(p => `
                <div class="card">
                    <img src="${p.imagem}" class="imagem_produto" alt="${p.nome}">
                    <h3>${p.nome}</h3>
                    <p>R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
                    <button class="btn-comprar" data-id="${p.id}">Comprar</button>
                </div>
            `).join('')}
        </div>
    `;

    container.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const prod = produtos.find(p => p.id === id);
            
            let carrinho = getCarrinho();
            const itemExistente = carrinho.find(i => i.id === id);

            if (itemExistente) {
                itemExistente.qtd += 1;
            } else {
                carrinho.push({ ...prod, qtd: 1 });
            }

            salvarCarrinho(carrinho);
            alert(`${prod.nome} foi adicionado ao carrinho!`);
        });
    });
}

// 2. TELA DO CARRINHO DE COMPRAS
function renderCarrinho(container) {
    const carrinho = getCarrinho();
    const META_FRETE_GRATIS = 400;

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio-box">
                <h2>Seu carrinho está vazio! 😢</h2>
                <p>Aproveite nossas ofertas e adicione seus colecionáveis favoritos.</p>
                <button class="btn" id="btnVoltarLoja" style="margin: 20px auto 0 auto;">Ver Produtos</button>
            </div>
        `;
        document.getElementById('btnVoltarLoja').addEventListener('click', () => navegaPara('home'));
        return;
    }

    let subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
    const valorDesconto = subtotal * estado.descontoPercentual;
    const totalFinal = Math.max(0, subtotal - valorDesconto + estado.freteValor);

    const faltamFrete = META_FRETE_GRATIS - subtotal;
    const pctFrete = Math.min(100, (subtotal / META_FRETE_GRATIS) * 100);

    container.innerHTML = `
        <div class="carrinho-page">
            <div class="carrinho-header">
                <h1>Meu Carrinho de Compras</h1>
            </div>

            <div class="frete-progresso-card">
                <p>
                    ${subtotal >= META_FRETE_GRATIS 
                        ? '🎉 Você ganhou <strong>FRETE GRÁTIS</strong>!' 
                        : `🚚 Falta apenas <strong>R$ ${faltamFrete.toFixed(2).replace('.', ',')}</strong> para Frete Grátis!`}
                </p>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pctFrete}%;"></div>
                </div>
            </div>

            <div class="carrinho-grid">
                <section class="carrinho-itens-card">
                    ${carrinho.map(item => `
                        <div class="carrinho-item">
                            <img src="${item.imagem}" alt="${item.nome}">
                            <div class="item-detalhes">
                                <h4>${item.nome}</h4>
                                <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div class="item-qtd-control">
                                <button class="btn-qtd qtd-menos" data-id="${item.id}">-</button>
                                <span>${item.qtd}</span>
                                <button class="btn-qtd qtd-mais" data-id="${item.id}">+</button>
                            </div>
                            <button class="btn-remover-item" data-id="${item.id}">🗑️</button>
                        </div>
                    `).join('')}
                </section>

                <aside class="resumo-card">
                    <h2>Resumo do Pedido</h2>
                    
                    <div class="box-calculo">
                        <label for="cupomInput">Cupom de Desconto</label>
                        <div class="input-btn-group">
                            <input type="text" id="cupomInput" placeholder="Ex: GEEK10">
                            <button type="button" id="btnCupom">Aplicar</button>
                        </div>
                        <small id="cupomInfo"></small>
                    </div>

                    <div class="box-calculo">
                        <label for="cepInput">Calcular Frete (CEP)</label>
                        <div class="input-btn-group">
                            <input type="text" id="cepInput" placeholder="00000-000" maxlength="9">
                            <button type="button" id="btnFrete">Calcular</button>
                        </div>
                        <small id="freteInfo"></small>
                    </div>

                    <div class="resumo-detalhes">
                        <div class="resumo-linha">
                            <span>Subtotal:</span>
                            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        ${estado.descontoPercentual > 0 ? `
                            <div class="resumo-linha" style="color: #00e676;">
                                <span>Desconto:</span>
                                <span>- R$ ${valorDesconto.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ` : ''}
                        <div class="resumo-linha">
                            <span>Frete:</span>
                            <span>R$ ${estado.freteValor.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="resumo-linha linha-total">
                            <span>Total:</span>
                            <span>R$ ${totalFinal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="pix-desconto">
                            ⚡ Ou <strong>R$ ${(totalFinal * 0.95).toFixed(2).replace('.', ',')}</strong> no PIX (5% OFF extra)
                        </div>
                    </div>

                    <button class="btn-finalizar" id="btnFinalizar">Finalizar Compra</button>
                </aside>
            </div>
        </div>
    `;

    // Eventos do Carrinho
    container.querySelectorAll('.qtd-mais').forEach(b => b.addEventListener('click', (e) => {
        let c = getCarrinho().map(i => i.id === parseInt(e.target.dataset.id) ? {...i, qtd: i.qtd + 1} : i);
        salvarCarrinho(c); render();
    }));

    container.querySelectorAll('.qtd-menos').forEach(b => b.addEventListener('click', (e) => {
        let c = getCarrinho().map(i => i.id === parseInt(e.target.dataset.id) ? {...i, qtd: Math.max(1, i.qtd - 1)} : i);
        salvarCarrinho(c); render();
    }));

    container.querySelectorAll('.btn-remover-item').forEach(b => b.addEventListener('click', (e) => {
        let c = getCarrinho().filter(i => i.id !== parseInt(e.target.dataset.id));
        salvarCarrinho(c); render();
    }));

    document.getElementById('btnCupom').addEventListener('click', () => {
        const val = document.getElementById('cupomInput').value.trim().toUpperCase();
        if (val === 'GEEK10') {
            estado.descontoPercentual = 0.10;
        } else {
            alert('Cupom inválido! Tente GEEK10');
        }
        render();
    });

    document.getElementById('btnFrete').addEventListener('click', () => {
        const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
        if (cep.length === 8) {
            estado.freteValor = 15.00;
        } else {
            alert('CEP Inválido!');
        }
        render();
    });

    document.getElementById('btnFinalizar').addEventListener('click', () => {
        alert('Pedido realizado com sucesso!');
        salvarCarrinho([]);
        navegaPara('home');
    });
}

// 3. TELA DE CADASTRO
function renderCadastro(container) {
    container.innerHTML = `
        <div class="cadastro-wrapper">
            <div class="cadastro-box">
                <h1>Crie sua Conta</h1>
                <h2>Junte-se ao Collector's Hub</h2>

                <form id="cadastroForm">
                    <div class="campo">
                        <label for="nome">Nome Completo</label>
                        <input type="text" id="nome" placeholder="Digite seu nome" required>
                    </div>

                    <div class="campo">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" placeholder="seuemail@exemplo.com" required>
                    </div>

                    <div class="campo">
                        <label for="senha">Senha</label>
                        <input type="password" id="senha" placeholder="••••••••" required minlength="6">
                    </div>

                    <div class="campo">
                        <label for="confirmarSenha">Confirmar Senha</label>
                        <input type="password" id="confirmarSenha" placeholder="••••••••" required>
                    </div>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('cadastroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const s1 = document.getElementById('senha').value;
        const s2 = document.getElementById('confirmarSenha').value;

        if (s1 !== s2) {
            alert('As senhas não coincidem!');
            return;
        }

        alert('Cadastro realizado com sucesso!');
        navegaPara('home');
    });
}

// INICIALIZAÇÃO DE EVENTOS GLOBAIS
document.addEventListener('DOMContentLoaded', () => {
    // Rotas pelo Header
    document.getElementById('logoLink').addEventListener('click', (e) => { e.preventDefault(); navegaPara('home'); });
    document.getElementById('btnIrCarrinho').addEventListener('click', () => navegaPara('carrinho'));
    document.getElementById('btnIrCadastro').addEventListener('click', () => navegaPara('cadastro'));

    // Sidebar
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');

    const fecharMenu = () => {
        sidebar.classList.remove('active');
        menuOverlay.classList.remove('active');
    };

    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        menuOverlay.classList.add('active');
    });

    menuClose.addEventListener('click', fecharMenu);
    menuOverlay.addEventListener('click', fecharMenu);

    // Categorias no Sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            estado.categoriaFiltro = link.getAttribute('data-categoria');
            fecharMenu();
            navegaPara('home');
        });
    });

    // Render Inicial
    render();
});