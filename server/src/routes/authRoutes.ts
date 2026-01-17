import { Router } from 'express';
import passport from '../config/passport';

const router = Router();

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/callback/google',
    passport.authenticate('google', {
        failureRedirect: process.env.NODE_ENV === 'production'
            ? 'https://life-c52d5i4sr-anil-kaliyas-projects.vercel.app/login'
            : 'http://localhost:5173/login'
    }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        const clientUrl = process.env.NODE_ENV === 'production'
            ? 'https://life-c52d5i4sr-anil-kaliyas-projects.vercel.app'
            : 'http://localhost:5173';
        res.redirect(clientUrl);
    }
);

// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

// Get current user
router.get('/me', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.user);
});

export default router;
