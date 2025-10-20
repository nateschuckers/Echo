document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('whats-new-carousel');
    if (!carousel) return;

    const slidesContainer = carousel.querySelector('.carousel-slides');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const slideCount = slides.length;
    let currentIndex = 0;
    let slideInterval;

    if (slideCount === 0) return;

    // --- Functions ---

    // Updates the carousel display to show the correct slide and active dot
    function updateCarousel() {
        // Move the slide container
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update the active state of dots
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Navigates to a specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    // Starts the automatic slide transition
    function startCarousel() {
        // Clear any existing interval to prevent multiple timers
        stopCarousel(); 
        slideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slideCount;
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }

    // Stops the automatic slide transition
    function stopCarousel() {
        clearInterval(slideInterval);
    }


    // --- Initialization ---

    // Create navigation dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => {
            goToSlide(i);
            // Reset interval after manual navigation
            startCarousel(); 
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    // Add event listeners to pause the carousel on hover
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // Initial setup
    updateCarousel();
    startCarousel();
});
