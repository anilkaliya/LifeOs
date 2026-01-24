import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL:
                process.env.NODE_ENV === 'production'
                    ? 'https://life-n4bbk8uvk-anil-kaliyas-projects.vercel.app/api/auth/callback/google'
                    : 'http://localhost:5001/api/auth/callback/google',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find or create user
                const [user, created] = await User.findOrCreate({
                    where: { googleId: profile.id },
                    defaults: {
                        googleId: profile.id,
                        email: profile.emails?.[0]?.value || '',
                        name: profile.displayName,
                        picture: profile.photos?.[0]?.value,
                    },
                });

                // Update user info if it changed
                if (!created) {
                    await user.update({
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value || user.email,
                        picture: profile.photos?.[0]?.value,
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error as Error, undefined);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ where: { email } });
                if (!user || !(await user.validatePassword(password))) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user to session
passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
