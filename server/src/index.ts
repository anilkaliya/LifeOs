import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import sequelize from './config/database';
import passport from './config/passport';
import apiRoutes from './routes/api';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Session store
const SessionStore = SequelizeStore(session.Store);
const sessionStore = new SessionStore({
    db: sequelize,
});

// CORS configuration - allow credentials
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            secure: false, // set to true if using HTTPS
        },
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

import { isAuthenticated } from './middleware/auth';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', isAuthenticated, apiRoutes);

app.get('/', (req, res) => {
    res.send('Daily Tracker API is running');
});

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');

        // Sync session store
        await sessionStore.sync();

        // Sync models (create tables)
        await sequelize.sync({ alter: true });

        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();

export default app;
