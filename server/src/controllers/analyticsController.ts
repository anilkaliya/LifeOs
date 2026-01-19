import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Meal, Workout, LearningSession, SkinCareLog } from '../models'; // Ensure models are exported from index

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { startDate, endDate, search } = req.query;

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

        const mealWhere: any = { ...dateFilter };
        const workoutWhere: any = { ...dateFilter };
        const learningWhere: any = { ...dateFilter };
        const skincareWhere: any = { ...dateFilter };

        if (search) {
            const searchStr = `%${search}%`;
            mealWhere[Op.or] = [
                { mealName: { [Op.iLike]: searchStr } },
                { description: { [Op.iLike]: searchStr } }
            ];
            workoutWhere[Op.or] = [
                { name: { [Op.iLike]: searchStr } },
                { notes: { [Op.iLike]: searchStr } }
            ];
            learningWhere[Op.or] = [
                { topic: { [Op.iLike]: searchStr } }
            ];
            skincareWhere[Op.or] = [
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
        let totalWorkouts = workouts.length;
        let totalLearningMinutes = 0;
        let skincareStreak = 0; // Simplified logic for now, or total days logged

        // Daily Breakdown for Charts
        const dailyData: Record<string, any> = {};

        // Process Meals
        meals.forEach((log: any) => {
            totalCalories += log.calories || 0;
            if (!dailyData[log.date]) dailyData[log.date] = { date: log.date, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[log.date].calories += log.calories || 0;
        });

        // Process Workouts
        workouts.forEach((log: any) => {
            if (!dailyData[log.date]) dailyData[log.date] = { date: log.date, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[log.date].workoutCount += 1;
        });

        // Process Learning
        learningSessions.forEach((log: any) => {
            totalLearningMinutes += log.durationMinutes || 0;
            if (!dailyData[log.date]) dailyData[log.date] = { date: log.date, calories: 0, learningMinutes: 0, workoutCount: 0 };
            dailyData[log.date].learningMinutes += log.durationMinutes || 0;
        });

        // Process Skincare
        skincareLogs.forEach((log: any) => {
            // For streak, we might just count days logged in this period
            if (log.detan || log.oiling || log.sunscreen || log.customRoutine) {
                skincareStreak++;
            }
        });

        // Combined Logs List for "Activity History"
        const allLogs = [
            ...meals.map((l: any) => ({ ...l.toJSON(), type: 'meal' })),
            ...workouts.map((l: any) => ({ ...l.toJSON(), type: 'workout' })),
            ...learningSessions.map((l: any) => ({ ...l.toJSON(), type: 'learning' })),
            ...skincareLogs.map((l: any) => ({ ...l.toJSON(), type: 'skincare' }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending

        res.json({
            totals: {
                calories: totalCalories,
                workouts: totalWorkouts,
                learningMinutes: totalLearningMinutes,
                skincareDays: skincareStreak
            },
            chartData: Object.values(dailyData).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            logs: allLogs
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};
