import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedY: number;
  speedX: number;
  wobbleAmplitude: number;
  wobbleSpeed: number;
  wobbleOffset: number;
  opacity: number;
  type: number; // 0=marigold, 1=rose, 2=jasmine, 3=lotus
  color: string;
}

const PETAL_COLORS = [
  // Marigold oranges/yellows
  '#FF9933', '#FFB347', '#E8870E', '#FFA500', '#F4A460',
  // Rose pinks/reds
  '#FF6B6B', '#E84393', '#FF8A9B', '#D63384', '#FF69B4',
  // Jasmine whites/creams
  '#FFF8DC', '#FFFACD', '#FFEFD5', '#FDF5E6', '#FAF0E6',
  // Lotus pinks
  '#FFB6C1', '#FFC0CB', '#FF91A4', '#DB7093',
];

const FlowerShower = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const PETAL_COUNT = Math.min(35, Math.floor(window.innerWidth / 40));

    const createPetal = (startFromTop = false): Petal => {
      const type = Math.floor(Math.random() * 4);
      const colorOffset = type === 0 ? 0 : type === 1 ? 5 : type === 2 ? 10 : 14;
      const colorRange = type === 0 ? 5 : type === 1 ? 5 : type === 2 ? 5 : 4;
      const color = PETAL_COLORS[colorOffset + Math.floor(Math.random() * colorRange)];

      return {
        x: Math.random() * canvas.width,
        y: startFromTop ? -20 - Math.random() * 100 : Math.random() * canvas.height * -1,
        size: 6 + Math.random() * 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        speedY: 0.3 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.3,
        wobbleAmplitude: 0.5 + Math.random() * 1.5,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleOffset: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.5,
        type,
        color,
      };
    };

    // Initialize petals
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => createPetal(false));

    const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      ctx.globalAlpha = petal.opacity;

      const s = petal.size;

      switch (petal.type) {
        case 0: // Marigold — small rounded blob
          ctx.beginPath();
          ctx.fillStyle = petal.color;
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            ctx.ellipse(
              Math.cos(angle) * s * 0.3,
              Math.sin(angle) * s * 0.3,
              s * 0.35, s * 0.25, angle, 0, Math.PI * 2
            );
          }
          ctx.fill();
          break;

        case 1: // Rose — teardrop petal
          ctx.beginPath();
          ctx.fillStyle = petal.color;
          ctx.moveTo(0, -s * 0.6);
          ctx.bezierCurveTo(s * 0.5, -s * 0.3, s * 0.4, s * 0.4, 0, s * 0.6);
          ctx.bezierCurveTo(-s * 0.4, s * 0.4, -s * 0.5, -s * 0.3, 0, -s * 0.6);
          ctx.fill();
          break;

        case 2: // Jasmine — small star shape
          ctx.beginPath();
          ctx.fillStyle = petal.color;
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const outerX = Math.cos(angle) * s * 0.5;
            const outerY = Math.sin(angle) * s * 0.5;
            const innerAngle = angle + Math.PI / 5;
            const innerX = Math.cos(innerAngle) * s * 0.2;
            const innerY = Math.sin(innerAngle) * s * 0.2;
            if (i === 0) ctx.moveTo(outerX, outerY);
            else ctx.lineTo(outerX, outerY);
            ctx.lineTo(innerX, innerY);
          }
          ctx.closePath();
          ctx.fill();
          // Yellow center
          ctx.beginPath();
          ctx.fillStyle = '#FFD700';
          ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 3: // Lotus — wide petal
          ctx.beginPath();
          ctx.fillStyle = petal.color;
          ctx.moveTo(0, -s * 0.7);
          ctx.bezierCurveTo(s * 0.6, -s * 0.4, s * 0.5, s * 0.3, 0, s * 0.5);
          ctx.bezierCurveTo(-s * 0.5, s * 0.3, -s * 0.6, -s * 0.4, 0, -s * 0.7);
          ctx.fill();
          // Lighter inner line
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 0.5;
          ctx.moveTo(0, -s * 0.5);
          ctx.lineTo(0, s * 0.3);
          ctx.stroke();
          break;
      }

      ctx.restore();
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      petalsRef.current.forEach((petal, i) => {
        // Wobble sideways
        petal.x += petal.speedX + Math.sin(time * petal.wobbleSpeed + petal.wobbleOffset) * petal.wobbleAmplitude;
        petal.y += petal.speedY;
        petal.rotation += petal.rotationSpeed;

        // Reset petal when it falls below screen
        if (petal.y > canvas.height + 20) {
          petalsRef.current[i] = createPetal(true);
        }

        // Wrap horizontally
        if (petal.x > canvas.width + 20) petal.x = -20;
        if (petal.x < -20) petal.x = canvas.width + 20;

        drawPetal(ctx, petal);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default FlowerShower;
