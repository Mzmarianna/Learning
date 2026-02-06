import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Brain, 
  Star, 
  Target, 
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  ChevronRight,
  Download,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import type { MasteryLevel } from '../../lib/wowl-mastery-engine';

interface AssessmentData {
  studentId: string;
  studentName: string;
  tier: string;
  baselineAssessment: {
    completedAt: Date;
    overallLevel: MasteryLevel;
    skillScores: {
      skill: string;
      subject: string;
      level: MasteryLevel;
      description: string;
    }[];
    strengths: string[];
    growthAreas: string[];
    recommendedStartingPoint: string;
  };
  currentProgress: {
    questsCompleted: number;
    totalQuests: number;
    challengesCompleted: number;
    totalXP: number;
    averageMastery: MasteryLevel;
    recentMasteryScores: {
      challengeTitle: string;
      subject: string;
      masteryLevel: MasteryLevel;
      completedAt: Date;
      xpEarned: number;
    }[];
  };
  masteryTrends: {
    week: string;
    math: number;
    reading: number;
    science: number;
    overall: number;
  }[];
}

interface StudentAssessmentViewProps {
  studentId: string;
  onDownloadReport?: () => void;
}

export default function StudentAssessmentView({ 
  studentId,
  onDownloadReport 
}: StudentAssessmentViewProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('month');

  // TODO: Replace with real data from Supabase
  const assessmentData: AssessmentData = {
    studentId: 'student-1',
    studentName: 'Alex Explorer',
    tier: 'explorers',
    baselineAssessment: {
      completedAt: new Date('2024-12-15'),
      overallLevel: 'developing',
      skillScores: [
        {
          skill: 'Number Sense',
          subject: 'Math',
          level: 'proficient',
          description: 'Strong understanding of place value and number relationships'
        },
        {
          skill: 'Reading Comprehension',
          subject: 'Reading',
          level: 'developing',
          description: 'Can identify main ideas but needs support with inference'
        },
        {
          skill: 'Problem Solving',
          subject: 'Math',
          level: 'developing',
          description: 'Approaches problems creatively but needs scaffolding for multi-step problems'
        },
        {
          skill: 'Written Expression',
          subject: 'Writing',
          level: 'emerging',
          description: 'Ideas are creative but needs support organizing thoughts'
        },
        {
          skill: 'Scientific Thinking',
          subject: 'Science',
          level: 'proficient',
          description: 'Excellent observation skills and natural curiosity'
        }
      ],
      strengths: [
        'Visual-spatial learning',
        'Creative problem-solving',
        'Strong in hands-on activities',
        'Excellent when using Roblox/gaming contexts'
      ],
      growthAreas: [
        'Multi-step problem solving',
        'Written organization',
        'Reading comprehension strategies',
        'Time management and focus'
      ],
      recommendedStartingPoint: 'Week 1: Number Adventures (with extra visual supports)'
    },
    currentProgress: {
      questsCompleted: 3,
      totalQuests: 12,
      challengesCompleted: 24,
      totalXP: 3450,
      averageMastery: 'proficient',
      recentMasteryScores: [
        {
          challengeTitle: 'Multiplication Arena Challenge',
          subject: 'Math',
          masteryLevel: 'mastered',
          completedAt: new Date('2025-01-10'),
          xpEarned: 150
        },
        {
          challengeTitle: 'Story Comprehension Quest',
          subject: 'Reading',
          masteryLevel: 'proficient',
          completedAt: new Date('2025-01-09'),
          xpEarned: 100
        },
        {
          challengeTitle: 'Fraction Pizza Party',
          subject: 'Math',
          masteryLevel: 'proficient',
          completedAt: new Date('2025-01-08'),
          xpEarned: 100
        },
        {
          challengeTitle: 'Science Experiment Log',
          subject: 'Science',
          masteryLevel: 'advanced',
          completedAt: new Date('2025-01-07'),
          xpEarned: 125
        }
      ]
    },
    masteryTrends: [
      { week: 'Week 1', math: 2, reading: 1.5, science: 2.5, overall: 2 },
      { week: 'Week 2', math: 2.5, reading: 2, science: 3, overall: 2.5 },
      { week: 'Week 3', math: 3, reading: 2.5, science: 3.5, overall: 3 },
      { week: 'Week 4', math: 3.5, reading: 3, science: 4, overall: 3.5 },
    ]
  };

  const masteryLevelToNumber = (level: MasteryLevel): number => {
    const map = { 'emerging': 1, 'developing': 2, 'proficient': 3, 'advanced': 4, 'mastered': 5 };
    return map[level];
  };

  const masteryLevelColor = (level: MasteryLevel): string => {
    const colors = {
      'emerging': 'bg-gray-400',
      'developing': 'bg-blue-400',
      'proficient': 'bg-green-500',
      'advanced': 'bg-purple-500',
      'mastered': 'bg-yellow-500'
    };
    return colors[level];
  };

  const masteryLevelLabel = (level: MasteryLevel): string => {
    const labels = {
      'emerging': 'Just Starting',
      'developing': 'Building Skills',
      'proficient': 'Got It!',
      'advanced': 'Strong Mastery',
      'mastered': 'Expert Level'
    };
    return labels[level];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {assessmentData.studentName}'s Learning Journey
            </h1>
            <p className="text-lg text-gray-600">
              Baseline assessment completed {assessmentData.baselineAssessment.completedAt.toLocaleDateString()}
            </p>
          </div>
          <Button
            onClick={onDownloadReport}
            variant="outline"
            className="border-2 border-purple-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </Button>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-4 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Baseline Level</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {masteryLevelLabel(assessmentData.baselineAssessment.overallLevel)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-4 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Current Average</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {masteryLevelLabel(assessmentData.currentProgress.averageMastery)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-4 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Quests Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessmentData.currentProgress.questsCompleted} / {assessmentData.currentProgress.totalQuests}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-600">Total XP Earned</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessmentData.currentProgress.totalXP.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Baseline Assessment Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-4 border-cyan-300 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Baseline Assessment Results</h2>
                <p className="text-gray-600">Initial skill evaluation to personalize learning</p>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="space-y-4 mb-6">
              {assessmentData.baselineAssessment.skillScores.map((skill, index) => (
                <motion.div
                  key={skill.skill}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl border-2 border-cyan-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-gray-900">{skill.skill}</h3>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                          {skill.subject}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{skill.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-2 ${masteryLevelColor(skill.level)} text-white font-bold rounded-lg text-sm`}>
                        {masteryLevelLabel(skill.level)}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`w-3 h-3 rounded-full ${
                              level <= masteryLevelToNumber(skill.level)
                                ? 'bg-purple-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Strengths & Growth Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {assessmentData.baselineAssessment.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Growth Areas</h3>
                </div>
                <ul className="space-y-2">
                  {assessmentData.baselineAssessment.growthAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-0.5">→</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Starting Point */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Wowl's Recommendation</h4>
                  <p className="text-gray-700">
                    {assessmentData.baselineAssessment.recommendedStartingPoint}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-8 border-4 border-purple-300 bg-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Recent Achievements</h2>
                  <p className="text-gray-600">Latest mastery scores and progress</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('week')}
                >
                  Week
                </Button>
                <Button
                  variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('month')}
                >
                  Month
                </Button>
                <Button
                  variant={selectedTimeframe === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe('all')}
                >
                  All Time
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {assessmentData.currentProgress.recentMasteryScores.map((score, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 ${masteryLevelColor(score.masteryLevel)} rounded-xl`}>
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{score.challengeTitle}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {score.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {score.completedAt.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                          <Star className="w-4 h-4" />
                          +{score.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-4 py-2 ${masteryLevelColor(score.masteryLevel)} text-white font-bold rounded-lg text-sm`}>
                      {masteryLevelLabel(score.masteryLevel)}
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= masteryLevelToNumber(score.masteryLevel)
                              ? 'bg-purple-600'
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Mastery Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-8 border-4 border-green-300 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mastery Trends</h2>
                <p className="text-gray-600">Progress over time by subject</p>
              </div>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-6">
              {assessmentData.masteryTrends.map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <h4 className="font-semibold text-gray-700">{week.week}</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Math</span>
                        <span className="font-semibold text-purple-600">{masteryLevelLabel(week.math === 1 ? 'emerging' : week.math === 2 ? 'developing' : week.math === 3 ? 'proficient' : week.math === 4 ? 'advanced' : 'mastered')}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${(week.math / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Reading</span>
                        <span className="font-semibold text-blue-600">{masteryLevelLabel(week.reading === 1 ? 'emerging' : week.reading === 2 ? 'developing' : week.reading === 3 ? 'proficient' : week.reading === 4 ? 'advanced' : 'mastered')}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${(week.reading / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Science</span>
                        <span className="font-semibold text-green-600">{masteryLevelLabel(week.science === 1 ? 'emerging' : week.science === 2 ? 'developing' : week.science === 3 ? 'proficient' : week.science === 4 ? 'advanced' : 'mastered')}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${(week.science / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Growth Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Growth Summary</h4>
                  <p className="text-gray-700">
                    {assessmentData.studentName} has shown consistent growth across all subjects! 
                    Science shows the strongest mastery, while reading comprehension is steadily improving. 
                    Math skills have progressed from developing to proficient level. Keep up the great work! 🎉
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Parent Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="p-6 border-4 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">How You Can Help</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Reading Support:</strong> Practice inference skills by asking "What do you think will happen next?" during story time</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Organization:</strong> Use visual planners or checklists to help organize multi-step tasks</span>
                  </li>
                  <li className="flex items-start gap-2 text-gray-700">
                    <ChevronRight className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Celebrate Effort:</strong> Praise the learning process, not just correct answers</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
