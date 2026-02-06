import { useNavigate } from 'react-router';
import { MariannaStory } from '../components/story/MariannaStory';
import { GameButton } from '../components/game-ui/GameButton';
import { Crown, ArrowLeft, Rocket } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-cyan-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-4 border-purple-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              <ArrowLeft className="size-5" />
              Back to Home
            </button>

            <div className="flex items-center gap-3">
              <Crown className="size-10 text-purple-600" strokeWidth={2.5} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-title)' }}>
                  Mz. Marianna's Academy
                </h1>
              </div>
            </div>

            <GameButton
              variant="primary"
              size="md"
              icon={Rocket}
              onClick={() => navigate('/placement-quiz')}
            >
              Start Quest
            </GameButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <MariannaStory variant="full" />
      </div>
    </div>
  );
}
