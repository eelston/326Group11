import { SettingsModel } from '../models/settings.js';

export class SettingsController {
    constructor() {
        this.model = new SettingsModel();
    }

    async getSettings(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const settings = await this.model.getSettings(userId);
            res.status(200).json(settings);
        } catch (error) {
            if (error.message === 'User ID is required') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async savePreferences(req, res) {
        try {
            const preferences = req.body;
            if (!preferences || Object.keys(preferences).length === 0) {
                return res.status(400).json({ error: 'Preferences data is required' });
            }

            const result = await this.model.savePreferences(preferences);
            res.status(200).json({ 
                message: 'Preferences saved successfully', 
                data: result 
            });
        } catch (error) {
            if (error.message.includes('must be a boolean') || 
                error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateProfile(req, res) {
        try {
            const profile = req.body;
            if (!profile || Object.keys(profile).length === 0) {
                return res.status(400).json({ error: 'Profile data is required' });
            }

            const result = await this.model.updateProfile(profile);
            res.status(200).json({ 
                message: 'Profile updated successfully', 
                data: result 
            });
        } catch (error) {
            if (error.message.includes('must be') || 
                error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async updateAccount(req, res) {
        try {
            const account = req.body;
            if (!account || Object.keys(account).length === 0) {
                return res.status(400).json({ error: 'Account data is required' });
            }

            const result = await this.model.updateAccount(account);
            res.status(200).json({ 
                message: 'Account updated successfully', 
                data: result 
            });
        } catch (error) {
            if (error.message.includes('Invalid email') || 
                error.message.includes('Password must be') || 
                error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async addClass(req, res) {
        try {
            const classData = req.body;
            if (!classData || Object.keys(classData).length === 0) {
                return res.status(400).json({ error: 'Class data is required' });
            }

            await this.model.validateClassData(classData);
            const result = await this.model.addClass(classData);
            res.status(201).json({ 
                message: 'Class added successfully', 
                data: result 
            });
        } catch (error) {
            if (error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async removeClass(req, res) {
        try {
            const { userId, classId } = req.params;
            if (!userId || !classId) {
                return res.status(400).json({ 
                    error: 'Both user ID and class ID are required' 
                });
            }

            const result = await this.model.removeClass(userId, classId);
            res.status(200).json({ 
                message: 'Class removed successfully',
                data: result
            });
        } catch (error) {
            if (error.message === 'Class not found') {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('is required')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}
