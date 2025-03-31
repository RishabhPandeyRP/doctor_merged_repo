import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import db from "./db.js"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "https://doctor-merged-repo.onrender.com/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails?.[0]?.value;
                const encryptedPass = await bcrypt.hash(id, 10)

                if (!email) {
                    return done(new Error("Google account must have an email"), profile);
                }

                const userCheck = await db.query(
                    "SELECT * FROM users WHERE email = $1",
                    [email]
                );

                let user;
                if (userCheck.rows.length > 0) {
                    user = userCheck.rows[0]; 
                }
                else {
                    const newUser = await db.query(
                        `INSERT INTO users (email, password, name, role) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
                        [email, encryptedPass, displayName, "patient"] 
                    );
                    user = newUser.rows[0];
                }

                return done(null, user);
            } catch (err) {
                return done(err, profile);
            }
        }
    )
)

export default passport