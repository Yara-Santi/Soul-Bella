document.addEventListener('DOMContentLoaded', () => {
    // Pega o termo de busca da URL (ex: ?highlight=lash%20lifting)
    const params = new URLSearchParams(window.location.search);
    const highlightTerm = params.get('highlight')?.toLowerCase();

    const ciliosList = document.getElementById('cilios-list');

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Filtra apenas os serviços de cílios/estética
            const ciliosData = data.filter(servico => servico.nome.toLowerCase().includes('cílios'));
            
            ciliosList.innerHTML = ''; // Limpa a mensagem de "carregando"

            ciliosData.forEach(professional => {
                const block = document.createElement('div');
                block.className = 'professional-block';

                // Gera a lista de técnicas
                const techniquesList = professional.tecnicas.map(tech => {
                    // Verifica se esta técnica deve ser destacada
                    const isHighlighted = highlightTerm && tech.nome.toLowerCase().includes(highlightTerm);
                    const highlightClass = isHighlighted ? 'highlight' : '';

                    return `<li class="${highlightClass}">
                                <span>${tech.nome}</span>
                                <span class="technique-price">${tech.valor}</span>
                            </li>`;
                }).join('');

                // Cria os botões de ação
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'actions-container';
                actionsDiv.innerHTML = `
                    <a href="${professional.link}" target="_blank" class="cta-button instagram-btn">
                        <i class="fa-brands fa-instagram"></i> Ver no Instagram
                    </a>
                    <button class="cta-button agendar-btn">
                        <i class="fa-brands fa-whatsapp"></i> Quero Agendar
                    </button>
                `;

                block.innerHTML = `
                    <h2>${professional.nome}</h2>
                    <p>com ${professional.profissional}</p>
                    <h3><i class="fa-solid fa-wand-magic-sparkles"></i> Técnicas Oferecidas</h3>
                    <ul>${techniquesList}</ul>
                `;

                // Adiciona o container com os dois botões ao final do card
                block.appendChild(actionsDiv);

                ciliosList.appendChild(block);

                // Redireciona para a página de agendamento com o nome da profissional na URL
                block.querySelector('.agendar-btn').addEventListener('click', () => {
                    window.location.href = `agendamento.html?professional=${encodeURIComponent(professional.profissional)}`;
                });

                // Se um item foi destacado, rola a tela até ele
                if (highlightTerm) {
                    const highlightedElement = block.querySelector('.highlight');
                    if (highlightedElement) {
                        highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
            ciliosList.innerHTML = '<p>Não foi possível carregar as informações. Tente novamente mais tarde.</p>';
        });
});