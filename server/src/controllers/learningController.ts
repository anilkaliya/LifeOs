import { Request, Response } from 'express';
import { LearningSession, User } from '../models';

export const createLearningSession = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User)?.id;
        const session = await LearningSession.create({ ...req.body, userId });
        res.json(session);
    } catch (_error) {
        res.status(500).json({ error: 'Failed to create learning session' });
    }
};

export const getLearningSessions = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User)?.id;
        const sessions = await LearningSession.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.json(sessions);
    } catch (_error) {
        res.status(500).json({ error: 'Failed to fetch learning sessions' });
    }
};

export const deleteLearningSession = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User)?.id;
        const deleted = await LearningSession.destroy({
            where: { id: req.params.id, userId }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Learning session not found' });
        }
        res.status(204).send();
    } catch (_error) {
        res.status(500).json({ error: 'Failed to delete learning session' });
    }
};
