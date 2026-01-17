import { Request, Response } from 'express';
import { Meal } from '../models';

export const createMeal = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const meal = await Meal.create({ ...req.body, userId });
        res.json(meal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create meal' });
    }
};

export const getMeals = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const meals = await Meal.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
};

export const deleteMeal = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const deleted = await Meal.destroy({
            where: { id: req.params.id, userId }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Meal not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete meal' });
    }
};
