import { PostBrowsingComponent } from "../../components/PostBrowsingComponent/PostBrowsingComponent.js"
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";
// import { mockFeed } from "../../lib/data/MockFeed.js"

const service = PostRepositoryFactory.get("remote");

const component = new PostBrowsingComponent(service); 
component.render(); 