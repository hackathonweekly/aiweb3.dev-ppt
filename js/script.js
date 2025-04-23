// Variables
let currentSlide = 1;
const totalSlides = 20;
const slideFrame = document.getElementById('slideFrame');
const slideIndicator = document.getElementById('slideIndicator');
const sidebar = document.getElementById('sidebar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const menuItems = document.querySelectorAll('.sidebar-menu li');


// '4' 内容没必要，隐藏掉
// All slide identifiers in order
const slideIds = [
    '1', '2', 
    '12-organizers', '12-sponsors', '12-0g',
    '3',  '5', '6', '7',  '9', '10', 
    '11', '8', 'team-formation',
    '14', '14d', '14c', '14b', '14a', '13', '15',
];

// Functions
function loadSlide(slideIndex) {
    let adjustedIndex = slideIndex;
    
    // Ensure slide index is within bounds
    if (adjustedIndex < 0) {
        adjustedIndex = 0;
    } else if (adjustedIndex >= slideIds.length) {
        adjustedIndex = slideIds.length - 1;
    }
    
    // Update current slide
    currentSlide = adjustedIndex;
    
    // Get the slide ID
    const slideId = slideIds[adjustedIndex];
    
    // Load slide in iframe
    slideFrame.src = `slides/slide${slideId}.html`;
    
    // Update slide indicator
    slideIndicator.textContent = `${adjustedIndex + 1} / ${totalSlides}`;
    
    // Update active menu item
    for (const item of menuItems) {
        if (item.getAttribute('data-slide') === slideId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    }
}

function goToNextSlide() {
    if (currentSlide < slideIds.length - 1) {
        loadSlide(currentSlide + 1);
    }
}

function goToPrevSlide() {
    if (currentSlide > 0) {
        loadSlide(currentSlide - 1);
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
    }
}

// Event Listeners
nextBtn.addEventListener('click', goToNextSlide);
prevBtn.addEventListener('click', goToPrevSlide);
openSidebarBtn.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Menu item click
for (const item of menuItems) {
    item.addEventListener('click', () => {
        const slideId = item.getAttribute('data-slide');
        const slideIndex = slideIds.indexOf(slideId);
        if (slideIndex !== -1) {
            loadSlide(slideIndex);
            toggleSidebar();
        }
    });
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        // Right arrow or space key
        goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
        // Left arrow key
        goToPrevSlide();
    } else if (e.key === 'Escape') {
        // Escape key
        if (sidebar.classList.contains('open')) {
            toggleSidebar();
        }
    } else if (e.key === 'f' || e.key === 'F') {
        // F key for fullscreen
        toggleFullscreen();
    }
});

// Handle fullscreen change
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    }
});

// Handle iframe resize messages
window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'resize') {
        // Adjust iframe height if needed
        if (event.data.height > window.innerHeight) {
            slideFrame.style.height = `${event.data.height}px`;
        } else {
            slideFrame.style.height = '100%';
        }
    }
});

// Initial load
loadSlide(0);
