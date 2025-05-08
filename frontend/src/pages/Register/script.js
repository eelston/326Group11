import { RegisterComponent } from "../../components/RegisterComponent/RegisterComponent.js";
import { RegisterRemoteService } from "../../services/RegisterRemoteService.js";

const body = document.body;

const service = new RegisterRemoteService();

const register = new RegisterComponent();
body.appendChild(register.render());