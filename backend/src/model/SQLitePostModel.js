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
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    postId: {
        type: DataTypes.INTEGER,
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
});

const Post = sequelize.define("Post", {
    postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true,
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
    isExpired: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    }
    // comments and tags to add in with the relation
});

Post.hasMany(Comment, {foreignKey: "postId", as: "postComments"}); // post has many comments
Comment.belongsTo(Post, {foreignKey: "postId", as: "post"});; // comment can only belong to 1 post
Post.hasMany(Tag, {foreignKey: "postId", as: "tags"}); // post can have many tags, but tags dont store
Tag.belongsTo(Post, {foreignKey: "postId", as: "post"});

class _SQLitePostModel {
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate();
        await sequelize.sync({force: true});
        // Exception will be thrown if either one of these operations fail.

        if (fresh) {
            await this.deleteAll();

            await this.create({
                postId: 1,
                userId: "User1",
                title: "Try Deleting Me!",
                description: "Hopefully You Can!",
                location: "Campus Library",
                isExpired: false,
                startTime: "A date string goes here.",
                tags: [{color: "#f76e60", tag: "CourseName"}, 
                    {color: "#5235ed", tag: "Example"}],
                postComments: [{
                    userId: "User2",
                    postId: 1,
                    CommentId: 1,
                    message: "Test message comment.",
                }],
            })
            await this.create({
                postId: 2,
                userId: "User2",
                title: "Mock 2",
                description: "Hopefully You Can!",
                location: "Campus Library",
                isExpired: false,
                startTime: "A date string goes here.",
                tags: [{color: "#f76e60", tag: "CourseName"}],
                postComments: []
            })
            await this.create({
                postId: 3,
                userId: "User3",
                title: "Mock 3 -- A little more wordy.",
                description: "Hopefully You Can! And hopefully the user loads fine with the right DB calls.",
                location: "Campus Library",
                isExpired: false,
                startTime: "A date string goes here.",
                tags: [{color: "#f76e60", tag: "CourseName"}],
                postComments: []
            })
        }
    }

    async create(post) {
        const {postComments = [], tags = [], ...otherPostData} = post;
        const newPost = await Post.create(otherPostData);

        await Promise.all(postComments.map(com => {
            Comment.create(com)
        }));
        await Promise.all(tags.map(t => Tag.create({...t, postId: newPost.postId})));
        return await this.read(post.postId)
    }

    async read(id = null) {
        const commsAndTagsToo = {include: [
            {model: Comment, as: "postComments"},
            {model: Tag, as: "tags"}
        ]};
        if (id) {
            return await Post.findByPk(id, commsAndTagsToo);
        }
        return await Post.findAll(commsAndTagsToo);
    }

    async update(post) {
        const {postComments = [], tags = [], ...otherPostData} = post;
        const postU = await Post.findByPk(post.postId);
        if (!postU) {
            return null;
        }
        await postU.update(postData);
        // Destroy old comments in case any were deleted
        await Comment.destroy({where: {postId: post.postId}});
        await Tag.destroy({where: {postId: post.postId}});
        // Rewrite into database the new comments and tags 
        await Promise.all(postComments.map(com => {
            Comment.create(com)
        }));
        await Promise.all(tags.map(t => Tag.create({...t, postId: newPost.postId})));
        return await this.read(post.postId) // should return updated post.
    }

    async delete(postIdDel = null) {
        if (!postIdDel) {
            return null;
        }
        const postDel = await Post.findByPk(postIdDel);
        if (!postDel) {
            return null;
        }
        await Comment.destroy({where: {postId: postIdDel}});
        await Tag.destroy({where: {postId: postIdDel}});
        await Post.destroy({where: {postId: postIdDel}});
        return postDel;
    }

    async deleteAll() {
        await Comment.destroy({where: {}})
        await Tag.destroy({where: {}})
        await Post.destroy({truncate: true});
        return;
    }
}

const SQLitePostModel = new _SQLitePostModel();

export default SQLitePostModel;
