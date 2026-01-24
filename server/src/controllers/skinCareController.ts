import { Request, Response } from 'express';
import { SkinCareLog, User } from '../models';

export const getSkinCareLog = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User)?.id;
        const { date } = req.params;
        const log = await SkinCareLog.findOne({ where: { date, userId } });
        if (!log) {
            return res.json({ date, detan: false, oiling: false, sunscreen: false });
        }
        res.json(log);
    } catch (_error) {
        res.status(500).json({ error: 'Failed to fetch skincare log' });
    }
};

export const updateSkinCareLog = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { date, detan, oiling, sunscreen, customRoutine } = req.body;

        const [log, _created] = await SkinCareLog.findOrCreate({
            where: { date, userId },
            defaults: {
                date,
                userId,
                detan: false,
                oiling: false,
                sunscreen: false,
                customRoutine: ''
            }
        });

        // Update fields
        if (detan !== undefined) log.detan = detan;
        if (oiling !== undefined) log.oiling = oiling;
        if (sunscreen !== undefined) log.sunscreen = sunscreen;
        if (customRoutine !== undefined) log.customRoutine = customRoutine;

        await log.save();
        res.json(log);
    } catch (_error) {
        res.status(500).json({ error: 'Failed to update skincare log' });
    }
};
