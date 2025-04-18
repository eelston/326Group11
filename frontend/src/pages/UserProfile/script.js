import { UserProfileComponent } from '../../components/UserProfileComponent/UserProfileComponent.js';
import { MockUser } from "../../lib/data/MockUser.js";

const userProfileComponent = new UserProfileComponent(MockUser);
userProfileComponent.render();
