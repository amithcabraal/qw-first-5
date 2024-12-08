import React from 'react';
import { Event } from '../types/Event';
import { Check, X } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  isSelected?: boolean;
  isCorrect: boolean | null;
  showDate?: boolean;
}

export function EventCard({ event, onClick, isSelected, isCorrect, showDate }: EventCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-transform w-full relative h-full
        ${!isSelected && !showDate ? 'hover:transform hover:scale-105' : ''}`}
      disabled={showDate}
    >
      {event.eventImage ? (
        <>
          <div className="relative h-64">
            <img
              src={event.eventImage}
              alt={event.eventDescription}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
              }}
            />
            {isSelected && (
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40`}>
                <div className={`rounded-full p-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? (
                    <Check className="w-12 h-12 text-white" />
                  ) : (
                    <X className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="p-6">
            <p className="text-lg text-gray-800 font-medium">{event.eventDescription}</p>
            {showDate && (
              <p className="text-lg text-purple-600 font-bold mt-2">
                {formatDate(event.date)}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full min-h-[16rem]">
          <div className="flex-grow p-8 flex items-center justify-center relative">
            <p className="text-xl text-gray-800 font-medium text-center leading-relaxed">
              {event.eventDescription}
            </p>
            {isSelected && (
              <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40`}>
                <div className={`rounded-full p-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect ? (
                    <Check className="w-12 h-12 text-white" />
                  ) : (
                    <X className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
          {showDate && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <p className="text-lg text-purple-600 font-bold text-center">
                {formatDate(event.date)}
              </p>
            </div>
          )}
        </div>
      )}
    </button>
  );
}