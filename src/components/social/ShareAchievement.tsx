import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Facebook, Twitter, Link2, Instagram, X, CheckCircle, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { toast } from 'sonner';

interface ShareAchievementProps {
  achievementTitle: string;
  achievementDescription: string;
  studentName: string;
  xpEarned: number;
  masteryLevel?: string;
  imageUrl?: string;
  onRequestParentApproval?: () => Promise<boolean>;
  requiresParentApproval?: boolean;
}

export default function ShareAchievement({
  achievementTitle,
  achievementDescription,
  studentName,
  xpEarned,
  masteryLevel,
  imageUrl,
  onRequestParentApproval,
  requiresParentApproval = true,
}: ShareAchievementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);
  const [hasApproval, setHasApproval] = useState(!requiresParentApproval);

  const shareText = `🎉 ${studentName} just earned ${xpEarned} XP at Mz. Marianna's Academy! ${achievementTitle} - ${achievementDescription}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleRequestApproval = async () => {
    if (!onRequestParentApproval) {
      toast.error('Parent approval system not configured');
      return;
    }

    setIsRequestingApproval(true);
    try {
      const approved = await onRequestParentApproval();
      if (approved) {
        setHasApproval(true);
        toast.success('Parent approved! You can now share this achievement.');
      } else {
        toast.info('Waiting for parent approval...');
      }
    } catch (error) {
      toast.error('Failed to request parent approval');
    } finally {
      setIsRequestingApproval(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'link' | 'instagram') => {
    if (!hasApproval) {
      toast.error('You need parent approval to share');
      return;
    }

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct web sharing, so copy to clipboard
        navigator.clipboard.writeText(shareText);
        toast.success('Achievement copied! Paste it in your Instagram story or post 📸');
        return;
      case 'link':
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success('Link copied to clipboard!');
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
      toast.success(`Shared to ${platform}!`);
    }
  };

  return (
    <>
      {/* Share Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="border-2 border-purple-300 hover:bg-purple-50"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <Card className="p-8 border-4 border-purple-300 bg-white">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <Share2 className="w-8 h-8 text-purple-600" />
                      Share Your Achievement
                    </h2>
                    <p className="text-gray-600">
                      Show the world what you've accomplished!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Achievement Preview */}
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                  {imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={achievementTitle}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">🏆</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {achievementTitle}
                      </h3>
                      <p className="text-gray-700 mb-3">{achievementDescription}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 font-bold rounded-full">
                          +{xpEarned} XP
                        </span>
                        {masteryLevel && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 font-bold rounded-full capitalize">
                            {masteryLevel} Level
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent Approval Section */}
                {requiresParentApproval && !hasApproval && (
                  <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">
                          Parent Approval Required
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">
                          To keep you safe, we need your parent's permission before you can share on social media.
                        </p>
                        <Button
                          onClick={handleRequestApproval}
                          disabled={isRequestingApproval}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          {isRequestingApproval ? 'Requesting...' : 'Ask Parent for Permission'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Approval Granted */}
                {hasApproval && (
                  <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">
                        ✓ Approved! You can now share this achievement.
                      </p>
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">Choose where to share:</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => handleShare('facebook')}
                      disabled={!hasApproval}
                      className="bg-[#1877F2] hover:bg-[#1564D6] text-white h-auto py-4"
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      <div className="text-left flex-1">
                        <div className="font-bold">Facebook</div>
                        <div className="text-xs opacity-90">Share on your timeline</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleShare('twitter')}
                      disabled={!hasApproval}
                      className="bg-[#1DA1F2] hover:bg-[#1A8CD8] text-white h-auto py-4"
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                      <div className="text-left flex-1">
                        <div className="font-bold">Twitter</div>
                        <div className="text-xs opacity-90">Post a tweet</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleShare('instagram')}
                      disabled={!hasApproval}
                      className="bg-gradient-to-r from-[#E4405F] via-[#F77737] to-[#FCAF45] hover:opacity-90 text-white h-auto py-4"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      <div className="text-left flex-1">
                        <div className="font-bold">Instagram</div>
                        <div className="text-xs opacity-90">Copy for story/post</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() => handleShare('link')}
                      disabled={!hasApproval}
                      variant="outline"
                      className="border-2 border-gray-300 hover:bg-gray-50 h-auto py-4"
                    >
                      <Link2 className="w-5 h-5 mr-2" />
                      <div className="text-left flex-1">
                        <div className="font-bold">Copy Link</div>
                        <div className="text-xs opacity-90">Share anywhere</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-xs text-gray-600">
                    <strong>🔒 Privacy & Safety:</strong> Only share achievements publicly if you have parent permission. 
                    Never share personal information like your full name, age, school, or location on social media.
                  </p>
                </div>

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
