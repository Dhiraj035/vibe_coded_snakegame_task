import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

type Point = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'>('START');

  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 15, y: 5 },
    lastTick: 0,
    particles: [] as Particle[],
    shake: 0,
    score: 0
  });

  const generateFood = (snake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!snake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  };

  const spawnParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x: x * CELL_SIZE + CELL_SIZE / 2,
        y: y * CELL_SIZE + CELL_SIZE / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1,
        maxLife: 20 + Math.random() * 20,
        color
      });
    }
    stateRef.current.particles.push(...newParticles);
  };

  const reset = () => {
    stateRef.current = {
      snake: [{ x: 10, y: 10 }],
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      food: generateFood([{ x: 10, y: 10 }]),
      lastTick: performance.now(),
      particles: [],
      shake: 0,
      score: 0
    };
    setScore(0);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (e.key === ' ') {
        setGameState(prev => {
          if (prev === 'PLAYING') return 'PAUSED';
          if (prev === 'PAUSED') return 'PLAYING';
          if (prev === 'START' || prev === 'GAMEOVER') {
            reset();
            return 'PLAYING';
          }
          return prev;
        });
        return;
      }

      const { dir } = stateRef.current;
      if (gameState !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (dir.y !== 1) stateRef.current.nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown': case 's': case 'S': if (dir.y !== -1) stateRef.current.nextDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': case 'a': case 'A': if (dir.x !== 1) stateRef.current.nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': case 'd': case 'D': if (dir.x !== -1) stateRef.current.nextDir = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    let animationFrameId: number;
    
    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);
      
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const state = stateRef.current;

      // Logic Tick
      if (gameState === 'PLAYING') {
        const tickRate = Math.max(40, 100 - Math.floor(state.score / 50) * 5);
        if (time - state.lastTick > tickRate) {
          state.lastTick = time;
          state.dir = state.nextDir;
          
          const head = state.snake[0];
          const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };

          // Collisions
          if (
            newHead.x < 0 || newHead.x >= GRID_SIZE ||
            newHead.y < 0 || newHead.y >= GRID_SIZE ||
            state.snake.some(s => s.x === newHead.x && s.y === newHead.y)
          ) {
            setGameState('GAMEOVER');
            state.shake = 25;
            spawnParticles(head.x, head.y, '#ff00ff');
          } else {
            state.snake.unshift(newHead);
            if (newHead.x === state.food.x && newHead.y === state.food.y) {
              state.score += 10;
              setScore(state.score);
              setHighScore(prev => Math.max(prev, state.score));
              state.food = generateFood(state.snake);
              state.shake = 8;
              spawnParticles(newHead.x, newHead.y, '#00ffff');
            } else {
              state.snake.pop();
            }
          }
        }
      }

      // Update Particles & Shake
      if (state.shake > 0) state.shake *= 0.85;
      if (state.shake < 0.5) state.shake = 0;

      state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
      });
      state.particles = state.particles.filter(p => p.life > 0);

      // Draw Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      ctx.save();
      if (state.shake > 0) {
        const dx = (Math.random() - 0.5) * state.shake;
        const dy = (Math.random() - 0.5) * state.shake;
        ctx.translate(dx, dy);
      }

      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for(let i=0; i<=GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i*CELL_SIZE, 0); ctx.lineTo(i*CELL_SIZE, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i*CELL_SIZE); ctx.lineTo(CANVAS_SIZE, i*CELL_SIZE); ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.fillRect(state.food.x * CELL_SIZE + 2, state.food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

      // Draw Snake
      state.snake.forEach((segment, i) => {
        const intensity = Math.max(0.2, 1 - (i / state.snake.length));
        ctx.fillStyle = `rgba(0, 255, 255, ${intensity})`;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = i === 0 ? 20 : 10 * intensity;
        ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      });

      // Draw Particles
      state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.globalAlpha = 1;
      });

      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center font-pixel w-full">
      <div className="w-full max-w-[400px] flex justify-between items-end mb-2">
        <div className="flex flex-col">
          <span className="text-sm text-magenta-500 tracking-widest">SCORE_</span>
          <span className="text-4xl text-cyan-500">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-magenta-500 tracking-widest">HIGH_</span>
          <span className="text-2xl text-cyan-500">{highScore}</span>
        </div>
      </div>

      <div className="relative border-4 border-cyan-500 shadow-[8px_8px_0px_#ff00ff] bg-black screen-tear">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full max-w-[400px] aspect-square block"
        />
        
        {gameState !== 'PLAYING' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center backdrop-blur-sm">
            {gameState === 'START' && (
              <>
                <h2 className="text-5xl text-cyan-500 font-glitch mb-4 glitch-effect" data-text="SNAKE.EXE">SNAKE.EXE</h2>
                <p className="text-magenta-500 animate-pulse text-xl">PRESS SPACE TO INITIALIZE</p>
              </>
            )}
            {gameState === 'GAMEOVER' && (
              <>
                <h2 className="text-5xl text-magenta-500 font-glitch mb-4 glitch-effect" data-text="FATAL_ERR">FATAL_ERR</h2>
                <p className="text-cyan-500 mb-4 text-2xl">SCORE: {score}</p>
                <p className="text-magenta-500 animate-pulse text-xl">PRESS SPACE TO REBOOT</p>
              </>
            )}
            {gameState === 'PAUSED' && (
              <>
                <h2 className="text-5xl text-cyan-500 font-glitch mb-4 glitch-effect" data-text="HALTED">HALTED</h2>
                <p className="text-magenta-500 animate-pulse text-xl">PRESS SPACE TO RESUME</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
