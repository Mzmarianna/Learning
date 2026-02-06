import { motion } from 'motion/react';
import { Sparkles, Edit } from 'lucide-react';
import unicornAvatar from '../../assets/88b5b6cf2bb8d4dc71d81f46908a4a014d89a219.png';
import horseAvatar from '../../assets/fc4539a92b56ffdc3859965f6b4163a39976dd53.png';
import chickenAvatar from '../../assets/7662dd81134e4c3b892f0af67a48795412e8662a.png';

interface AvatarDisplayProps {
  avatarId?: string;
  avatarName?: string;
  size?: 'sm' | 'md' | 'lg';
  showEdit?: boolean;
  onEdit?: () => void;
}

const AVATAR_IMAGES: Record<string, string> = {
  unicorn: unicornAvatar,
  horse: horseAvatar,
  chicken: chickenAvatar,
};

export default function AvatarDisplay({
  avatarId = 'unicorn',
  avatarName,
  size = 'md',
  showEdit = false,
  onEdit,
}: AvatarDisplayProps) {
  const avatarImage = AVATAR_IMAGES[avatarId] || unicornAvatar;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  return (
    <div className="relative group">
      {/* Avatar Container */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 blur-xl opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Avatar Image */}
        <div className="relative z-10 bg-white rounded-full p-2 shadow-lg border-4 border-purple-300">
          <motion.img
            src={avatarImage}
            alt={avatarName || 'Your Avatar'}
            className="w-full h-full object-contain rounded-full"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
        </div>

        {/* Sparkle Effects */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${20 + i * 30}%`,
              right: `${-10 + i * 5}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </motion.div>
        ))}

        {/* Edit Button */}
        {showEdit && onEdit && (
          <motion.button
            onClick={onEdit}
            className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>

      {/* Avatar Name */}
      {avatarName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-full inline-block shadow-lg">
            <p className="text-sm font-semibold">{avatarName}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
