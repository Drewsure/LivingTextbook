// Game Theme Configurations - wordwall.net inspired themes
export const gameThemes = {
  jungle: {
    name: 'Jungle Adventure',
    emoji: '🌴',
    primaryGradient: 'from-green-600 to-emerald-700',
    secondaryGradient: 'from-lime-400 to-green-500',
    accentColor: 'bg-amber-500',
    bgPattern: 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900',
    cardBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
    textColor: 'text-green-900',
    borderColor: 'border-green-500',
    particles: ['🍃', '🌿', '🦜', '🐒', '🌺'],
    correctSound: 'Roar! Amazing!',
    incorrectSound: 'Oops! Try again!'
  },
  space: {
    name: 'Space Explorer',
    emoji: '🚀',
    primaryGradient: 'from-indigo-600 to-purple-700',
    secondaryGradient: 'from-violet-400 to-indigo-500',
    accentColor: 'bg-cyan-400',
    bgPattern: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900',
    cardBg: 'bg-gradient-to-br from-indigo-100 to-purple-200',
    textColor: 'text-indigo-900',
    borderColor: 'border-indigo-500',
    particles: ['⭐', '🌟', '✨', '🪐', '🛸'],
    correctSound: 'Blast off! Perfect!',
    incorrectSound: 'Houston, try again!'
  },
  ocean: {
    name: 'Ocean Discovery',
    emoji: '🌊',
    primaryGradient: 'from-cyan-600 to-blue-700',
    secondaryGradient: 'from-sky-400 to-cyan-500',
    accentColor: 'bg-teal-400',
    bgPattern: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900',
    cardBg: 'bg-gradient-to-br from-cyan-100 to-blue-200',
    textColor: 'text-cyan-900',
    borderColor: 'border-cyan-500',
    particles: ['🐠', '🐙', '🦀', '🐚', '🌊'],
    correctSound: 'Splash! Fantastic!',
    incorrectSound: 'Whoops! Swim again!'
  },
  candy: {
    name: 'Candy Land',
    emoji: '🍭',
    primaryGradient: 'from-pink-500 to-rose-600',
    secondaryGradient: 'from-fuchsia-400 to-pink-500',
    accentColor: 'bg-yellow-400',
    bgPattern: 'bg-gradient-to-br from-pink-200 via-fuchsia-200 to-purple-200',
    cardBg: 'bg-gradient-to-br from-pink-100 to-rose-200',
    textColor: 'text-pink-900',
    borderColor: 'border-pink-500',
    particles: ['🍬', '🍫', '🧁', '🎂', '🍩'],
    correctSound: 'Sweet! Yummy answer!',
    incorrectSound: 'Oopsie! Try another!'
  },
  safari: {
    name: 'Safari Quest',
    emoji: '🦁',
    primaryGradient: 'from-amber-500 to-orange-600',
    secondaryGradient: 'from-yellow-400 to-amber-500',
    accentColor: 'bg-orange-500',
    bgPattern: 'bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100',
    cardBg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-500',
    particles: ['🦒', '🐘', '🦓', '🦛', '🌻'],
    correctSound: 'Wild! Great job!',
    incorrectSound: 'Keep hunting!'
  },
  winter: {
    name: 'Winter Wonderland',
    emoji: '❄️',
    primaryGradient: 'from-sky-400 to-blue-500',
    secondaryGradient: 'from-cyan-300 to-sky-400',
    accentColor: 'bg-white',
    bgPattern: 'bg-gradient-to-br from-sky-100 via-blue-50 to-slate-100',
    cardBg: 'bg-gradient-to-br from-white to-sky-100',
    textColor: 'text-sky-900',
    borderColor: 'border-sky-400',
    particles: ['❄️', '⛄', '🎿', '🏔️', '🌨️'],
    correctSound: 'Cool! Frozen perfection!',
    incorrectSound: 'Brrr! Try again!'
  },
  ninja: {
    name: 'Ninja Academy',
    emoji: '🥷',
    primaryGradient: 'from-slate-700 to-gray-800',
    secondaryGradient: 'from-red-500 to-rose-600',
    accentColor: 'bg-red-600',
    bgPattern: 'bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900',
    cardBg: 'bg-gradient-to-br from-slate-100 to-gray-200',
    textColor: 'text-slate-900',
    borderColor: 'border-red-500',
    particles: ['⚔️', '🌸', '🎯', '🔥', '💫'],
    correctSound: 'Hai! Master move!',
    incorrectSound: 'Train harder!'
  },
  rainbow: {
    name: 'Rainbow World',
    emoji: '🌈',
    primaryGradient: 'from-red-500 via-yellow-500 to-green-500',
    secondaryGradient: 'from-blue-500 via-purple-500 to-pink-500',
    accentColor: 'bg-violet-500',
    bgPattern: 'bg-gradient-to-br from-red-100 via-yellow-100 via-green-100 via-blue-100 to-purple-100',
    cardBg: 'bg-white',
    textColor: 'text-violet-900',
    borderColor: 'border-violet-400',
    particles: ['🌈', '🦄', '⭐', '🎨', '🎉'],
    correctSound: 'Colorful! Brilliant!',
    incorrectSound: 'Keep painting!'
  }
};

export const getRandomTheme = () => {
  const themeKeys = Object.keys(gameThemes);
  return themeKeys[Math.floor(Math.random() * themeKeys.length)];
};

export const getThemeByKeyword = (keyword) => {
  const lowerKeyword = (keyword || '').toLowerCase();
  
  // Match themes based on keywords
  if (lowerKeyword.includes('animal') || lowerKeyword.includes('zoo')) return 'safari';
  if (lowerKeyword.includes('ocean') || lowerKeyword.includes('sea') || lowerKeyword.includes('fish')) return 'ocean';
  if (lowerKeyword.includes('space') || lowerKeyword.includes('star') || lowerKeyword.includes('planet')) return 'space';
  if (lowerKeyword.includes('jungle') || lowerKeyword.includes('tree') || lowerKeyword.includes('forest')) return 'jungle';
  if (lowerKeyword.includes('food') || lowerKeyword.includes('candy') || lowerKeyword.includes('sweet')) return 'candy';
  if (lowerKeyword.includes('winter') || lowerKeyword.includes('snow') || lowerKeyword.includes('cold')) return 'winter';
  if (lowerKeyword.includes('color') || lowerKeyword.includes('rainbow')) return 'rainbow';
  if (lowerKeyword.includes('ninja') || lowerKeyword.includes('japan')) return 'ninja';
  
  // Default to random theme
  return getRandomTheme();
};
