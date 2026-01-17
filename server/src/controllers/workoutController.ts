import { Request, Response } from 'express';
import { Workout } from '../models';

export const createWorkout = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const workout = await Workout.create({ ...req.body, userId });
        res.json(workout);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create workout' });
    }
};

export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const workouts = await Workout.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
};

export const deleteWorkout = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const deleted = await Workout.destroy({
            where: { id: req.params.id, userId }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Workout not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete workout' });
    }
};
