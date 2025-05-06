import express from "express";
import passport from "../auth/passport.js";
import RegisterController from "../controller/RegisterController.js";
//import { isAuthenticated, authorizeRole } from "../auth/middleware.js";

class RegisterRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/signup", async (req, res) => {
            await RegisterController.signup(req, res);
        });

        this.router.post("/login", async (req, res) => {
            await RegisterController.login(req, res);
        });

        this.router.get("/logout", async (req, res) => {
            await RegisterController.logout(req, res);
        });

        this.router.get("/auth/google",
            passport.authenticate("google", { scope: ["profile"] })
        );

        router.get("/auth/google/callback",
            passport.authenticate("google", { failureRedirect: "/" }),
            googleAuthCallback
        );
    }

    getRouter() {
        return this.router;
    }
}

export default new RegisterRoutes().getRouter();