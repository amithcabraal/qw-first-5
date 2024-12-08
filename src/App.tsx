import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { StartScreen } from './components/StartScreen';
import { GameHeader } from './components/GameHeader';
import { GameOver } from './components/GameOver';
import { GameBoard } from './components/GameBoard';

function App() {
  const {
    event1,
    event2,
    score,
    highScore,
    gameOver,
    timeLeft,
    gameStarted,
    selectedEvent,
    isCorrect,
    handleChoice,
    startGame,
    setupNewRound
  } = useGameLogic();

  if (!gameStarted) {
    return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-6xl mx-auto">
        <GameHeader score={score} timeLeft={timeLeft} highScore={highScore} />

        {gameOver ? (
          <GameOver score={score} highScore={highScore} onRestart={startGame} />
        ) : (
          <GameBoard
            event1={event1}
            event2={event2}
            selectedEvent={selectedEvent}
            isCorrect={isCorrect}
            onChoice={handleChoice}
            onNextRound={setupNewRound}
          />
        )}
      </div>
    </div>
  );
}

export default App;