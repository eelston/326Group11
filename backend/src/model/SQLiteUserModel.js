import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

const User = sequelize.define("User", {

});

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
                return await User.findOne({ where: {userId: user.userId}});
            }
            return await User.findOne({ where: {email: user.email}});
        }
        return await User.findAll();
    }

    async update(user) {
        const useru = await User.findByPk(user.userid);
        if (!useru){
            return null;
        }
        await useru.update(user);
        return useru;
    }

    async delete(user = null) {
        if (user === null) {
            await User.destroy({ truncate: true });
            return;
        }
        await User.destroy({ where: { userId: user.userId}});
        return user;
    }

}

const SQLiteUserModel = new _SQLiteUserModel();

export default SQLiteUserModel;