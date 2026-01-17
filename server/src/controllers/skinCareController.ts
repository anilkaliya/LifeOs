import { Request, Response } from 'express';
import { SkinCareLog } from '../models';

export const getSkinCareLog = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { date } = req.params;
        let log = await SkinCareLog.findOne({ where: { date, userId } });
        if (!log) {
            return res.json({ date, detan: false, oiling: false, sunscreen: false });
        }
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch skincare log' });
    }
};

export const updateSkinCareLog = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any)?.id;
        const { date, detan, oiling, sunscreen } = req.body;

        const [log, created] = await SkinCareLog.findOrCreate({
            where: { date, userId },
            defaults: {
                date,
                userId,
                detan: false,
                oiling: false,
                sunscreen: false
            }
        });

        // Update fields
        if (detan !== undefined) log.detan = detan;
        if (oiling !== undefined) log.oiling = oiling;
        if (sunscreen !== undefined) log.sunscreen = sunscreen;

        await log.save();
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update skincare log' });
    }
};
