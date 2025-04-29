import { EventHub } from '../eventhub/EventHub.js';
import { Events } from '../eventhub/SettingsEvents.js';
import Service from './Service.js';

export class SettingsService extends Service {
    constructor() {
        super();
        this.eventHub = EventHub.getInstance();
        this.baseUrl = '/api';
        // Get userId from local storage or session
        this.userId = localStorage.getItem('userId') || '123';
        this.addSubscriptions();
    }

    addSubscriptions() {
        this.subscribe(Events.SAVE_PREFERENCES, this.savePreferences.bind(this));
        this.subscribe(Events.SAVE_PROFILE, this.updateProfile.bind(this));
        this.subscribe(Events.SAVE_ACCOUNT, this.saveAccount.bind(this));
        this.subscribe(Events.ADD_CLASS, this.addClass.bind(this));
        this.subscribe(Events.REMOVE_CLASS, this.removeClass.bind(this));
    }

    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            const error = new Error(data.error || 'An error occurred');
            error.status = response.status;
            throw error;
        }
        
        return data;
    }

    async getSettings() {
        try {
            const response = await fetch(`${this.baseUrl}/settings/${this.userId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await this.handleResponse(response);
            return data;
        } catch (error) {
            const message = error.status === 404 ? 'Settings not found' : error.message;
            this.eventHub.publish(Events.SETTINGS_ERROR, message);
            return null;
        }
    }

    async savePreferences(preferences) {
        try {
            preferences.userId = this.userId;
            
            const response = await fetch(`${this.baseUrl}/settings/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(preferences)
            });
            
            const result = await this.handleResponse(response);
            this.eventHub.publish(Events.SETTINGS_SUCCESS, result.message);
            return result.data;
        } catch (error) {
            this.eventHub.publish(Events.SETTINGS_ERROR, error.message);
            return null;
        }
    }

    async updateProfile(profile) {
        try {
            profile.userId = this.userId;
            
            const response = await fetch(`${this.baseUrl}/settings/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(profile)
            });
            
            const result = await this.handleResponse(response);
            this.eventHub.publish(Events.SETTINGS_SUCCESS, result.message);
            return result.data;
        } catch (error) {
            this.eventHub.publish(Events.SETTINGS_ERROR, error.message);
            return null;
        }
    }

    async saveAccount(accountData) {
        try {
            accountData.userId = this.userId;
            
            const response = await fetch(`${this.baseUrl}/settings/account`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(accountData)
            });
            
            const result = await this.handleResponse(response);
            this.eventHub.publish(Events.SETTINGS_SUCCESS, result.message);
            return result.data;
        } catch (error) {
            this.eventHub.publish(Events.SETTINGS_ERROR, error.message);
            return null;
        }
    }

    async addClass(classData) {
        try {
            classData.userId = this.userId;
            
            const response = await fetch(`${this.baseUrl}/settings/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(classData)
            });
            
            const result = await this.handleResponse(response);
            this.eventHub.publish(Events.SETTINGS_SUCCESS, result.message);
            return result.data;
        } catch (error) {
            this.eventHub.publish(Events.SETTINGS_ERROR, error.message);
            return null;
        }
    }

    async removeClass(classId) {
        try {
            const response = await fetch(
                `${this.baseUrl}/settings/classes/${this.userId}/${classId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await this.handleResponse(response);
            this.eventHub.publish(Events.SETTINGS_SUCCESS, result.message);
            return result.data;
        } catch (error) {
            this.eventHub.publish(Events.SETTINGS_ERROR, error.message);
            return null;
        }
    }
}
