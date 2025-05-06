import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite"
});

const Tag = sequelize.define("Tag", {
    color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:"#ffd7d7"
    },
    tag: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Comment = sequelize.define("Comment", {
    commentId: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
    },
    postId: {
        type: DataTypes.NUMBER,
        allowNull: false, 
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timeStamp: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
});

const Post = sequelize.define("Post", {
    postId: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    startTime: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    timeStamp: {
        type: DataTypes.NUMBER, // Might not matter , might be deleted
        allowNull: false,
    },
    isExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
    // comments and tags to add in with the relation
});

Post.hasMany(Comment, {foreignKey: "postId", as: "postComments"}); // post has many comments
Comment.belongsTo(Post, {foreignKey: "postId", as: "post"});; // comment can only belong to 1 post
Post.hasMany(Tag, {foreignKey: "postId", as: "tags"}); // post can have many tags, but tags dont store
// which posts they're in.

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
        return await Post.create(post);
    }

    async read(id = null) {
        if (id) {
            return await Post.findByPk(id);
        }
        return await Post.findAll();
    }

    async update(post) {
        const postu = await Post.findByPk(post.postId);
        if (!postu) {
            return null;
        }
        await postu.update(post);
        return postu; // should return updated post.
    }

    async delete(postIdDel = null) {
        if (!postIdDel) {
            return null;
        }
        const postDel = await Post.findByPk(postIdDel);
        await Post.destroy({where: {postId: postIdDel}});
        return postDel;
    }

    async deleteAll() {
        await Post.destroy({truncate: true});
        return;
    }
}

const SQLitePostModel = new _SQLitePostModel();

export default SQLitePostModel;
