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
        this.#attachEventListeners();

        // add container to main component
        document.getElementsByTagName('main')[0].appendChild(this.#container); 
    }

    // create container element and apply class
    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.setAttribute('id', 'location-browsing');
    }

    // render each location card
    #renderCards(locations = this.#locationsData, sortOption = "Recently Updated") { // render method defaults to rendering locations data from server (currently JSON) and by recently updated
        const locationBrowsingContainer = this.#container;
        locationBrowsingContainer.innerHTML = ""; // clear any pre-existing HTML

        // determine order for location rendering
        let toBeRendered = this.#locationsData;
        switch (sortOption) {
            case "Recently Updated":
                toBeRendered = [...locations].sort((a, b) => (this.#getMostRecentTimestamp(b)-this.#getMostRecentTimestamp(a))); // sort by timestamps in descending order
                break;
            case "Ascending Crowd Score":
                // calculate average crowding score from given array of reports
                // TODO: consider implementing location as a class if not stored as JSON to keep location get methods to one place
                toBeRendered = [...locations].sort((a, b) => (this.#getAverageCrowdingScore(a)-this.#getAverageCrowdingScore(b))); // sort by avg score (ascending)
                break;
            case "Descending Crowd Score":
                toBeRendered = [...locations].sort((a, b) => (this.#getAverageCrowdingScore(b)-this.#getAverageCrowdingScore(a))); // sort by avg score (descending)
                break;
        }

        toBeRendered.forEach(location => { // render each location in given order
            console.log(`rendering ${location.name}`); // printing to console for confirmation
            const locationCard = new LocationCardComponent(location); // create new component for each location
            locationBrowsingContainer.appendChild(locationCard.render()); // add location card to location browsing container
        })
    }

    // returns the most recent report timestamp from given location
    #getMostRecentTimestamp(location) {
        if (location.type === "Single-Floor") {
            return location.reports[0].timestamp; // return most recent timestamp
        } else if (location.type === "Multi-Floor") {
            const allReports = location.floors.map(floor => floor.reports); // get array of report arrays
            const allTimestamps = allReports.map(reports => reports.map(report => report.timestamp)); // get array of all timestamps
            allTimestamps.sort((a,b) => b-a); // sort in descending order
            return allTimestamps[0]; // return largest (=== most recent) timestamp (Date timestamp is in ms since epoch)
        }
    }

    // returns the average crowding score for an entire location
    #getAverageCrowdingScore(location) {
        if (location.type === "Single-Floor") {
            const crowdingScores = location.reports.map(report => report.score) // get array of scores
            return crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length // calculate average crowding score

        } else if (location.type === "Multi-Floor") {
            // TODO: determine if average across entire building is ideal
            const allReports = location.floors.map(floor => floor.reports); // get array of report arrays
            const crowdingScores = allReports.map(reports => reports.map(report => report.score)); // get array of all scores
            return crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length // calculate average crowding score
        }
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

    // filter and re-render location cards based on given query (string)
    #filterLocationCardsByQuery(query) {
        const key = query.toLowerCase(); // convert search query to lowercase

        // TODO: determine if filter may benefit from extra keyword matches (other than just title)
        const matches = this.#locationsData.filter(location => { // filter locations by title match
            return location.name.toLowerCase().includes(key);
        })

        this.#renderCards(matches); // render filtered cards only
    }

    // TODO: account for filter by query AND sort option -> may need to rework both functions a bit
    #sortLocationCards(sortOption) {
        console.log(sortOption);
        this.#renderCards(this.#locationsData, sortOption);
    }

    #attachEventListeners() {
        // const hub = EventHub.getInstance();

        // attach event listener for search bar filter
        // TODO: determine if this is better implemented using eventhub
        const searchBarElement = document.getElementById("search-bar");
        searchBarElement.addEventListener("keyup", (event) => this.#filterLocationCardsByQuery(event.target.value)); // update on keyup
        // event.target is reference to searchBarElement (reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/target)

        // attach event listener for 'Sort by' dropdown/select
        const sortByElement = document.getElementById("sort-by-select");
        sortByElement.addEventListener("change", (event) => this.#sortLocationCards(event.target.value)); // update on changed selection
    }
}
