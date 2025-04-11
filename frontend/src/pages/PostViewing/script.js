import { PostViewingComponent } from "../../components/BaseComponent/postViewingComponent/PostViewingComponent.js"
import { PostRepositoryService } from "../../services/PostRepositoryService.js"
import { mockFeed } from "../../../tests/postData/mockFeed.js"

const service = new PostRepositoryService();
await service.initDB();

const component = new PostViewingComponent(service);

const postId = "0000001";
console.log("testing");
console.log("POST ID: " + postId);

component.render(postId);