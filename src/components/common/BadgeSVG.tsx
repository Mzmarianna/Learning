/**
 * SVG Badge Generator Component
 * Creates beautiful, animated achievement badges
 * Easily replaceable with AI-generated images later
 */

interface BadgeSVGProps {
  badgeId: string;
  size?: number;
  animated?: boolean;
  className?: string;
}

interface BadgeConfig {
  id: string;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  iconType: string;
  displayText?: string;
  accentColor?: string;
  level?: number;
}

const BADGE_CONFIGS: Record<string, BadgeConfig> = {
  // ===== LEVEL 1 BADGES =====
  'badge-count-10': {
    id: 'badge-count-10',
    name: 'Counting to 10',
    gradientStart: '#DBEAFE',
    gradientEnd: '#3B82F6',
    iconType: 'number',
    displayText: '10',
    accentColor: '#1E40AF',
    level: 1,
  },
  'badge-count-20': {
    id: 'badge-count-20',
    name: 'Counting to 20',
    gradientStart: '#F3E8FF',
    gradientEnd: '#A855F7',
    iconType: 'number',
    displayText: '20',
    accentColor: '#7C3AED',
    level: 1,
  },
  'badge-addition': {
    id: 'badge-addition',
    name: 'Addition Master',
    gradientStart: '#D1FAE5',
    gradientEnd: '#10B981',
    iconType: 'plus',
    accentColor: '#047857',
    level: 1,
  },
  'badge-patterns': {
    id: 'badge-patterns',
    name: 'Pattern Spotter',
    gradientStart: '#FEF3C7',
    gradientEnd: '#F59E0B',
    iconType: 'pattern',
    accentColor: '#D97706',
    level: 1,
  },
  'badge-shapes': {
    id: 'badge-shapes',
    name: 'Shape Expert',
    gradientStart: '#E0E7FF',
    gradientEnd: '#6366F1',
    iconType: 'shapes',
    accentColor: '#4F46E5',
    level: 1,
  },
  'badge-subtraction': {
    id: 'badge-subtraction',
    name: 'Subtraction Star',
    gradientStart: '#FFEDD5',
    gradientEnd: '#F97316',
    iconType: 'minus',
    accentColor: '#EA580C',
    level: 1,
  },
  'badge-count-50': {
    id: 'badge-count-50',
    name: 'Counting to 50',
    gradientStart: '#CCFBF1',
    gradientEnd: '#14B8A6',
    iconType: 'number',
    displayText: '50',
    accentColor: '#0D9488',
    level: 1,
  },
  'badge-addition-pro': {
    id: 'badge-addition-pro',
    name: 'Addition Pro',
    gradientStart: '#D1FAE5',
    gradientEnd: '#059669',
    iconType: 'plus-circle',
    displayText: 'PRO',
    accentColor: '#047857',
    level: 1,
  },
  'badge-subtraction-pro': {
    id: 'badge-subtraction-pro',
    name: 'Subtraction Pro',
    gradientStart: '#FECDD3',
    gradientEnd: '#F43F5E',
    iconType: 'minus-circle',
    displayText: 'PRO',
    accentColor: '#E11D48',
    level: 1,
  },
  'badge-money-counter': {
    id: 'badge-money-counter',
    name: 'Money Counter',
    gradientStart: '#FEF3C7',
    gradientEnd: '#FBBF24',
    iconType: 'dollar',
    accentColor: '#D97706',
    level: 1,
  },
  'badge-money-master': {
    id: 'badge-money-master',
    name: 'Money Master',
    gradientStart: '#FCD34D',
    gradientEnd: '#D97706',
    iconType: 'wallet',
    accentColor: '#92400E',
    level: 1,
  },
  'badge-skip-2': {
    id: 'badge-skip-2',
    name: 'Skip Counter (2s)',
    gradientStart: '#CFFAFE',
    gradientEnd: '#06B6D4',
    iconType: 'skip',
    displayText: '×2',
    accentColor: '#0891B2',
    level: 1,
  },
  'badge-skip-5': {
    id: 'badge-skip-5',
    name: 'Skip Counter (5s)',
    gradientStart: '#FEF08A',
    gradientEnd: '#EAB308',
    iconType: 'skip',
    displayText: '×5',
    accentColor: '#CA8A04',
    level: 1,
  },
  'badge-skip-10': {
    id: 'badge-skip-10',
    name: 'Skip Counter (10s)',
    gradientStart: '#DDD6FE',
    gradientEnd: '#7C3AED',
    iconType: 'star',
    displayText: '×10',
    accentColor: '#6D28D9',
    level: 1,
  },
  'badge-count-100': {
    id: 'badge-count-100',
    name: 'Counting to 100',
    gradientStart: '#FBBF24',
    gradientEnd: '#F59E0B',
    iconType: 'trophy',
    displayText: '100',
    accentColor: '#D97706',
    level: 1,
  },
  'badge-graduate-l1': {
    id: 'badge-graduate-l1',
    name: 'Level 1 Graduate',
    gradientStart: '#1E3A8A',
    gradientEnd: '#FBBF24',
    iconType: 'graduation',
    displayText: 'L1',
    accentColor: '#92400E',
    level: 1,
  },

  // ===== LEVEL 2 BADGES =====
  'badge-place-value': {
    id: 'badge-place-value',
    name: 'Place Value Pro',
    gradientStart: '#99F6E4',
    gradientEnd: '#0D9488',
    iconType: 'grid',
    accentColor: '#115E59',
    level: 2,
  },
  'badge-number-explorer': {
    id: 'badge-number-explorer',
    name: 'Number Explorer',
    gradientStart: '#FDE68A',
    gradientEnd: '#F59E0B',
    iconType: 'search',
    accentColor: '#D97706',
    level: 2,
  },
  'badge-addition-ace': {
    id: 'badge-addition-ace',
    name: 'Addition Ace',
    gradientStart: '#A7F3D0',
    gradientEnd: '#10B981',
    iconType: 'ace',
    displayText: 'ACE',
    accentColor: '#047857',
    level: 2,
  },
  'badge-subtraction-star-l2': {
    id: 'badge-subtraction-star-l2',
    name: 'Subtraction Star',
    gradientStart: '#DDD6FE',
    gradientEnd: '#8B5CF6',
    iconType: 'star',
    accentColor: '#6D28D9',
    level: 2,
  },
  'badge-repeated-addition': {
    id: 'badge-repeated-addition',
    name: 'Repeated Addition Rockstar',
    gradientStart: '#FBCFE8',
    gradientEnd: '#EC4899',
    iconType: 'rockstar',
    displayText: '🎸',
    accentColor: '#BE185D',
    level: 2,
  },
  'badge-number-bonds': {
    id: 'badge-number-bonds',
    name: 'Number Bond Builder',
    gradientStart: '#BFDBFE',
    gradientEnd: '#3B82F6',
    iconType: 'link',
    accentColor: '#1E40AF',
    level: 2,
  },
  'badge-regrouping-champion': {
    id: 'badge-regrouping-champion',
    name: 'Regrouping Champion',
    gradientStart: '#FED7AA',
    gradientEnd: '#FB923C',
    iconType: 'champion',
    accentColor: '#EA580C',
    level: 2,
  },
  'badge-regrouping-subtraction': {
    id: 'badge-regrouping-subtraction',
    name: 'Regrouping Subtraction Star',
    gradientStart: '#A5F3FC',
    gradientEnd: '#06B6D4',
    iconType: 'arrows',
    accentColor: '#0891B2',
    level: 2,
  },
  'badge-money-master-l2': {
    id: 'badge-money-master-l2',
    name: 'Money Master',
    gradientStart: '#FDE047',
    gradientEnd: '#CA8A04',
    iconType: 'coins',
    accentColor: '#A16207',
    level: 2,
  },
  'badge-time-teller': {
    id: 'badge-time-teller',
    name: 'Time Teller',
    gradientStart: '#BAE6FD',
    gradientEnd: '#0EA5E9',
    iconType: 'clock',
    accentColor: '#0369A1',
    level: 2,
  },
  'badge-data-detective': {
    id: 'badge-data-detective',
    name: 'Data Detective',
    gradientStart: '#CBD5E1',
    gradientEnd: '#64748B',
    iconType: 'chart',
    accentColor: '#475569',
    level: 2,
  },
  'badge-word-problem-solver': {
    id: 'badge-word-problem-solver',
    name: 'Word Problem Solver',
    gradientStart: '#D9F99D',
    gradientEnd: '#84CC16',
    iconType: 'document',
    accentColor: '#65A30D',
    level: 2,
  },
  'badge-logic-leader': {
    id: 'badge-logic-leader',
    name: 'Logic Leader',
    gradientStart: '#C7D2FE',
    gradientEnd: '#6366F1',
    iconType: 'brain',
    accentColor: '#4F46E5',
    level: 2,
  },
  'badge-operation-expert': {
    id: 'badge-operation-expert',
    name: 'Operation Expert',
    gradientStart: '#3B82F6',
    gradientEnd: '#06B6D4',
    iconType: 'calculator',
    accentColor: '#0284C7',
    level: 2,
  },
  'badge-reasoning-ranger': {
    id: 'badge-reasoning-ranger',
    name: 'Reasoning Ranger',
    gradientStart: '#86EFAC',
    gradientEnd: '#22C55E',
    iconType: 'message',
    accentColor: '#16A34A',
    level: 2,
  },
  'badge-graduate-l2': {
    id: 'badge-graduate-l2',
    name: 'Level 2 Graduate',
    gradientStart: '#7C3AED',
    gradientEnd: '#F59E0B',
    iconType: 'graduation',
    displayText: 'L2',
    accentColor: '#92400E',
    level: 2,
  },

  // ===== LEVEL 3 BADGES =====
  'badge-place-value-pro': {
    id: 'badge-place-value-pro',
    name: 'Place Value Pro',
    gradientStart: '#A78BFA',
    gradientEnd: '#6D28D9',
    iconType: 'grid',
    displayText: 'PRO',
    accentColor: '#5B21B6',
    level: 3,
  },
  'badge-mental-math-master': {
    id: 'badge-mental-math-master',
    name: 'Mental Math Master',
    gradientStart: '#FEF08A',
    gradientEnd: '#FFFFFF',
    iconType: 'lightning',
    accentColor: '#EAB308',
    level: 3,
  },
  'badge-array-architect': {
    id: 'badge-array-architect',
    name: 'Array Architect',
    gradientStart: '#BFDBFE',
    gradientEnd: '#2563EB',
    iconType: 'grid',
    accentColor: '#1E40AF',
    level: 3,
  },
  'badge-division-discoverer': {
    id: 'badge-division-discoverer',
    name: 'Division Discoverer',
    gradientStart: '#FED7AA',
    gradientEnd: '#F97316',
    iconType: 'divide',
    accentColor: '#EA580C',
    level: 3,
  },
  'badge-one-zero-hero': {
    id: 'badge-one-zero-hero',
    name: 'One and Zero Hero',
    gradientStart: '#FCA5A5',
    gradientEnd: '#FB923C',
    iconType: 'hero',
    displayText: '1×0',
    accentColor: '#DC2626',
    level: 3,
  },
  'badge-ten-five-expert': {
    id: 'badge-ten-five-expert',
    name: 'Ten and Five Expert',
    gradientStart: '#99F6E4',
    gradientEnd: '#14B8A6',
    iconType: 'certificate',
    displayText: '10×5',
    accentColor: '#0D9488',
    level: 3,
  },
  'badge-two-times-titan': {
    id: 'badge-two-times-titan',
    name: 'Two Times Titan',
    gradientStart: '#FDBA74',
    gradientEnd: '#C2410C',
    iconType: 'titan',
    displayText: '×2',
    accentColor: '#9A3412',
    level: 3,
  },
  'badge-three-times-champ': {
    id: 'badge-three-times-champ',
    name: 'Three Times Champ',
    gradientStart: '#FDE047',
    gradientEnd: '#CA8A04',
    iconType: 'trophy',
    displayText: '×3',
    accentColor: '#A16207',
    level: 3,
  },
  'badge-four-times-master': {
    id: 'badge-four-times-master',
    name: 'Four Times Master',
    gradientStart: '#6EE7B7',
    gradientEnd: '#059669',
    iconType: 'square',
    displayText: '×4',
    accentColor: '#047857',
    level: 3,
  },
  'badge-six-times-scholar': {
    id: 'badge-six-times-scholar',
    name: 'Six Times Scholar',
    gradientStart: '#1E3A8A',
    gradientEnd: '#F59E0B',
    iconType: 'hexagon',
    displayText: '×6',
    accentColor: '#92400E',
    level: 3,
  },
  'badge-seven-times-superstar': {
    id: 'badge-seven-times-superstar',
    name: 'Seven Times Superstar',
    gradientStart: '#F0ABFC',
    gradientEnd: '#C026D3',
    iconType: 'star',
    displayText: '×7',
    accentColor: '#A21CAF',
    level: 3,
  },
  'badge-eight-times-elite': {
    id: 'badge-eight-times-elite',
    name: 'Eight Times Elite',
    gradientStart: '#E2E8F0',
    gradientEnd: '#64748B',
    iconType: 'octagon',
    displayText: '×8',
    accentColor: '#475569',
    level: 3,
  },
  'badge-nine-times-ninja': {
    id: 'badge-nine-times-ninja',
    name: 'Nine Times Ninja',
    gradientStart: '#1F2937',
    gradientEnd: '#7C3AED',
    iconType: 'ninja',
    displayText: '×9',
    accentColor: '#6D28D9',
    level: 3,
  },
  'badge-twelve-times-wizard': {
    id: 'badge-twelve-times-wizard',
    name: 'Twelve Times Wizard',
    gradientStart: '#A78BFA',
    gradientEnd: '#3B82F6',
    iconType: 'wizard',
    displayText: '×12',
    accentColor: '#1E40AF',
    level: 3,
  },
  'badge-multiplication-master': {
    id: 'badge-multiplication-master',
    name: 'Multiplication Master',
    gradientStart: '#FBBF24',
    gradientEnd: '#EC4899',
    iconType: 'master',
    displayText: '×',
    accentColor: '#BE185D',
    level: 3,
  },
  'badge-graduate-l3': {
    id: 'badge-graduate-l3',
    name: 'Level 3 Graduate',
    gradientStart: '#FFFFFF',
    gradientEnd: '#E5E7EB',
    iconType: 'graduation',
    displayText: 'L3',
    accentColor: '#9CA3AF',
    level: 3,
  },
};

function renderBadgeIcon(iconType: string, displayText?: string, accentColor?: string) {
  const textColor = accentColor || '#FFFFFF';
  
  switch (iconType) {
    case 'number':
      return (
        <text
          x="256"
          y="320"
          fontSize="180"
          fontWeight="bold"
          fill="white"
          textAnchor="middle"
          filter="url(#shadow)"
        >
          {displayText}
        </text>
      );
    
    case 'plus':
      return (
        <g>
          <rect x="216" y="156" width="80" height="200" rx="20" fill="white" filter="url(#shadow)" />
          <rect x="156" y="216" width="200" height="80" rx="20" fill="white" filter="url(#shadow)" />
        </g>
      );
    
    case 'minus':
      return (
        <rect x="156" y="216" width="200" height="80" rx="20" fill="white" filter="url(#shadow)" />
      );
    
    case 'pattern':
      return (
        <g>
          <circle cx="180" cy="256" r="30" fill="#FCD34D" filter="url(#shadow)" />
          <rect x="226" y="226" width="60" height="60" rx="10" fill="#A78BFA" filter="url(#shadow)" />
          <polygon points="332,286 362,226 302,226" fill="#34D399" filter="url(#shadow)" />
        </g>
      );
    
    case 'shapes':
      return (
        <g>
          <circle cx="200" cy="200" r="35" fill="#FCD34D" filter="url(#shadow)" />
          <rect x="266" y="165" width="70" height="70" rx="8" fill="#A78BFA" filter="url(#shadow)" />
          <polygon points="256,330 220,280 292,280" fill="#34D399" filter="url(#shadow)" />
        </g>
      );
    
    case 'star':
      return (
        <g>
          <polygon
            points="256,140 280,210 355,210 295,255 320,325 256,280 192,325 217,255 157,210 232,210"
            fill="white"
            filter="url(#shadow)"
          />
          {displayText && (
            <text x="256" y="270" fontSize="48" fontWeight="bold" fill={accentColor} textAnchor="middle">
              {displayText}
            </text>
          )}
        </g>
      );
    
    case 'trophy':
      return (
        <g>
          <path
            d="M 180 180 L 180 220 Q 180 280 256 280 Q 332 280 332 220 L 332 180 Z"
            fill="white"
            filter="url(#shadow)"
          />
          <rect x="236" y="280" width="40" height="60" rx="5" fill="white" filter="url(#shadow)" />
          <rect x="206" y="330" width="100" height="20" rx="5" fill="white" filter="url(#shadow)" />
          <ellipse cx="256" cy="180" rx="76" ry="40" fill="white" filter="url(#shadow)" />
          {displayText && (
            <text x="256" y="230" fontSize="42" fontWeight="bold" fill={accentColor} textAnchor="middle">
              {displayText}
            </text>
          )}
        </g>
      );
    
    case 'graduation':
      return (
        <g>
          <polygon
            points="256,180 356,220 256,260 156,220"
            fill="white"
            filter="url(#shadow)"
          />
          <rect x="236" y="220" width="40" height="80" fill="white" filter="url(#shadow)" />
          <rect x="206" y="290" width="100" height="15" rx="5" fill="white" filter="url(#shadow)" />
          <circle cx="376" cy="200" r="15" fill={accentColor} filter="url(#shadow)" />
          {displayText && (
            <text x="256" y="255" fontSize="36" fontWeight="bold" fill={accentColor} textAnchor="middle">
              {displayText}
            </text>
          )}
        </g>
      );
    
    case 'dollar':
      return (
        <g>
          <text x="256" y="330" fontSize="200" fontWeight="bold" fill="white" textAnchor="middle" filter="url(#shadow)">
            $
          </text>
        </g>
      );
    
    case 'lightning':
      return (
        <polygon
          points="280,140 200,256 256,256 232,372 312,256 256,256"
          fill="white"
          filter="url(#shadow)"
        />
      );
    
    case 'divide':
      return (
        <g>
          <rect x="156" y="236" width="200" height="40" rx="20" fill="white" filter="url(#shadow)" />
          <circle cx="256" cy="180" r="30" fill="white" filter="url(#shadow)" />
          <circle cx="256" cy="332" r="30" fill="white" filter="url(#shadow)" />
        </g>
      );
    
    case 'grid':
      return (
        <g>
          <rect x="170" y="170" width="60" height="60" rx="8" fill="white" fillOpacity="0.9" filter="url(#shadow)" />
          <rect x="240" y="170" width="60" height="60" rx="8" fill="white" fillOpacity="0.7" filter="url(#shadow)" />
          <rect x="310" y="170" width="60" height="60" rx="8" fill="white" fillOpacity="0.5" filter="url(#shadow)" />
          <rect x="170" y="240" width="60" height="60" rx="8" fill="white" fillOpacity="0.7" filter="url(#shadow)" />
          <rect x="240" y="240" width="60" height="60" rx="8" fill="white" fillOpacity="0.9" filter="url(#shadow)" />
          <rect x="310" y="240" width="60" height="60" rx="8" fill="white" fillOpacity="0.7" filter="url(#shadow)" />
          {displayText && (
            <text x="256" y="370" fontSize="40" fontWeight="bold" fill="white" textAnchor="middle" filter="url(#shadow)">
              {displayText}
            </text>
          )}
        </g>
      );

    case 'hero':
    case 'ninja':
    case 'wizard':
    case 'titan':
      return (
        <g>
          <polygon
            points="256,140 280,210 355,210 295,255 320,325 256,280 192,325 217,255 157,210 232,210"
            fill="white"
            filter="url(#shadow)"
          />
          <text x="256" y="270" fontSize="44" fontWeight="bold" fill={accentColor} textAnchor="middle">
            {displayText || iconType.toUpperCase()}
          </text>
        </g>
      );
    
    default:
      // Default: display text or icon type
      return (
        <text x="256" y="300" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle" filter="url(#shadow)">
          {displayText || '★'}
        </text>
      );
  }
}

export default function BadgeSVG({ badgeId, size = 128, animated = true, className = '' }: BadgeSVGProps) {
  const config = BADGE_CONFIGS[badgeId];
  
  if (!config) {
    // Fallback badge
    return (
      <svg width={size} height={size} viewBox="0 0 512 512" className={className}>
        <circle cx="256" cy="256" r="240" fill="#9CA3AF" />
        <text x="256" y="300" fontSize="60" fill="white" textAnchor="middle">?</text>
      </svg>
    );
  }

  const gradientId = `gradient-${config.id}`;
  const glowId = `glow-${config.id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      style={animated ? { animation: 'badgePulse 3s ease-in-out infinite' } : {}}
    >
      <defs>
        {/* Main gradient */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: config.gradientStart, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: config.gradientEnd, stopOpacity: 1 }} />
        </linearGradient>

        {/* Glow effect */}
        <radialGradient id={glowId}>
          <stop offset="0%" style={{ stopColor: config.gradientEnd, stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: config.gradientEnd, stopOpacity: 0 }} />
        </radialGradient>

        {/* Shadow filter */}
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Shine effect */}
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.4 }} />
          <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.1 }} />
          <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="256" cy="256" r="250" fill={`url(#${glowId})`} opacity="0.5" />

      {/* Main badge circle with gradient */}
      <circle cx="256" cy="256" r="230" fill={`url(#${gradientId})`} filter="url(#shadow)" />

      {/* Inner border ring */}
      <circle
        cx="256"
        cy="256"
        r="220"
        fill="none"
        stroke="white"
        strokeWidth="4"
        opacity="0.3"
      />

      {/* Shine overlay */}
      <ellipse
        cx="256"
        cy="180"
        rx="180"
        ry="120"
        fill="url(#shine)"
        opacity="0.6"
      />

      {/* Badge icon/content */}
      {renderBadgeIcon(config.iconType, config.displayText, config.accentColor)}

      {/* Sparkles */}
      <g opacity="0.8">
        <circle cx="380" cy="150" r="8" fill="white">
          {animated && (
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="420" cy="256" r="6" fill="white">
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2.5s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="380" cy="362" r="7" fill="white">
          {animated && (
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="132" cy="150" r="6" fill="white">
          {animated && (
            <animate
              attributeName="opacity"
              values="1;0.4;1"
              dur="2.2s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx="92" cy="256" r="8" fill="white">
          {animated && (
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.8s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </g>

      {/* Level indicator (small badge in corner) */}
      {config.level && (
        <g>
          <circle cx="400" cy="112" r="45" fill={config.accentColor} filter="url(#shadow)" />
          <text x="400" y="125" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle">
            L{config.level}
          </text>
        </g>
      )}
    </svg>
  );
}

// Export badge configs for use elsewhere
export { BADGE_CONFIGS };
export type { BadgeConfig };
