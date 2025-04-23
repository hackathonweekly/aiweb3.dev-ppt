// This script injects our slide-template.js into each slide iframe
document.addEventListener('DOMContentLoaded', () => {
    const slideFrame = document.getElementById('slideFrame');
    
    // When a slide loads, inject the template script
    slideFrame.addEventListener('load', () => {
        try {
            // Get the iframe's document
            const iframeDoc = slideFrame.contentDocument || slideFrame.contentWindow.document;
            
            // Create a script element
            const script = iframeDoc.createElement('script');
            script.src = '../js/slide-template.js';
            
            // Append the script to the iframe document's body or head
            if (iframeDoc.body) {
                iframeDoc.body.appendChild(script);
            } else if (iframeDoc.head) {
                iframeDoc.head.appendChild(script);
            }
            
            // Directly apply styles to ensure scrolling works
            if (iframeDoc.querySelector('.slide')) {
                const slideEl = iframeDoc.querySelector('.slide');
                slideEl.style.overflow = 'auto';
                slideEl.style.height = 'auto';
                slideEl.style.minHeight = '100vh';
            }
            
            // Set body to allow scrolling
            if (iframeDoc.body) {
                iframeDoc.body.style.overflow = 'auto';
                iframeDoc.body.style.height = 'auto';
                iframeDoc.body.style.minHeight = '100vh';
            }
            
            // For the slide-content element
            if (iframeDoc.querySelector('.slide-content')) {
                iframeDoc.querySelector('.slide-content').style.paddingTop = '20px';
                iframeDoc.querySelector('.slide-content').style.paddingBottom = '20px';
            }
            
            // Observe height changes and adjust container
            const resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    const height = entry.contentRect.height;
                    window.parent.postMessage({ type: 'resize', height: height }, '*');
                }
            });
            
            if (iframeDoc.body) {
                resizeObserver.observe(iframeDoc.body);
            }
            
        } catch (e) {
            console.error('Error injecting script into iframe:', e);
        }
    });
}); 