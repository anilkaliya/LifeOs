import { Request, Response } from 'express';
import { LearningSession } from '../models';

export const createLearningSession = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const session = await LearningSession.create({ ...req.body, userId });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create learning session' });
    }
};

export const getLearningSessions = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const sessions = await LearningSession.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch learning sessions' });
    }
};

export const deleteLearningSession = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const deleted = await LearningSession.destroy({
            where: { id: req.params.id, userId }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Learning session not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete learning session' });
    }
};
