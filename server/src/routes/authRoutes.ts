import { Router } from 'express';
import passport from '../config/passport';
import User from '../models/User';

const router = Router();

// Local Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info?.message || 'Authentication failed' });

        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json(user);
        });
    })(req, res, next);
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = await User.create({ name, email, password });

        // Don't auto-login after register
        res.json({ message: 'Registration successful' });

    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
    '/callback/google',
    passport.authenticate('google', {
        failureRedirect: process.env.NODE_ENV === 'production'
            ? `https://life-os-lilac-six.vercel.app/login`
            : 'http://localhost:5173/login'
    }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        const clientUrl = process.env.NODE_ENV === 'production'
            ? `https://life-os-lilac-six.vercel.app`
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
