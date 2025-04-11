import { PostBrowsingComponent } from "../../components/BaseComponent/PostBrowsingComponent/PostBrowsingComponent.js"
import { TaskRepositoryService } from "../../services/TaskRepositoryService.js"
import { mockFeed } from "../../../tests/postData/mockFeed.js"

const service = new TaskRepositoryService();

async function feedLoad() {
    await service.initDB();
    await service.clearPosts();

    await Promise.all(
        mockFeed.map(post =>
            service.storePost(post).then(() => {
                console.log(`Inserted post with id: ${post.postId}`);
            }).catch(e => {
                console.log(`Error inserting post with id: ${post.postId}`, e);
            })
        )
    );
    const component = new PostBrowsingComponent(service); 
    component.render();

    document.getElementById("search-bar").addEventListener("input", (search) => {
        component.filterPosts(search.target.value)
    })
}
feedLoad(); 