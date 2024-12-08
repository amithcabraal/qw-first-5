import { useState, useCallback, useEffect } from 'react';
import { Event } from '../types/Event';
import { events } from '../data/events';

export function useGameLogic() {
  const [event1, setEvent1] = useState<Event | null>(null);
  const [event2, setEvent2] = useState<Event | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getEventsWithinTimeRange = useCallback((baseEvent: Event, maxYearDiff: number = 5): Event[] => {
    if (!baseEvent?.date) return [];
    
    const baseDate = new Date(baseEvent.date);
    
    return events.filter(event => {
      if (!event?.date || event === baseEvent) return false;
      const eventDate = new Date(event.date);
      const diffInMonths = Math.abs(
        (eventDate.getFullYear() - baseDate.getFullYear()) * 12 +
        (eventDate.getMonth() - baseDate.getMonth())
      );
      return diffInMonths <= maxYearDiff * 12;
    });
  }, []);

  const getRandomEvent = useCallback((): Event | null => {
    const validEvents = events.filter(event => event.date);
    if (validEvents.length === 0) return null;
    return validEvents[Math.floor(Math.random() * validEvents.length)];
  }, []);

  const setupNewRound = useCallback(() => {
    if (isTransitioning || gameOver) return;
    
    setSelectedEvent(null);
    setIsCorrect(null);
    setIsTransitioning(false);
    
    let attempts = 0;
    const maxAttempts = 10;
    
    const findValidEventPair = (): boolean => {
      const firstEvent = getRandomEvent();
      if (!firstEvent) return false;
      
      const nearbyEvents = getEventsWithinTimeRange(firstEvent);
      if (nearbyEvents.length > 0) {
        const secondEvent = nearbyEvents[Math.floor(Math.random() * nearbyEvents.length)];
        setEvent1(firstEvent);
        setEvent2(secondEvent);
        return true;
      }
      return false;
    };

    while (attempts < maxAttempts) {
      if (findValidEventPair()) return;
      attempts++;
    }

    // If we couldn't find a valid pair after max attempts, end the game
    setGameOver(true);
  }, [getRandomEvent, getEventsWithinTimeRange, gameOver, isTransitioning]);

  const handleChoice = useCallback((chosenEvent: Event, otherEvent: Event) => {
    if (!chosenEvent?.date || !otherEvent?.date || gameOver || selectedEvent || isTransitioning) return;

    setIsTransitioning(true);
    const chosenDate = new Date(chosenEvent.date);
    const otherDate = new Date(otherEvent.date);
    
    setSelectedEvent(chosenEvent);
    const correct = chosenDate < otherDate;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => {
        setScore(prev => prev + 1);
        setIsTransitioning(false);
        setupNewRound();
      }, 2000);
    } else {
      setTimeout(() => {
        setIsTransitioning(false);
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
        }
      }, 2000);
    }
  }, [gameOver, score, highScore, setupNewRound, selectedEvent, isTransitioning]);

  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setTimeLeft(60);
    setGameStarted(true);
    setIsTransitioning(false);
    setupNewRound();
  }, [setupNewRound]);

  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            if (score > highScore) {
              setHighScore(score);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver, timeLeft, score, highScore]);

  return {
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
  };
}