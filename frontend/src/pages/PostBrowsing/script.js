import { PostBrowsingComponent } from "../../components/PostBrowsingComponent/PostBrowsingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../lib/data/MockFeed.js"

const service = new PostRepositoryService();

await service.initDB();
await service.clearPosts();
mockFeed.map(post => service.storePost(post));

const component = new PostBrowsingComponent(service); 
component.render(); 