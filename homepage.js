document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('whats-new-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot', 'w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'dark:bg-gray-600');
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(n) {
        // Hide current slide and deactivate dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('bg-primary');
        dots[currentSlide].classList.add('bg-gray-300', 'dark:bg-gray-600');

        // Calculate next slide index
        currentSlide = (n + slides.length) % slides.length;

        // Show new slide and activate dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('bg-primary');
        dots[currentSlide].classList.remove('bg-gray-300', 'dark:bg-gray-600');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Auto-play functionality
    let slideTimer = setInterval(nextSlide, slideInterval);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });

    // Resume on leave
    carousel.addEventListener('mouseleave', () => {
        slideTimer = setInterval(nextSlide, slideInterval);
    });

    // Initialize first slide
    goToSlide(0);
});
