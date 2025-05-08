import express from 'express';
import { SettingsController } from '../controller/SettingsController.js';

class SettingsRoutes {
    constructor() {
        this.router = express.Router();
        this.controller = new SettingsController();
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    validateRequest(req, res, next) {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.is('application/json')) {
            return res.status(415).json({ 
                error: 'Content-Type must be application/json' 
            });
        }
    }
    next();
};

    validateUserId(req, res, next) {
    const userId = req.params.userId || req.body.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (typeof userId !== 'string' && typeof userId !== 'number') {
        return res.status(400).json({ error: 'Invalid User ID format' });
    }
    next();
};

    errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

    initializeMiddleware() {
        // Apply error handler middleware
        this.router.use(this.errorHandler.bind(this));
    }

    initializeRoutes() {
        this.router.get('/settings/:userId', 
            this.validateUserId.bind(this), 
            this.controller.getSettings.bind(this.controller)
        );

        this.router.post('/settings/preferences', 
            this.validateRequest.bind(this),
            this.validateUserId.bind(this),
            this.controller.savePreferences.bind(this.controller)
        );

        this.router.put('/settings/account',
            this.validateRequest.bind(this),
            this.validateUserId.bind(this),
            this.controller.updateAccount.bind(this.controller)
        );

        this.router.put('/settings/profile', 
            this.validateRequest.bind(this),
            this.validateUserId.bind(this),
            this.controller.updateProfile.bind(this.controller)
        );

        this.router.post('/settings/classes', 
            this.validateRequest.bind(this),
            this.validateUserId.bind(this),
            this.controller.addClass.bind(this.controller)
        );

        this.router.delete('/settings/classes/:userId/:classId', 
            this.validateUserId.bind(this),
            this.controller.removeClass.bind(this.controller)
        );
    }

    getRouter() {
        return this.router;
    }
}

export default SettingsRoutes;
