import { create } from 'zustand';
import { format } from 'date-fns';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

export interface DietLog {
    id: string;
    mealName: string;
    description: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    date: string;
}

export interface WorkoutLog {
    id: string;
    name: string;
    notes?: string;
    date: string;
}

export interface LearningLog {
    id: string;
    topic: string;
    durationMinutes: number;
    date: string;
}

export interface SkinCareLog {
    date: string;
    detan: boolean;
    oiling: boolean;
    sunscreen: boolean;
}

interface AppState {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;

    dietLogs: DietLog[];
    addDietLog: (log: Omit<DietLog, 'id'>) => Promise<void>;

    workoutLogs: WorkoutLog[];
    addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => Promise<void>;

    learningLogs: LearningLog[];
    addLearningLog: (log: Omit<LearningLog, 'id'>) => Promise<void>;

    deleteDietLog: (id: string) => Promise<void>;
    deleteWorkoutLog: (id: string) => Promise<void>;
    deleteLearningLog: (id: string) => Promise<void>;

    skinCareLog: SkinCareLog | null;
    saveSkinCare: (detan: boolean, oiling: boolean, sunscreen: boolean) => Promise<void>;

    // Authentication
    user: { id: number; name: string; email: string; picture?: string } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;

    fetchData: (date?: Date) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
    selectedDate: new Date(),
    setSelectedDate: (date) => set({ selectedDate: date }),

    dietLogs: [],
    addDietLog: async (log) => {
        try {
            const res = await fetch(`${API_URL}/meals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
                credentials: 'include',
            });
            if (res.ok) {
                const newLog = await res.json();
                set((state) => ({ dietLogs: [newLog, ...state.dietLogs] }));
            }
        } catch (error) {
            console.error('Failed to add diet log:', error);
        }
    },

    workoutLogs: [],
    addWorkoutLog: async (log) => {
        try {
            const res = await fetch(`${API_URL}/workouts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
                credentials: 'include',
            });
            if (res.ok) {
                const newLog = await res.json();
                set((state) => ({ workoutLogs: [newLog, ...state.workoutLogs] }));
            }
        } catch (error) {
            console.error('Failed to add workout log:', error);
        }
    },

    learningLogs: [],
    addLearningLog: async (log) => {
        try {
            const res = await fetch(`${API_URL}/learning`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(log),
                credentials: 'include',
            });
            if (res.ok) {
                const newLog = await res.json();
                set((state) => ({ learningLogs: [newLog, ...state.learningLogs] }));
            }
        } catch (error) {
            console.error('Failed to add learning log:', error);
        }
    },

    deleteDietLog: async (id) => {
        try {
            await fetch(`${API_URL}/meals/${id}`, { method: 'DELETE', credentials: 'include' });
            set((state) => ({ dietLogs: state.dietLogs.filter(l => l.id !== id) }));
        } catch (error) {
            console.error('Failed to delete diet log:', error);
        }
    },

    deleteWorkoutLog: async (id) => {
        try {
            await fetch(`${API_URL}/workouts/${id}`, { method: 'DELETE', credentials: 'include' });
            set((state) => ({ workoutLogs: state.workoutLogs.filter(l => l.id !== id) }));
        } catch (error) {
            console.error('Failed to delete workout log:', error);
        }
    },

    deleteLearningLog: async (id) => {
        try {
            await fetch(`${API_URL}/learning/${id}`, { method: 'DELETE', credentials: 'include' });
            set((state) => ({ learningLogs: state.learningLogs.filter(l => l.id !== id) }));
        } catch (error) {
            console.error('Failed to delete learning log:', error);
        }
    },

    skinCareLog: { date: format(new Date(), 'yyyy-MM-dd'), detan: false, oiling: false, sunscreen: false },
    saveSkinCare: async (detan: boolean, oiling: boolean, sunscreen: boolean) => {
        const dateStr = format(new Date(), 'yyyy-MM-dd');

        // Optimistic update
        set({
            skinCareLog: {
                date: dateStr,
                detan,
                oiling,
                sunscreen
            }
        });

        try {
            await fetch(`${API_URL}/skincare`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: dateStr,
                    detan,
                    oiling,
                    sunscreen
                }),
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to update skincare:', error);
        }
    },

    fetchData: async (date = new Date()) => {
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            // Parallel fetch
            const [mealsRes, workoutsRes, learningRes, skinCareRes] = await Promise.all([
                fetch(`${API_URL}/meals`, { credentials: 'include' }),
                fetch(`${API_URL}/workouts`, { credentials: 'include' }),
                fetch(`${API_URL}/learning`, { credentials: 'include' }),
                fetch(`${API_URL}/skincare/${dateStr}`, { credentials: 'include' }),
            ]);

            const dietLogs = mealsRes.ok ? await mealsRes.json() : [];
            const workoutLogs = workoutsRes.ok ? await workoutsRes.json() : [];
            const learningLogs = learningRes.ok ? await learningRes.json() : [];
            const skinCareLog = skinCareRes.ok ? await skinCareRes.json() : null;

            set({ dietLogs, workoutLogs, learningLogs, skinCareLog });
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // On error, reset to empty to avoid type errors
            set({ dietLogs: [], workoutLogs: [], learningLogs: [], skinCareLog: null });
        }
    },

    // Authentication state
    user: null,
    isAuthenticated: false,
    isLoading: true,

    checkAuth: async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                credentials: 'include',
            });
            if (res.ok) {
                const user = await res.json();
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    logout: async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                credentials: 'include',
            });
            set({ user: null, isAuthenticated: false });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    },
}));
