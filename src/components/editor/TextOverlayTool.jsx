import React, { useState } from 'react';
import { Type } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Slider } from '../ui/slider';

export function TextOverlayTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [position, setPosition] = useState('center');
  const [duration, setDuration] = useState(5);

  const handleAddText = () => {
    // Handle adding text overlay
    console.log({
      text,
      fontSize,
      color,
      position,
      duration,
    });
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Type className="h-4 w-4" />
        Text
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Text Overlay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Text</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text..."
                className="w-full px-3 py-2 border rounded-md h-20"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Font Size</label>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={12}
                max={72}
                step={1}
              />
              <span className="text-xs text-gray-600">{fontSize}px</span>
            </div>

            <div>
              <label className="text-sm font-medium">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 border rounded-md cursor-pointer"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="center-left">Center Left</option>
                <option value="center">Center</option>
                <option value="center-right">Center Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Duration (seconds)</label>
              <Slider
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={1}
                max={30}
                step={0.5}
              />
              <span className="text-xs text-gray-600">{duration}s</span>
            </div>

            <Button onClick={handleAddText} className="w-full">
              Add Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
