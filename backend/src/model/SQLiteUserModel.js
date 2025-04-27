import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pronouns: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    iconContent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    settings: {
        type: DataTypes.JSONB,
        defaultValue: {
            iconColor: "#5ad8cc",
            displayPronouns: false,
            displayMajor: false,
            recieveEmailNotifications: false,
        },
    },
    profileContent: {
        type: DataTypes.JSONB,
        defautValue: {
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

Facts.belongsTo(User, {
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
        }
    }

    async create(user) {
        return await User.create(user);
    }

    async read(user = null) {
        if (user) {
            if (user.userId) {
                const userr = await User.findOne({ 
                    where: {userId: user.userId},
                    include: {model: Fact, as: "facts"},
                });
                if (userr){
                    userr.profileContent = userr.profileContent || {};
                    userr.profileContent.about = userr.facts.map((fact) => ({
                        factName: fact.factName,
                        factAnswer: fact.factAnswer,
                    }));
                    delete userr.facts;
                    return userr;
                }
            }
            const userr = User.findOne({ 
                where: {email: user.email},
                include: {model: Fact, as: "facts"},
            });
            if (userr){
                userr.profileContent = userr.profileContent || {};
                userr.profileContent.about = userr.facts.map((fact) => ({
                    factName: fact.factName,
                    factAnswer: fact.factAnswer,
                }));
                delete userr.facts;
                return userr;
            }
            return null;
        }
        return await User.findAll();
    }

    async update(user) {
        const useru = await User.findByPk(user.userid);
        if (!useru){
            return null;
        }
        await useru.update(user);
        if (user.profileContent && user.profileContent.about){
            await Fact.destroy({where: {userId: user.userId}});
            const facts = user.profileContent.about.map((fact) => ({
                factName: fact.factName,
                factAnswer: fact.factAnswer,
                userId: user.userId,
            }));
            await Fact.bulkCreate(facts);
        }
        return useru;
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