import React, { useState } from 'react';
import { Slider } from '../ui/slider';

export function SpeedControl({ currentSpeed = 1, onSpeedChange }) {
  const [speed, setSpeed] = useState(currentSpeed);

  const presetSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSpeedChange = (value) => {
    setSpeed(value);
    onSpeedChange(value);
  };

  return (
    <div className="w-full space-y-3">
      <div>
        <label className="text-sm font-medium">Playback Speed</label>
        <div className="text-xs text-gray-600 mt-1">{speed.toFixed(2)}x</div>
      </div>

      <Slider
        value={[speed]}
        onValueChange={(value) => handleSpeedChange(value[0])}
        min={0.25}
        max={2}
        step={0.05}
        className="w-full"
      />

      <div className="grid grid-cols-6 gap-2">
        {presetSpeeds.map((presetSpeed) => (
          <button
            key={presetSpeed}
            onClick={() => handleSpeedChange(presetSpeed)}
            className={`py-1 px-2 rounded text-sm transition-colors ${
              Math.abs(speed - presetSpeed) < 0.01
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {presetSpeed}x
          </button>
        ))}
      </div>
    </div>
  );
}
