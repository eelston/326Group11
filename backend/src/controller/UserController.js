import ModelFactory from "../model/ModelFactory.js";

class UserController {
    constructor(){
        ModelFactory.getModel("sqlite-fresh").then((model) => {
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

    async login(req, res) {
        try {
            if (!req.params || !req.params.email){
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
            if (!req.params){
                return res.status(400).json({error: "User ID required to get account."});
            }
            const userId = req.params.userId;
            const user = await this.model.read({userId});
            if (!user) {
                return res.status(400).json({ error: "User not found."})
            }
            res.status(200).json({ user });
        } catch (error) {
            console.error("Error getting user:", error);
            return res
            .status(500)
            .json({ error: "Failed to get user. Please try again." });
        }
    }

    async addUser(req, res) { //NEED AN UPDATE
        try {
            if (!req.params) {
                return res.status(400).json({ error: "Email, password, and User ID required to make account."})
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

    async updateUser(req, res) { // NEED UPDATE IN FUTURE after course
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

export default new UserController();