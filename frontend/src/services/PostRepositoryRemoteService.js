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
        this.subscribe(Events.LoadPosts, () => {
            this.loadAllPosts();
        });
        this.subscribe(Events.UpdatePost, (data) => {
            this.updatePost(data)
        });
        this.subscribe(Events.FilterPosts, (searchQuery) => {
            this.filterPosts(searchQuery);
        })
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
            this.publish(Events.FilterPostsFailure);
            throw new Error("Failed to get filtered posts.");
        }
        const data = await response.json();
        this.publish(Events.FilterPostsSuccess, data.posts);
        return data.posts;
    }

    async loadAllPosts() {
        const response = await fetch("http://localhost:3000/v1/posts");
        if (!response.ok) {
            this.publish(Events.LoadPostsFailure);
            throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        this.publish(Events.LoadPostsSuccess, data.posts);
        return data.posts;
    }

    async loadPost(postId) {
        const response = await fetch(`http://localhost:3000/v1/posts/${encodeURIComponent(postId)}`);
        console.log("Response status: " + response.status);
        if (!response.ok) {
            this.publish(Events.LoadPostFailure);
            throw new Error(`Failed to fetch post with postId ${postId}`);
        }
        const data = await response.json();
        this.publish(Events.LoadPostSuccess, data);
        return data; 
    }

    async updatePost(postData) {
        const response = await fetch(`http://localhost:3000/v1/posts/${encodeURIComponent(postData.postId)}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            this.publish(Events.UpdatePostFailure);
            throw new Error(`Failed to update post with postId ${postData.postId}`)
        }
        const updatedPost = await response.json();
        this.publish(Events.UpdatePostSuccess, updatedPost);
        return updatedPost;
    }

    async deletePost(postId) {
        const response = await fetch(`http://localhost:3000/v1/posts/${encodeURIComponent(postId)}`, {
            method: "DELETE"
        });
        const data = await response.json();
        if (!response.ok) {
            this.publish(Events.UnStorePostFailure);
            throw new Error(`Failed to update post with postId ${postId}`);
        }
        this.publish(Events.UnStorePostSuccess);
        return data;
    }

    async storePost(postData) {
        const response = await fetch("http://localhost:3000/v1/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(postData)
        });
        if (!response.ok) {
            this.publish(Events.StorePostFailure);
            throw new Error("Failed to store post.");
        }
        const data = await response.json();
        this.publish(Events.StorePostSuccess);
        return data;
    }

    async clearPosts() {
        const response = await fetch("http://localhost:3000/v1/posts", {
            method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok) {
            this.publish(Events.UnStorePostsFailure);
            throw new Error("Failed to clear posts.");
        }
        // Notify subscribers that posts have been cleared from server.
        // This is likely needed to update the UI.
        this.publish(Events.UnStorePostsSuccess);
        return data;
    }
}