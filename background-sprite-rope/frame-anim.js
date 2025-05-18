document.addEventListener('DOMContentLoaded', () => {
    const sprite = document.getElementById('sprite');
    const container = document.getElementById('spriteContainer');
    const instructions = document.querySelector('.instructions');
    
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
        if (isAnimating) return;
        
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
    
    // Add click event listener to start animation
    container.addEventListener('click', startAnimation);
    
    // Show first frame initially
    showFrame(0);
});