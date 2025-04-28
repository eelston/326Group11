import { PostCreationComponent } from "../../components/PostCreationComponent/PostCreationComponent.js";
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const page = document.getElementById("page");
const service = PostRepositoryFactory.get("remote");
service.addSubscriptions();

const postCreation = new PostCreationComponent();
page.appendChild(postCreation.render());