import React, { useState } from 'react';
import { Scissors } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export function CutTool() {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const handleCut = () => {
    // Handle cutting logic
    console.log(`Cutting from ${startTime}s to ${endTime}s`);
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
        <Scissors className="h-4 w-4" />
        Cut
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cut Video Segment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Start Time (seconds)</label>
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Time (seconds)</label>
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <Button onClick={handleCut} className="w-full">
              Apply Cut
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
