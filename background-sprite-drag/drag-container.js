/**
 * Drag container functionality
 * Handles container resizing independent of sprite animation
 */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('spriteContainer');
    const dragHandle = document.getElementById('dragHandle');
    
    let isDragging = false;
    let isMenuOpen = false;
    let startY = 0;
    let startScaleY = 1;
    
    // Original container dimensions
    let originalHeight;
    let minScale = 0.5; // 50% scale for minimum height
    
    // Setup drag functionality
    function initDrag() {
        // Store original dimensions
        const rect = container.getBoundingClientRect();
        originalHeight = rect.height;
        
        // Mouse down event on drag handle
        dragHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientY);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            
            // Stop animation if running and we have access to the animation API
            if (window.spriteAnimation && window.spriteAnimation.isRunning()) {
                window.spriteAnimation.stop();
            }
        });
        
        // Touch events for mobile
        dragHandle.addEventListener('touchstart', (e) => {
            startDrag(e.touches[0].clientY);
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
            
            // Stop animation if running and we have access to the animation API
            if (window.spriteAnimation && window.spriteAnimation.isRunning()) {
                window.spriteAnimation.stop();
            }
        });
    }
    
    // Initialize drag with starting position
    function startDrag(clientY) {
        isDragging = true;
        startY = clientY;
        
        // Get current scale from transform matrix or default to 1
        const transform = window.getComputedStyle(container).transform;
        startScaleY = 1; // Default scale
        
        if (transform && transform !== 'none') {
            // Extract the scaleY value from the transform matrix
            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            if (matrix.length >= 6) {
                startScaleY = parseFloat(matrix[3]);
            }
        }
    }
    
    // Handle mouse move for dragging
    function onMouseMove(e) {
        if (!isDragging) return;
        
        // Calculate how much the mouse has moved
        const deltaY = e.clientY - startY;
        const deltaRatio = deltaY / originalHeight;
        
        // Calculate new scaleY factor
        let newScaleY = startScaleY - deltaRatio;
        
        // Apply constraints (min 50%, max 100% scale)
        newScaleY = Math.max(newScaleY, minScale);
        newScaleY = Math.min(newScaleY, 1);
        
        // Apply the new scale (this keeps the bottom fixed)
        container.style.transform = `scaleY(${newScaleY})`;
        
        // Update menu state
        isMenuOpen = newScaleY < 0.75;
    }
    
    // Handle touch move for mobile dragging
    function onTouchMove(e) {
        if (!isDragging) return;
        
        // Calculate how much the touch has moved
        const deltaY = e.touches[0].clientY - startY;
        const deltaRatio = deltaY / originalHeight;
        
        // Calculate new scaleY factor
        let newScaleY = startScaleY - deltaRatio;
        
        // Apply constraints (min 50%, max 100% scale)
        newScaleY = Math.max(newScaleY, minScale);
        newScaleY = Math.min(newScaleY, 1);
        
        // Apply the new scale (this keeps the bottom fixed)
        container.style.transform = `scaleY(${newScaleY})`;
        
        // Update menu state
        isMenuOpen = newScaleY < 0.75;
    }
    
    // Handle mouse up
    function onMouseUp() {
        if (!isDragging) return;
        
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        // Snap to either open or closed position
        snapToPosition();
    }
    
    // Handle touch end for mobile
    function onTouchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
        
        // Snap to either open or closed position
        snapToPosition();
    }
    
    // Snap to either open or closed position
    function snapToPosition() {
        // Get current scale from transform matrix
        const transform = window.getComputedStyle(container).transform;
        let currentScaleY = 1; // Default scale
        
        if (transform && transform !== 'none') {
            // Extract the scaleY value from the transform matrix
            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            if (matrix.length >= 6) {
                currentScaleY = parseFloat(matrix[3]);
            }
        }
        
        // Determine if we should snap to open or closed
        if (currentScaleY < 0.75) {
            // Snap to 50% height (open menu)
            container.style.transform = `scaleY(${minScale})`;
            isMenuOpen = true;
        } else {
            // Snap to original height (closed menu)
            container.style.transform = 'scaleY(1)';
            isMenuOpen = false;
        }
    }
    
    // Initialize drag functionality
    initDrag();
    
    // Export functions for potential use by other scripts
    window.dragContainer = {
        isMenuOpen: () => isMenuOpen,
        reset: () => {
            container.style.transform = 'scaleY(1)';
            isMenuOpen = false;
        }
    };
});