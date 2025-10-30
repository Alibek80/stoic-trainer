/**
 * Constants for Stoic Trainer app
 */

// Virtues names and descriptions
export const VIRTUES = {
  wisdom: {
    name: 'Мудрость',
    description: 'Способность принимать правильные решения',
    icon: 'Compass',
  },
  courage: {
    name: 'Мужество',
    description: 'Смелость перед лицом трудностей',
    icon: 'Shield',
  },
  justice: {
    name: 'Справедливость',
    description: 'Честность и равенство в отношениях',
    icon: 'Target',
  },
  temperance: {
    name: 'Умеренность',
    description: 'Контроль над желаниями и эмоциями',
    icon: 'TrendingUp',
  },
} as const;

// Morning reflection steps
export const MORNING_REFLECTION_STEPS = [
  {
    id: 'gratitude',
    label: 'За что я благодарен сегодня?',
    placeholder: 'Напишите 3 вещи, за которые вы благодарны...',
  },
  {
    id: 'intentions',
    label: 'Каковы мои намерения на день?',
    placeholder: 'Что я хочу сегодня сделать или почувствовать?',
  },
  {
    id: 'obstacles',
    label: 'Какие препятствия могут возникнуть?',
    placeholder: 'Как стоик, как я могу подготовиться к трудностям?',
  },
] as const;

// Evening reflection steps
export const EVENING_REFLECTION_STEPS = [
  {
    id: 'review',
    label: 'Что хорошего произошло сегодня?',
    placeholder: 'Опишите позитивные моменты дня...',
  },
  {
    id: 'lessons',
    label: 'Какие уроки я извлек?',
    placeholder: 'Чему я научился сегодня?',
  },
  {
    id: 'improvements',
    label: 'Что я могу улучшить завтра?',
    placeholder: 'Как я могу стать лучше завтра?',
  },
] as const;

// Default challenges
export const DEFAULT_CHALLENGES = [
  {
    title: 'Откажитесь от жалоб на один день',
    description: 'Попробуйте прожить день без жалоб на обстоятельства. Вместо этого фокусируйтесь на решениях.',
  },
  {
    title: 'Практикуйте отрицательную визуализацию',
    description: 'Представьте, что потеряли что-то важное. Это поможет ценить то, что есть.',
  },
  {
    title: 'Запишите благодарности',
    description: 'Запишите 5 вещей, за которые вы благодарны сегодня.',
  },
  {
    title: 'Примите то, что не можете изменить',
    description: 'Определите одну вещь, которую вы не можете контролировать, и примите её спокойно.',
  },
  {
    title: 'Практикуйте доброту',
    description: 'Сделайте что-то доброе для другого человека без ожидания благодарности.',
  },
] as const;

// Mood scale labels
export const MOOD_SCALE = {
  1: 'Плохо',
  2: 'Ниже среднего',
  3: 'Нормально',
  4: 'Хорошо',
  5: 'Отлично',
} as const;

export const STRESS_SCALE = {
  1: 'Минимальный',
  2: 'Низкий',
  3: 'Умеренный',
  4: 'Высокий',
  5: 'Очень высокий',
} as const;

// App settings
export const APP_CONFIG = {
  dateFormat: 'YYYY-MM-DD',
  weekDays: 7,
  challengeStreakGoal: 7,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  reflections: 'stoic_reflections',
  virtues: 'stoic_virtues',
  challenges: 'stoic_challenges',
  quotes: 'stoic_quotes_favorites',
  moodLogs: 'stoic_mood_logs',
  lastSync: 'stoic_last_sync',
} as const;

// Theme colors
export const THEME_COLORS = {
  background: '#F9FAFB',
  accent: '#F59E0B',
  text: '#111827',
  secondary: '#6B7280',
} as const;



