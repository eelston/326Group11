import { Service } from "./Service.js"
import { fetch } from "../utility/fetch.js"

export class PostRepositoryRemoteFakeService extends Service {
    constructor() {
        super();
    }

    async loadAllTasks() {
        //TODO
    }

    async storeTask(taskData) {
        //TODO
    }

    async clearTasks() {
        //TODO
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