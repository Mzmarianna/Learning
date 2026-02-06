import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Clock, Coffee, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { checkSessionLimits } from '../../lib/safety/child-safety';

interface SessionLimitModalProps {
  studentId: string;
  onClose: () => void;
  onTakeBreak: () => void;
}

export default function SessionLimitModal({
  studentId,
  onClose,
  onTakeBreak,
}: SessionLimitModalProps) {
  const [limitInfo, setLimitInfo] = useState<{
    canContinue: boolean;
    reason?: string;
    minutesRemaining?: number;
    requiresBreak?: boolean;
  } | null>(null);

  useEffect(() => {
    checkLimits();
  }, [studentId]);

  const checkLimits = async () => {
    const info = await checkSessionLimits(studentId);
    setLimitInfo(info);
  };

  if (!limitInfo || limitInfo.canContinue) {
    return null;
  }

  // Break required
  if (limitInfo.requiresBreak) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 border-4 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              <Coffee className="w-20 h-20 mx-auto text-blue-600" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Time for a Break! ☕
            </h2>
            
            <p className="text-lg text-gray-700 mb-6">
              {limitInfo.reason}
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">Break Time Activities:</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li>💧 Drink some water</li>
                  <li>🤸 Do some stretches</li>
                  <li>👀 Look at something far away</li>
                  <li>🚶 Walk around for a few minutes</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={onTakeBreak}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Start 5-Minute Break
            </Button>

            <p className="text-xs text-gray-600 mt-4">
              Taking breaks helps your brain learn better! 🧠✨
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Daily limit reached
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-4 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            <Clock className="w-20 h-20 mx-auto text-yellow-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Great Learning Today! 🎉
          </h2>
          
          <p className="text-lg text-gray-700 mb-4">
            {limitInfo.reason}
          </p>

          <div className="p-4 bg-white rounded-xl border-2 border-yellow-200 mb-6">
            <p className="text-gray-700">
              You've done amazing work today! Come back tomorrow to continue your learning adventure.
            </p>
          </div>

          <Button
            onClick={onClose}
            size="lg"
            className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
          >
            Finish for Today
          </Button>

          <p className="text-xs text-gray-600 mt-4">
            Balance is important for healthy learning! 🌟
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
