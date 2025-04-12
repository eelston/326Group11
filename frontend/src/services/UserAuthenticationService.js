import { UserRepository } from "./UserRepository.js";
import { EventHub } from '../eventhub/EventHub.js';

/**
 * Basic layout for a class handling User Authentication during signup and login.
 * Will be adjusted to extend Service.js in the future.
 */

export class UserAuthenticationService {
    constructor(userRepository = new UserRepository()){
        this.userRepository = userRepository;
        this.eventHub = EventHub.getInstance();
    }

    async handleLogin(credentials) {
        try{
            const user = await this.userRepository.getUserByEmail(credentials.email);
            if (user && user.password === credentials.password){
                this.eventHub.publish("LOGIN_SUCCESS", user);
            }
            else{
                this.eventHub.publish("LOGIN_FAILURE", { message: 'Invalid email and/or password.' });
            }
        } catch(error){
            this.eventHub.publish("LOGIN_FAILURE", { message: error.message });
        }
    }

    async handleSignup(userData) {
        try{
            const userExists = await this.userRepository.getUserByEmail(userData.email);
            if (!userExists){
                const user = await this.userRepository.createUser(userData);
                this.eventHub.publish("SIGNUP_SUCCESS", user);
            }
            else{
                this.eventHub.publish("SIGNUP_FAILURE", {message: 'Account with this email already exists.'})
            }
        } catch(error){
            this.eventHub.publish("SIGNUP_FAILURE", { message: error.message });
        }
    }

}