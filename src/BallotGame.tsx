import { useState, useEffect, useRef, useCallback } from 'react';

import { Inbox, Play, RotateCcw, AlertTriangle, FileBadge } from 'lucide-react';
import './game.css';

declare global {
  interface Window {
    boxPosRef: number;
  }
}

// Types and Constants
type ItemType = 'valid' | 'invalid';

interface FallingItem {
  id: number;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  type: ItemType;
  speed: number;
}

const BOX_WIDTH = 25; // % (Made wider to catch easily)
const ITEM_SIZE = 8; // %

export default function BallotGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [boxPosition, setBoxPosition] = useState(50); // Center
  const [items, setItems] = useState<FallingItem[]>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const idCounterRef = useRef<number>(0);
  const scoreRef = useRef(0);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Constants for tuning
  const SPAWN_RATE = 1500; // ms (Slower spawn)
  const BASE_SPEED = 12; // % per second (Slower falling)

  const startGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setItems([]);
    idCounterRef.current = 0;
    spawnTimerRef.current = 0;
    lastTimeRef.current = performance.now();
  };

  const stopGame = () => {
    setIsPlaying(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isPlaying || !gameAreaRef.current) return;
    
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }

    const rect = gameAreaRef.current.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * 100;
    
    // Constrain box
    if (x < BOX_WIDTH / 2) x = BOX_WIDTH / 2;
    if (x > 100 - BOX_WIDTH / 2) x = 100 - BOX_WIDTH / 2;
    
    setBoxPosition(x);
  }, [isPlaying]);

  useEffect(() => {
    const area = gameAreaRef.current;
    if (area) {
      area.addEventListener('mousemove', handleMouseMove);
      area.addEventListener('touchmove', handleMouseMove, { passive: true });
    }
    return () => {
      if (area) {
        area.removeEventListener('mousemove', handleMouseMove);
        area.removeEventListener('touchmove', handleMouseMove);
      }
    };
  }, [handleMouseMove]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (time: number) => {
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Spawn new items
      spawnTimerRef.current += deltaTime;
      if (spawnTimerRef.current > Math.max(SPAWN_RATE - scoreRef.current * 10, 600)) { // Speed up much slower
        spawnTimerRef.current = 0;
        const isInvalid = Math.random() > 0.8; // Only 20% chance of invalid vote
        
        setItems(prev => [...prev, {
          id: idCounterRef.current++,
          x: Math.random() * (100 - ITEM_SIZE),
          y: -10, // Start above
          type: isInvalid ? 'invalid' : 'valid',
          speed: BASE_SPEED + Math.random() * 5 + (scoreRef.current * 0.15) // Speed scales much slower
        }]);
      }

      // Update positions and check collisions
      setItems(prevItems => {
        const nextItems: FallingItem[] = [];
        
        for (const item of prevItems) {
          const nextY = item.y + (item.speed * (deltaTime / 1000));
          
          // Collision Detection Thresholds
          const hitBoxTop = 85; // %
          
          if (nextY >= hitBoxTop && item.y < hitBoxTop) {
            // Check X alignment
            const boxLeft = window.boxPosRef - BOX_WIDTH / 2;
            const boxRight = window.boxPosRef + BOX_WIDTH / 2;
            const itemCenter = item.x + ITEM_SIZE / 2;

            if (itemCenter >= boxLeft && itemCenter <= boxRight) {
              // Caught
              if (item.type === 'valid') {
                setScore(s => s + 10);
              } else {
                // Penalize for catching invalid
                setScore(s => Math.max(0, s - 5));
              }
              continue; // Item disappears
            }
          }

          // Missed valid vote
          if (nextY > 100) {
            if (item.type === 'valid') {
              // Penalize for missing valid
              setScore(s => Math.max(0, s - 5));
            }
            continue; // Item disappears
          }

          nextItems.push({ ...item, y: nextY });
        }

        return nextItems;
      });

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // Hack wrapper to let RAF read latest box pos cleanly
  useEffect(() => {
    (window as any).boxPosRef = boxPosition;
  }, [boxPosition]);

  // Removed setState in effect

  useEffect(() => {
    return () => stopGame();
  }, []);

  return (
    <section className="game-section nav-section" id="game">
      <div className="game-header">
        <h2 className="game-title">Ballot Box Defender</h2>
        <p className="game-subtitle">Catch the authentic ballots and dodge the invalid ones! Move your mouse or drag your finger across the box.</p>
      </div>

      <div className="game-container">
        <div className="game-hud">
          <div className="score-display">
            Score: <span className="highlight-text">{score}</span>
          </div>
          <div className="lives-display">
            Time: <span className={`highlight-text ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
          </div>
        </div>

        <div className="game-area" ref={gameAreaRef}>
          {!isPlaying && !isGameOver && (
            <div className="game-overlay">
              <Inbox size={64} className="game-logo" />
              <h3>Ready to secure the election?</h3>
              <button className="game-btn primary" onClick={startGame}>
                <Play size={20} /> Play Game
              </button>
            </div>
          )}

          {isGameOver && (
            <div className="game-overlay over">
              <h3>Game Over!</h3>
              <p>Final Score: {score}</p>
              <button className="game-btn primary" onClick={startGame}>
                <RotateCcw size={20} /> Play Again
              </button>
            </div>
          )}

          {/* Falling Items */}
          {items.map(item => (
            <div
              key={item.id}
              className={`falling-item ${item.type}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${ITEM_SIZE}%`,
                height: `${ITEM_SIZE}%`
              }}
            >
              {item.type === 'valid' ? <FileBadge size="100%" color="white" /> : <AlertTriangle size="100%" color="#ef4444" />}
            </div>
          ))}

          {/* Player Box */}
          <div 
            className="player-box"
            style={{ 
              left: `${boxPosition}%`,
              width: `${BOX_WIDTH}%`
            }}
          >
            <div className="box-opening"></div>
            <Inbox size="100%" color="#3b82f6" strokeWidth={1.5} />
            <div className="box-label">VOTE</div>
          </div>
        </div>
      </div>
    </section>
  );
}
