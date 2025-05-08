import { PostViewingComponent } from "../../components/PostViewingComponent/PostViewingComponent.js";
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";
//import { mockFeed } from "../../lib/data/MockFeed.js"
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';
import { UserRepositoryRemoteService } from "../../services/UserRepositoryRemoteService.js";

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const service = PostRepositoryFactory.get("remote");
const users = new UserRepositoryRemoteService();

const component = new PostViewingComponent(); 

const params = new URLSearchParams(window.location.search);
const postId = params.get('id');

component.render(postId); 