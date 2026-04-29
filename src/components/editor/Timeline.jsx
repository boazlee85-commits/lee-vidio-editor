import React, { useRef, useState } from 'react';

export function Timeline({ duration = 100, currentTime = 0, onSeek, clips = [] }) {
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(percent * duration);
  };

  const currentPercent = (currentTime / duration) * 100;

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, duration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-300">Timeline</label>
        <span className="text-xs text-gray-500">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div
        ref={timelineRef}
        className="relative w-full h-16 bg-gray-800 rounded cursor-pointer group"
        onMouseDown={handleMouseDown}
      >
        {/* Clips */}
        {clips.map((clip, idx) => (
          <div
            key={idx}
            className="absolute h-full bg-blue-500 opacity-75 rounded"
            style={{
              left: `${(clip.start / duration) * 100}%`,
              width: `${((clip.end - clip.start) / duration) * 100}%`,
            }}
          />
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-1 bg-red-500 rounded transition-all"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-red-500 rounded-full" />
        </div>

        {/* Time markers */}
        <div className="absolute bottom-0 w-full h-6 flex items-end px-2">
          {[0, 0.25, 0.5, 0.75, 1].map((marker) => (
            <div
              key={marker}
              className="flex-1 text-center text-xs text-gray-600 border-l border-gray-700"
            >
              {marker === 1 ? formatTime(duration) : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Drag to seek • Zoom with scroll • Double-click to add marker
      </div>
    </div>
  );
}
