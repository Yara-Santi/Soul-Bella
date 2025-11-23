document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header.details-page-header');

    // Limpa o cabeçalho e o recria com todos os elementos necessários
    if (header) {
        header.innerHTML = ''; // Limpa qualquer conteúdo pré-existente

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
            <a href="index.html" class="back-link">‹ Voltar ao Início</a>
            <h1 class="header-subtitle">Nosso compromisso com o seu Bem-Estar</h1>
        `;
        header.appendChild(centerContainer);

        // 3. Adiciona o espaçador para alinhar tudo corretamente
        const spacer = document.createElement('div');
        spacer.classList.add('header-spacer');
        header.appendChild(spacer);
    }
});