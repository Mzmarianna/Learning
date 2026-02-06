/**
 * Challenge Detail Modal
 * Shows full challenge details with submission interface
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Upload, FileText, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';
import type { WarriorChallenge } from '@/lib/curriculum-index';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface ChallengeDetailModalProps {
  challenge: WarriorChallenge;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submissionData: any) => Promise<void>;
}

export default function ChallengeDetailModal({
  challenge,
  isOpen,
  onClose,
  onSubmit,
}: ChallengeDetailModalProps) {
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        type: challenge.submissionType,
        content: challenge.submissionType === 'text' ? submissionText : submissionFiles,
      };
      await onSubmit(submissionData);
      setSubmissionText('');
      setSubmissionFiles([]);
      onClose();
    } catch (error) {
      console.error('Error submitting challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmissionIcon = () => {
    switch (challenge.submissionType) {
      case 'text': return FileText;
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'screenshot': return ImageIcon;
      case 'digital': return LinkIcon;
      case 'multiple': return Upload;
      default: return FileText;
    }
  };

  const SubmissionIcon = getSubmissionIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-700">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-blue-600 text-white">
                    {challenge.dayOfWeek}
                  </Badge>
                  <Badge className="bg-purple-600 text-white">
                    {challenge.subject}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {challenge.title}
                </h2>
                <p className="text-slate-300">
                  {challenge.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6 space-y-6">
              {/* Instructions */}
              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  📋 Instructions
                </h3>
                <ol className="space-y-2">
                  {challenge.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Mastery Requirements */}
              <section>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  ✨ Mastery Requirements
                </h3>
                <div className="space-y-2">
                  {challenge.masteryRequirements.map((requirement, index) => (
                    <div key={index} className="flex gap-3 text-slate-300">
                      <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-400 mt-0.5" />
                      <span>{requirement}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Materials (if any) */}
              {challenge.materials && challenge.materials.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    🛠️ Materials Needed
                  </h3>
                  <ul className="space-y-1 text-slate-300">
                    {challenge.materials.map((material, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-purple-400">•</span>
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Standards */}
              {challenge.ccssStandards && challenge.ccssStandards.length > 0 && (
                <section>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    📚 Standards
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {challenge.ccssStandards.map((standard, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Submission Section */}
              <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <SubmissionIcon className="w-5 h-5 text-purple-400" />
                  Submit Your Work
                </h3>
                
                <div className="space-y-4">
                  {challenge.submissionType === 'text' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Type or paste your response:
                      </label>
                      <Textarea
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="Write your response here..."
                        rows={8}
                        className="w-full bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  )}

                  {(challenge.submissionType === 'image' || 
                    challenge.submissionType === 'video' || 
                    challenge.submissionType === 'screenshot') && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Upload your {challenge.submissionType}:
                      </label>
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-300 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500">
                          {challenge.submissionType === 'image' && 'PNG, JPG up to 10MB'}
                          {challenge.submissionType === 'video' && 'MP4, MOV up to 100MB'}
                          {challenge.submissionType === 'screenshot' && 'PNG, JPG up to 10MB'}
                        </p>
                      </div>
                    </div>
                  )}

                  {challenge.submissionType === 'digital' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Share a link to your digital work:
                      </label>
                      <input
                        type="url"
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Google Docs, Slides, Roblox game links, etc.
                      </p>
                    </div>
                  )}

                  {challenge.submissionType === 'multiple' && (
                    <div>
                      <label className="block text-sm text-slate-400 mb-2">
                        Upload multiple files:
                      </label>
                      <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-300 mb-1">
                          Upload images, videos, documents, or links
                        </p>
                        <p className="text-sm text-slate-500">
                          Multiple files allowed
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-900/50">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>⏱️ Estimated: {challenge.estimatedMinutes} min</span>
                <span>⚡ Reward: {challenge.xpReward} XP</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!submissionText && submissionFiles.length === 0)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Challenge'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
