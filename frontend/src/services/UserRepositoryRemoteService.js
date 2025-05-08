import Service from "./Service.js";
import { Events } from "../eventhub/Events.js";

export class UserRepositoryRemoteService extends Service {
    constructor() {
        super();
        this.#initUsers();
    }

    addSubscriptions() { 
        this.subscribe(Events.LoadUserData, (userId) => {
            this.loadUser(userId);
        });
    }
  
    async #initUsers() { 
        const response = await fetch("http://localhost:3000/users/users");
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        data.users.forEach(async (user) => {
            this.publish(Events.NewUser, user);
        })
    }

    async loadUser(userId) {
        const response = await fetch(`http://localhost:3000/users/${userId}`);
        console.log("Response status: " + response.status);
        if (!response.ok) {
            this.publish(Events.LoadUserDataFailure);
            throw new Error(`Failed to fetch user with userId ${userId}`);
        }
        const data = await response.json();
        this.publish(Events.LoadUserDataSuccess, data);
        return data; 
    }
}