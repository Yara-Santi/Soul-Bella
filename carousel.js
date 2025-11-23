function initializeCarousel(containerSelector, imagePrefix, totalImages, randomize = false) {
    const carouselContainer = document.querySelector(containerSelector);
    if (!carouselContainer) return;

    const images = [];
    for (let i = 1; i <= totalImages; i++) {
        images.push(`images/${imagePrefix}-${i}.jpg`);
    }

    // Se a opção 'randomize' for verdadeira, embaralha as imagens
    if (randomize) {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]]; // Troca os elementos de posição
        }
    }

    images.forEach((src, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        if (index === 0) {
            slide.classList.add('active');
        }
        slide.innerHTML = `<img src="${src}" alt="Foto ${index + 1} do carrossel">`;
        // Insere o slide diretamente no container, antes dos botões, que é a estrutura que o CSS espera
        carouselContainer.insertBefore(slide, carouselContainer.querySelector('.carousel-prev'));
    });

    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const prevButton = carouselContainer.querySelector('.carousel-prev');
    const nextButton = carouselContainer.querySelector('.carousel-next');
    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
        slides[currentIndex].classList.remove('active');
        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    function startAutoPlay() {
        // Para o segundo carrossel, podemos variar o tempo para um efeito mais dinâmico
        const intervalTime = containerSelector.includes('-2') ? 6000 : 5000;
        autoPlayInterval = setInterval(nextSlide, intervalTime);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }
    
    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        resetAutoPlay();
    });

    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o primeiro carrossel
    // As imagens devem ser nomeadas: carousel-1.jpg, carousel-2.jpg, ...
    initializeCarousel('.carousel-container-1', 'carousel', 20, true); // O 'true' ativa a ordem aleatória

    // Inicializa o segundo carrossel
    // As imagens devem ser nomeadas: tecnica-1.jpg, tecnica-2.jpg, ...
    initializeCarousel('.carousel-container-2', 'tecnica', 24, true); // O 'true' ativa a ordem aleatória
});
