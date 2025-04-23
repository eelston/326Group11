import { LocationCardComponent } from '../../components/LocationCardComponent/LocationCardComponent.js'
import { LocationBrowsingComponent } from '../../components/LocationBrowsingComponent/LocationBrowsingComponent.js';
// import { MockLocations } from "../../../tests/data/MockLocations.js"
import { ReportRepositoryRemoteService } from '../../services/ReportRepositoryRemoteService.js'

// render location browsing component
const locationBrowsingComponent = new LocationBrowsingComponent();
locationBrowsingComponent.render();

// services
// const locationRepository = null;
const reportRepository = new ReportRepositoryRemoteService();
