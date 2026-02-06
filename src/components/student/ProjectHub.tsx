import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Lightbulb, 
  Rocket, 
  Award, 
  Clock, 
  Target,
  ChevronRight,
  CheckCircle2,
  Play,
  Gamepad2,
  Blocks,
  Video,
  Image,
  FileText,
  Zap
} from 'lucide-react';
import { Button } from '../ui/button';
import { User } from '../../lib/types';
import { 
  generateInquiryProject, 
  inquiryToProject, 
  InquiryProjectTemplate,
  getProjectScaffolding
} from '../../lib/curriculum-project-mapper';
import { getStudentCompetencies } from '../../lib/adaptive-learning';
import ProjectChallenge from './ProjectChallenge';

interface ProjectHubProps {
  user: User;
  currentSubject?: 'math' | 'reading' | 'writing' | 'spelling';
}

export default function ProjectHub({ user, currentSubject = 'math' }: ProjectHubProps) {
  const [availableProjects, setAvailableProjects] = useState<InquiryProjectTemplate[]>([]);
  const [selectedProject, setSelectedProject] = useState<InquiryProjectTemplate | null>(null);
  const [showProjectChallenge, setShowProjectChallenge] = useState(false);
  const [inProgressProjects, setInProgressProjects] = useState<string[]>([]);

  useEffect(() => {
    loadAvailableProjects();
    loadInProgressProjects();
  }, [user.uid, currentSubject]);

  const loadAvailableProjects = () => {
    // Generate 3 project options for student
    const project1 = generateInquiryProject(user.uid, currentSubject);
    const project2 = generateInquiryProject(user.uid, currentSubject);
    const project3 = generateInquiryProject(user.uid, currentSubject);

    const projects = [project1, project2, project3].filter(p => p !== null) as InquiryProjectTemplate[];
    setAvailableProjects(projects);
  };

  const loadInProgressProjects = () => {
    const saved = localStorage.getItem(`inProgressProjects-${user.uid}`);
    if (saved) {
      setInProgressProjects(JSON.parse(saved));
    }
  };

  const startProject = (project: InquiryProjectTemplate) => {
    setSelectedProject(project);
    setShowProjectChallenge(true);
    
    // Mark as in progress
    const updated = [...inProgressProjects, project.id];
    setInProgressProjects(updated);
    localStorage.setItem(`inProgressProjects-${user.uid}`, JSON.stringify(updated));
  };

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'roblox': return <Gamepad2 className="w-5 h-5" />;
      case 'minecraft': return <Blocks className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'photo': return <Image className="w-5 h-5" />;
      case 'written': return <FileText className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'foundation': return 'from-emerald-500 to-teal-500';
      case 'intermediate': return 'from-cyan-500 to-blue-500';
      case 'advanced': return 'from-purple-500 to-pink-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getDifficultyBorder = (difficulty: string) => {
    switch(difficulty) {
      case 'foundation': return 'border-emerald-500/50';
      case 'intermediate': return 'border-cyan-500/50';
      case 'advanced': return 'border-purple-500/50';
      default: return 'border-slate-500/50';
    }
  };

  if (showProjectChallenge && selectedProject) {
    const project = inquiryToProject(selectedProject);
    return (
      <ProjectChallenge
        project={project}
        studentId={user.uid}
        onComplete={() => {
          setShowProjectChallenge(false);
          setSelectedProject(null);
          // Remove from in-progress
          const updated = inProgressProjects.filter(id => id !== selectedProject.id);
          setInProgressProjects(updated);
          localStorage.setItem(`inProgressProjects-${user.uid}`, JSON.stringify(updated));
        }}
        onBack={() => {
          setShowProjectChallenge(false);
          setSelectedProject(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-12 border border-purple-500/30 shadow-2xl"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%' 
              }}
              animate={{
                y: ['-10%', '110%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Project Hub</h1>
                <p className="text-slate-300 text-lg">Build. Create. Master.</p>
              </div>
            </div>

            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
              Apply your skills to real-world projects. Build in Roblox, Minecraft, or any platform you choose.
              Each project is matched to your current abilities.
            </p>
          </div>

          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="hidden lg:block"
          >
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 opacity-50 blur-2xl" />
          </motion.div>
        </div>
      </motion.div>

      {/* Available Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Available Projects</h2>
          </div>
          <span className="text-sm text-slate-400">
            {availableProjects.length} projects matched to your level
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableProjects.map((project, idx) => {
            const isInProgress = inProgressProjects.includes(project.id);
            
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border-2 ${getDifficultyBorder(project.difficulty)} shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                onClick={() => !isInProgress && startProject(project)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor(project.difficulty)} opacity-0 group-hover:opacity-10 transition-opacity`} />

                {/* Content */}
                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${getDifficultyColor(project.difficulty)} text-white text-xs font-bold uppercase tracking-wide`}>
                      {project.difficulty}
                    </div>
                    
                    {isInProgress && (
                      <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/50 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-xs text-amber-300 font-semibold">In Progress</span>
                      </div>
                    )}
                  </div>

                  {/* Project Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  {/* Driving Question */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                    <p className="text-sm text-purple-300 font-medium italic">
                      "{project.drivingQuestion}"
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    {/* Time estimate */}
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{project.estimatedTime} minutes</span>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-2">
                      {project.platforms.slice(0, 3).map((platform, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                            platform.isPreferred
                              ? 'bg-emerald-500/20 border border-emerald-500/50'
                              : 'bg-slate-700/40 border border-slate-600'
                          }`}
                        >
                          {getPlatformIcon(platform.name)}
                          <span className={`text-xs font-medium ${
                            platform.isPreferred ? 'text-emerald-300' : 'text-slate-400'
                          }`}>
                            {platform.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Competencies */}
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-400">
                        {project.competencyIds.length} skills
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      startProject(project);
                    }}
                    disabled={isInProgress}
                    className={`w-full ${
                      isInProgress
                        ? 'bg-amber-600 hover:bg-amber-500'
                        : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500'
                    } text-white font-semibold rounded-xl py-6 transition-all group-hover:shadow-lg`}
                  >
                    {isInProgress ? (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Continue Project
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Start Project
                      </>
                    )}
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Phases Preview (expandable on hover) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  whileHover={{ height: 'auto', opacity: 1 }}
                  className="border-t border-slate-700 bg-slate-800/50 overflow-hidden"
                >
                  <div className="p-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Project Phases:</h4>
                    <div className="space-y-1">
                      {project.phases.map((phase, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                          <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold">
                            {phase.phase}
                          </div>
                          <span>{phase.name}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">{phase.duration}min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {availableProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Projects Available Yet</h3>
          <p className="text-slate-400">
            Complete some lessons first, and I'll generate projects matched to your skills.
          </p>
        </motion.div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Zap className="w-6 h-6" />, label: 'Projects Completed', value: '0', color: 'cyan' },
          { icon: <Award className="w-6 h-6" />, label: 'Skills Mastered', value: '0', color: 'purple' },
          { icon: <Target className="w-6 h-6" />, label: 'In Progress', value: inProgressProjects.length, color: 'pink' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            className={`bg-gradient-to-br from-slate-900 to-slate-800 border border-${stat.color}-500/30 rounded-2xl p-6 text-center`}
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 border border-${stat.color}-500/50 flex items-center justify-center mx-auto mb-3 text-${stat.color}-400`}>
              {stat.icon}
            </div>
            <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
