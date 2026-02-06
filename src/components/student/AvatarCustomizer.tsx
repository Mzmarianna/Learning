import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Check, Lock, Crown, Star } from 'lucide-react';
import unicornAvatar from '../../assets/88b5b6cf2bb8d4dc71d81f46908a4a014d89a219.png';
import horseAvatar from '../../assets/fc4539a92b56ffdc3859965f6b4163a39976dd53.png';
import chickenAvatar from '../../assets/7662dd81134e4c3b892f0af67a48795412e8662a.png';

interface AvatarCustomizerProps {
  currentXP: number;
  selectedAvatar?: string;
  avatarName?: string;
  onSelectAvatar: (avatarId: string) => void;
  onNameAvatar: (name: string) => void;
  onClose: () => void;
}

interface Avatar {
  id: string;
  name: string;
  image: string;
  unlockXP: number;
  description: string;
}

interface Accessory {
  id: string;
  name: string;
  icon: string;
  unlockXP: number;
  category: 'hat' | 'glasses' | 'background';
}

const AVATARS: Avatar[] = [
  {
    id: 'unicorn',
    name: 'Gaming Unicorn',
    image: unicornAvatar,
    unlockXP: 0,
    description: 'A magical gamer ready for adventure!',
  },
  {
    id: 'horse',
    name: 'Happy Horse',
    image: horseAvatar,
    unlockXP: 200,
    description: 'Gallop through quests with joy!',
  },
  {
    id: 'chicken',
    name: 'Cool Chicken',
    image: chickenAvatar,
    unlockXP: 500,
    description: 'This chicken is anything but chicken!',
  },
];

const ACCESSORIES: Accessory[] = [
  { id: 'crown', name: 'Royal Crown', icon: '👑', unlockXP: 100, category: 'hat' },
  { id: 'wizard-hat', name: 'Wizard Hat', icon: '🎩', unlockXP: 150, category: 'hat' },
  { id: 'sunglasses', name: 'Cool Shades', icon: '😎', unlockXP: 80, category: 'glasses' },
  { id: 'stars', name: 'Starry Background', icon: '✨', unlockXP: 120, category: 'background' },
];

export default function AvatarCustomizer({
  currentXP,
  selectedAvatar = 'unicorn',
  avatarName = '',
  onSelectAvatar,
  onNameAvatar,
  onClose,
}: AvatarCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'select' | 'name' | 'accessories'>('select');
  const [tempName, setTempName] = useState(avatarName);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

  const selectedAvatarData = AVATARS.find((a) => a.id === selectedAvatar);

  const canUnlock = (unlockXP: number) => currentXP >= unlockXP;

  const handleUnlockAvatar = (avatarId: string) => {
    setShowUnlockAnimation(true);
    setTimeout(() => {
      onSelectAvatar(avatarId);
      setShowUnlockAnimation(false);
    }, 1500);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onNameAvatar(tempName.trim());
    }
  };

  const toggleAccessory = (accessoryId: string) => {
    if (selectedAccessories.includes(accessoryId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accessoryId));
    } else {
      setSelectedAccessories([...selectedAccessories, accessoryId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-4 border-purple-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <div>
                <h2 className="text-3xl">Your Avatar</h2>
                <p className="text-white/90">Customize your learning companion!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* XP Display */}
          <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
            <Star className="w-6 h-6" />
            <div className="flex-1">
              <p className="text-sm text-white/80">Your XP</p>
              <p className="text-2xl">{currentXP} XP</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-6 border-b-2 border-purple-200">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'select'
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Choose Avatar
          </button>
          <button
            onClick={() => setActiveTab('name')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'name'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Name Avatar
          </button>
          <button
            onClick={() => setActiveTab('accessories')}
            className={`flex-1 py-3 px-4 rounded-xl transition-all ${
              activeTab === 'accessories'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Accessories
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Select Avatar Tab */}
          {activeTab === 'select' && (
            <div className="grid md:grid-cols-3 gap-6">
              {AVATARS.map((avatar, index) => {
                const isUnlocked = canUnlock(avatar.unlockXP);
                const isSelected = avatar.id === selectedAvatar;

                return (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-2xl overflow-hidden shadow-lg transition-all ${
                      isSelected
                        ? 'ring-4 ring-purple-500 ring-offset-2'
                        : 'hover:scale-105'
                    }`}
                  >
                    {/* Avatar Image */}
                    <div className={`aspect-square bg-gradient-to-br from-cyan-100 to-purple-100 p-6 ${
                      !isUnlocked ? 'opacity-50 grayscale' : ''
                    }`}>
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Avatar Info */}
                    <div className="bg-white p-4">
                      <h3 className="text-xl mb-1">{avatar.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{avatar.description}</p>

                      {/* Unlock/Select Button */}
                      {isUnlocked ? (
                        isSelected ? (
                          <div className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg">
                            <Check className="w-5 h-5" />
                            <span>Selected</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUnlockAvatar(avatar.id)}
                            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Select
                          </button>
                        )
                      ) : (
                        <div className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-2 rounded-lg">
                          <Lock className="w-5 h-5" />
                          <span>Unlock at {avatar.unlockXP} XP</span>
                        </div>
                      )}
                    </div>

                    {/* Selected Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-2 shadow-lg"
                      >
                        <Crown className="w-6 h-6" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Name Avatar Tab */}
          {activeTab === 'name' && selectedAvatarData && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-64 h-64 mb-6"
                  >
                    <img
                      src={selectedAvatarData.image}
                      alt={selectedAvatarData.name}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                  <h3 className="text-2xl mb-2">Give your {selectedAvatarData.name} a name!</h3>
                  <p className="text-gray-600 mb-6">
                    Cost: <span className="text-purple-600">50 XP</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Avatar Name
                    </label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Enter a cool name..."
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                      maxLength={20}
                    />
                  </div>

                  {avatarName && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-700">
                        Current name: <span className="font-semibold">{avatarName}</span>
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSaveName}
                    disabled={!tempName.trim() || currentXP < 50}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {currentXP < 50 ? (
                      <>
                        <Lock className="w-5 h-5" />
                        Need 50 XP to Name
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Save Name (50 XP)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Accessories Tab */}
          {activeTab === 'accessories' && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl mb-2">Unlock Accessories</h3>
                <p className="text-gray-600">Spend XP to unlock cool items for your avatar!</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {ACCESSORIES.map((accessory, index) => {
                  const isUnlocked = canUnlock(accessory.unlockXP);
                  const isSelected = selectedAccessories.includes(accessory.id);

                  return (
                    <motion.div
                      key={accessory.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-xl p-6 shadow-lg ${
                        isSelected ? 'ring-4 ring-pink-400' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-5xl ${!isUnlocked ? 'grayscale opacity-50' : ''}`}>
                          {accessory.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg mb-1">{accessory.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {accessory.category.charAt(0).toUpperCase() + accessory.category.slice(1)}
                          </p>
                          {isUnlocked ? (
                            <button
                              onClick={() => toggleAccessory(accessory.id)}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                              }`}
                            >
                              {isSelected ? 'Equipped' : 'Equip'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">{accessory.unlockXP} XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Unlock Animation */}
      <AnimatePresence>
        {showUnlockAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-8xl mb-4"
              >
                ✨
              </motion.div>
              <h2 className="text-4xl text-white mb-2">Avatar Unlocked!</h2>
              <p className="text-xl text-white/80">Your new companion is ready!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
