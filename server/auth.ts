import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import passport from "passport";
import { storage } from "./storage";

export function setupAuth(app: Express) {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const MemoryStore = createMemoryStore(session);

    app.set("trust proxy", 1);
    app.use(
        session({
            secret: process.env.SESSION_SECRET || "dev-secret-key",
            resave: false,
            saveUninitialized: false,
            store: new MemoryStore({
                checkPeriod: 86400000,
            }),
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: sessionTtl,
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user: any, cb) => cb(null, user));
    passport.deserializeUser((user: any, cb) => cb(null, user));

    // Mock login route for dev/demo purposes
    app.post("/api/login", (req, res) => {
        const user = {
            id: "dev-user",
            email: "dev@example.com",
            firstName: "Dev",
            lastName: "User",
            claims: {
                sub: "dev-user",
                email: "dev@example.com",
            }
        };
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "Login failed" });
            return res.json(user);
        });
    });

    app.post("/api/logout", (req, res) => {
        req.logout((err) => {
            if (err) return res.status(500).json({ message: "Logout failed" });
            res.json({ message: "Logged out" });
        });
    });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }

    // Auto-login as dev user if in no-db/dev mode
    // This matches the previous behavior where we allowed "dev-user" access
    if (!process.env.DATABASE_URL || process.env.NODE_ENV === "development") {
        const devUser = {
            id: "dev-user",
            email: "dev@example.com",
            firstName: "Dev",
            lastName: "User",
            claims: {
                sub: "dev-user",
                email: "dev@example.com",
            }
        };
        req.login(devUser, (err) => {
            if (err) return res.status(401).json({ message: "Unauthorized" });
            next();
        });
        return;
    }

    res.status(401).json({ message: "Unauthorized" });
}
