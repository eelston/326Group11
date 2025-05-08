import Service from "./Service.js";
import { Events } from "../eventhub/Events.js";

export class RegisterRemoteService extends Service {
    constructor() {
        super();
    }

    addSubscriptions() {
        this.subscribe(Events.Login, (data) => {
            this.login(data);
        });

        this.subscribe(Events.Signup, (data) => {
            this.signup(data);
        });

        /**
        this.subscribe(Events.Logout, (data) => {
            this.logout(data);
        })
        */

    }

    async login(data) {
        const response = await fetch("http://localhost:3000/users/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error("Failed to login.");
        }
        this.publish(Events.LoginSuccess);
        return responseData;
    }

    async signup(data) {
        const response = await fetch("http://localhost:3000/users/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error("Failed to login.");
        }
        this.publish(Events.SignupSuccess);
        return responseData;
    }

    
}