import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Info, Star } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import {
  type DevelopmentalArea,
  type IBCompetency,
  type CompetencyProgress,
  DEVELOPMENTAL_AREAS,
  getCompetenciesByArea,
} from '../../lib/ib-competencies';

interface IBCompetencyChecklistProps {
  studentId: string;
  selectedArea?: DevelopmentalArea;
  progress: Record<string, CompetencyProgress>;
  onUpdateProgress?: (competencyId: string, status: CompetencyProgress['status']) => void;
}

export function IBCompetencyChecklist({
  studentId,
  selectedArea,
  progress,
  onUpdateProgress,
}: IBCompetencyChecklistProps) {
  const [expandedArea, setExpandedArea] = useState<DevelopmentalArea | null>(
    selectedArea || null
  );
  const [expandedCompetency, setExpandedCompetency] = useState<string | null>(null);

  const areas = selectedArea 
    ? [selectedArea]
    : (Object.keys(DEVELOPMENTAL_AREAS) as DevelopmentalArea[]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">🌟 Your Learning Journey</h2>
        <p className="text-sm opacity-90">
          Track your growth across 7 developmental areas - every step counts!
        </p>
      </div>

      {/* Developmental Areas */}
      {areas.map((areaKey) => {
        const area = DEVELOPMENTAL_AREAS[areaKey];
        const competencies = getCompetenciesByArea(areaKey);
        const areaProgress = calculateAreaProgress(competencies, progress);
        const isExpanded = expandedArea === areaKey;

        return (
          <Card key={areaKey} className="overflow-hidden">
            {/* Area Header */}
            <button
              onClick={() => setExpandedArea(isExpanded ? null : areaKey)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{area.icon}</div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-gray-800">{area.name}</h3>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-2">
                  <div className="text-sm font-semibold text-gray-700">
                    {areaProgress.completed} / {areaProgress.total}
                  </div>
                  <div className="text-xs text-gray-500">Mastered</div>
                </div>
                <Progress value={areaProgress.percentage} className="w-20 h-2" />
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Competencies List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 space-y-3 bg-gradient-to-br from-gray-50 to-white">
                    {competencies.map((competency) => (
                      <CompetencyItem
                        key={competency.id}
                        competency={competency}
                        progress={progress[competency.id]}
                        isExpanded={expandedCompetency === competency.id}
                        onToggleExpand={() =>
                          setExpandedCompetency(
                            expandedCompetency === competency.id
                              ? null
                              : competency.id
                          )
                        }
                        onUpdateStatus={(status) =>
                          onUpdateProgress?.(competency.id, status)
                        }
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Individual Competency Item
 */
interface CompetencyItemProps {
  competency: IBCompetency;
  progress?: CompetencyProgress;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (status: CompetencyProgress['status']) => void;
}

function CompetencyItem({
  competency,
  progress,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
}: CompetencyItemProps) {
  const status = progress?.status || 'not_started';

  const statusConfig: Record<
    CompetencyProgress['status'],
    { icon: JSX.Element; color: string; label: string; progress: number }
  > = {
    not_started: {
      icon: <Circle className="w-5 h-5 text-gray-400" />,
      color: 'bg-gray-100 text-gray-700',
      label: 'Not Started',
      progress: 0,
    },
    emerging: {
      icon: <Circle className="w-5 h-5 text-blue-500 fill-blue-500 opacity-25" />,
      color: 'bg-blue-100 text-blue-700',
      label: 'Emerging',
      progress: 25,
    },
    developing: {
      icon: <Circle className="w-5 h-5 text-purple-500 fill-purple-500 opacity-50" />,
      color: 'bg-purple-100 text-purple-700',
      label: 'Developing',
      progress: 50,
    },
    proficient: {
      icon: <Circle className="w-5 h-5 text-amber-500 fill-amber-500 opacity-75" />,
      color: 'bg-amber-100 text-amber-700',
      label: 'Proficient',
      progress: 75,
    },
    mastered: {
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      color: 'bg-green-100 text-green-700',
      label: 'Mastered',
      progress: 100,
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Competency Header */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggleExpand}
            className="flex-shrink-0 mt-0.5"
          >
            {currentStatus.icon}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-800 text-sm">
                {competency.competency}
              </h4>
              <Badge variant="outline" className={`${currentStatus.color} text-xs flex-shrink-0`}>
                {currentStatus.label}
              </Badge>
            </div>

            <p className="text-xs text-gray-600 mb-2">
              {competency.description}
            </p>

            {/* Progress Bar */}
            <Progress value={currentStatus.progress} className="h-1.5 mb-2" />

            {/* Examples Preview */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>{competency.examples.length} examples • Age {competency.ageRange}</span>
              <button
                onClick={onToggleExpand}
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                {isExpanded ? 'Show less' : 'Learn more'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-gradient-to-br from-cyan-50 to-purple-50 p-4"
          >
            {/* Examples */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" />
                What This Looks Like:
              </h5>
              <ul className="space-y-1">
                {competency.examples.map((example, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-cyan-500 font-bold">•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Assessment Criteria */}
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Can Do Checklist:
              </h5>
              <ul className="space-y-1">
                {competency.assessmentCriteria.map((criteria, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Update Status Buttons */}
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Update progress:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([statusKey, config]) => (
                  <Button
                    key={statusKey}
                    onClick={() => onUpdateStatus(statusKey as CompetencyProgress['status'])}
                    variant={status === statusKey ? 'default' : 'outline'}
                    size="sm"
                    className={status === statusKey ? config.color : 'text-gray-600'}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Evidence Notes (if any) */}
            {progress?.evidenceNotes && progress.evidenceNotes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">
                  📝 Teacher Notes:
                </h5>
                <div className="space-y-1">
                  {progress.evidenceNotes.map((note, idx) => (
                    <p key={idx} className="text-sm text-gray-700 italic">
                      "{note}"
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Calculate progress for a developmental area
 */
function calculateAreaProgress(
  competencies: IBCompetency[],
  progress: Record<string, CompetencyProgress>
) {
  const total = competencies.length;
  const completed = competencies.filter(
    (c) => progress[c.id]?.status === 'mastered'
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}
