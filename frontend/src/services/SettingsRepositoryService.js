import { EventHub } from '../eventhub/EventHub.js';
import { Events } from '../eventhub/SettingsEvents.js';
import Service from './Service.js';

export class SettingsService extends Service {
    constructor() {
        super();
        this.eventHub = EventHub.getInstance();
        this.baseUrl = '/api/settings';  // Changed to match backend route
        // Get userId from local storage or session
        this.userId = localStorage.getItem('userId') || '123';
        console.log('SettingsService initialized with userId:', this.userId);
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
            console.log('Fetching settings for userId:', this.userId);
            const response = await fetch(`${this.baseUrl}/${this.userId}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await this.handleResponse(response);
            console.log('Settings data received:', data);
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
            
            const response = await fetch(`${this.baseUrl}/preferences`, {
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
            
            const response = await fetch(`${this.baseUrl}/profile`, {
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
            
            const response = await fetch(`${this.baseUrl}/account`, {
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
            
            const response = await fetch(`${this.baseUrl}/classes`, {
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
                `${this.baseUrl}/classes/${this.userId}/${classId}`, {
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
