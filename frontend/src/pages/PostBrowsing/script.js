import { PostBrowsingComponent } from "../../components/BaseComponent/PostBrowsingComponent/PostBrowsingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../../tests/postData/mockFeed.js"
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const service = new PostRepositoryService();

await service.initDB();
await service.clearPosts();
mockFeed.map(post => service.storePost(post));

const component = new PostBrowsingComponent(service); 
component.render();