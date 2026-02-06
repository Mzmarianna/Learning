import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import RobloxEmbed from '../components/challenges/RobloxEmbed';
import PortfolioSubmission from '../components/student/PortfolioSubmission';
import { getGameById } from '../lib/curriculum/approved-roblox-games';
import { getSafetySettings } from '../lib/safety/child-safety';
import { getCurrentUser } from '../lib/supabase/auth';
import LoadingScreen from '../components/common/LoadingScreen';
import { toast } from 'sonner';

export default function RobloxChallengePage() {
  const { gameId, challengeId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [allowExternalPlay, setAllowExternalPlay] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameAndSettings();
  }, [gameId]);

  const loadGameAndSettings = async () => {
    try {
      // Get game info
      if (!gameId) {
        toast.error('No game ID provided');
        navigate(-1);
        return;
      }

      const gameData = getGameById(gameId);
      if (!gameData) {
        toast.error('Game not found or not approved');
        navigate(-1);
        return;
      }

      setGame(gameData);

      // Check safety settings
      const user = await getCurrentUser();
      if (user) {
        const safetySettings = await getSafetySettings(user.id);
        if (safetySettings) {
          setAllowExternalPlay(!safetySettings.contentFilter.blockExternalLinks);
        }
      }
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setShowSubmission(true);
  };

  const handleSubmissionComplete = () => {
    toast.success('Great work! Your submission has been recorded.');
    navigate('/dashboard/student');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Game Not Found</h1>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b-4 border-purple-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-2 border-purple-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Quest
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            🎮 Roblox Challenge
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!showSubmission ? (
          <RobloxEmbed
            game={game}
            allowExternalPlay={allowExternalPlay}
            onComplete={handleComplete}
          />
        ) : (
          <div className="space-y-6">
            {/* Transition Message */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-300 rounded-xl text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Ready to Submit!
              </h2>
              <p className="text-gray-700">
                Upload your screenshot(s) below to show what you accomplished in {game.gameName}!
              </p>
            </div>

            {/* Portfolio Submission */}
            <PortfolioSubmission
              challengeId={challengeId || 'roblox-challenge'}
              challengeTitle={game.gameName}
              onSubmit={handleSubmissionComplete}
              onCancel={() => setShowSubmission(false)}
              prefilledType="roblox"
            />
          </div>
        )}
      </div>
    </div>
  );
}