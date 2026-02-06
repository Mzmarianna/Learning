import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface InstructionCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  actionText?: string;
  onAction?: () => void;
  gradient?: string;
}

export default function InstructionCard({
  icon: Icon,
  iconColor = 'text-purple-600',
  title,
  description,
  imageUrl,
  imageAlt = 'Instruction visual',
  actionText,
  onAction,
  gradient = 'from-purple-50 to-pink-50',
}: InstructionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onAction ? 1.02 : 1 }}
      className={`bg-gradient-to-br ${gradient} border-2 border-purple-200 rounded-2xl overflow-hidden shadow-lg ${
        onAction ? 'cursor-pointer' : ''
      }`}
      onClick={onAction}
    >
      {imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <ImageWithFallback
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0 ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>

        {actionText && onAction && (
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
            {actionText}
          </button>
        )}
      </div>
    </motion.div>
  );
}
