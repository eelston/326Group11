import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class LoginComponent extends BaseComponent { 
    #container = null; // init component container element

    constructor() {
        super();
        this.loadCSS("LoginComponent");
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