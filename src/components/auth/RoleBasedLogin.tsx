import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Users, Shield, GraduationCap, BookOpen, School } from 'lucide-react';
import { UserRole } from '../../lib/types';

interface RoleBasedLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    role: 'student' as UserRole,
    icon: GraduationCap,
    title: 'Student',
    description: 'Access your quests, earn XP, and track your progress',
    gradient: 'from-cyan-500 to-cyan-600',
    hoverGradient: 'from-cyan-600 to-cyan-700',
  },
  {
    role: 'parent' as UserRole,
    icon: Users,
    title: 'Parent',
    description: 'View your child\'s progress and weekly summaries',
    gradient: 'from-purple-500 to-purple-600',
    hoverGradient: 'from-purple-600 to-purple-700',
  },
  {
    role: 'tutor' as UserRole,
    icon: BookOpen,
    title: 'Tutor',
    description: 'Review student work and provide feedback',
    gradient: 'from-pink-500 to-pink-600',
    hoverGradient: 'from-pink-600 to-pink-700',
  },
  {
    role: 'admin' as UserRole,
    icon: Shield,
    title: 'Admin',
    description: 'Manage teachers, tutors, and school partnerships',
    gradient: 'from-amber-500 to-amber-600',
    hoverGradient: 'from-amber-600 to-amber-700',
  },
  {
    role: 'teacher' as UserRole,
    icon: User,
    title: 'Teacher',
    description: 'Lead live classes and create challenges',
    gradient: 'from-emerald-500 to-emerald-600',
    hoverGradient: 'from-emerald-600 to-emerald-700',
  },
  {
    role: 'school' as UserRole,
    icon: School,
    title: 'School',
    description: 'Access professional development and reports',
    gradient: 'from-indigo-500 to-indigo-600',
    hoverGradient: 'from-indigo-600 to-indigo-700',
  },
];

export default function RoleBasedLogin({ isOpen, onClose, onSelectRole }: RoleBasedLoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-8 text-white text-center rounded-t-3xl">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-10 h-10" />
                  </div>
                </motion.div>
                <h2 className="text-3xl md:text-4xl mb-2">Welcome Back!</h2>
                <p className="text-xl text-white/90">Select your role to continue</p>
              </div>

              {/* Role Selection Grid */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {roles.map((roleItem, index) => {
                    const Icon = roleItem.icon;
                    return (
                      <motion.button
                        key={roleItem.role}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedRole(roleItem.role);
                          setTimeout(() => onSelectRole(roleItem.role), 300);
                        }}
                        className={`relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 ${
                          selectedRole === roleItem.role
                            ? `bg-gradient-to-br ${roleItem.hoverGradient} text-white shadow-xl`
                            : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg border border-gray-200'
                        }`}
                      >
                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '200%' }}
                          transition={{ duration: 0.6 }}
                        />

                        <div className="relative z-10">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                            selectedRole === roleItem.role
                              ? 'bg-white/20'
                              : `bg-gradient-to-br ${roleItem.gradient}`
                          }`}>
                            <Icon className={`w-7 h-7 ${
                              selectedRole === roleItem.role ? 'text-white' : 'text-white'
                            }`} />
                          </div>

                          <h3 className={`text-2xl mb-2 ${
                            selectedRole === roleItem.role ? 'text-white' : 'text-gray-800'
                          }`}>
                            {roleItem.title}
                          </h3>

                          <p className={selectedRole === roleItem.role ? 'text-white/90' : 'text-gray-600'}>
                            {roleItem.description}
                          </p>
                        </div>

                        {/* Selected indicator */}
                        {selectedRole === roleItem.role && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Help Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-600">
                    Not sure which role? <button onClick={onClose} className="text-cyan-600 hover:text-cyan-700 underline">Contact support</button>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}