import ModelFactory from "../model/ModelFactory.js";

class UserController {
    constructor(){
        ModelFactory.getModel().then((model) => {
            this.model = model;
        });
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.model.read();
            res.json({ users });
        } catch (error) {
            console.error("Error getting users.");
            return res
            .status(500)
            .json({ error: "Failed to get users. Please try again."});
        }
    }

    async getUserLogin(req, res) {
        try {
            if (!req.body || !req.body.email){
                return res.status(400).json({error: "Email required to get account."});
            }
            const user = await this.model.read(req.body);
            if (!user) {
                return res.status(400).json({ error: "User not found."})
            }
            res.json({ user });
        } catch (error) {
            console.error("Error getting user:", error);
            return res
            .status(500)
            .json({ error: "Failed to get user. Please try again." });
        }
    }

    async getUser(req, res) {
        try {
            if (!req.body || !req.body.userId){
                return res.status(400).json({error: "User ID required to get account."});
            }
            const user = await this.model.read(req.body);
            if (!user) {
                return res.status(400).json({ error: "User not found."})
            }
            res.json({ user });
        } catch (error) {
            console.error("Error getting user:", error);
            return res
            .status(500)
            .json({ error: "Failed to get user. Please try again." });
        }
    }

    async addUser(req, res) {
        try {
            if (!req.body || !req.body.email || !req.body.password) {
                return res.status(400).json({ error: "Email and password required to make account."})
            }
            const user = await this.model.create(req.body);
            return res.status(201).json({ user });
        } catch (error) {
            console.error("Error adding user:", error);
            return res
            .status(500)
            .json({ error: "Failed to add user. Please try again." });
        }
    }

    async updateUser(req, res) {
        try {
            if (!req.body || !req.body.userId) {
                return res.status(400).json({ error: "User ID required to update account."})
            }
            const user = await this.model.update(req.body);
            if (!user) {
                return res.status(400).json({ error: "User not found."})
            }
            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error updating user:", error);
            return res
            .status(500)
            .json({ error: "Failed to update user. Please try again." })
        }
    }
}