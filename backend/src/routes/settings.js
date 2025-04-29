import express from 'express';
import { SettingsController } from '../controllers/settings.js';

const router = express.Router();
const controller = new SettingsController();

const validateRequest = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.is('application/json')) {
            return res.status(415).json({ 
                error: 'Content-Type must be application/json' 
            });
        }
    }
    next();
};

const validateUserId = (req, res, next) => {
    const userId = req.params.userId || req.body.userId;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (typeof userId !== 'string' && typeof userId !== 'number') {
        return res.status(400).json({ error: 'Invalid User ID format' });
    }
    next();
};

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

router.get('/settings/:userId', 
    validateUserId, 
    controller.getSettings.bind(controller)
);

router.post('/settings/preferences', 
    validateRequest,
    validateUserId,
    controller.savePreferences.bind(controller)
);

router.put('/settings/account',
    validateRequest,
    validateUserId,
    controller.updateAccount.bind(controller)
);

router.put('/settings/profile', 
    validateRequest,
    validateUserId,
    controller.updateProfile.bind(controller)
);

router.post('/settings/classes', 
    validateRequest,
    validateUserId,
    controller.addClass.bind(controller)
);

router.delete('/settings/classes/:userId/:classId', 
    validateUserId,
    controller.removeClass.bind(controller)
);

router.use(errorHandler);

export default router;
