import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CutTool } from './CutTool';
import { TextOverlayTool } from './TextOverlayTool';
import { SpeedControl } from './SpeedControl';

export function ToolPanel({ onToolSelect, currentSpeed, onSpeedChange }) {
  return (
    <div className="w-full border-t bg-white">
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-gray-50">
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="p-4">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <CutTool />
              <TextOverlayTool />
            </div>
            <div className="text-sm text-gray-600">
              Select a tool to apply edits to your video
            </div>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['Brightness', 'Contrast', 'Saturation', 'Blur', 'Sharpen', 'Grayscale'].map((effect) => (
                <button
                  key={effect}
                  onClick={() => onToolSelect(effect)}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  {effect}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="properties" className="p-4">
          <div className="space-y-4">
            <SpeedControl
              currentSpeed={currentSpeed}
              onSpeedChange={onSpeedChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
