import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "src/data/settings.sqlite"
});

// Preferences model for user settings preferences
const Preferences = sequelize.define("Preferences", {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    displayMajor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    displayPronouns: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    emailNotifications: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

// Profile model for user profile settings
const Profile = sequelize.define("Profile", {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pronouns: {
        type: DataTypes.STRING,
        allowNull: true
    },
    major: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Class model for user's classes
const Class = sequelize.define("Class", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Account model for user account settings
const Account = sequelize.define("Account", {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Set up associations
Preferences.belongsTo(Account, { foreignKey: 'userId' });
Profile.belongsTo(Account, { foreignKey: 'userId' });
Class.belongsTo(Account, { foreignKey: 'userId' });

class _SQLiteSettingsModel {
    constructor() {}

    async init(fresh = false) {
        try {
            await sequelize.authenticate();
            console.log('Database connection established successfully');
            
            const forceSync = fresh || process.env.NODE_ENV === 'development';
            await sequelize.sync({ force: forceSync });
            
            // Create default data for testing
            if (forceSync) {
                console.log('Creating test user account');
                await Account.create({
                    userId: '123',
                    email: '123@example.com',
                    password: null
                });
            }
            
            console.log('Database initialization complete');
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    async getSettings(userId) {
        if (!userId) throw new Error('User ID is required');

        try {
            console.log('Getting settings for userId:', userId);
            
            // First ensure account exists
            let account = await Account.findByPk(userId);
            if (!account) {
                console.log('Creating new account for userId:', userId);
                account = await Account.create({
                    userId,
                    email: `${userId}@example.com`,
                    password: null
                });
            }

            // Get or create preferences and profile
            const [preferences, profile, classes] = await Promise.all([
                Preferences.findByPk(userId) || Preferences.create({ 
                    userId,
                    displayMajor: false,
                    displayPronouns: false,
                    emailNotifications: false
                }),
                Profile.findByPk(userId) || Profile.create({ 
                    userId, 
                    displayName: userId 
                }),
                Class.findAll({ where: { userId } })
            ]);

            return {
                preferences,
                profile,
                classes,
                account
            };
        } catch (error) {
            console.error('Error in getSettings:', error);
            throw error;
        }
    }

    async savePreferences(preferences) {
        if (!preferences || !preferences.userId) {
            throw new Error('Preferences object with userId is required');
        }

        const [pref] = await Preferences.upsert({
            userId: preferences.userId,
            displayMajor: preferences.displayMajor,
            displayPronouns: preferences.displayPronouns,
            emailNotifications: preferences.emailNotifications
        });

        return this.getSettings(preferences.userId);
    }

    async updateProfile(profile) {
        if (!profile || !profile.userId) {
            throw new Error('Profile object with userId is required');
        }

        const [prof] = await Profile.upsert({
            userId: profile.userId,
            displayName: profile.displayName,
            pronouns: profile.pronouns,
            major: profile.major,
            bio: profile.bio
        });

        return this.getSettings(profile.userId);
    }

    async updateAccount(account) {
        if (!account || !account.userId) {
            throw new Error('Account object with userId is required');
        }

        const [acc] = await Account.upsert({
            userId: account.userId,
            email: account.email,
            password: account.password
        });

        return this.getSettings(account.userId);
    }

    validateClassData(classData) {
        if (!classData) throw new Error('Class data is required');
        if (!classData.userId) throw new Error('User ID is required');
        if (!classData.subject) throw new Error('Subject is required');
        if (!classData.number) throw new Error('Course number is required');
        return true;
    }

    async addClass(classData) {
        try {
            console.log('Model: Validating class data:', classData);
            this.validateClassData(classData);

            console.log('Model: Looking up account for userId:', classData.userId);
            let account = await Account.findByPk(classData.userId);
            
            if (!account) {
                console.log('Model: Creating new account for userId:', classData.userId);
                account = await Account.create({
                    userId: classData.userId,
                    email: `${classData.userId}@example.com`,
                    password: null
                });
            }

            console.log('Model: Creating new class:', {
                userId: classData.userId,
                subject: classData.subject,
                number: classData.number
            });
            
            const newClass = await Class.create({
                id: Date.now().toString(),
                userId: classData.userId,
                subject: classData.subject,
                number: classData.number
            });

            console.log('Model: Class created successfully, getting settings');
            return this.getSettings(classData.userId);
        } catch (error) {
            console.error('Model Error in addClass:', error);
            console.error('Stack:', error.stack);
            throw error;
        }
    }

    async removeClass(userId, classId) {
        if (!userId) throw new Error('User ID is required');
        if (!classId) throw new Error('Class ID is required');

        const deletedCount = await Class.destroy({
            where: {
                userId,
                id: classId
            }
        });

        if (deletedCount === 0) {
            throw new Error('Class not found');
        }

        return this.getSettings(userId);
    }
}

const SQLiteSettingsModel = new _SQLiteSettingsModel();

export default SQLiteSettingsModel;
