import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Heart, Star, Trophy, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";
import { translate, speak } from "@/utils/translations";
import Confetti from "react-confetti";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 50;
const PLATFORM_HEIGHT = 20;
const ITEM_SIZE = 40;
const BARREL_SIZE = 35;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;

export default function DonkeyKongGame({ content, onComplete, instructionLanguage = 'ja' }) {
  const [gameState, setGameState] = useState('ready'); // ready, playing, levelComplete, gameOver, victory
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [player, setPlayer] = useState({ x: 100, y: GAME_HEIGHT - 100, vx: 0, vy: 0, onGround: true });
  const [collectibles, setCollectibles] = useState([]);
  const [barrels, setBarrels] = useState([]);
  const [collectedWords, setCollectedWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [combo, setCombo] = useState(0);
  
  const gameRef = useRef(null);
  const keysPressed = useRef({});
  const animationFrameRef = useRef(null);

  const words = content?.words || content?.keywords || ['cat', 'dog', 'bird', 'fish', 'tree'];
  const theme = content?.theme || 'Vocabulary';
  
  // Platform layout for each level
  const platforms = [
    // Ground
    { x: 0, y: GAME_HEIGHT - 40, width: GAME_WIDTH, height: PLATFORM_HEIGHT },
    // Level 1 platforms
    { x: 50, y: GAME_HEIGHT - 140, width: 200, height: PLATFORM_HEIGHT },
    { x: 300, y: GAME_HEIGHT - 140, width: 150, height: PLATFORM_HEIGHT },
    { x: 550, y: GAME_HEIGHT - 140, width: 200, height: PLATFORM_HEIGHT },
    // Level 2 platforms
    { x: 100, y: GAME_HEIGHT - 240, width: 180, height: PLATFORM_HEIGHT },
    { x: 350, y: GAME_HEIGHT - 240, width: 200, height: PLATFORM_HEIGHT },
    { x: 600, y: GAME_HEIGHT - 240, width: 150, height: PLATFORM_HEIGHT },
    // Level 3 platforms
    { x: 50, y: GAME_HEIGHT - 340, width: 150, height: PLATFORM_HEIGHT },
    { x: 250, y: GAME_HEIGHT - 340, width: 180, height: PLATFORM_HEIGHT },
    { x: 500, y: GAME_HEIGHT - 340, width: 250, height: PLATFORM_HEIGHT },
    // Level 4 platforms (top)
    { x: 150, y: GAME_HEIGHT - 440, width: 200, height: PLATFORM_HEIGHT },
    { x: 400, y: GAME_HEIGHT - 440, width: 250, height: PLATFORM_HEIGHT },
    // Victory platform
    { x: 300, y: GAME_HEIGHT - 520, width: 200, height: PLATFORM_HEIGHT },
  ];

  // Ladders
  const ladders = [
    { x: 200, y: GAME_HEIGHT - 140, height: 100 },
    { x: 450, y: GAME_HEIGHT - 140, height: 100 },
    { x: 650, y: GAME_HEIGHT - 240, height: 100 },
    { x: 150, y: GAME_HEIGHT - 340, height: 100 },
    { x: 400, y: GAME_HEIGHT - 340, height: 100 },
    { x: 550, y: GAME_HEIGHT - 440, height: 100 },
    { x: 250, y: GAME_HEIGHT - 440, height: 100 },
    { x: 380, y: GAME_HEIGHT - 520, height: 80 },
  ];

  // Initialize level
  const initLevel = useCallback(() => {
    // Create collectibles (correct words to collect)
    const levelWords = words.slice(0, Math.min(5 + level, words.length));
    const newCollectibles = levelWords.map((word, i) => ({
      id: `collect-${i}`,
      word,
      x: 100 + (i * 150) % 600,
      y: GAME_HEIGHT - 180 - Math.floor(i / 4) * 100,
      collected: false,
      isCorrect: true
    }));

    // Create barrels (wrong answers - obstacles)
    const wrongWords = generateWrongWords(levelWords);
    const newBarrels = wrongWords.map((word, i) => ({
      id: `barrel-${i}`,
      word,
      x: 50 + Math.random() * 700,
      y: 100 + Math.random() * 200,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1 + level * 0.5),
      vy: 0
    }));

    setCollectibles(newCollectibles);
    setBarrels(newBarrels);
    setCurrentQuestion(levelWords[0]);
    setPlayer({ x: 100, y: GAME_HEIGHT - 100, vx: 0, vy: 0, onGround: true });
  }, [level, words]);

  function generateWrongWords(correctWords) {
    const allPossibleWrong = [
      'apple', 'banana', 'orange', 'grape', 'mango',
      'red', 'blue', 'green', 'yellow', 'purple',
      'one', 'two', 'three', 'four', 'five',
      'happy', 'sad', 'angry', 'tired', 'hungry'
    ].filter(w => !correctWords.includes(w.toLowerCase()));
    
    const shuffled = allPossibleWrong.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3 + level);
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setPlayer(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVx = prev.vx;
        let newVy = prev.vy;
        let onGround = false;

        // Horizontal movement
        if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
          newVx = -MOVE_SPEED;
        } else if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
          newVx = MOVE_SPEED;
        } else {
          newVx = 0;
        }

        // Apply gravity
        newVy += GRAVITY;
        
        // Jump
        if ((keysPressed.current['Space'] || keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) && prev.onGround) {
          newVy = JUMP_FORCE;
          speak('Jump!', 'en-US');
        }

        // Update position
        newX += newVx;
        newY += newVy;

        // Platform collision
        for (const platform of platforms) {
          if (
            newX + PLAYER_SIZE > platform.x &&
            newX < platform.x + platform.width &&
            newY + PLAYER_SIZE > platform.y &&
            prev.y + PLAYER_SIZE <= platform.y + 10 &&
            newVy >= 0
          ) {
            newY = platform.y - PLAYER_SIZE;
            newVy = 0;
            onGround = true;
          }
        }

        // Ladder climbing
        for (const ladder of ladders) {
          if (
            newX + PLAYER_SIZE / 2 > ladder.x &&
            newX + PLAYER_SIZE / 2 < ladder.x + 30 &&
            newY + PLAYER_SIZE > ladder.y &&
            newY < ladder.y + ladder.height
          ) {
            if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) {
              newY -= 3;
              newVy = 0;
            }
            if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) {
              newY += 3;
              newVy = 0;
            }
          }
        }

        // Boundary checks
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));
        newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, newY));

        return { x: newX, y: newY, vx: newVx, vy: newVy, onGround };
      });

      // Move barrels
      setBarrels(prev => prev.map(barrel => {
        let newX = barrel.x + barrel.vx;
        let newVx = barrel.vx;
        
        // Bounce off walls
        if (newX <= 0 || newX >= GAME_WIDTH - BARREL_SIZE) {
          newVx = -newVx;
          newX = Math.max(0, Math.min(GAME_WIDTH - BARREL_SIZE, newX));
        }
        
        return { ...barrel, x: newX, vx: newVx };
      }));

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Check collectible collision
    setCollectibles(prev => {
      const updated = prev.map(item => {
        if (item.collected) return item;
        
        const collision = 
          player.x < item.x + ITEM_SIZE &&
          player.x + PLAYER_SIZE > item.x &&
          player.y < item.y + ITEM_SIZE &&
          player.y + PLAYER_SIZE > item.y;
        
        if (collision) {
          setScore(s => s + 100 * (1 + combo * 0.1));
          setCombo(c => c + 1);
          setCollectedWords(w => [...w, item.word]);
          setShowConfetti(true);
          speak(`${item.word}! Great!`, 'en-US');
          setTimeout(() => setShowConfetti(false), 1500);
          return { ...item, collected: true };
        }
        return item;
      });

      // Check if all collected
      if (updated.filter(i => !i.collected).length === 0) {
        setGameState('levelComplete');
      }

      return updated;
    });

    // Check barrel collision
    for (const barrel of barrels) {
      const collision = 
        player.x < barrel.x + BARREL_SIZE &&
        player.x + PLAYER_SIZE > barrel.x &&
        player.y < barrel.y + BARREL_SIZE &&
        player.y + PLAYER_SIZE > barrel.y;
      
      if (collision) {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
          } else {
            speak('Oops! Try again!', 'en-US');
            setPlayer({ x: 100, y: GAME_HEIGHT - 100, vx: 0, vy: 0, onGround: true });
            setCombo(0);
          }
          return newLives;
        });
        break;
      }
    }

    // Check victory (reached top)
    if (player.y < 100 && collectibles.filter(i => !i.collected).length === 0) {
      setGameState('victory');
    }
  }, [player, barrels, collectibles, gameState, combo]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setCollectedWords([]);
    setCombo(0);
    initLevel();
    speak('Go! Collect the words!', 'en-US');
  };

  // Next level
  const nextLevel = () => {
    setLevel(l => l + 1);
    setGameState('playing');
    initLevel();
    speak(`Level ${level + 1}! Let's go!`, 'en-US');
  };

  // Handle game completion
  const handleVictory = () => {
    const finalScore = Math.round((score / (words.length * 100)) * 100);
    onComplete(Math.min(100, finalScore));
  };

  // Touch controls for mobile
  const handleTouchMove = (direction) => {
    if (direction === 'left') keysPressed.current['ArrowLeft'] = true;
    if (direction === 'right') keysPressed.current['ArrowRight'] = true;
    if (direction === 'up') keysPressed.current['ArrowUp'] = true;
    setTimeout(() => {
      keysPressed.current['ArrowLeft'] = false;
      keysPressed.current['ArrowRight'] = false;
      keysPressed.current['ArrowUp'] = false;
    }, 100);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}
      
      {/* Game Header */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 px-4 py-2 rounded-full">
            <span className="font-black text-xl">Level {level}</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-8 h-8 ${i < lives ? 'text-red-500 fill-red-500' : 'text-white/30'}`} 
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 px-4 py-2 rounded-full flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            <span className="font-black text-xl">{score}</span>
          </div>
          {combo > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-black"
            >
              {combo}x Combo!
            </motion.div>
          )}
        </div>
      </div>

      {/* Game Canvas */}
      <Card className="border-4 border-amber-400 rounded-3xl overflow-hidden shadow-2xl">
        <CardContent className="p-0 relative" ref={gameRef}>
          <div 
            className="relative bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-30"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                  style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                />
              ))}
            </div>

            {/* Platforms */}
            {platforms.map((platform, i) => (
              <div
                key={`platform-${i}`}
                className="absolute bg-gradient-to-b from-amber-600 to-amber-800 border-t-4 border-amber-400"
                style={{
                  left: platform.x,
                  top: platform.y,
                  width: platform.width,
                  height: platform.height,
                  borderRadius: '4px'
                }}
              />
            ))}

            {/* Ladders */}
            {ladders.map((ladder, i) => (
              <div
                key={`ladder-${i}`}
                className="absolute"
                style={{
                  left: ladder.x,
                  top: ladder.y,
                  width: 30,
                  height: ladder.height
                }}
              >
                {/* Ladder rungs */}
                {[...Array(Math.floor(ladder.height / 20))].map((_, j) => (
                  <div
                    key={j}
                    className="absolute w-full h-2 bg-amber-300"
                    style={{ top: j * 20 }}
                  />
                ))}
                {/* Ladder sides */}
                <div className="absolute left-0 top-0 w-2 h-full bg-amber-400" />
                <div className="absolute right-0 top-0 w-2 h-full bg-amber-400" />
              </div>
            ))}

            {/* Collectibles */}
            <AnimatePresence>
              {collectibles.filter(i => !i.collected).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, y: [0, -5, 0] }}
                  exit={{ scale: 0, rotate: 360 }}
                  transition={{ y: { duration: 1, repeat: Infinity } }}
                  className="absolute bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg border-2 border-white shadow-lg flex items-center justify-center"
                  style={{
                    left: item.x,
                    top: item.y,
                    width: ITEM_SIZE,
                    height: ITEM_SIZE
                  }}
                >
                  <span className="text-white font-bold text-xs">{item.word.slice(0, 3)}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Barrels (obstacles) */}
            {barrels.map((barrel) => (
              <motion.div
                key={barrel.id}
                animate={{ rotate: barrel.vx > 0 ? 360 : -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="absolute bg-gradient-to-br from-red-500 to-red-700 rounded-full border-4 border-red-300 shadow-lg flex items-center justify-center"
                style={{
                  left: barrel.x,
                  top: barrel.y,
                  width: BARREL_SIZE,
                  height: BARREL_SIZE
                }}
              >
                <span className="text-white font-bold text-xs">X</span>
              </motion.div>
            ))}

            {/* Player */}
            {gameState === 'playing' && (
              <motion.div
                className="absolute"
                style={{
                  left: player.x,
                  top: player.y,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE
                }}
              >
                {/* Player character - cute student */}
                <div className="w-full h-full relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full rounded-b-lg" />
                  {/* Face */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-8 bg-amber-200 rounded-full">
                    {/* Eyes */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-slate-800 rounded-full" />
                    <div className="absolute top-2 right-2 w-2 h-2 bg-slate-800 rounded-full" />
                    {/* Smile */}
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Goal indicator at top */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute top-10 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-2 rounded-full border-4 border-white shadow-xl">
                <Trophy className="w-8 h-8 text-white inline mr-2" />
                <span className="font-black text-white">GOAL!</span>
              </div>
            </motion.div>

            {/* Ready Screen */}
            {gameState === 'ready' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-3xl p-8 text-center max-w-md"
                >
                  <div className="text-6xl mb-4">🦍</div>
                  <h2 className="text-3xl font-black text-slate-800 mb-2">Word Climber!</h2>
                  <p className="text-slate-600 mb-4">
                    {translate("Climb to the top and collect all the words!", instructionLanguage)}
                  </p>
                  <div className="bg-slate-100 rounded-xl p-4 mb-6 text-left">
                    <p className="font-bold mb-2">Controls:</p>
                    <p>← → Arrow keys to move</p>
                    <p>↑ or Space to jump</p>
                    <p>↑ on ladders to climb</p>
                  </div>
                  <p className="text-amber-600 font-bold mb-4">Theme: {theme}</p>
                  <Button
                    onClick={startGame}
                    className="w-full h-14 text-xl font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full"
                    data-testid="start-climbing-game"
                  >
                    {translate("Start Game", instructionLanguage)}!
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Level Complete Screen */}
            {gameState === 'levelComplete' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-3xl p-8 text-center"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="text-3xl font-black text-emerald-600 mb-4">Level Complete!</h2>
                  <p className="text-2xl font-bold text-slate-700 mb-4">Score: {score}</p>
                  <div className="flex gap-2 flex-wrap justify-center mb-6">
                    {collectedWords.map((word, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
                        {word}
                      </span>
                    ))}
                  </div>
                  <Button
                    onClick={nextLevel}
                    className="w-full h-14 text-xl font-black bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                  >
                    Next Level →
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'gameOver' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-3xl p-8 text-center"
                >
                  <div className="text-6xl mb-4">😢</div>
                  <h2 className="text-3xl font-black text-red-600 mb-4">Game Over!</h2>
                  <p className="text-xl text-slate-600 mb-4">Final Score: {score}</p>
                  <Button
                    onClick={startGame}
                    className="w-full h-14 text-xl font-black bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </div>
            )}

            {/* Victory Screen */}
            {gameState === 'victory' && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Confetti />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white rounded-3xl p-8 text-center"
                >
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-black text-amber-600 mb-4">Victory!</h2>
                  <p className="text-2xl font-bold text-slate-700 mb-2">Final Score: {score}</p>
                  <p className="text-lg text-slate-500 mb-6">Words Collected: {collectedWords.length}</p>
                  <Button
                    onClick={handleVictory}
                    className="w-full h-14 text-xl font-black bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"
                    data-testid="complete-climbing-game"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Complete!
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Touch Controls */}
      {gameState === 'playing' && (
        <div className="flex gap-4 md:hidden">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-violet-600"
            onTouchStart={() => handleTouchMove('left')}
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-green-600"
            onTouchStart={() => handleTouchMove('up')}
          >
            <ArrowUp className="w-8 h-8" />
          </Button>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-violet-600"
            onTouchStart={() => handleTouchMove('right')}
          >
            <ArrowRight className="w-8 h-8" />
          </Button>
        </div>
      )}

      {/* Current word to collect */}
      {gameState === 'playing' && (
        <div className="bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-violet-200">
          <p className="text-slate-500 text-sm">Collect these words:</p>
          <div className="flex gap-2 flex-wrap">
            {collectibles.map((item) => (
              <span 
                key={item.id}
                className={`px-3 py-1 rounded-full font-bold text-sm ${
                  item.collected 
                    ? 'bg-green-100 text-green-700 line-through' 
                    : 'bg-violet-100 text-violet-700'
                }`}
              >
                {item.word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
