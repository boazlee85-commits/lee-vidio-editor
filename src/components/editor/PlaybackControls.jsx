import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';

export function PlaybackControls({
  isPlaying,
  onPlayPause,
  onSkipBackward,
  onSkipForward,
  currentTime = 0,
  duration = 0,
  onSeek,
}) {
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-gray-900 text-white p-4 space-y-3 rounded-lg">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkipBackward}
            className="text-gray-300 hover:text-white"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            onClick={onPlayPause}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkipForward}
            className="text-gray-300 hover:text-white"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <Volume2 className="h-4 w-4" />
            <div className="w-24 bg-gray-700 rounded-full h-1 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-1">
          <div
            className="w-full bg-gray-700 rounded-full h-1 cursor-pointer hover:h-2 transition-all"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              onSeek(percent * duration);
            }}
          >
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
