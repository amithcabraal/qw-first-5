import React from 'react';
import { Event } from '../types/Event';
import { EventCard } from './EventCard';
import { RotateCcw } from 'lucide-react';

interface GameBoardProps {
  event1: Event | null;
  event2: Event | null;
  selectedEvent: Event | null;
  isCorrect: boolean | null;
  onChoice: (chosen: Event, other: Event) => void;
  onNextRound: () => void;
}

export function GameBoard({
  event1,
  event2,
  selectedEvent,
  isCorrect,
  onChoice,
  onNextRound
}: GameBoardProps) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {event1 && event2 && (
          <>
            <EventCard
              event={event1}
              onClick={() => onChoice(event1, event2)}
              isSelected={selectedEvent === event1}
              isCorrect={selectedEvent === event1 ? isCorrect : null}
              showDate={!!selectedEvent}
            />
            <EventCard
              event={event2}
              onClick={() => onChoice(event2, event1)}
              isSelected={selectedEvent === event2}
              isCorrect={selectedEvent === event2 ? isCorrect : null}
              showDate={!!selectedEvent}
            />
          </>
        )}
      </div>
      {selectedEvent && (
        <div className="flex justify-center">
          <button
            onClick={onNextRound}
            className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-opacity flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Next Round
          </button>
        </div>
      )}
    </>
  );
}