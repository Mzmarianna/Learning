import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Camera, CheckCircle, ExternalLink, AlertCircle, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface RobloxGame {
  gameId: string;
  gameName: string;
  gameUrl: string;
  thumbnailUrl?: string;
  instructions: string;
  completionCriteria: string[];
  estimatedMinutes: number;
}

interface RobloxEmbedProps {
  game: RobloxGame;
  onScreenshotCapture?: (screenshotUrl: string) => void;
  onComplete?: () => void;
  allowExternalPlay?: boolean; // Parent setting
}

export default function RobloxEmbed({
  game,
  onScreenshotCapture,
  onComplete,
  allowExternalPlay = false,
}: RobloxEmbedProps) {
  const [embedError, setEmbedError] = useState(false);
  const [playStarted, setPlayStarted] = useState(false);
  const [playTime, setPlayTime] = useState(0);

  // Track play time
  useEffect(() => {
    if (!playStarted) return;

    const timer = setInterval(() => {
      setPlayTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [playStarted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleScreenshotInstructions = () => {
    toast.info(
      <div className="space-y-2">
        <p className="font-bold">How to Take a Screenshot:</p>
        <ul className="text-sm space-y-1">
          <li>🖥️ <strong>Windows:</strong> Press Windows + Print Screen</li>
          <li>🍎 <strong>Mac:</strong> Press Cmd + Shift + 3</li>
          <li>📱 <strong>iPad:</strong> Press Power + Volume Up</li>
          <li>💻 <strong>Chromebook:</strong> Press Ctrl + Show Windows</li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Then click "Upload Screenshot" below to submit your work!
        </p>
      </div>,
      { duration: 10000 }
    );
  };

  const embedUrl = `https://www.roblox.com/games/${game.gameId}`;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <Card className="p-6 border-4 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-start gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{game.gameName}</h2>
            <p className="text-gray-700 mb-3">{game.instructions}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-purple-600 font-semibold">
                <Info className="w-4 h-4" />
                ~{game.estimatedMinutes} minutes
              </span>
              {playStarted && (
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  ⏱️ Playing: {formatTime(playTime)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Completion Criteria */}
        <div className="mt-4 p-4 bg-white rounded-xl border-2 border-purple-200">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            What You Need to Do:
          </h3>
          <ul className="space-y-2">
            {game.completionCriteria.map((criteria, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-purple-600 font-bold">{index + 1}.</span>
                <span>{criteria}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Safety Notice */}
      <Card className="p-4 border-2 border-blue-300 bg-blue-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-blue-900 mb-1">🔒 Safe Gaming Zone</p>
            <p className="text-blue-800">
              This Roblox game has been approved by your teacher. Stay in this game and don't click 
              external links. When you're done, take a screenshot to show your work!
            </p>
          </div>
        </div>
      </Card>

      {/* Embedded Roblox Game */}
      <Card className="overflow-hidden border-4 border-green-300">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              <span className="font-bold">Play Roblox Game</span>
            </div>
            <Button
              onClick={handleScreenshotInstructions}
              size="sm"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Camera className="w-4 h-4 mr-2" />
              Screenshot Help
            </Button>
          </div>
        </div>

        {/* Embedded Game Container */}
        <div className="relative bg-gray-900" style={{ paddingBottom: '56.25%' }}>
          {!embedError ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              onLoad={() => setPlayStarted(true)}
              onError={() => setEmbedError(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white p-8">
              <div className="text-center max-w-md">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h3 className="text-xl font-bold mb-2">Can't Embed Game</h3>
                <p className="text-gray-300 mb-4">
                  Some Roblox games can't be embedded. You can play it in a new tab and come back to submit your screenshot.
                </p>
                {allowExternalPlay && (
                  <Button
                    onClick={() => {
                      window.open(game.gameUrl, '_blank', 'noopener,noreferrer');
                      setPlayStarted(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in Roblox
                  </Button>
                )}
                {!allowExternalPlay && (
                  <p className="text-yellow-400 text-sm">
                    Ask your parent to enable external links in settings.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Screenshot Instructions */}
      <Card className="p-6 border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="flex items-start gap-4">
          <Camera className="w-10 h-10 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              📸 Submit Your Work
            </h3>
            <p className="text-gray-700 mb-4">
              After completing the challenge, take a screenshot showing your achievement and upload it below!
            </p>

            {/* Screenshot Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white rounded-lg border-2 border-yellow-200">
                <p className="font-semibold text-gray-900 mb-1">✅ Good Screenshots Show:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Your in-game username</li>
                  <li>• The completed task/build</li>
                  <li>• Any scores or achievements</li>
                  <li>• Clear, well-lit image</li>
                </ul>
              </div>
              <div className="p-3 bg-white rounded-lg border-2 border-yellow-200">
                <p className="font-semibold text-gray-900 mb-1">❌ Avoid:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Blurry or dark images</li>
                  <li>• Screenshots of other games</li>
                  <li>• Images with personal info</li>
                  <li>• Inappropriate content</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleScreenshotInstructions}
                variant="outline"
                className="border-2 border-yellow-400"
              >
                <Info className="w-4 h-4 mr-2" />
                How to Screenshot
              </Button>
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 flex-1"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                I'm Ready to Upload My Screenshot
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Educational Value */}
      <Card className="p-4 border-2 border-indigo-300 bg-indigo-50">
        <h4 className="font-bold text-indigo-900 mb-2">🧠 What You're Learning:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-2 bg-white rounded-lg text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-semibold text-gray-900">Problem Solving</div>
          </div>
          <div className="p-2 bg-white rounded-lg text-center">
            <div className="text-2xl mb-1">🏗️</div>
            <div className="font-semibold text-gray-900">Spatial Thinking</div>
          </div>
          <div className="p-2 bg-white rounded-lg text-center">
            <div className="text-2xl mb-1">🎨</div>
            <div className="font-semibold text-gray-900">Creativity</div>
          </div>
          <div className="p-2 bg-white rounded-lg text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-semibold text-gray-900">Logic & Reasoning</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
