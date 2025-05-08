import { RegisterComponent } from "../../components/RegisterComponent/RegisterComponent.js";

const body = document.body;

const register = new RegisterComponent();
body.appendChild(register.render());