import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAtom } from 'jotai';
import { currentViewAtom } from './UI';

// Component tạo hiệu ứng particles gộp thành chữ
const TextParticles = ({ text, className, style, delay = 0 }) => {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textElement = textRef.current;
    const container = containerRef.current;
    if (!canvas || !text || !textElement || !container) return;

    const updateCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      return ctx;
    };

    const ctx = updateCanvas();
    
    // Lấy font size từ computed style
    const computedStyle = window.getComputedStyle(textElement);
    const fontSize = parseFloat(computedStyle.fontSize);
    const fontFamily = computedStyle.fontFamily;
    
    // Tạo particles từ text
    const createTextParticles = () => {
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;
      
      const particles = [];
      const particleCount = Math.min(text.length * 20, 600);
      
      // Tạo particles ở vị trí ngẫu nhiên ban đầu
      for (let i = 0; i < particleCount; i++) {
        const centerX = canvas.width / (2 * (window.devicePixelRatio || 1));
        const centerY = canvas.height / (2 * (window.devicePixelRatio || 1));
        
        particles.push({
          startX: Math.random() * canvas.width / (window.devicePixelRatio || 1),
          startY: Math.random() * canvas.height / (window.devicePixelRatio || 1),
          targetX: centerX - (textWidth / 2) + Math.random() * textWidth,
          targetY: centerY + (Math.random() - 0.5) * textHeight * 0.6,
          x: 0,
          y: 0,
          progress: 0,
          size: Math.random() * 2.5 + 1,
          color: Math.random() < 0.4 
            ? { r: 255, g: 80, b: 80 } 
            : Math.random() < 0.7 
            ? { r: 255, g: 200, b: 80 } 
            : { r: 255, g: 150, b: 80 },
          delay: Math.random() * 0.15,
          speed: 0.15 + Math.random() * 0.20
        });
      }
      
      return particles;
    };

    particlesRef.current = createTextParticles();
    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000 - delay;

      if (elapsed < 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentCtx = updateCanvas();
      currentCtx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

      let allComplete = true;

      particlesRef.current.forEach((particle) => {
        if (elapsed < particle.delay) {
          allComplete = false;
          particle.x = particle.startX;
          particle.y = particle.startY;
        } else {
          const adjustedElapsed = elapsed - particle.delay;
          particle.progress = Math.min(adjustedElapsed * particle.speed, 1);
          
          // Easing function (ease-out cubic)
          const easeOut = 1 - Math.pow(1 - particle.progress, 3);
          
          particle.x = particle.startX + (particle.targetX - particle.startX) * easeOut;
          particle.y = particle.startY + (particle.targetY - particle.startY) * easeOut;

          if (particle.progress < 1) allComplete = false;
        }

        // Vẽ particle với glow effect
        const alpha = Math.min(particle.progress * 1.2, 1);
        const glowSize = particle.size * 2;
        
        // Outer glow
        const gradient = currentCtx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        );
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        currentCtx.fillStyle = gradient;
        currentCtx.beginPath();
        currentCtx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        currentCtx.fill();
        
        // Core particle
        currentCtx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`;
        currentCtx.beginPath();
        currentCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        currentCtx.fill();
      });

      // Force complete sau 2 giây để đảm bảo hiển thị chữ
      if (elapsed >= 2 && !isComplete) {
        setIsComplete(true);
      } else if (allComplete && !isComplete) {
        setIsComplete(true);
      }

      if (!isComplete) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      updateCanvas();
      particlesRef.current = createTextParticles();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [text, delay, isComplete]);

  return (
    <div ref={containerRef} className="relative inline-block" style={style}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: isComplete ? 0 : 1, transition: 'opacity 0.8s ease-out' }}
      />
      <span 
        ref={textRef}
        className={className} 
        style={{ 
          opacity: isComplete ? 1 : 0, 
          transition: 'opacity 0.8s ease-in',
          visibility: isComplete ? 'visible' : 'hidden'
        }}
      >
        {text}
      </span>
    </div>
  );
};

const TetMemoriesIntro = () => {
  const [transition, setTransition] = useState(false);
  const [showNextPage, setShowNextPage] = useState(false);
  const [, setCurrentView] = useAtom(currentViewAtom);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  // Optimized particle class for Tet memories
  const createParticle = useMemo(() => {
    return class Particle {
      constructor(index) {
        this.index = index;
        this.reset();
      }

      reset() {
        // Soft depth for gentle motion
        this.z = Math.random() * 1500 + 300;
        
        // Circular gentle flow pattern
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 800 + 200;
        
        this.angle = angle;
        this.radius = radius;
        this.x = Math.cos(angle) * radius;
        this.y = Math.sin(angle) * radius;
        
        // Gentle velocity
        this.speed = 0.3 + Math.random() * 0.4;
        this.size = Math.random() * 3 + 1;
        this.brightness = Math.random() * 0.6 + 0.4;
        
        // Tet colors: red, gold, orange
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
          this.color = { r: 255, g: 80, b: 80 }; // Red
        } else if (colorChoice < 0.7) {
          this.color = { r: 255, g: 200, b: 80 }; // Gold
        } else {
          this.color = { r: 255, g: 150, b: 80 }; // Orange
        }
        
        this.type = Math.random();
        this.floatOffset = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.rotation = Math.random() * Math.PI * 2;
      }

      update(deltaTime, globalTime) {
        // Gentle reverse motion
        const speed = this.speed * deltaTime * 30;
        this.z += speed * 1.2;
        
        // Soft circular motion
        this.angle += this.rotationSpeed;
        
        // Floating motion like memories drifting
        const float = Math.sin(globalTime * 0.0005 + this.floatOffset) * 20;
        this.x = Math.cos(this.angle) * this.radius + float;
        this.y = Math.sin(this.angle) * this.radius + Math.cos(globalTime * 0.0003 + this.floatOffset) * 15;
        
        this.rotation += this.rotationSpeed;
        
        // Reset when too close
        if (this.z > 1800) {
          this.reset();
        }
      }

      draw(ctx, width, height, globalTime) {
        const perspective = 800;
        const scale = perspective / (perspective + this.z);
        
        if (scale <= 0) return;
        
        const x2d = this.x * scale + width / 2;
        const y2d = this.y * scale + height / 2;
        
        // Culling
        if (x2d < -100 || x2d > width + 100 || y2d < -100 || y2d > height + 100) return;
        
        const depth = 1 - (this.z / 1800);
        const size = this.size * scale * 2.5;
        const pulse = 0.85 + Math.sin(globalTime * 0.002 + this.floatOffset) * 0.15;
        const alpha = this.brightness * depth * pulse;
        
        ctx.save();
        ctx.translate(x2d, y2d);
        ctx.rotate(this.rotation);
        
        // Different shapes for Tet elements
        if (this.type < 0.3) {
          // Peach blossom petals
          this.drawPetal(ctx, size, alpha);
        } else if (this.type < 0.6) {
          // Lucky coins
          this.drawCoin(ctx, size, alpha);
        } else if (this.type < 0.85) {
          // Soft light orbs (lanterns)
          this.drawLantern(ctx, size, alpha);
        } else {
          // Gentle sparkles
          this.drawSparkle(ctx, size, alpha);
        }
        
        ctx.restore();
      }

      drawPetal(ctx, size, alpha) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.8})`);
        gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          const x = Math.cos(angle) * size * 1.5;
          const y = Math.sin(angle) * size * 1.5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }

      drawCoin(ctx, size, alpha) {
        // Outer glow
        const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3);
        outerGlow.addColorStop(0, `rgba(255, 215, 0, ${alpha * 0.3})`);
        outerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(0, 0, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin body
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `rgba(255, 220, 100, ${alpha})`);
        gradient.addColorStop(0.7, `rgba(255, 200, 80, ${alpha * 0.9})`);
        gradient.addColorStop(1, `rgba(200, 150, 50, ${alpha * 0.7})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner detail
        ctx.strokeStyle = `rgba(200, 150, 50, ${alpha * 0.6})`;
        ctx.lineWidth = size * 0.1;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawLantern(ctx, size, alpha) {
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 4);
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.6})`);
        gradient.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.4})`);
        gradient.addColorStop(0.6, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      drawSparkle(ctx, size, alpha) {
        ctx.strokeStyle = `rgba(255, 220, 150, ${alpha})`;
        ctx.lineWidth = size * 0.3;
        ctx.lineCap = 'round';
        
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i / 4) * Math.PI * 2);
          ctx.beginPath();
          ctx.moveTo(0, -size * 1.5);
          ctx.lineTo(0, size * 1.5);
          ctx.stroke();
          ctx.restore();
        }
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize particles - Responsive count based on screen size
    const Particle = createParticle;
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    const particleCount = isMobile ? 80 : isTablet ? 120 : 150;
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => new Particle(i));
    
    let lastTime = performance.now();
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      timeRef.current = currentTime - startTime;
      
      // Trigger transition
      if (timeRef.current >= 7000 && !transition) {
        setTransition(true);
        setTimeout(() => setShowNextPage(true), 1000);
      }
      
      const { width, height } = canvas;
      
      // Warm gradient background
      const bgGradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) * 0.7
      );
      bgGradient.addColorStop(0, '#2d1810');
      bgGradient.addColorStop(0.5, '#1a0e08');
      bgGradient.addColorStop(1, '#0a0503');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      // Soft ambient light
      const ambientGlow = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, width * 0.5
      );
      ambientGlow.addColorStop(0, 'rgba(255, 150, 80, 0.08)');
      ambientGlow.addColorStop(0.5, 'rgba(255, 100, 50, 0.04)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);
      
      // Sort and draw particles
      particlesRef.current.sort((a, b) => b.z - a.z);
      
      particlesRef.current.forEach(particle => {
        particle.update(deltaTime, timeRef.current);
        particle.draw(ctx, width, height, timeRef.current);
      });
      
      // Soft central glow (warm memories gathering)
      const centralGlow = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, 200 + Math.sin(timeRef.current * 0.001) * 30
      );
      centralGlow.addColorStop(0, 'rgba(255, 200, 100, 0.12)');
      centralGlow.addColorStop(0.5, 'rgba(255, 150, 80, 0.06)');
      centralGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = centralGlow;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 200 + Math.sin(timeRef.current * 0.001) * 30, 0, Math.PI * 2);
      ctx.fill();
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Reinitialize particles with appropriate count for new screen size
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      const particleCount = isMobile ? 80 : isTablet ? 120 : 150;
      particlesRef.current = Array.from({ length: particleCount }, (_, i) => new Particle(i));
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [transition, createParticle]);

  // Warm landing page
  const NextPage = () => (
    <div className="w-full h-screen bg-gradient-to-br from-amber-900 via-red-900 to-orange-900 flex items-center justify-center overflow-hidden relative">
      {/* Decorative elements - Responsive sizes */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-10 md:left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 border-2 sm:border-3 md:border-4 border-yellow-400 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 sm:bottom-16 sm:right-16 md:bottom-20 md:right-20 w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24 border-2 sm:border-3 md:border-4 border-red-400 rounded-full animate-float-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 sm:border-3 md:border-4 border-orange-400 rounded-full animate-float-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 text-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
        <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-slideUp">
          <div className="inline-block">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-red-300 to-orange-200 tracking-tight mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4 md:px-8"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Tết Đến Xuân Về
            </h1>
            <div className="h-0.5 sm:h-1 md:h-1.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full animate-expand"></div>
          </div>
        </div>
        
        <p 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-yellow-100 font-light animate-slideUp animation-delay-300 leading-relaxed px-4 sm:px-6"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Những kỷ niệm đẹp năm vừa qua
        </p>
        
        <p 
          className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-100/90 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed sm:leading-loose animate-slideUp animation-delay-500 font-light px-4 sm:px-6"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Dòng thời gian lặng lẽ quay ngược, mang theo tiếng cười, yêu thương và những kỷ niệm đẹp đã làm nên một năm trọn vẹn và đáng nhớ.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-6 md:pt-8 animate-slideUp animation-delay-700 px-4">
          <button 
            onClick={() => setCurrentView("book")}
            className="group relative w-full sm:w-auto inline-block px-6 py-3 sm:px-8 sm:py-4 md:px-12 md:py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-base sm:text-lg md:text-xl font-semibold rounded-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-105 active:scale-95"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
              Xem kỷ niệm
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>

      {/* Floating petals - Responsive count */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
            }}
          >
            <div 
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-br from-red-300 to-pink-400 opacity-60"
              style={{
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (showNextPage) {
    return <NextPage />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          opacity: transition ? 0 : 1,
          transform: transition ? 'scale(1.15)' : 'scale(1)',
          filter: transition ? 'blur(15px)' : 'blur(0px)'
        }}
      />
      
      {/* Gentle title overlay */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-out px-4 sm:px-6 md:px-8"
        style={{
          opacity: transition ? 0 : 1,
          transform: transition ? 'scale(0.8) translateY(-50px)' : 'scale(1) translateY(0)'
        }}
      >
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 w-full max-w-6xl mx-auto">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <TextParticles
              text="Nhìn Lại Kỷ Niệm"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-yellow-200 to-orange-300 drop-shadow-2xl tracking-wide pb-2 sm:pb-3 md:pb-4 lg:pb-6 px-2 sm:px-4 md:px-8"
              style={{ fontFamily: "'Dancing Script', cursive", display: 'block' }}
              delay={0.5}
            />
            <div className="flex justify-center gap-2 sm:gap-3">
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent rounded-full animate-expandWidth"></div>
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full animate-expandWidth" style={{animationDelay: '0.2s'}}></div>
              <div className="h-0.5 sm:h-1 w-12 sm:w-16 md:w-20 lg:w-24 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full animate-expandWidth" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
          <TextParticles
            text="Quay ngược thời gian, nhìn lại hành trình đẹp đẽ"
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-yellow-100 font-light tracking-wider px-2 sm:px-4 md:px-8"
            style={{ fontFamily: "'Dancing Script', cursive", display: 'block' }}
            delay={1.2}
          />
        </div>
      </div>
      
      {/* Warm fade transition */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-orange-200 via-red-200 to-yellow-200 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: transition ? 0.4 : 0 }}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expandWidth {
          0% { width: 0; opacity: 0; }
          50% { opacity: 1; }
          100% { width: 100%; opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expand {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes swing {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 2s ease-out forwards;
        }
        
        .animate-expandWidth {
          animation: expandWidth 1.8s ease-out forwards;
          width: 0;
          max-width: 6rem;
        }
        
        @media (min-width: 640px) {
          .animate-expandWidth {
            max-width: 4rem;
          }
        }
        
        @media (min-width: 768px) {
          .animate-expandWidth {
            max-width: 5rem;
          }
        }
        
        @media (min-width: 1024px) {
          .animate-expandWidth {
            max-width: 6rem;
          }
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
          opacity: 0;
        }
        
        .animate-slideUp {
          animation: slideUp 1.2s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
          opacity: 0;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
          opacity: 0;
        }
        
        .animate-expand {
          animation: expand 1.5s ease-out forwards;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
        }
        
        .animate-fall {
          animation: fall linear infinite;
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default TetMemoriesIntro;