import StudentAssessmentView from '../parent/StudentAssessmentView';

interface StudentAssessmentPanelProps {
  studentId: string;
  onDownloadReport?: () => void;
  onClose?: () => void;
}

export default function StudentAssessmentPanel({
  studentId,
  onDownloadReport,
  onClose
}: StudentAssessmentPanelProps) {
  return (
    <div className="relative">
      {onClose && (
        <div className="fixed top-4 left-4 z-40">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition-colors text-sm font-medium text-gray-700"
          >
            ← Back to Students
          </button>
        </div>
      )}
      <StudentAssessmentView
        studentId={studentId}
        onDownloadReport={onDownloadReport}
      />
    </div>
  );
}
