import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Link2, FileText, Image, Video, CheckCircle, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { User } from '../../lib/types';
import {
  Project,
  ProjectSubmission,
  SubmittedFile,
  evaluateProjectWithAI,
  saveSubmission,
  getStudentSubmissions,
} from '../../lib/project-generator';
import { updateCompetencyMastery, saveCompetencyMastery } from '../../lib/adaptive-learning';

interface ProjectChallengeProps {
  project: Project;
  user: User;
  onComplete?: (evaluation: any) => void;
}

export default function ProjectChallenge({ project, user, onComplete }: ProjectChallengeProps) {
  const [stage, setStage] = useState<'briefing' | 'working' | 'submit' | 'evaluating' | 'results'>('briefing');
  const [files, setFiles] = useState<SubmittedFile[]>([]);
  const [studentNotes, setStudentNotes] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleAddLink = () => {
    if (!linkInput.trim()) return;

    const newFile: SubmittedFile = {
      type: 'link',
      url: linkInput,
      filename: 'Project Link',
      notes: '',
    };

    setFiles([...files, newFile]);
    setLinkInput('');
  };

  const handleFileUpload = (type: SubmittedFile['type']) => {
    // In production, this would handle actual file uploads
    // For demo, we'll create placeholder entries
    const placeholderFile: SubmittedFile = {
      type,
      url: `placeholder-${type}-${Date.now()}`,
      filename: `${type}-${Date.now()}.${type === 'screenshot' ? 'png' : type === 'video' ? 'mp4' : 'pdf'}`,
      notes: '',
    };

    setFiles([...files, placeholderFile]);
  };

  const handleSubmit = async () => {
    setStage('evaluating');

    // Create submission
    const submission: ProjectSubmission = {
      id: `sub-${Date.now()}`,
      projectId: project.id,
      studentId: user.uid,
      submittedAt: new Date(),
      files,
      studentNotes,
      status: 'submitted',
    };

    // Evaluate with AI
    const evaluationResult = await evaluateProjectWithAI(submission, project);
    
    submission.evaluation = evaluationResult;
    submission.status = 'evaluated';

    // Save submission
    saveSubmission(submission);

    // Update mastery for each competency
    project.competencies.forEach(compId => {
      const criterion = project.evaluationCriteria.find(c => c.competencyId === compId);
      const score = evaluationResult.criteriaScores.find(s => s.criterionId === criterion?.id);
      
      if (score) {
        const isSuccess = (score.pointsEarned / score.maxPoints) >= 0.7;
        const mastery = updateCompetencyMastery(
          null, // Would load existing in production
          compId,
          user.uid,
          project.subject,
          isSuccess,
          project.estimatedTime,
          isSuccess ? undefined : criterion?.description
        );
        saveCompetencyMastery(mastery);
      }
    });

    setEvaluation(evaluationResult);
    setStage('results');

    if (onComplete) {
      onComplete(evaluationResult);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {/* STAGE 1: BRIEFING */}
        {stage === 'briefing' && (
          <motion.div
            key="briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Wowl's Briefing */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px] flex-shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-4xl">
                    🦉
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-2">Wowl</h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {project.wowlPrompt}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 rounded-xl p-4 border border-cyan-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-300 font-semibold">Example Ideas:</span>
                </div>
                <ul className="space-y-1">
                  {project.exampleIdeas.map((idea, idx) => (
                    <li key={idx} className="text-slate-300 text-sm">• {idea}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
              <p className="text-slate-300 mb-6">{project.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Estimated Time</div>
                  <div className="text-white font-semibold">{project.estimatedTime} minutes</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Difficulty</div>
                  <div className="text-white font-semibold capitalize">{project.difficulty}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Subject</div>
                  <div className="text-white font-semibold capitalize">{project.subject}</div>
                </div>
              </div>

              {/* Platforms */}
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-3">Where to Build:</h3>
                <div className="space-y-2">
                  {project.platforms.map((platform, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        platform.isPreferred
                          ? 'bg-purple-900/30 border-purple-500/50'
                          : 'bg-slate-700/30 border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium capitalize">{platform.name}</span>
                        {platform.isPreferred && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      {platform.instructions && (
                        <p className="text-sm text-slate-400 mt-1">{platform.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Submit */}
              <div>
                <h3 className="text-white font-semibold mb-3">What to Submit:</h3>
                <div className="space-y-2">
                  {project.deliverables.map((deliverable, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      {deliverable.required ? (
                        <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-white">
                          {deliverable.description}
                          {!deliverable.required && (
                            <span className="text-slate-500 ml-2">(optional)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStage('working')}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-lg py-6"
            >
              Start Project <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* STAGE 2: WORKING */}
        {stage === 'working' && (
          <motion.div
            key="working"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
              <p className="text-slate-400 mb-6">Work on your project. When you're done, submit your work below.</p>

              {/* Quick Reference */}
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700">
                <h3 className="text-white font-semibold mb-2 text-sm">Quick Reference:</h3>
                <p className="text-slate-300 text-sm">{project.wowlPrompt}</p>
              </div>

              <Button
                onClick={() => setStage('submit')}
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              >
                I'm Done - Submit My Work <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: SUBMIT */}
        {stage === 'submit' && (
          <motion.div
            key="submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-2xl font-bold text-white mb-6">Submit Your Work</h2>

              {/* Upload Options */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-white font-semibold mb-2 block">Add Files:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => handleFileUpload('screenshot')}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Image className="w-6 h-6 text-cyan-400" />
                      <span className="text-sm text-white">Screenshot</span>
                    </button>
                    <button
                      onClick={() => handleFileUpload('video')}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Video className="w-6 h-6 text-purple-400" />
                      <span className="text-sm text-white">Video</span>
                    </button>
                    <button
                      onClick={() => handleFileUpload('photo')}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
                    >
                      <Image className="w-6 h-6 text-pink-400" />
                      <span className="text-sm text-white">Photo</span>
                    </button>
                    <button
                      onClick={() => handleFileUpload('document')}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 transition-colors"
                    >
                      <FileText className="w-6 h-6 text-emerald-400" />
                      <span className="text-sm text-white">Document</span>
                    </button>
                  </div>
                </div>

                {/* Link Input */}
                <div>
                  <label className="text-white font-semibold mb-2 block">Or Add a Link:</label>
                  <div className="flex gap-2">
                    <Input
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="https://www.roblox.com/games/..."
                      className="flex-1 bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={handleAddLink}
                      variant="outline"
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <Link2 className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Submitted Files:</h3>
                  <div className="space-y-2">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
                      >
                        <div className="flex items-center gap-3">
                          {file.type === 'screenshot' && <Image className="w-5 h-5 text-cyan-400" />}
                          {file.type === 'video' && <Video className="w-5 h-5 text-purple-400" />}
                          {file.type === 'photo' && <Image className="w-5 h-5 text-pink-400" />}
                          {file.type === 'document' && <FileText className="w-5 h-5 text-emerald-400" />}
                          {file.type === 'link' && <Link2 className="w-5 h-5 text-cyan-400" />}
                          <span className="text-white text-sm">{file.filename}</span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Notes */}
              <div className="mb-6">
                <label className="text-white font-semibold mb-2 block">
                  Explain Your Work (Optional):
                </label>
                <Textarea
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="What did you create? What challenges did you face? What are you proud of?"
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStage('working')}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Go Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={files.length === 0}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-50"
                >
                  Submit for Evaluation <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 4: EVALUATING */}
        {stage === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[3px]"
              >
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                  🦉
                </div>
              </motion.div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Wowl is Evaluating Your Work</h3>
            <p className="text-slate-400">Analyzing your submission...</p>
          </motion.div>
        )}

        {/* STAGE 5: RESULTS */}
        {stage === 'results' && evaluation && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score Display */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-6xl font-bold text-white mb-2">
                {evaluation.percentageScore}%
              </div>
              <div className="text-slate-300 text-lg mb-4">
                {evaluation.totalPoints} / {evaluation.maxPoints} points
              </div>
              <div className="inline-block bg-slate-800/60 rounded-lg px-4 py-2">
                <p className="text-white">{evaluation.wowlComment}</p>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Detailed Feedback</h3>
              
              {evaluation.criteriaScores.map((score: any, idx: number) => {
                const criterion = project.evaluationCriteria.find(c => c.id === score.criterionId);
                const percentage = (score.pointsEarned / score.maxPoints) * 100;
                
                return (
                  <div key={idx} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{criterion?.description}</h4>
                      <span className="text-slate-300">
                        {score.pointsEarned} / {score.maxPoints} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-slate-400 text-sm">{score.feedback}</p>
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            {evaluation.nextSteps.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
                <ul className="space-y-2">
                  {evaluation.nextSteps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-300">
                      <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => onComplete && onComplete(evaluation)}
              size="lg"
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white"
            >
              Continue Learning <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
