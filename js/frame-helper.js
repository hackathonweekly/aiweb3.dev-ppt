// Helper script to ensure iframe content scrolls properly
document.addEventListener('DOMContentLoaded', function() {
    // Make sure the slide content is scrollable
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    
    // If this page is in an iframe, let the parent know about content size changes
    if (window.parent && window !== window.parent) {
        // Send height information to parent
        function updateParentOnResize() {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'resize', height: height }, '*');
        }
        
        // Call initially and on any window resize
        updateParentOnResize();
        window.addEventListener('resize', updateParentOnResize);
    }
}); 