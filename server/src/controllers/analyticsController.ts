import { Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';
import { Meal, Workout, LearningSession, SkinCareLog, User } from '../models'; // Ensure models are exported from index

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User)?.id;
        const { startDate, endDate, search } = req.query as { startDate?: string; endDate?: string; search?: string };

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Ensure endDate includes the entire day
        // If dates are strings 'YYYY-MM-DD', BETWEEN includes them for DATEONLY.
        // But if comparisons happen against formatted strings, let's be safe.

        const dateFilter = {
            userId,
            date: {
                [Op.between]: [startDate, endDate]
            }
        };

        const mealWhere: WhereOptions = { ...dateFilter };
        const workoutWhere: WhereOptions = { ...dateFilter };
        const learningWhere: WhereOptions = { ...dateFilter };
        const skincareWhere: WhereOptions = { ...dateFilter };

        if (search) {
            const searchStr = `%${search}%`;
            (mealWhere as Record<symbol | string, any>)[Op.or] = [
                { mealName: { [Op.iLike]: searchStr } },
                { description: { [Op.iLike]: searchStr } }
            ];
            (workoutWhere as Record<symbol | string, any>)[Op.or] = [
                { name: { [Op.iLike]: searchStr } },
                { notes: { [Op.iLike]: searchStr } }
            ];
            (learningWhere as Record<symbol | string, any>)[Op.or] = [
                { topic: { [Op.iLike]: searchStr } }
            ];
            (skincareWhere as Record<symbol | string, any>)[Op.or] = [
                { customRoutine: { [Op.iLike]: searchStr } }
            ];
        }

        const [meals, workouts, learningSessions, skincareLogs] = await Promise.all([
            Meal.findAll({ where: mealWhere, order: [['date', 'ASC']] }),
            Workout.findAll({ where: workoutWhere, order: [['date', 'ASC']] }),
            LearningSession.findAll({ where: learningWhere, order: [['date', 'ASC']] }),
            SkinCareLog.findAll({ where: skincareWhere, order: [['date', 'ASC']] })
        ]);

        // Aggregation
        let totalCalories = 0;
        const totalWorkouts = workouts.length;
        let totalLearningMinutes = 0;
        let skincareStreak = 0; // Simplified logic for now, or total days logged

        const getDateStr = (date: any): string => {
            if (date instanceof Date) return date.toISOString().split('T')[0];
            return String(date);
        };

        // Daily Breakdown for Charts
        const dailyData: Record<string, { date: string; calories: number; learningMinutes: number; workoutCount: number }> = {};

        // Process Meals
        meals.forEach((log) => {
            const dateStr = getDateStr(log.date);
            totalCalories += log.calories || 0;
            if (!dailyData[dateStr]) dailyData[dateStr] = { date: dateStr, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[dateStr].calories += log.calories || 0;
        });

        // Process Workouts
        workouts.forEach((log) => {
            const dateStr = getDateStr(log.date);
            if (!dailyData[dateStr]) dailyData[dateStr] = { date: dateStr, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[dateStr].workoutCount += 1;
        });

        // Process Learning
        learningSessions.forEach((log) => {
            const dateStr = getDateStr(log.date);
            totalLearningMinutes += log.durationMinutes || 0;
            if (!dailyData[dateStr]) dailyData[dateStr] = { date: dateStr, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[dateStr].learningMinutes += log.durationMinutes || 0;
        });

        // Process Skincare
        skincareLogs.forEach((log) => {
            // For streak, we might just count days logged in this period
            if (log.detan || log.oiling || log.sunscreen || log.customRoutine) {
                skincareStreak++;
            }
        });

        // Combined Logs List for "Activity History"
        const allLogs = [
            ...meals.map((l) => ({ ...l.toJSON(), type: 'meal', date: getDateStr(l.date) })),
            ...workouts.map((l) => ({ ...l.toJSON(), type: 'workout', date: getDateStr(l.date) })),
            ...learningSessions.map((l) => ({ ...l.toJSON(), type: 'learning', date: getDateStr(l.date) })),
            ...skincareLogs.map((l) => ({ ...l.toJSON(), type: 'skincare', date: getDateStr(l.date) }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending

        res.json({
            totals: {
                calories: totalCalories,
                workouts: totalWorkouts,
                learningMinutes: totalLearningMinutes,
                skincareDays: skincareStreak
            },
            chartData: Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            logs: allLogs
        });

    } catch (_error) {
        console.error('Analytics Error:', _error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
