export class SettingsModel {
    constructor() {
        this.settings = new Map();
    }
    
    validatePreferences(preferences) {
        if (!preferences) throw new Error('Preferences object is required');
        if (!preferences.userId) throw new Error('User ID is required');
        if (typeof preferences.displayMajor !== 'boolean') throw new Error('displayMajor must be a boolean');
        if (typeof preferences.displayPronouns !== 'boolean') throw new Error('displayPronouns must be a boolean');
        if (typeof preferences.emailNotifications !== 'boolean') throw new Error('emailNotifications must be a boolean');
        return true;
    }

    validateProfile(profile) {
        if (!profile) throw new Error('Profile object is required');
        if (!profile.userId) throw new Error('User ID is required');
        if (!profile.displayName) throw new Error('Display name is required');
        if (profile.displayName.length < 2) throw new Error('Display name must be at least 2 characters');
        if (profile.bio && profile.bio.length > 500) throw new Error('Bio must not exceed 500 characters');
        return true;
    }

    validateClassData(classData) {
        if (!classData) throw new Error('Class data is required');
        if (!classData.userId) throw new Error('User ID is required');
        if (!classData.subject) throw new Error('Subject is required');
        if (!classData.number) throw new Error('Course number is required');
        return true;
    }

    async getSettings(userId) {
        if (!userId) throw new Error('User ID is required');
        
        // If user doesn't exist, create default settings
        if (!this.settings.has(userId)) {
            this.settings.set(userId, {
                preferences: {
                    displayMajor: false,
                    displayPronouns: false,
                    emailNotifications: false,
                    userId
                },
                profile: {
                    displayName: '',
                    pronouns: '',
                    major: '',
                    bio: '',
                    userId
                },
                classes: [],
                account: {}
            });
        }
        
        return this.settings.get(userId);
    }
    
    async savePreferences(preferences) {
        this.validatePreferences(preferences);
        const userId = preferences.userId;
        
        // Get existing settings or create new ones
        let settings = await this.getSettings(userId);
        
        // Update only the preference fields while preserving the userId
        settings.preferences = {
            displayMajor: preferences.displayMajor,
            displayPronouns: preferences.displayPronouns,
            emailNotifications: preferences.emailNotifications,
            userId
        };
        
        this.settings.set(userId, settings);
        
        return settings;
    }

    validateAccount(account) {
        if (!account) throw new Error('Account data is required');
        if (!account.userId) throw new Error('User ID is required');
        if (!account.email) throw new Error('Email is required');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) throw new Error('Invalid email format');
        if (account.password && account.password.length < 8) throw new Error('Password must be at least 8 characters');
        return true;
    }

    async updateProfile(profile) {
        this.validateProfile(profile);
        if (!this.settings) {
            this.settings = new Map();
        }
        const userId = profile.userId;
        if (!this.settings.has(userId)) {
            this.settings.set(userId, {
                preferences: {},
                profile: {},
                classes: [],
                account: {}
            });
        }
        const settings = this.settings.get(userId);
        settings.profile = profile;
        this.settings.set(userId, settings);
        return settings;
    }

    async updateAccount(account) {
        this.validateAccount(account);
        const userId = account.userId;
        if (!this.settings.has(userId)) {
            this.settings.set(userId, {
                preferences: {},
                profile: {},
                classes: [],
                account: {}
            });
        }
        const settings = this.settings.get(userId);
        settings.account = {
            email: account.email,
            userId: account.userId
        };
        if (account.password) {
            settings.account.password = account.password;
        }
        this.settings.set(userId, settings);
        return settings;
    }

    async addClass(classData) {
        const userId = classData.userId;
        const settings = await this.getSettings(userId);
        settings.classes.push({
            id: Date.now().toString(),
            ...classData
        });
        this.settings.set(userId, settings);
        return settings;
    }

    async removeClass(userId, classId) {
        if (!userId) throw new Error('User ID is required');
        if (!classId) throw new Error('Class ID is required');
        
        const settings = await this.getSettings(userId);
        const initialLength = settings.classes.length;
        settings.classes = settings.classes.filter(c => c.id !== classId);
        
        if (settings.classes.length === initialLength) {
            throw new Error('Class not found');
        }
        
        this.settings.set(userId, settings);
        return settings;
    }
}
