import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Users, BookOpen, Settings, TrendingUp, Shield, Search, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import CreateStudentModal from '../admin/CreateStudentModal';
import AssignChallengesModal from '../admin/AssignChallengesModal';

interface AdminDashboardProps {
  onNavigateToStudents?: () => void;
  onNavigateToContent?: () => void;
}

export default function AdminDashboard({
  onNavigateToStudents,
  onNavigateToContent,
}: AdminDashboardProps) {
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showAssignChallenges, setShowAssignChallenges] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Mock data - will be replaced with real Supabase data
  const stats = {
    totalStudents: 12,
    activeStudents: 8,
    totalChallenges: 48,
    completedToday: 15,
  };

  const recentStudents = [
    { id: '1', name: 'Alex Explorer', tier: 'explorers', xp: 1250, lastActive: '2 hours ago' },
    { id: '2', name: 'Sam Warrior', tier: 'warriors', xp: 2500, lastActive: '1 day ago' },
    { id: '3', name: 'Riley Young', tier: 'early-explorers', xp: 450, lastActive: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">Manage students, content, and learning pathways</p>
            </div>
            
            <Button
              onClick={() => setShowCreateStudent(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Student Account
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-4 border-blue-300">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-4 border-green-300">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Active Students</p>
                  <p className="text-3xl font-bold">{stats.activeStudents}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-purple-300">
              <div className="flex items-center justify-between mb-3">
                <BookOpen className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Total Challenges</p>
                  <p className="text-3xl font-bold">{stats.totalChallenges}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-4 border-yellow-300">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-10 h-10" />
                <div className="text-right">
                  <p className="text-sm font-semibold opacity-90">Completed Today</p>
                  <p className="text-3xl font-bold">{stats.completedToday}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-4 border-purple-300 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Students</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {recentStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{student.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="capitalize">{student.tier.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{student.xp} XP</span>
                        <span>•</span>
                        <span className="text-gray-500">{student.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedStudent(student.id);
                        setShowAssignChallenges(true);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Assign Challenges
                    </Button>
                    <Button
                      onClick={() => console.log('View student', student.id)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      View Profile
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button variant="outline" onClick={onNavigateToStudents}>
                View All Students
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-6 border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-shadow cursor-pointer">
              <Users className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Manage Students</h3>
              <p className="text-sm text-gray-600">
                View, edit, and manage all student accounts and progress
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="p-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow cursor-pointer">
              <BookOpen className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Content Library</h3>
              <p className="text-sm text-gray-600">
                Browse and assign quests, challenges, and learning materials
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="p-6 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow cursor-pointer">
              <Settings className="w-12 h-12 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Platform Settings</h3>
              <p className="text-sm text-gray-600">
                Configure platform settings, integrations, and permissions
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <CreateStudentModal
        isOpen={showCreateStudent}
        onClose={() => setShowCreateStudent(false)}
        onSuccess={() => {
          setShowCreateStudent(false);
          // Refresh student list
        }}
      />

      <AssignChallengesModal
        isOpen={showAssignChallenges}
        onClose={() => {
          setShowAssignChallenges(false);
          setSelectedStudent(null);
        }}
        studentId={selectedStudent}
        onSuccess={() => {
          setShowAssignChallenges(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
