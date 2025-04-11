import { PostBrowsingComponent } from "../../components/BaseComponent/PostBrowsingComponent/PostBrowsingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../../tests/postData/mockFeed.js"

const service = new PostRepositoryService();

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
}

feedLoad(); 