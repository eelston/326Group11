import { hashEmailHMAC } from "../auth/hmac.js";
import dotenv from "dotenv";
import ModelFactory from "../model/ModelFactory.js";

dotenv.config();

class RegisterController {

    constructor() {
        ModelFactory.getModel("sqlite").then((model) => {
            this.model = model;
        });
    }
    
    async signup(req, res) {
        try {
            const { userId, email, password } = req.body;

            if (!userId || !email || !password) {
                return res.status(400).json({ status: 400, message: "All fields are required." });
            }

            const existingUserById = await this.model.findOne({ where: { userId } });
            if (existingUserById) {
                return res.status(400).json({ status: 400, message: "Username already taken." });
            }

            const hashedEmail = hashEmailHMAC(email);
            const existingUserByEmail = await this.model.findOne({ where: { email: hashedEmail } });
            if (existingUserByEmail) {
                return res.status(400).json({ status: 400, message: "Account with email already exists." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await this.model.create({
                userId: userId,
                email: hashedEmail,
                password: hashedPassword
            });

            return res.status(200).json({
                status: 200,
                message: "Signup successful",
                user: { userId: newUser.userId }
            });
        } catch (error) {
            console.error("Signup error:", error);
            return res.status(500).json({ status: 500, message: "Signup failed. Please try again." });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ status: 400, message: "Email and password are required." });
            }

            const hashedEmail = hashEmailHMAC(email);
            const user = await this.model.findOne({ where: { email: hashedEmail } });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ status: 401, message: "Invalid credentials." });
            }

            return res.status(200).json({ status: 200, message: "Login successful" });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ status: 500, message: "Login failed. Please try again." });
        }
    }

}

export default new RegisterController();