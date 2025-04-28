// The routes or router pattern is a design pattern used to define and
// manage the different URL endpoints of an application. Each route
// corresponds to a specific URL path and HTTP method (like GET or POST),
// and is linked to a function that handles requests for that endpoint. By
// using this pattern, the application’s routing logic is clearly organized,
// making it easier to add, update, or remove routes as the application
// grows.

// The routes pattern is crucial in applications like web servers and APIs
// where each URL endpoint may require different processing. For example,
// a GET request to "/users" might retrieve a list of users, while a POST
// request to "/users" might add a new user. Each route handler specifies
// what action to take based on the URL and HTTP method, ensuring that the
// right code is executed for each request type and URL.

// Organizing code with a router or routes pattern improves readability,
// maintainability, and modularity. By keeping routes separate from other
// logic, such as data handling and business rules, changes can be made to
// the endpoints without altering the application’s core functionality.
// This structure also supports scalability, as it’s easy to add more routes
// without affecting existing ones, and facilitates testing by allowing each
// route to be tested independently for correct handling of inputs and
// outputs.

//TODO ADD THE RESPONSE INFO AT TOP EMULATE THE GIVEN
import express from "express";
import PostController from "../controller/PostController.js";

class PostRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Getting all the posts 
        this.router.get("/posts", async (req, res) => {
            await PostController.getAllPosts(req, res);
        });

        this.router.get("/post", async (req, res) => {
            await PostController.getPost(req, res);
        } )

        // Add a new post
        this.router.post("/post", async (req, res) => {
            await PostController.addPost(req, res);
        });

        // Clearing all posts
        this.router.delete("/posts", async (req, res) => {
            await PostController.deleteAllPosts(req, res);
        })

        // Deleting a post 
        this.router.delete("/post", async (req, res) => {
            await PostController.deletePost(req, res);
        })

        // Updating a post (comments, and potentially editing a post in the future)
        this.router.patch("/post", async (req, res) => {
            await PostController.updatePost(req, res);
        });
    }

    getRouter() {
        return this.router;
    }
}

export default new PostRoutes().getRouter();