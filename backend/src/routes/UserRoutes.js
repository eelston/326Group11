import express from "express";
import UserController from "../controller/UserController.js";
import RegisterController from "../controller/RegisterController.js";

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {

        this.router.post("/login", async (req, res) => {
            await RegisterController.login(req, res);
        })

        this.router.post("/signup", async (req, res) => {
            await RegisterController.signup(req, res);
        })

        this.router.get("/users", async (req, res) => {
            await UserController.getAllUsers(req, res);
        })

        this.router.get("/:userId", async (req, res) => {
            await UserController.getUser(req, res);
        })

        this.router.post("/users", async (req, res) => {
            await UserController.addUser(req, res); //upgrade this and bottom one later potentially
        })

        this.router.put("/user", async (req, res) => {
            await UserController.updateUser(req, res);
        })
    }

    getRouter() {
        return this.router;
    }
}

export default new UserRoutes().getRouter();