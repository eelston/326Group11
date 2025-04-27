import express from "express";
import UserController from "../controller/UserController";

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {

        this.router.get("/login", async (req, res) => {
            await UserController.getUserLogin(req, res);
        })

        this.router.get("/users", async (req, res) => {
            await UserController.getAllUsers(req, res);
        })

        this.router.get("/user", async (req, res) => {
            await UserController.getUser(req, res);
        })

        this.router.post("/user", async (req, res) => {
            await UserController.addUser(req, res);
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