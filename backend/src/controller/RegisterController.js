import bcrypt from "bcryptjs";
import { hashEmailHMAC } from "../auth/hmac.js";
import dotenv from "dotenv";
import User from "../models/settings.js";

dotenv.config();

const factoryResponse = (status, message) => ({ status, message });

const existsUsername = async (username) => {
  const user = await User.findOne({ where: { userId: username } });
  return user;
};

const existsEmail = async (email) => {
    const emailHash = hashEmailHMAC(email);
    const user = await User.findOne({ where: { email: emailHash } });
    return user;
  };

// Registration route
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (await existsUsername(username))
        return res.status(400).json(factoryResponse(400, "Username already taken."));
  
    if (await existsEmail(email))
        return res.status(400).json(factoryResponse(400, "Account with email already exists."));

    const hashedEmail = hashEmailHMAC(email);
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({ 
        userId: username, 
        email: hashedEmail, 
        password: hashPassword 
    });

    res.json(factoryResponse(200, "Registration successful"));
    console.log("User registered successfully");
};

//Login route
export const login = async (req, res) => {
    const { email, password } = req.body;
    const hashedEmail = hashEmailHMAC(email);

    const user = await User.findOne({ where: { email: hashedEmail } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json(factoryResponse(401, "Invalid credentials"));
    }
    
    req.login(user, (err) =>
        err ? next(err) : res.json(factoryResponse(200, "Login successful"))
    );
};

//Logout route
export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            res.json(factoryResponse(500, "Logout failed"));
            return;
        }
        res.json(factoryResponse(200, "Logout successful"));
    });
};