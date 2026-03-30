import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Drive (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cyber City Echoes', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Synthwave Dreams', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900/80 backdrop-blur-md border border-neon-pink/50 rounded-2xl p-4 glow-pink transition-all duration-300">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-neon-pink/20 glow-pink ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music className="w-6 h-6 text-neon-pink drop-shadow-[0_0_8px_#ff00ff]" />
          </div>
          <div>
            <h3 className="text-white font-medium text-glow-pink truncate max-w-[200px]">
              {currentTrack.title}
            </h3>
            <p className="text-neon-pink/70 text-xs uppercase tracking-wider">Now Playing</p>
          </div>
        </div>
        <button 
          onClick={toggleMute}
          className="text-neon-cyan text-glow-cyan hover:text-white transition-all drop-shadow-[0_0_5px_#00ffff]"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-800 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-neon-pink transition-all duration-100 ease-linear shadow-[0_0_10px_#ff00ff]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-8">
        <button 
          onClick={handlePrev}
          className="text-neon-pink text-glow-pink hover:text-white hover:scale-110 transition-all drop-shadow-[0_0_8px_#ff00ff]"
        >
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan glow-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_30px_#00ffff] transition-all"
        >
          {isPlaying ? <Pause className="w-8 h-8 drop-shadow-[0_0_8px_#00ffff]" /> : <Play className="w-8 h-8 ml-1 drop-shadow-[0_0_8px_#00ffff]" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="text-neon-pink text-glow-pink hover:text-white hover:scale-110 transition-all drop-shadow-[0_0_8px_#ff00ff]"
        >
          <SkipForward className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
