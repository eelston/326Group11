// INSPIRED BY CS 326 MATERIAL, specifically InMemoryTaskModel.js
//
// This is a simple model that stores posts in memory. It has methods to create,
// read, update, and delete posts. The posts are stored in an array, and the
// methods manipulate this array to perform the CRUD operations.
//
// This model is useful for prototyping and testing, as it provides a quick way
// to store and manipulate data without the need for a persistent database. It
// can be easily replaced with a more sophisticated database model when needed.

class _InMemoryPostModel {
    static postId = 1;

    constructor() {
        this.posts = [];
    }

    async create(post) {
        post.postId = _InMemoryPostModel.postId++;
        this.posts.push(post);
        return post;
    }

    async read(id = null) {
        if (id) {
            return this.posts.find((post) => post.postId === Number(id));
        }
        return this.posts;
    }

    async update(post) {
        const index = this.posts.findIndex((p) => p.postId === post.postId);
        this.posts[index] = post;
        return post;
    }

    async delete(id = null) {
        if (id) {
            const index = this.posts.findIndex((post) => post.postId === Number(id));
            if (index !== -1) {
                const deleted = this.posts.splice(index, 1)[0];
                return deleted;
            }
        }
        return null;
    }

    async deleteAll() { // TODO UPDATE?
        this.posts = [];
        return;
    }
}
// Creating a singleton instance of the InMemoryPostModel.
const InMemoryPostModel = new _InMemoryPostModel();

//Initializing the model with some sample posts. 
InMemoryPostModel.create({
    name: "Melissa",
    postId: "1",
    userId: "0000004",
    pronouns: "she/her",
    title: "Study buds for discrete exam coming up...",
    tags: [{
        color: "#5feee0",
        tag: "CS 250",
    }, {
        color: "#f76e50",
        tag: "Comp Sci"
    }, {
        color: "#bcff8f",
        tag: "Midterm"
    }, {
        color: "#ffa2ce",
        tag: "Floor 2",
    }],
    description: 
    `Hi everyone! My names Melissa and I am a cs major! I am looking to study with my
    fellow classmates for this upcoming CS 250 midterm. I am feeling honestly rlly 
    nervous and even with the SI sessions I'm still stressed. I am going to be at the
    library (floor 2) tomorrow at 9 am and gonna spend the entire day there studying up!
    Please join at any time even if you don't feel super ready (b/c im not either!). 
    I'd love to meet some of my classmates! Anyway good luck to everyone else taking this
    exam in two days. :P `,
    location: "Campus Library",
    startTime: {time:"9:00 A.M", date: "Tomorrow"},
    timeStamp: 1745770000067, 
    isExpired: false,
    postComments: [{
        userId: "0000003",
        commentId: "1",
        name: "Udella",
        iconBgColor: "#5ad8cc",
        iconContent: ":U",
        pronouns: "she/her",
        message: "Omg I'll show up! At 11 am tho prolly. See u then!",
        timeStamp: 1745772000067,
    }, {
        userId: "0000004",
        commentId: "2",
        name: "Jessie",
        iconBgColor: "#5ad8cc",
        iconContent: ":J",
        pronouns: "She/her",
        message: "I'll be joining!",
        timeStamp: 1745776009967,
    }]
});

InMemoryPostModel.create({
    postId: "2",
    title: "Title Goes Here... ",
    tags: [{
        color: "#f76e50",
        tag: "Tags Go Here"
    }],
    description: `Some text goes here. A lot of varied text too. Of all various unique
    sizes. Maybe some expressions too as well. Agreed upon here.`,
    location: "Location here",
    startTime: {time:"Time", date: "Date"},
    timeStamp: 1745776663767,
    isExpired: false, 
    postComments: [],
    userId: "0000000",
    name: "displayName",
    pronouns: "she/he/they"
});
InMemoryPostModel.create({
    postId: "3",
    title: "Try To Delete Me! ",
    tags: [{
        color: "#f76e50",
        tag: "Tags Go Here"
    }],
    description: `Some text goes here. A lot of varied text too. Of all various unique
    sizes. Maybe some expressions too as well. Agreed upon here.`,
    location: "Location here",
    startTime: {time:"Time", date: "Date"},
    timeStamp: 1745776663767,
    isExpired: false, 
    postComments: [],
    userId: "0000000",
    name: "displayName",
    pronouns: "she/he/they"
});
InMemoryPostModel.create({
    postId: "4",
    title: "Title Goes Here TestExpired... ",
    tags: [{
        color: "#f76e50",
        tag: "Tags Go Here"
    }],
    description: `Some text goes here. A lot of varied text too. Of all various unique
    sizes. Maybe some expressions too as well. Agreed upon here.`,
    location: "Location here",
    startTime: {time:"Time", date: "Date"},
    timeStamp: 1745776663767,
    isExpired: true, 
    postComments: [],
    userId: "0000000",
    name: "displayName",
    pronouns: "she/he/they"
});

export default InMemoryPostModel;
