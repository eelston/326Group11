import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    logging: false
});

const Fact = sequelize.define("Fact", {
    factName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    factAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
    },
    pronouns: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No Assigned Pronouns",
    },
    iconContent: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ":3",
    },
    settings: {
        type: DataTypes.JSONB,
        defaultValue: {
            iconColor: "#5ad8cc",
            displayPronouns: false,
            displayMajor: false,
            receiveEmailNotifications: false,
        },
    },
    profileContent: {
        type: DataTypes.JSONB,
        defaultValue: {
            about: [],
            blurb: "",
            courses: "",
        },
    },
    /**
    authoredPosts: {
    },
    */
});

User.hasMany(Fact, {
    foreignKey: "userId",
    as: "facts",
});

Fact.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
})

class _SQLiteUserModel {
    constructor() {}

    async init(fresh = false){
        await sequelize.authenticate();
        await sequelize.sync({ force: true});
        if(fresh){
            await this.delete();

            await this.create({
                userId: "User1",
                password: "12345678Ab",
                email: "example1@gmail.com",
                name: "Dana",
                pronouns: "she/her",
                iconContent: ":D"
            });

            await this.create({
                userId: "User2",
                password: "12345678Ab",
                email: "example2@gmail.com",
                name: "Sarah",
                pronouns: "she/her",
                iconContent: ":S"
            });

            await this.create({
                userId: "User3",
                password: "12345678Ab",
                email: "example3@gmail.com",
                name: "Eliya",
                pronouns: "he/him",
                iconContent: ":E"
            });
        }
    }

    async create(user) {
        const userc = {
            userId: user.userId,
            email: user.email,
            password: user.password,
            name: user.name || user.userId,
        };
        const newUser = await User.create(userc);
        return await this.read({ userId: newUser.userId });
    }

    async read(user = null) {
        if (user) {
            if (user.userId) {
                const userr = await User.findOne({ 
                    where: {userId: user.userId},
                    include: {model: Fact, as: "facts"},
                });
                if (userr) return this.transformUser(userr);
            }
            if (user.email){
                const userr = await User.findOne({ 
                    where: {email: user.email},
                    include: {model: Fact, as: "facts"},
                });
                if (userr) return this.transformUser(userr);
            }
            return null;
        }
        const users = await User.findAll({ include: { model: Fact, as: "facts" } });
        return users.map(this.transformUser);
    }

    async transformUser(userr) {
        userr.profileContent = userr.profileContent || {};
        userr.profileContent.about = (userr.facts || []).map(fact => ({
            factName: fact.factName,
            factAnswer: fact.factAnswer,
        }));
        delete userr.facts;
        return userr;
    }

    async update(user) {
        const useru = await User.findByPk(user.userId);
        if (!useru){
            return null;
        }
        await useru.update(user);
        if (user.profileContent && Array.isArray(user.profileContent.about)){
            await Fact.destroy({where: {userId: user.userId}});
            const facts = user.profileContent.about.map((fact) => ({
                factName: fact.factName,
                factAnswer: fact.factAnswer,
                userId: user.userId,
            }));
            if (facts.length > 0){
                await Fact.bulkCreate(facts);
            }
        }
        return await this.read({ userId: user.userId });
    }

    async delete(user = null) {
        if (user === null) {
            await User.destroy({ truncate: true });
            await Fact.destroy({ truncate: true});
            return;
        }
        await Fact.destroy({ where: {userId: user.userId}});
        await User.destroy({ where: { userId: user.userId}});
        return user;
    }

}

const SQLiteUserModel = new _SQLiteUserModel();

export default SQLiteUserModel;