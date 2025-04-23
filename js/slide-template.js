// This script is meant to be included in all slides to ensure proper scrolling behavior
document.addEventListener('DOMContentLoaded', () => {
    // Allow scrolling in the slide
    const slideElement = document.querySelector('.slide');
    if (slideElement) {
        slideElement.style.overflow = 'auto';
        slideElement.style.height = 'auto';
        slideElement.style.minHeight = '100vh';
    }

    // For slides that need to be taller than viewport
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    // Ensure any really tall slides can still be fully viewed
    if (document.body.scrollHeight > window.innerHeight) {
        console.log("Slide content taller than viewport, enabling scroll");
    }
}); 