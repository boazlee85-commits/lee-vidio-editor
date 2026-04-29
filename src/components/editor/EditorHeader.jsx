import React from 'react';
import { FileDown, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '../ui/button';

export function EditorHeader({ onExport, onReset, title = "Video Editor" }) {
  return (
    <header className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">Edit and create amazing videos</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          
          <Button
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
