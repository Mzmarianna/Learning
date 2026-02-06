import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'cyan' | 'pink' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  glow?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const GameButton = forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, glow, pulse, children, className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-purple-500/50',
      secondary: 'bg-white border-4 border-purple-400 text-purple-600 hover:bg-purple-50 hover:border-purple-500 shadow-lg',
      success: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/50',
      warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-yellow-500/50',
      purple: 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/50',
      cyan: 'bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white shadow-lg hover:shadow-cyan-500/50',
      pink: 'bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white shadow-lg hover:shadow-pink-500/50',
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-yellow-900 shadow-lg hover:shadow-yellow-500/50',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    };

    const glowClass = glow ? 'animate-glow' : '';
    const pulseClass = pulse ? 'animate-pulse' : '';

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          ${variants[variant]}
          ${sizes[size]}
          ${glowClass}
          ${pulseClass}
          font-bold
          transform transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          relative overflow-hidden
          group
          ${className}
        `}
        style={{ fontFamily: 'var(--font-ui)' }}
        {...props}
      >
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        {/* Content */}
        <span className="relative flex items-center justify-center gap-2">
          {Icon && <Icon className={size === 'sm' ? 'size-4' : size === 'md' ? 'size-5' : size === 'lg' ? 'size-6' : 'size-7'} />}
          {children}
          {IconRight && <IconRight className={size === 'sm' ? 'size-4' : size === 'md' ? 'size-5' : size === 'lg' ? 'size-6' : 'size-7'} />}
        </span>
      </motion.button>
    );
  }
);

GameButton.displayName = 'GameButton';
