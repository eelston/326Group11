import Service from "./Service.js";
import { Events } from "../eventhub/Events.js";

export class PostRepositoryRemoteService extends Service {
    constructor() {
        super();
        this.#initPosts();
    }

    addSubscriptions() {
        this.subscribe(Events.StorePost, (data) => {
            this.storePost(data);
        });
        this.subscribe(Events.UnStorePosts, () => {
            this.clearPosts();
        });
        this.subscribe(Events.UnStorePost, (postId) => {
            this.deletePost(postId);
        });
        this.subscribe(Events.LoadPost, (postId) => {
            this.loadPost(postId);
        });
        this.subscribe(Events.loadAllPosts, () => {
            this.loadAllPosts();
        });
        // TODO
    }

    async #initPosts() { 
        const response = await fetch("http://localhost:3000/v1/posts");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        data.posts.forEach(async (post) => {
            this.publish(Events.NewPost, post);
        })
    }

    async filterPosts(searchQuery = "") {
        const response = await fetch(`http://localhost:3000/v1/posts?s=${encodeURIComponent(searchQuery)}`)
        if (!response.ok) {
            throw new Error("Failed to get filtered posts.");
        }
        const data = await response.json();
        return data.posts;
        //TODO what about try catch case ? 
        // return empty array for catch 
    }

    async loadAllPosts() {
        const response = await fetch("http://localhost:3000/v1/posts");
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        return data.posts;
    }

    async loadPost(postId) {
        const response = await fetch(`http://localhost:3000/v1/post?id=${encodeURIComponent(postId)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch post with postId ${postId}`);
        }
        const data = await response.json();
        return data.post; //try catch?
    }

    async updatePost(postData) {
        const response = await fetch("http://localhost:3000/v1/post", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error(`Failed to update post with postId ${postData.postId}`)
        }
        const updatedPost = await response.json();
        return updatedPost;
        // try catch? 
    }

    async deletePost(postId) {
        const response = await fetch(`http://localhost:3000/v1/post?id=${encodeURIComponent(postId)}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to update post with postId ${postId}`);
        }
        this.publish(Events.UnStorePostSuccess);
        return data;

    }

    async storePost(postData) {
        const response = await fetch("http://localhost:3000/v1/post", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            throw new Error("Failed to store post.");
        }
        const data = await response.json();
        return data;
    }

    async clearPosts() {
        const response = await fetch("http://localhost:3000/v1/posts", {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Failed to clear posts.");
        }
        // Notify subscribers that posts have been cleared from server.
        // This is likely needed to update the UI.
        this.publish(Events.UnStorePostsSuccess);
        return data;
    }

}