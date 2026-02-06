import { useNavigate, useParams } from 'react-router';
import { getChallengeById } from '../lib/curriculum/explorers-hub-curriculum';
import SubmissionFlow from '../components/student/SubmissionFlow';

export default function SubmitChallengePage() {
  const navigate = useNavigate();
  const { challengeId } = useParams<{ challengeId: string }>();
  
  const challenge = challengeId ? getChallengeById(challengeId) : null;

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
          <button
            onClick={() => navigate('/quests')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Back to Quests
          </button>
        </div>
      </div>
    );
  }

  return (
    <SubmissionFlow
      studentId="temp-student-id" // Will be filled from auth
      studentName="Student" // Will be filled from auth
      studentAge={10} // Will be filled from profile
      studentTier="explorers" // Will be filled from profile
      challengeId={challenge.challengeId}
      challengeTitle={challenge.title}
      challengeType={challenge.subject}
      skillLevel="Grade4" // Will be determined from tier
      competencyId={challenge.ccssStandards?.[0] || 'general'}
      baseXP={challenge.xpReward}
      onComplete={(assessment) => {
        // Navigate back to quest or dashboard
        navigate(-1);
      }}
    />
  );
}