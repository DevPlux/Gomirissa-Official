"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

const VolumeIcon = ({ muted }: { muted: boolean }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {muted ? (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </>
    ) : (
      <>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </>
    )}
  </svg>
);

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.log('Playback failed:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-border rounded-full px-4 py-2 shadow-lg">
      <audio ref={audioRef} loop preload="auto">
        <source src="/fish.mp4" type="video/mp4" />
      </audio>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        className="h-10 w-10 rounded-full hover:bg-primary/10"
      >
        {isPlaying ? (
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="h-10 w-10 rounded-full hover:bg-primary/10"
      >
        <VolumeIcon muted={isMuted} />
      </Button>

      <span className="text-sm font-medium text-foreground/70 ml-1">
        🌊 Ocean Sounds
      </span>
    </div>
  );
}