// DESCRIPTION TAKEN FROM AND STRUCTURE INSPIRED by CS 326 course material: 
//
// The controller pattern is a design pattern commonly used in software
// engineering to separate the business logic of an application from its
// presentation layer. It organizes the code in a way that keeps the
// handling of user requests, business rules, and data processing separate
// from the user interface and data models. This pattern is especially
// useful in applications that involve handling HTTP requests, such as
// web applications, where different types of requests need distinct
// processing workflows.

// In the controller pattern, a "controller" is responsible for taking user
// input (e.g., an HTTP request), processing it according to the business
// logic, and sending a response. By using this pattern, each controller
// method manages a specific functionality, like adding a task or updating
// a user profile, which keeps the logic modular and reusable. Controllers
// interact with models (for data) and views (for user feedback) without
// knowing the internal details of each, promoting low coupling.

// The controller pattern also improves maintainability by isolating
// different concerns in the codebase. Changes to business logic or data
// processing can be made within the controller without affecting other
// parts of the application. Additionally, this pattern allows for easier
// testing, as each controller can be tested in isolation to verify that it
// handles input and output correctly, without dependencies on the
// application's interface or data storage layers.

import ModelPostFactory from "../model/ModelPostFactory";

class PostController {
    constructor() {
        this.model = ModelPostFactory.getModel();
    }

    // Get all Posts:
    async getAllPosts(req, res) {
        const posts = await this.model.read(); 
        // Response is obj with a 'posts' property containing an array of posts.
        // Could be anything but define it as an obj with a 'posts' property to keep
        // responses consistent across different endpoints.
        res.json({ posts });
    }

    // Add a new task
    async addPost(req, res) { //TODO, Ask Anastasia about her implementation of post creation
        //try {
            // Check if 'post' is provided in the request body
            if (!req.body || !req.body.post) {
                return res.status(400).json({error: "Post "});
            }
        //}
    }

    

    async clearTasks(req, res) {
        await this.model.delete();
        res.json(await this.model.read());
    }
}

export default new PostController();