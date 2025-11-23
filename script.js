let cardContainer = document.querySelector(".card-container");
let dados = [];

// Função de busca atualizada
function handleSearch() {
    const termoBusca = searchInput.value.toLowerCase();
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Limpa resultados anteriores

    if (!termoBusca) {
        searchResultsContainer.style.display = 'none';
        return;
    }

    const resultados = [];

    // 1. Busca por técnicas específicas
    dados.forEach(servico => {
        servico.tecnicas.forEach(tecnica => {
            if (tecnica.nome.toLowerCase().includes(termoBusca)) {
                // Adiciona o link para a página de valores (unhas.html ou cilios.html)
                let paginaValores = '';
                if (servico.nome.toLowerCase().includes('unhas')) paginaValores = 'unhas.html';
                if (servico.nome.toLowerCase().includes('cílios')) paginaValores = 'cilios.html';

                if (paginaValores) {
                    resultados.push({
                        texto: `Ver valores para: <strong>${tecnica.nome}</strong>`,
                        link: `${paginaValores}?highlight=${encodeURIComponent(tecnica.nome)}`
                    });
                }

                // Adiciona o link para a página de detalhes da técnica (tecnicas.html)
                resultados.push({
                    texto: `Saber mais sobre: <strong>${tecnica.nome}</strong>`,
                    link: `tecnicas.html?highlight=${encodeURIComponent(tecnica.nome)}`
                });
            }
        });
    });

    // Remove duplicados (caso uma técnica apareça em mais de um lugar com o mesmo link)
    const uniqueResults = Array.from(new Map(resultados.map(item => [item.link, item])).values());

    if (uniqueResults.length > 0) {
        searchResultsContainer.innerHTML = uniqueResults.map(res =>
            `<a href="${res.link}" class="search-result-item">${res.texto}</a>`
        ).join('');
        searchResultsContainer.style.display = 'block';
    } else {
        searchResultsContainer.innerHTML = '<p class="search-result-item">Nenhum resultado encontrado.</p>';
        searchResultsContainer.style.display = 'block';
    }
}

async function iniciarBusca() {
    try {
        let resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error('Erro ao carregar os dados: ' + resposta.statusText);
        }
        dados = await resposta.json();
        // Apenas carrega os dados, a renderização agora é estática no HTML inicial
        // A função renderizarCards agora usa a variável global 'dados'
        renderizarCards();
    } catch (error) {
        console.error('Não foi possível buscar o arquivo JSON:', error);
        cardContainer.innerHTML = '<p>Erro ao carregar as informações.</p>';
    }
}

document.addEventListener('DOMContentLoaded', iniciarBusca);

// Adiciona um listener para o evento de carregar a página
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('botao-busca');

// Adiciona listeners para o input e botão de busca
if (searchInput && searchButton) {
    // Ação ao clicar no botão
    searchButton.addEventListener('click', handleSearch);

    // Ação ao pressionar "Enter" no campo de busca
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

function renderizarCards() {
    cardContainer.innerHTML = ""; // Limpa o container
    const nomesRenderizados = new Set(); // Conjunto para rastrear nomes que já foram adicionados

    // Itera sobre TODOS os dados do arquivo data.json
    for (const dado of dados) {
        // Se o nome do serviço ainda NÃO foi renderizado, cria o card
        if (!nomesRenderizados.has(dado.nome)) {
            const article = document.createElement("article");
            article.classList.add("card");

            // Adiciona o nome ao conjunto para não criar de novo
            nomesRenderizados.add(dado.nome);

            // Define a página de destino do link
            let page = '';
            const nomeLowerCase = dado.nome.toLowerCase();

            if (nomeLowerCase.includes('unhas')) page = 'unhas.html';
            else if (nomeLowerCase.includes('cílios')) page = 'cilios.html';
            else if (nomeLowerCase.includes('técnicas')) page = 'tecnicas.html';
            else if (nomeLowerCase.includes('políticas')) page = 'politicas.html';
            else if (nomeLowerCase.includes('dicas')) page = 'dicas.html';
            else if (nomeLowerCase.includes('instagram')) page = dado.link;

            const target = nomeLowerCase.includes('instagram') ? 'target="_blank"' : '';
            article.innerHTML = `<a href="${page}" ${target}>${dado.nome}</a>`;
            cardContainer.appendChild(article);
        }
    }
}

// Função para exibir a página de detalhes de um serviço
function showDetailsPage(serviceName) {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const body = document.querySelector('body');

    // Limpa o conteúdo atual e ajusta as classes
    header.innerHTML = '';
    main.innerHTML = '';
    body.className = ''; // Remove a classe 'home-page' do body
    header.className = 'details-page-header'; // Garante a classe correta no header

    // Adiciona a logo que volta para a home
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.classList.add('logo-link');
    logoLink.innerHTML = `<img src="images/logo-soulbella-branca.webp" alt="Logo Soul Bella" class="header-logo">`;
    header.appendChild(logoLink);

    // Adiciona o container central com botão de voltar e subtítulo
    const centerContainer = document.createElement('div');
    centerContainer.classList.add('details-header-center');
    centerContainer.innerHTML = `
        <a href="index.html" class="back-link">‹ Voltar</a>
        <h2 class="header-subtitle">${serviceName}</h2>
    `;
    header.appendChild(centerContainer);

    // Adiciona o espaçador para alinhar
    const spacer = document.createElement('div');
    spacer.classList.add('header-spacer');
    header.appendChild(spacer);

    // Carrega o conteúdo específico da página de detalhes
    // (Esta parte precisaria ser implementada para carregar os cards de profissionais, etc.)
    main.innerHTML = `<div class="details-container"></div>`;
}

// Função para exibir o formulário de agendamento
function showAgendamentoForm(profissionalNome) {
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const body = document.querySelector('body');

    // Limpa o conteúdo e ajusta as classes
    header.innerHTML = '';
    main.innerHTML = '';
    body.className = '';
    header.className = 'details-page-header';

    // Adiciona a logo da borboleta
    const logoLink = document.createElement('a');
    logoLink.href = 'index.html';
    logoLink.classList.add('logo-link');
    logoLink.innerHTML = `<img src="images/logo-soulbella-branca.webp" alt="Logo Soul Bella" class="header-logo">`;
    header.appendChild(logoLink);

    // Adiciona o container central
    const centerContainer = document.createElement('div');
    centerContainer.classList.add('details-header-center');
    centerContainer.innerHTML = `
        <a href="javascript:history.back()" class="back-link">‹ Voltar</a>
        <h2 class="header-subtitle">Agendamento com ${profissionalNome}</h2>
    `;
    header.appendChild(centerContainer);

    // Adiciona o espaçador
    const spacer = document.createElement('div');
    spacer.classList.add('header-spacer');
    header.appendChild(spacer);

    // Cria o container do formulário e o adiciona ao main
    const formContainer = document.createElement('div');
    formContainer.classList.add('agendamento-container');
    main.appendChild(formContainer);

    // (O restante da lógica do formulário de 'agendamento.js' seria movido para cá)
}
