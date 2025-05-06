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
// method manages a specific functionality, like adding a post or updating
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

import ModelPostFactory from "../model/ModelPostFactory.js";

class PostController {
    constructor() {
        ModelPostFactory.getModel("in-memory").then((model) => {
            this.model = model;
        }) //TODO, To change for next milestone
    }

    // Get all Posts:
    async getAllPosts(req, res) {
        const allPosts = await this.model.read();
        const nonExpiredPosts = allPosts.filter(post => (post.isExpired === false)); 
        const search = req.query.s?.toLowerCase() || "";
        const filtered = nonExpiredPosts
            .filter(post => (search === "") || (post.title.toLowerCase().includes(search) || 
            post.description.toLowerCase().includes(search) ||
            post.location.toLowerCase().includes(search) || 
            post.tags.some(tag => tag.tag.toLowerCase().includes(search))));
        res.json({posts: filtered})
        // Response is obj with a 'posts' property containing an array of posts.
        // Could be anything but define it as an obj with a 'posts' property to keep
        // responses consistent across different endpoints.
    }

    async getPost(req, res) {
        try {
            const postId = req.params.id;
            const post = await this.model.read(postId);
            if (!post) {
                return res.status(404).json({ error: "Post not found." });
            }
            res.json(post);
        } catch (error) {
            console.error("Error getting post:", error);
            res.status(500).json({error: "Failed to get post."});
        }
    }

    // Add a new post
    async addPost(req, res) { 
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Post description required."})
            }
        // Create new post object with unique ID
        const post = await this.model.create(req.body);
    
        // For debug: 
        console.log(`New Post details: ${post.userId}, ${post.postId},
            ${post.userName}, ${post.userPronouns}, ${post.title},
            ${post.tags}, ${post.description}, ${post.location}, 
            ${post.startTime}, ${post.timeStamp}, ${post.isExpired},
            ${post.comments},`);
       
        return res.status(201).json(post);
        } catch (error) {
            console.error("Error adding post: ", error);
            return res.status(500).json({error: "Failed to add post. Please try again."})
        }
    }
    
    async deleteAllPosts(req, res) {
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Post description required" });
            }
        
            await this.model.deleteAll(req.body);
            res.json(await this.model.read());
    
        } catch (error) {
            console.error("Error deleting posts: ", error);
            return res.status(500).json({error: "Failed to delete posts. Please try again."})
        }
    }

    async deletePost(req, res) { 
        try {
            const postId = req.params.id;
            if (!postId) {
                return res.status(400).json({ error: "PostId is required!"})
            }
            const postDeleted = await this.model.delete(postId);
            if (!postDeleted) {
                return res.status(404).json({ error: "Post not found and deleted."});
            }
            return res.status(200).json({postDeleted});
            
        } catch (error) {
            console.error("Error deleting post: ", error);
            return res.status(500).json({error: "Failed to delete post."})
        }
    }

    // for comments 
    async updatePost(req, res) { // should be fine? but if any errors maybe i gotta debug... -julia
        try {
            if (!req.body) {
                return res.status(400).json({ error: "Post description required "});
            }
            const post = await this.model.update(req.body);
            return res.status(201).json(post);
        } catch (error) {
            console.error("Error in updating post: ", error);
            return res.status(500).json({error: "Failed to update post. Please try again."})
        }
    }
 
    async clearPosts(req, res) {
        await this.model.delete();
        res.json(await this.model.read());
    }
}

export default new PostController();