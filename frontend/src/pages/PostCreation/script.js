import { PostCreationComponent } from "../../components/PostCreationComponent/PostCreationComponent.js";
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";
import { UserRepositoryRemoteService } from "../../services/UserRepositoryRemoteService.js";

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const page = document.getElementById("page");
const service = PostRepositoryFactory.get("remote");
const users = new UserRepositoryRemoteService(); 

const postCreation = new PostCreationComponent();
page.appendChild(postCreation.render());