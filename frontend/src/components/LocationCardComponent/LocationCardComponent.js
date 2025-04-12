import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { CrowdingHints } from './CrowdingHints.js'

export class LocationCardComponent extends BaseComponent {
    #container = null; // private variable to store location card container element
    #locationData;

    constructor(locationData = {}) {
        super();
        this.#locationData = locationData;
        this.loadCSS('LocationCardComponent');
    }

    render() {
        this.#createContainer(); // create card container

        if (this.#locationData.type === "Single-Floor") {
            this.#renderSingleFloor();
        } else if (this.#locationData.type === "Multi-Floor") {
            this.#renderMultiFloor();
        }
        // this.#container.innerHTML = this.#buildLocationCard();

        // this.#container = document.createElement('div');
    // this.#container.classList.add('task-item');

    // // Render the task text
    // const taskText = this.#createTaskText();
    // this.#container.appendChild(taskText);

    // // Render the file link if a file is present
    // if (this.taskData.file) {
    //   const fileLink = this.#createFileLink(this.taskData.file);
    //   this.#container.appendChild(fileLink);
    // }

        return this.#container;
    }

    // create location card container
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('location-card');
    }

    // render card for location with one floor
    #renderSingleFloor() {
        const locationReports = this.#locationData.reports; // get crowding score reports

        const lastUpdatedTimestamp = locationReports[0].timestamp; // get timestamp for most recent report
        
        const averageCrowdingScore = this.#calculateAverageCrowdingScore(locationReports); // average crowding score
        const level = Math.round(averageCrowdingScore); // level for crowding score bar

        this.#container.innerHTML = `
                <div class="location-info">
                   <div class="location-name">${this.#locationData.name}</div>
                   <div class="crowding-score-hint">${CrowdingHints[level-1]}</div>
                </div>
                
                <div class="crowding-score-bar-container">
                   <div id="level${level}" class="crowding-score-bar"></div>
                </div>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>
            `        
    }

    // render card for location with multiple floors
    #renderMultiFloor() {
        this.#container.innerHTML = `<div class="location-name">${this.#locationData.name}</div>`; // add location name

        this.#locationData.floors.forEach(floor => { // render information for each floor under location
            const floorInfo = document.createElement('div'); // create new div for floor information
            floorInfo.classList.add("floor-info"); // add tag for styling

            const lastUpdatedTimestamp = floor.reports[0].timestamp; // get timestamp for most recent report

            const averageCrowdingScore = this.#calculateAverageCrowdingScore(floor.reports); // average crowding score for floor
            const level = Math.round(averageCrowdingScore); // level for crowding score bar


            floorInfo.innerHTML = `
                <div class="location-info">
                    <div class="floor-name"><strong>Floor ${floor.name}</strong></div>
                    <div class="crowding-score-hint">${CrowdingHints[level-1]}</div>
                </div>
                
                <div class="crowding-score-bar-container">
                    <div id="level${level}" class="crowding-score-bar"></div>
                </div>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>
            `

            this.#container.appendChild(floorInfo);
        });
    }

    #calculateAverageCrowdingScore(reports) {
        const crowdingScores = reports.map(report => report.score) // get array of scores
        return crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length // calculate average
    }

    // convert number to string
    #timestampToString(timestamp) {
        return new Date(timestamp).toString();
        // TODO: tidy output to more closely match mockup
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();
    }
}