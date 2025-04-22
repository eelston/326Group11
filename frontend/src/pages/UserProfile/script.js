import { UserProfileComponent } from '../../components/UserProfileComponent/UserProfileComponent.js';
import { MockUser } from "../../../tests/data/MockUser.js";
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();

const userProfileComponent = new UserProfileComponent(MockUser);
userProfileComponent.render();
