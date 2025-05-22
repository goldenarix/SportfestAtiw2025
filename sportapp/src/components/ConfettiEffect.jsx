import React, { useEffect, useRef } from 'react';

const ConfettiEffect = ({ isActive }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const particleCount = 150; // Number of confetti particles
    const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#7FFF00', '#FF4500', '#9370DB']; // Gold, Pink, Cyan, Green, Orange, Purple

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function Particle(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = Math.random() * 6 + 4; // Size between 4 and 10
      this.speedX = Math.random() * 6 - 3; // Horizontal speed
      this.speedY = Math.random() * 2 + 1; // Vertical speed (mostly downwards)
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() < 0.5 ? -1 : 1; // Spin direction
      this.rotationSpeed = Math.random() * 0.1 + 0.02;
      this.opacity = 1;
      this.fadeOutSpeed = Math.random() * 0.01 + 0.005;
    }

    Particle.prototype.update = function() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.angle += this.rotationSpeed * this.spin;
      this.opacity -= this.fadeOutSpeed;

      if (this.y > canvas.height) {
        // Reset particle if it goes off screen (or let it fade)
        // For this effect, we'll let them fade and then clear
      }
    };

    Particle.prototype.draw = function() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity > 0 ? this.opacity : 0;
      // Draw a rectangle, you can also draw circles or other shapes
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5); // Make them slightly rectangular
      ctx.restore();
    };

    function initParticles() {
      particles = [];
      // Create particles near the center top of where the button was clicked (approximated)
      const clickX = canvas.width / 2; 
      const clickY = canvas.height * 0.2; // Assume button is somewhat high

      for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        // Spread them out a bit more
        const initialX = clickX + (Math.random() - 0.5) * 100;
        const initialY = clickY + (Math.random() - 0.5) * 50;
        particles.push(new Particle(initialX, initialY, color));
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Remove faded particles
      particles = particles.filter(p => p.opacity > 0);

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animateParticles);
      }
    }

    initParticles();
    animateParticles();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-initialize on resize could be an option, or adjust existing particles
      // For simplicity, we can re-init if active
      if(isActive) {
        initParticles();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      particles = []; // Clear particles on unmount or when isActive becomes false
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isActive]); // Rerun effect when isActive changes

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Make canvas non-interactive
        zIndex: 9999, // Ensure it's on top
      }}
    />
  );
};

export default ConfettiEffect; 