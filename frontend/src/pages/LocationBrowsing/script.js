import { LocationCardComponent } from '../../components/LocationCardComponent/LocationCardComponent.js'
import { LocationBrowsingComponent } from '../../components/LocationBrowsingComponent/LocationBrowsingComponent.js';
// import { MockLocations } from "../../../tests/data/MockLocations.js"
import { LocationRepositoryRemoteFakeService } from '../../services/LocationRepositoryRemoteFakeService.js';
import { NavbarComponent } from '../../components/NavbarComponent/NavbarComponent.js';

const navbarComponent = new NavbarComponent();
navbarComponent.render();

// render location browsing component
const locationBrowsingComponent = new LocationBrowsingComponent();
locationBrowsingComponent.render();

// locationBrowsingComponent.render();

// // Render the component in the #app container
// const appContainer = document.getElementById('app');
// appContainer.appendChild(appController.render());

// // Services
// const taskRepository = new LocationRepositoryRemoteFakeService(); // fake remote repository