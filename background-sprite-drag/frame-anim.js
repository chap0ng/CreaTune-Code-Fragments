/**
 * Animation functionality for sprite sheet
 * This version is updated to work with transform-based scaling
 */
document.addEventListener('DOMContentLoaded', () => {
    const sprite = document.getElementById('sprite');
    const container = document.getElementById('spriteContainer');
    const instructions = document.querySelector('.instructions');
    const dragHandle = document.getElementById('dragHandle');
    
    // Sprite sheet configuration
    const columns = 3;
    const rows = 4;
    const totalFrames = columns * rows;
    
    let currentFrame = 0;
    let isAnimating = false;
    let animationInterval;
    let animationTimer;
    
    // Animation duration (5 seconds)
    const animationDuration = 5000;
    
    // Function to display a specific frame
    function showFrame(frameIndex) {
        // Calculate which row and column the frame is in
        const row = Math.floor(frameIndex / columns);
        const col = frameIndex % columns;
        
        // For a background-size of 300% 400%, the positions will be:
        // Col 0: 0%, Col 1: 50%, Col 2: 100%
        // Row 0: 0%, Row 1: 33.33%, Row 2: 66.66%, Row 3: 100%
        const xPercent = col * 50;
        const yPercent = row * 33.33;
        
        // Set the background position
        sprite.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
    }
    
    // Function to advance to next frame
    function nextFrame() {
        // Show current frame
        showFrame(currentFrame);
        
        // Move to next frame, loop back to beginning if at the end
        currentFrame = (currentFrame + 1) % totalFrames;
    }
    
    // Start animation
    function startAnimation() {
        // Check if animation is already running
        if (isAnimating) return;
        
        // Check if container is in "menu open" state by checking its transform
        const transform = window.getComputedStyle(container).transform;
        let currentScaleY = 1; // Default scale
        
        if (transform && transform !== 'none') {
            // Extract the scaleY value from the transform matrix
            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
            if (matrix.length >= 6) {
                currentScaleY = parseFloat(matrix[3]);
            }
        }
        
        // If scale is less than 0.9, consider it as "menu open" and don't animate
        if (currentScaleY < 0.9) {
            return;
        }
        
        isAnimating = true;
        currentFrame = 0;
        instructions.style.display = 'none';
        
        // Run at 12fps
        const frameRate = 1000 / 12; // 12 FPS = ~83ms between frames
        animationInterval = setInterval(nextFrame, frameRate);
        
        // Set a timer to stop the animation after 5 seconds
        animationTimer = setTimeout(() => {
            stopAnimation();
        }, animationDuration);
    }
    
    // Stop animation
    function stopAnimation() {
        clearInterval(animationInterval);
        clearTimeout(animationTimer);
        isAnimating = false;
        instructions.style.display = 'block';
        
        // Reset to first frame
        currentFrame = 0;
        showFrame(0);
    }
    
    // Click handler for animation
    container.addEventListener('click', (e) => {
        // Ignore clicks on the drag handle
        if (e.target === dragHandle) {
            return;
        }
        
        startAnimation();
    });
    
    // Initialize animation with first frame
    showFrame(0);
    
    // Export functions for potential use by other scripts
    window.spriteAnimation = {
        start: startAnimation,
        stop: stopAnimation,
        isRunning: () => isAnimating
    };
});