import { PostCreationComponent } from "../../components/PostCreationComponent/PostCreationComponent.js";
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const page = document.getElementById("page");
const postCreation = new PostCreationComponent();
page.appendChild(postCreation.render());