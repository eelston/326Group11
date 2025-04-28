import { PostBrowsingComponent } from "../../components/PostBrowsingComponent/PostBrowsingComponent.js";
import { PostRepositoryFactory } from "../../services/PostRepositoryFactory.js";
// import { mockFeed } from "../../lib/data/MockFeed.js"
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();
// there's also some minor styling conflicts on this page, again we can probably deal with after more backend stuff is implemented - erika
const service = PostRepositoryFactory.get("remote");

const component = new PostBrowsingComponent(service); 
component.render(); 