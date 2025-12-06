import { create } from 'zustand';

const STORAGE_KEY = 'dailyHabitTracker_v1';

const defaultHabits = [
  { id: 'h1', name: 'Meditating', category: 'Spiritual' },
  { id: 'h2', name: 'Journaling', category: 'Spiritual' },
  { id: 'h3', name: 'Yoga', category: 'Health' },
  { id: 'h4', name: 'Gym', category: 'Health' },
  { id: 'h5', name: 'Morning Walk', category: 'Health' },
  { id: 'h6', name: 'Budget Tracker', category: 'Finance' },
  { id: 'h7', name: 'Coffee Catchup', category: 'Social' },
];

const defaultCategories = ['Spiritual', 'Health', 'Finance', 'Social'];

const loadFromStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        habits: defaultHabits,
        completions: {},
        selectedMonth: new Date().toISOString().slice(0, 7),
        categories: defaultCategories,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      habits: parsed.habits ?? defaultHabits,
      completions: parsed.completions ?? {},
      selectedMonth: parsed.selectedMonth ?? new Date().toISOString().slice(0, 7),
      categories: parsed.categories ?? defaultCategories,
    };
  } catch {
    return {
      habits: defaultHabits,
      completions: {},
      selectedMonth: new Date().toISOString().slice(0, 7),
      categories: defaultCategories,
    };
  }
};

const saveToStorage = (state) => {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      habits: state.habits,
      completions: state.completions,
      selectedMonth: state.selectedMonth,
      categories: state.categories,
    })
  );
};

export const useHabitStore = create((set, get) => ({
  ...loadFromStorage(),

  setMonth: (month) => {
    set({ selectedMonth: month });
    saveToStorage(get());
  },

  addHabit: (name, category) => {
    const id = `h_${Date.now()}`;
    set((state) => ({
      habits: [...state.habits, { id, name, category }],
    }));
    saveToStorage(get());
  },

  deleteHabit: (id) => {
    set((state) => {
      const newHabits = state.habits.filter((h) => h.id !== id);
      const newCompletions = { ...state.completions };
      Object.keys(newCompletions).forEach((key) => {
        if (key.startsWith(id + ':')) delete newCompletions[key];
      });
      return { habits: newHabits, completions: newCompletions };
    });
    saveToStorage(get());
  },

  toggleCompletion: (habitId, dateKey) => {
    set((state) => {
      const k = `${habitId}:${dateKey}`;
      const newCompletions = { ...state.completions };
      if (newCompletions[k]) {
        delete newCompletions[k];
      } else {
        newCompletions[k] = true;
      }
      return { completions: newCompletions };
    });
    saveToStorage(get());
  },

  addCategory: (category) => {
    set((state) => ({
      categories: [...state.categories, category],
    }));
    saveToStorage(get());
  },

  removeCategory: (category) => {
    set((state) => ({
      categories: state.categories.filter((c) => c !== category),
      habits: state.habits.filter((h) => h.category !== category),
    }));
    saveToStorage(get());
  },
}));
