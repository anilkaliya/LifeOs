import { Router } from 'express';
import {
    createMeal, getMeals, deleteMeal,
    createWorkout, getWorkouts, deleteWorkout,
    createLearningSession, getLearningSessions, deleteLearningSession,
    getSkinCareLog, updateSkinCareLog
} from '../controllers';

const router = Router();

// --- Meals ---
router.post('/meals', createMeal);
router.get('/meals', getMeals);
router.delete('/meals/:id', deleteMeal);

// --- Workouts ---
router.post('/workouts', createWorkout);
router.get('/workouts', getWorkouts);
router.delete('/workouts/:id', deleteWorkout);

// --- Learning ---
router.post('/learning', createLearningSession);
router.get('/learning', getLearningSessions);
router.delete('/learning/:id', deleteLearningSession);

// --- Skin Care ---
router.get('/skincare/:date', getSkinCareLog);
router.post('/skincare', updateSkinCareLog);

// --- Analytics ---
import { getAnalytics } from '../controllers';
router.get('/analytics', getAnalytics);

export default router;
