import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

const Comment = sequelize.define("Comment", {
    //TODO
});

const Post = sequelize.define("Post", {
    //TODO
});

class _SQLitePostModel {
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate(0);
        await sequelize.sync({force: true});
        // Exception will be thrown if either one of these operations fail.

        if (fresh) {
            await this.delete();

            await this.create({
                //TODO POST 1
            })
            await this.create({
                //TODO POST 2
            })
            await this.create({
                //TODO POST 3
            })
        }
    }

    async create(post) {
        //TODO
    }

    async read(id = null) {
        //TODO
    }

    async update(post) {
        //TODO
    }

    async delete(task = null) {
        //TODO
    }

    async deleteAll(post = null) {
        //TODO 
    }
}

const SQLitePostModel = new _SQLitePostModel();

export default SQLitePostModel;
