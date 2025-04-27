import { PostBrowsingComponent } from "../../components/PostBrowsingComponent/PostBrowsingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../lib/data/MockFeed.js"
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";

const service = PostRepositoryFactory.get("remote");

//await service.initDB();
//await service.clearPosts();
//mockFeed.map(post => service.storePost(post));
//

const component = new PostBrowsingComponent(service); 
component.render(); 

