import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { LocationCardComponent } from '../LocationCardComponent/LocationCardComponent.js';
import { fetch } from "../../utility/fetchLocations.js"

export class LocationBrowsingComponent extends BaseComponent {
    #container = null; // private variable to store the container element
    #locationsData; // private variable for location data from server

    constructor() {
        super();
        this.loadCSS('LocationBrowsingComponent');
    }

    async render() {
        if (this.#container) {
            return this.#container;
        }
        this.#locationsData = await this.#getLocations();
        
        
        this.#createContainer();
        this.#renderCards();
        // this.#attachEventListeners();

        // add container to main component
        document.getElementsByTagName('main')[0].appendChild(this.#container); 
    }

    // create container element and apply class
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.setAttribute('id', 'location-browsing');
    }

    // render each location card
    #renderCards() {
        const locationBrowsingContainer = this.#container;

        this.#locationsData.forEach(location => {
            console.log(`rendering ${location.name}`); // printing to console for confirmation
            const locationCard = new LocationCardComponent(location); // create new component for each location
            locationBrowsingContainer.appendChild(locationCard.render()); // add location card to location browsing container
        })
    }

    // fetch location data from mock server (local JSON file)
    async #getLocations() {
        try {
            const response = await fetch("http://localhost:3000/lib/data/MockLocations.json");
            if (response.ok) {
                const json = await response.json();
                const data = await JSON.parse(json);

                if (Array.isArray(data) && data.length > 0) { // check data format / if location data exists
                    this.#locationsData = data; // save location data
                    return data;

                } else {
                    throw new Error("no locations found");
                }
            } else {
                throw new Error(response.status);
            }

        } catch (error) { // error handling
            console.log(`Error fetching location data: ${error}`);
        }        
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();
    }


    // reference functions from CS 326 example
    // Adds a task to the task list
    // #addTaskToList(taskData) {
    //     const taskList = this.#getTaskListElement();
    //     const taskContainer = document.createElement('li');

    //     // Create a new TaskComponent for each task
    //     const task = new TaskComponent(taskData);
    //     taskList.appendChild(task.render());
    // }

    // #getTaskListElement() {
    //     return this.#container.querySelector('#taskList');
    //   }
}
