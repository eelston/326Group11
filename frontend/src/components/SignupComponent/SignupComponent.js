import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class SignupComponent extends BaseComponent { 
    #container = null; // init component container element

    constructor() {
        super();
        this.loadCSS("SignupComponent");
    }

    render() {
        this.#createContainer();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {

    }

    #attachEventListeners() {
        
    }
}