import { PostCreationComponent } from "../../components/PostCreationComponent/PostCreationComponent.js";

const page = document.getElementById("page");
const postCreation = new PostCreationComponent();
page.appendChild(postCreation.render());