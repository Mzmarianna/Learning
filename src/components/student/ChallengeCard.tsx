import { Input } from '../ui/input';
import RewardOverlay from './RewardOverlay';
import { useNavigate } from 'react-router';

interface ChallengeCardProps {
  challenge: ChallengeInstance;
  questInstance: QuestInstance;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ChallengeCard({
  challenge,
  questInstance,
  onClose,
  onUpdate,
}: ChallengeCardProps) {
  const navigate = useNavigate();
  const [studentNotes, setStudentNotes] = useState(challenge.studentNotes || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if this is a Roblox challenge
  const isRobloxChallenge = challenge.challengeNumber === 2; // "Roblox Multiplication Arena"
  const robloxGameId = isRobloxChallenge ? '606849621' : null;

  // Mock challenge template data (in production, this would come from Firestore)
  const challengeTemplate = {
    title: `Challenge ${challenge.challengeNumber}: ${getChallengeTitle(challenge.challengeNumber)}`,
    instructions: getChallengeInstructions(challenge.challengeNumber),
    videoUrl: challenge.challengeNumber === 1 ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : undefined,
    estimatedMinutes: 15,
    baseXP: 50,
    evidenceType: challenge.challengeNumber % 3 === 0 ? 'video' : 'image',
    evidencePrompt: getEvidencePrompt(challenge.challengeNumber),
  };

  function getChallengeTitle(num: number): string {
    const titles = [
      'Pre-Assessment',
      'Roblox Multiplication Arena',
      'Fraction Pizza Party',
      'Number Pattern Detective',
      'Math Story Problems',
      'Times Table Challenge',
      'Division Quest',
      'Midpoint Check-In',
      'Area & Perimeter Builder',
      'Money Math Mission',
      'Measurement Master',
      'Data & Graphs Explorer',
      'Word Problem Wizard',
      'Math Game Creation',
      'Real World Math Hunt',
      'Grand Celebration Quest',
    ];
    return titles[num - 1] || 'Math Challenge';
  }

  function getChallengeInstructions(num: number): string {
    if (num === 1) {
      return 'Welcome to your first challenge! Watch the video to learn what we\'ll be exploring. Then answer a few questions to show what you already know. No pressure - this helps us understand where to start!';
    }
    if (num === 8) {
      return 'You\'re halfway through! Let\'s pause and reflect on what you\'ve learned. Complete the midpoint activities and share your favorite discovery so far.';
    }
    if (num === 16) {
      return '🎉 Congratulations! You\'ve reached the final celebration! Show off everything you\'ve learned by creating your own math game or project. Make it fun and creative!';
    }
    return `Complete the activity and submit your work. Remember to take your time and ask for help if you need it. You've got this! 💪`;
  }

  function getEvidencePrompt(num: number): string {
    if (num % 3 === 0) {
      return '📹 Record a short video (30-60 seconds) showing your work or explaining your answer.';
    }
    return '📸 Take a photo of your completed work, screenshot, or Roblox achievement.';
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Simulate upload/submission (in production, this would upload to Firebase Storage)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show reward overlay
    setShowReward(true);

    // In production, this would update Firestore
    console.log('Submitting challenge:', {
      challengeId: challenge.id,
      notes: studentNotes,
      file: uploadedFile?.name,
      xpAwarded: challengeTemplate.baseXP,
    });

    // Wait for celebration, then update
    setTimeout(() => {
      setShowReward(false);
      setSubmitting(false);
      onUpdate();
    }, 3000);
  };

  const canSubmit = uploadedFile !== null && challenge.status !== 'submitted' && challenge.status !== 'approved';
  const isCompleted = challenge.status === 'approved';
  const isPending = challenge.status === 'submitted';

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-calm-surface border-4 border-calm-primary rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-calm-primary text-white p-6 flex items-start justify-between z-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xl">{challenge.challengeNumber}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl">{challengeTemplate.title}</h2>
                    <p className="text-sm text-white/80">
                      ⏱️ {challengeTemplate.estimatedMinutes} minutes • ⭐ {challengeTemplate.baseXP} XP
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              {isCompleted && (
                <div className="reward-bg text-white rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Challenge Mastered! 🌟</p>
                    <p className="text-sm text-white/90">You've completed this challenge. Great work!</p>
                  </div>
                </div>
              )}

              {isPending && (
                <div className="bg-warning-light border-2 border-warning rounded-xl p-4 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-warning" />
                  <div>
                    <p className="font-semibold text-warning">Under Review</p>
                    <p className="text-sm text-muted-foreground">
                      Your tutor is reviewing your work. Check back soon!
                    </p>
                  </div>
                </div>
              )}

              {/* Video Section */}
              {challengeTemplate.videoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-calm-primary">
                    <Video className="w-5 h-5" />
                    <h3 className="font-semibold">📺 Watch First</h3>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      className="w-full h-full"
                      src={challengeTemplate.videoUrl}
                      title="Challenge Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Instructions Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-calm-primary">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-semibold">📝 Instructions</h3>
                </div>
                <div className="bg-calm-bg rounded-lg p-4">
                  <p className="text-lg leading-relaxed">{challengeTemplate.instructions}</p>
                </div>
                
                {/* Roblox Game Button */}
                {isRobloxChallenge && robloxGameId && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-300 rounded-xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
                        <Gamepad2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">🎮 Play Approved Roblox Game</h4>
                        <p className="text-sm text-gray-700">
                          Click below to play the Math Obby Adventure game in a safe, embedded environment!
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        onClose();
                        navigate(`/roblox-challenge/${robloxGameId}/${challenge.id}`);
                      }}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <Gamepad2 className="w-5 h-5 mr-2" />
                      Launch Roblox Challenge
                    </Button>
                  </div>
                )}
                
                {/* Audio Read-Aloud Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    // In production, use Web Speech API
                    const utterance = new SpeechSynthesisUtterance(challengeTemplate.instructions);
                    speechSynthesis.speak(utterance);
                  }}
                >
                  <Volume2 className="w-4 h-4" />
                  Read Instructions Aloud
                </Button>
              </div>

              {/* Activity/Work Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-calm-primary">🎯 Your Turn!</h3>
                <div className="bg-success-light border-2 border-success rounded-lg p-4">
                  <p className="text-success font-semibold mb-2">What to do:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Complete the activity (on paper, in Roblox, or as a project)</li>
                    <li>Take a photo or screenshot of your work</li>
                    <li>Upload it below and add any notes</li>
                    <li>Click "Submit Quest" to earn your XP!</li>
                  </ol>
                </div>
              </div>

              {/* Upload Evidence Section */}
              {!isCompleted && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-calm-primary">
                    <Upload className="w-5 h-5" />
                    <h3 className="font-semibold">📤 Submit Your Work</h3>
                  </div>
                  
                  <div className="bg-calm-bg rounded-lg p-4 space-y-3">
                    <p className="text-sm text-muted-foreground">{challengeTemplate.evidencePrompt}</p>
                    
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-calm-border rounded-lg p-6 text-center hover:border-calm-primary transition-colors">
                      <Input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        disabled={isPending}
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-calm-primary" />
                        {uploadedFile ? (
                          <div>
                            <p className="font-semibold text-success">✓ {uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-semibold">Click to upload</p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, MP4 (max 10MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Student Notes */}
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        💬 Add a note (optional)
                      </label>
                      <Textarea
                        value={studentNotes}
                        onChange={(e) => setStudentNotes(e.target.value)}
                        placeholder="Tell your tutor about your work, any challenges you faced, or questions you have..."
                        rows={3}
                        disabled={isPending}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tutor Feedback (if exists) */}
              {challenge.tutorFeedback && (
                <div className="bg-reward-purple-light border-2 border-reward-purple rounded-lg p-4">
                  <p className="font-semibold text-reward-purple mb-2">💜 Tutor Feedback</p>
                  <p className="text-sm">{challenge.tutorFeedback}</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-calm-surface border-t-2 border-calm-border p-6 flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              {!isCompleted && !isPending && (
                <Button
                  className="flex-1 reward-bg hover:opacity-90 text-white"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? 'Submitting...' : '🚀 Submit Quest'}
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Reward Overlay */}
      {showReward && (
        <RewardOverlay
          xpAwarded={challengeTemplate.baseXP}
          title="Quest Complete!"
          message="Great work! Your tutor will review your submission."
        />
      )}
    </>
  );
}