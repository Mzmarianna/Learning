import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface GameCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: string;
  badge?: string;
  stats?: { label: string; value: string | number }[];
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  hover3D?: boolean;
}

export function GameCard({
  title,
  description,
  icon: Icon,
  gradient = 'from-purple-500 to-pink-500',
  badge,
  stats,
  children,
  onClick,
  className = '',
  hover3D = true,
}: GameCardProps) {
  return (
    <motion.div
      whileHover={ hover3D ? { scale: 1.02, rotate: hover3D ? -1 : 0 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200
        hover:border-purple-400 transform transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header with Icon and Badge */}
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="size-8 text-white" strokeWidth={2.5} />
          </div>
        )}
        {badge && (
          <div className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
            {badge}
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-2 text-purple-900" style={{ fontFamily: 'var(--font-title)' }}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-600 leading-relaxed mb-4">
          {description}
        </p>
      )}

      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-purple-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'var(--font-xp)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-purple-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Children */}
      {children}
    </motion.div>
  );
}
