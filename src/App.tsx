import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink/30 overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-pink/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full py-8 px-4 text-center">
          <h1 
            className="text-6xl md:text-8xl font-glitch tracking-widest text-white text-glow-cyan glitch-effect"
            data-text="NEON BEATS"
          >
            NEON BEATS
          </h1>
          <p className="text-neon-pink text-glow-pink mt-4 tracking-widest uppercase font-digital text-2xl">Synthwave & Snake</p>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-4 max-w-7xl mx-auto w-full">
          
          {/* Game Section */}
          <div className="flex-1 flex justify-center w-full">
            <SnakeGame />
          </div>

          {/* Music Player Section */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <MusicPlayer />
            
            <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl backdrop-blur-sm">
              <h3 className="text-neon-cyan font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                SYSTEM STATUS
              </h3>
              <ul className="space-y-2 text-sm text-gray-400 font-mono">
                <li className="flex justify-between">
                  <span>AUDIO_ENGINE:</span>
                  <span className="text-neon-green">ONLINE</span>
                </li>
                <li className="flex justify-between">
                  <span>GAME_LOOP:</span>
                  <span className="text-neon-green">ACTIVE</span>
                </li>
                <li className="flex justify-between">
                  <span>AESTHETIC:</span>
                  <span className="text-neon-pink">MAXIMUM</span>
                </li>
              </ul>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-600 text-xs font-mono">
          <p>Â© {new Date().getFullYear()} NEON BEATS INC. // AI GENERATED AUDIO DEMO</p>
        </footer>
      </div>
    </div>
  );
}
