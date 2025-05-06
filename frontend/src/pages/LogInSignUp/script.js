import { RegisterComponent } from "../../components/RegisterComponent/RegisterComponent.js";

const page = document.getElementById("page");

const register = new RegisterComponent();
page.appendChild(register.render());