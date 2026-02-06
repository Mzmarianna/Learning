import { motion } from 'motion/react';
import { Level, RedemptionOption } from '@/lib/curriculum-data';
import { 
  Shirt, 
  Crown, 
  Backpack, 
  Star, 
  Unlock, 
  Zap, 
  Timer, 
  Award, 
  Trophy, 
  Shield, 
  Rocket,
  DollarSign,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RedemptionOptionsProps {
  level: Level;
  totalRobuxEarned: number;
  redeemedItems?: string[]; // IDs of already redeemed items
  onRedeem?: (option: RedemptionOption) => void;
}

// Map icon names to components
const iconMap: Record<string, any> = {
  Shirt,
  Crown,
  Backpack,
  Star,
  Unlock,
  Zap,
  Timer,
  Award,
  Trophy,
  Shield,
  Rocket,
};

export default function RedemptionOptions({
  level,
  totalRobuxEarned,
  redeemedItems = [],
  onRedeem,
}: RedemptionOptionsProps) {
  const canRedeem = totalRobuxEarned >= level.redemptionThreshold;

  const groupedOptions = {
    avatar: level.redemptionOptions.filter(opt => opt.category === 'avatar'),
    gamepass: level.redemptionOptions.filter(opt => opt.category === 'gamepass'),
    special: level.redemptionOptions.filter(opt => opt.category === 'special'),
  };

  const categoryConfig = {
    avatar: {
      title: 'Avatar Items',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    gamepass: {
      title: 'Game Passes',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    special: {
      title: 'Special Rewards',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  };

  const renderOption = (option: RedemptionOption) => {
    const Icon = iconMap[option.icon] || Award;
    const isRedeemed = redeemedItems.includes(option.id);
    const isFree = option.robuxCost === 0;
    const canAfford = totalRobuxEarned >= option.robuxCost;
    const config = categoryConfig[option.category];

    return (
      <motion.div
        key={option.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={canAfford && !isRedeemed ? { scale: 1.03 } : undefined}
        className={`${config.bgColor} border-2 ${config.borderColor} rounded-xl p-4 transition-all ${
          isRedeemed ? 'opacity-60' : canAfford ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'
        }`}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`${config.iconBg} p-2 rounded-lg`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{option.name}</h3>
            <p className="text-sm text-gray-600">{option.description}</p>
          </div>
          {isRedeemed && (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-700">
              {isFree ? 'FREE' : `${option.robuxCost} Robux`}
            </span>
          </div>
          
          {!isRedeemed && (
            <Button
              size="sm"
              disabled={!canAfford && !isFree}
              onClick={() => onRedeem?.(option)}
              className={`${
                isFree 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : canAfford
                  ? 'reward-bg'
                  : 'bg-gray-300'
              } text-white`}
            >
              {isFree ? 'Claim' : canAfford ? 'Redeem' : 'Locked'}
              {!canAfford && !isFree && <Lock className="w-3 h-3 ml-1" />}
            </Button>
          )}
          
          {isRedeemed && (
            <span className="text-sm font-semibold text-green-600">Redeemed</span>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Robux Balance */}
      <div className={`border-2 rounded-2xl p-6 ${
        canRedeem 
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300' 
          : 'bg-calm-surface border-calm-border'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Robux Redemption Center</h2>
            <p className="text-gray-700">
              {canRedeem 
                ? '🎉 Congratulations! You have enough Robux to redeem rewards!'
                : `Earn ${level.redemptionThreshold - totalRobuxEarned} more Robux to unlock redemption options.`}
            </p>
          </div>
          <div className={`${canRedeem ? 'bg-yellow-100 border-yellow-300 animate-pulse' : 'bg-white border-calm-border'} border-2 rounded-xl p-4`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{totalRobuxEarned}</div>
              <div className="text-sm text-muted-foreground">Robux</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 border-2 border-calm-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Redemption Progress</span>
            <span className="text-sm font-semibold text-purple-600">
              {totalRobuxEarned} / {level.redemptionThreshold}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500"
              style={{ width: `${Math.min((totalRobuxEarned / level.redemptionThreshold) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Avatar Items */}
      {groupedOptions.avatar.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-xl">
              <Shirt className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Avatar Items</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedOptions.avatar.map(renderOption)}
          </div>
        </div>
      )}

      {/* Game Passes */}
      {groupedOptions.gamepass.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-xl">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Game Passes</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedOptions.gamepass.map(renderOption)}
          </div>
        </div>
      )}

      {/* Special Rewards */}
      {groupedOptions.special.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-xl">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Special Rewards</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {groupedOptions.special.map(renderOption)}
          </div>
        </div>
      )}

      {/* Teacher Note */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-1 rounded-full mt-0.5">
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Teacher Note</h4>
            <p className="text-sm text-blue-800">
              Students can choose one reward option when they reach {level.redemptionThreshold} Robux. 
              Track student progress using the provided tracking sheet. Redemption should be facilitated 
              during designated reward periods. Students can continue earning Robux beyond {level.redemptionThreshold} for 
              additional rewards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
