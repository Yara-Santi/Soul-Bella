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
            <h1 id="professional-title" class="header-subtitle">Conheça Nossas Técnicas</h1>
        `;
        header.appendChild(centerContainer);

        // 3. Adiciona o espaçador para alinhar tudo corretamente
        const spacer = document.createElement('div');
        spacer.classList.add('header-spacer');
        header.appendChild(spacer);
    }

    // --- LÓGICA AVANÇADA DO CARROSSEL (COM AUTOPLAY E RANDOMIZAÇÃO) ---

    function initializeCarousel(containerSelector, imagePrefix, totalImages, randomize = false) {
        const carouselContainer = document.querySelector(containerSelector);
        if (!carouselContainer) return; // Se o carrossel não existir na página, para a execução

        const slidesWrapper = carouselContainer.querySelector('.carousel-slides-wrapper');
        slidesWrapper.innerHTML = ''; // Limpa quaisquer imagens de exemplo do HTML

        let imagePaths = [];
        for (let i = 1; i <= totalImages; i++) {
            // Corrigido para usar a extensão .JPG, conforme os arquivos no repositório
            imagePaths.push(`images/${imagePrefix}-${i}.JPG`);
        }

        if (randomize) {
            // Embaralha o array de imagens para uma exibição dinâmica
            for (let i = imagePaths.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [imagePaths[i], imagePaths[j]] = [imagePaths[j], imagePaths[i]];
            }
        }

        // Cria e adiciona os slides ao carrossel
        imagePaths.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = index === 0 ? 'carousel-slide active' : 'carousel-slide';
            slide.innerHTML = `<img src="${src}" alt="Foto ${index + 1} do carrossel">`;
            slidesWrapper.appendChild(slide);
        });

        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const prevBtn = carouselContainer.querySelector('.carousel-prev');
        const nextBtn = carouselContainer.querySelector('.carousel-next');
        let currentIndex = 0;

        function showSlide(index) {
            slides[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
        }
        
        // Inicia a troca automática de slides
        let autoPlay = setInterval(() => showSlide(currentIndex + 1), 5000);
        
        // Adiciona funcionalidade aos botões de navegação
        nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    }

    // Inicializa os carrosséis com a lógica completa
    // Carrossel 1: Imagens com prefixo 'carousel' (ex: carousel-1.webp, carousel-2.webp...)
    initializeCarousel('#carousel-unhas', 'carousel', 20, true);

    // Carrossel 2: Imagens com prefixo 'tecnica' (ex: tecnica-1.webp, tecnica-2.webp...)
    initializeCarousel('#carousel-cilios', 'tecnica', 24, true);
});