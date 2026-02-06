import {
  WeekSchedule,
  WeeklyLesson,
  PracticeGame,
  getCurrentWeekSchedule,
  getTodaysLesson,
  getNextLesson,
  calculateWeekProgress,
  getSubjectColor,
  getSubjectIcon,
  markLessonCompleted,
} from '../../lib/explorers-weekly-schedule';

interface ExplorerWeeklyScheduleProps {
  studentId: string;
  currentWeek?: number;
}

export default function ExplorerWeeklySchedule({ 
  studentId, 
  currentWeek = 1 
}: ExplorerWeeklyScheduleProps) {
  const [schedule, setSchedule] = useState<WeekSchedule>(getCurrentWeekSchedule());
  const [selectedLesson, setSelectedLesson] = useState<WeeklyLesson | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const todaysLesson = getTodaysLesson(schedule, new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const nextLesson = getNextLesson(schedule);
  const weekProgress = calculateWeekProgress(schedule);

  const handleMarkComplete = (lessonId: string) => {
    const updatedSchedule = markLessonCompleted(lessonId, schedule);
    setSchedule(updatedSchedule);
    
    // In production, this would save to Supabase
    console.log('✅ Lesson marked complete:', lessonId);
  };

  const handleJoinClass = (googleMeetLink?: string) => {
    if (googleMeetLink) {
      window.open(googleMeetLink, '_blank');
    }
  };

  const getDayStatus = (day: string): 'past' | 'today' | 'future' => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const todayName = days[today];
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    
    const currentDayIndex = dayOrder.indexOf(todayName);
    const checkDayIndex = dayOrder.indexOf(day);
    
    if (checkDayIndex < 0) return 'future';
    if (checkDayIndex < currentDayIndex) return 'past';
    if (checkDayIndex === currentDayIndex) return 'today';
    return 'future';
  };

  return (
    <div className="space-y-6">
      {/* Week Header */}
      <div className="bg-gradient-to-br from-calm-primary to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6" />
              <span className="text-sm font-semibold opacity-90">WEEK {schedule.weekNumber}</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{schedule.weekTheme}</h2>
            <p className="text-white/90 text-sm">
              Explorers of Knowledge • {schedule.lessons.length} Live Lessons
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5" />
              <span className="font-bold">{schedule.totalXP} XP</span>
            </div>
            <div className="text-xs opacity-90">Total Available</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Week Progress</span>
            <span className="font-bold">{weekProgress}%</span>
          </div>
          <Progress value={weekProgress} className="h-3 bg-white/20" />
        </div>
      </div>

      {/* Today's Lesson Highlight */}
      {todaysLesson && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-purple-300 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getSubjectColor(todaysLesson.subject)} flex items-center justify-center text-4xl shadow-lg flex-shrink-0`}>
              {getSubjectIcon(todaysLesson.subject)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-600 text-white">📍 TODAY</Badge>
                <Badge variant="outline">{todaysLesson.day}</Badge>
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {todaysLesson.subject}: {todaysLesson.title}
              </h3>
              
              <p className="text-gray-700 mb-4">{todaysLesson.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-700 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">
                    {todaysLesson.startTime} – {todaysLesson.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold">{todaysLesson.xpReward} XP</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleJoinClass(todaysLesson.googleMeetLink)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Class Now
                </Button>
                <Button
                  onClick={() => {
                    setSelectedLesson(todaysLesson);
                    setShowDetails(true);
                  }}
                  variant="outline"
                  className="border-2 border-purple-300"
                >
                  <Book className="w-5 h-5 mr-2" />
                  View Details
                </Button>
                {todaysLesson.status === 'upcoming' && (
                  <Button
                    onClick={() => handleMarkComplete(todaysLesson.id)}
                    variant="outline"
                    className="border-2 border-purple-300"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Weekly Schedule Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-calm-primary" />
          This Week's Lessons
        </h3>
        
        <div className="grid gap-4">
          {schedule.lessons.map((lesson, index) => {
            const dayStatus = getDayStatus(lesson.day);
            const isToday = todaysLesson?.id === lesson.id;
            
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  border-2 rounded-xl p-5 transition-all cursor-pointer
                  ${isToday 
                    ? 'bg-purple-50 border-purple-400 shadow-md' 
                    : 'bg-calm-surface border-calm-border hover:border-cyan-400'
                  }
                  ${lesson.status === 'completed' ? 'opacity-75' : ''}
                `}
                onClick={() => {
                  setSelectedLesson(lesson);
                  setShowDetails(true);
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Day Badge */}
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`
                      w-16 h-16 rounded-xl bg-gradient-to-br ${getSubjectColor(lesson.subject)} 
                      flex items-center justify-center text-3xl shadow-md
                    `}>
                      {getSubjectIcon(lesson.subject)}
                    </div>
                    {lesson.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-semibold">
                        {lesson.day}
                      </Badge>
                      <Badge className={`${getSubjectColor(lesson.subject)} bg-gradient-to-r text-white border-0`}>
                        {lesson.subject}
                      </Badge>
                      {isToday && (
                        <Badge className="bg-purple-600 text-white">UP NEXT</Badge>
                      )}
                    </div>

                    <h4 className="font-bold text-lg mb-1">
                      {lesson.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {lesson.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.startTime} – {lesson.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{lesson.xpReward} XP</span>
                      </div>
                      {lesson.materials && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>{lesson.materials.length} materials needed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex flex-col items-end gap-2">
                    {lesson.status === 'completed' && (
                      <span className="text-xs text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                        ✓ Completed
                      </span>
                    )}
                    {dayStatus === 'today' && lesson.status === 'upcoming' && (
                      <span className="text-xs text-purple-600 font-semibold bg-purple-100 px-3 py-1 rounded-full">
                        ⏰ Today
                      </span>
                    )}
                    {dayStatus === 'future' && (
                      <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Lesson Details Modal */}
      <AnimatePresence>
        {showDetails && selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-br ${getSubjectColor(selectedLesson.subject)} p-6 text-white`}>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{getSubjectIcon(selectedLesson.subject)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-white/20 text-white border-white/40">
                        {selectedLesson.day}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/40">
                        {selectedLesson.subject}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{selectedLesson.title}</h3>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedLesson.startTime} – {selectedLesson.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {selectedLesson.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="font-bold text-lg mb-2">📝 Description</h4>
                  <p className="text-gray-700">{selectedLesson.description}</p>
                </div>

                {/* Learning Objectives */}
                {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-2">🎯 Learning Objectives</h4>
                    <ul className="space-y-2">
                      {selectedLesson.objectives.map((objective, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Materials Needed */}
                {selectedLesson.materials && selectedLesson.materials.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-2">🎒 Materials Needed</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedLesson.materials.map((material, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-cyan-600">•</span>
                          <span className="text-gray-700">{material}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practice Games */}
                {selectedLesson.practiceGames && selectedLesson.practiceGames.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      🎮 Practice Games & Activities
                    </h4>
                    <div className="space-y-3">
                      {selectedLesson.practiceGames.map((game, i) => (
                        <motion.a
                          key={i}
                          href={game.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl hover:border-purple-400 transition-all group"
                        >
                          <div className="text-3xl flex-shrink-0">{game.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                                {game.name}
                              </h5>
                              <ExternalLink className="w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{game.description}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="bg-purple-100 px-2 py-0.5 rounded-full font-medium">
                                {game.gameType}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                ~{game.estimatedMinutes} min
                              </span>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      💡 <strong>Tip:</strong> These games help reinforce today's concepts through play! Try at least one before or after class.
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  {selectedLesson.googleMeetLink && (
                    <Button
                      onClick={() => handleJoinClass(selectedLesson.googleMeetLink)}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Join Class
                    </Button>
                  )}
                  {selectedLesson.status === 'upcoming' && (
                    <Button
                      onClick={() => {
                        handleMarkComplete(selectedLesson.id);
                        setShowDetails(false);
                      }}
                      className="flex-1 bg-purple-600 text-white"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Tips */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <h4 className="font-bold mb-1">Weekly Rhythm Tips</h4>
            <p className="text-sm text-gray-700">
              This predictable schedule helps reduce anxiety! All lessons connect to the theme: <strong>{schedule.weekTheme}</strong>. 
              Notice how math, reading, writing, and STEAM all reinforce the same concepts in different ways.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}