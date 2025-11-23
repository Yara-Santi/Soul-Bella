document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const params = new URLSearchParams(window.location.search);
    const professionalName = params.get('professional');

    const tecnicasListEl = document.getElementById('tecnicas-list');
    const agendamentoForm = document.getElementById('agendamento-form');
    const clienteNomeInput = document.getElementById('cliente-nome');

    // Limpa o cabeçalho e o recria com todos os elementos necessários
    if (header) {
        header.innerHTML = ''; // Limpa qualquer conteúdo pré-existente
        header.className = 'details-page-header'; // Aplica a classe correta

        // 1. Adiciona a LOGO da borboleta
        const logoLink = document.createElement('a');
        logoLink.href = 'index.html';
        logoLink.classList.add('logo-link');
        logoLink.innerHTML = `<img src="images/logo.png" alt="Logo Soul Bella" class="header-logo">`;
        header.appendChild(logoLink);

        // 2. Adiciona o container central com botão "Voltar" e Título
        const centerContainer = document.createElement('div');
        centerContainer.classList.add('details-header-center');
        centerContainer.innerHTML = `
            <a href="javascript:history.back()" class="back-link">‹ Voltar</a>
            <p class="header-subtitle">Quase lá! Preencha os dados para seu agendamento.</p>
        `;
        header.appendChild(centerContainer);

        // 3. Adiciona o espaçador para alinhar tudo corretamente
        const spacer = document.createElement('div');
        spacer.classList.add('header-spacer');
        header.appendChild(spacer);
    }

    if (!professionalName) {
        document.querySelector('.agendamento-container').innerHTML = '<h1>Erro: Profissional não especificada.</h1>';
        return;
    }

    // Função para buscar dados de um arquivo de forma segura
    const fetchData = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Falha ao carregar ${url}`);
            return []; // Retorna um array vazio em caso de erro para não quebrar a aplicação
        }
        return response.json();
    };

    // Carrega os dados de ambos os arquivos em paralelo
    Promise.all([fetchData('data.json'), fetchData('unhas.json')])
        .then(([mainData, unhasData]) => {
            // Junta os dados dos dois arquivos em uma única lista
            const allProfessionals = [...mainData, ...unhasData];
            const professionalData = allProfessionals.find(p => p.profissional === professionalName);

            if (!professionalData) {
                document.querySelector('.agendamento-container').innerHTML = '<h1>Erro: Profissional não encontrada.</h1>';
                return;
            }

            // Preenche o nome da profissional no título do formulário
            document.getElementById('professional-name').textContent = professionalData.profissional;

            // Cria a lista de técnicas com radio buttons
            tecnicasListEl.innerHTML = professionalData.tecnicas.map((tech, index) => `
                <div class="tecnica-option">
                    <!-- Trocado para checkbox para permitir múltiplas seleções -->
                    <input type="checkbox" id="tech-${index}" name="tecnica" value="${tech.nome}" data-price="${tech.valor}">
                    <label for="tech-${index}">
                        <span class="tecnica-name">${tech.nome}</span>
                        <span class="tecnica-price">${tech.valor}</span>
                    </label>
                </div>
            `).join('');

            // Adiciona o evento de submit ao formulário
            agendamentoForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const nomeCliente = clienteNomeInput.value;
                const checkboxesSelecionadas = agendamentoForm.querySelectorAll('input[name="tecnica"]:checked');

                if (checkboxesSelecionadas.length === 0) {
                    alert('Por favor, selecione pelo menos uma técnica.');
                    return;
                }

                let total = 0;
                const nomesDasTecnicas = [];

                checkboxesSelecionadas.forEach(checkbox => {
                    nomesDasTecnicas.push(checkbox.value);

                    // Extrai o primeiro número do preço (ex: "R$ 40 / R$ 90" vira 40)
                    const priceString = checkbox.dataset.price;
                    const priceMatch = priceString.match(/(\d+)/);
                    if (priceMatch) {
                        total += parseInt(priceMatch[0], 10);
                    }
                });

                const listaDeTecnicas = nomesDasTecnicas.join(', ');
                const totalFormatado = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const whatsappProfissional = professionalData.whatsapp;

                const mensagem = `Olá, ${professionalData.profissional}! Meu nome é ${nomeCliente} e gostaria de agendar um horário para os seguintes serviços: *${listaDeTecnicas}*. \n\nValor total: *${totalFormatado}*`;
                const linkWhatsapp = `https://wa.me/${whatsappProfissional}?text=${encodeURIComponent(mensagem)}`;

                window.open(linkWhatsapp, '_blank');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            tecnicasListEl.innerHTML = '<p>Não foi possível carregar as técnicas.</p>';
        });
});