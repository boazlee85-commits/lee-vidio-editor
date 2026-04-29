import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { EditorHeader } from '@/components/editor/EditorHeader';
import { ExportModal } from '@/components/editor/ExportModal';
import { PlaybackControls } from '@/components/editor/PlaybackControls';
import { Timeline } from '@/components/editor/Timeline';
import { ToolPanel } from '@/components/editor/ToolPanel';
import { VideoPreview } from '@/components/editor/VideoPreview';
import { VideoUpload } from '@/components/editor/VideoUpload';
import { YouTubeUploadPanel } from '@/components/editor/YouTubeUploadPanel';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function clampTime(time, duration) {
  if (!duration) return 0;
  return Math.max(0, Math.min(time, duration));
}

export default function Editor() {
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('');
  const [editorMessage, setEditorMessage] = useState('');
  const [editorError, setEditorError] = useState('');

  const clips = useMemo(() => {
    if (!duration) return [];
    return [{ start: 0, end: duration }];
  }, [duration]);

  const handleVideoSelected = (nextVideoSrc, file) => {
    if (videoSrc && videoSrc !== nextVideoSrc) {
      URL.revokeObjectURL(videoSrc);
    }

    setVideoSrc(nextVideoSrc);
    setVideoFile(file);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setEditorMessage('');
    setEditorError('');
  };

  const handleReset = () => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
    }

    setVideoSrc('');
    setVideoFile(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setPlaybackSpeed(1);
    setSelectedTool('');
    setEditorMessage('');
    setEditorError('');
  };

  const handleExport = async ({ format, quality }) => {
    if (!videoFile) {
      setEditorError('Upload a video before exporting.');
      return;
    }

    const safeFormat = format || 'mp4';
    const downloadUrl = URL.createObjectURL(videoFile);
    const baseName = videoFile.name.replace(/\.[^/.]+$/, '');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${baseName}-export-${quality}.${safeFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    setEditorError('');
    setEditorMessage(`Video exported as ${safeFormat.toUpperCase()} (${quality}).`);
  };

  const handleSeek = (nextTime) => {
    setCurrentTime(clampTime(nextTime, duration));
  };

  useEffect(() => {
    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <EditorHeader onExport={() => setIsExportModalOpen(true)} onReset={handleReset} title="Lee Video Editor" />

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Source Video</CardTitle>
              </CardHeader>
              <CardContent>
                <VideoUpload onVideoSelected={handleVideoSelected} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Editing Tools</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ToolPanel
                  onToolSelect={setSelectedTool}
                  currentSpeed={playbackSpeed}
                  onSpeedChange={setPlaybackSpeed}
                />
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <VideoPreview
                src={videoSrc}
                currentTime={currentTime}
                isPlaying={isPlaying}
                playbackRate={playbackSpeed}
                onTimeUpdate={setCurrentTime}
                onDurationChange={setDuration}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            <PlaybackControls
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying((currentValue) => !currentValue)}
              onSkipBackward={() => handleSeek(currentTime - 10)}
              onSkipForward={() => handleSeek(currentTime + 10)}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />

            <Timeline duration={duration || 1} currentTime={currentTime} onSeek={handleSeek} clips={clips} />

            {selectedTool && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{selectedTool} selected.</AlertDescription>
              </Alert>
            )}

            {editorMessage && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <AlertDescription className="text-green-900">{editorMessage}</AlertDescription>
              </Alert>
            )}

            {editorError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{editorError}</AlertDescription>
              </Alert>
            )}
          </section>
        </div>

        <YouTubeUploadPanel videoFile={videoFile} />
      </main>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
