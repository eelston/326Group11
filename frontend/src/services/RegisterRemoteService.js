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
        const response = await fetch("http://localhost:3000/login");
    }

    async signup(data) {
        const response = await fetch("http://localhost:3000/signup");
    }

}