import { Service } from "./Service.js"
import { fetch } from "../utility/fetch.js"

export class PostRepositoryRemoteFakeService extends Service {
    constructor() {
        super();
    }

    async loadPost(postId) {
        const resp = await fetch(`http://localhost:5500/post/${postId}`, {
            method: "GET" 
        });
        const data = await response.json();
        return data;
    }

    async loadAllPosts() {
        const resp = await fetch("http://localhost:5500/post", {
            method: "GET"
        });
        const data = await response.json();
        return data;
    }

    async storePost(postData) {
        const resp = await fetch("http://localhost:5500/post", {
            method: "POST",
            body: JSON.stringify(postData)
        });
        const data = await response.json();
        return data;
    }

    async clearPosts() {
        const response = await fetch("http://localhost:5500/post", {
            method: "DELETE"
        });
        const data = await response.json();
        return data;
    }

    addSubscriptions() {
        this.subscribe(Events.StorePost, (postData) => {
            this.storePost(postData)
        });
        this.subscribe(Events.UnstorePosts, () => {
            this.clearPosts();
        });
    }
}