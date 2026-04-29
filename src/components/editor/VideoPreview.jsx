import React, { useEffect, useRef, useState } from 'react';

export function VideoPreview({
  src,
  currentTime,
  isPlaying,
  playbackRate = 1,
  onTimeUpdate,
  onDurationChange,
  onEnded,
}) {
  const videoRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (videoRef.current && currentTime !== undefined) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    onDurationChange?.(videoRef.current.duration || 0);
    setVideoDimensions({
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black rounded-lg overflow-hidden">
      {src ? (
        <video
          ref={videoRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onEnded}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="text-gray-500 text-center">
          <div className="text-3xl mb-4 font-medium">Video</div>
          <p>No video selected</p>
          <p className="text-sm">Upload a video to get started</p>
        </div>
      )}

      {videoDimensions.width > 0 && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {videoDimensions.width} x {videoDimensions.height}
        </div>
      )}
    </div>
  );
}
