import { PostViewingComponent } from "../../components/PostViewingComponent/PostViewingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../lib/data/MockFeed.js"
// import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

// const navbarComponent = new NavbarComponent();
// navbarComponent.render();

const service = new PostRepositoryService();
await service.initDB();

const component = new PostViewingComponent(service);

const postId = "0000001";
console.log("testing");
console.log("POST ID: " + postId);

component.render(postId);