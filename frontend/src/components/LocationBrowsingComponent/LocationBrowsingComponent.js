import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { LocationCardComponent } from '../LocationCardComponent/LocationCardComponent.js';
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';
import { fetch } from "../../utility/fetchLocations.js"

export class LocationBrowsingComponent extends BaseComponent {
    #container = null; // private variable to store the container element
    #locationsData; // private variable for location data from server
    #dimmerElement; // private variable for background dimmer element

    constructor() {
        super();
        this.loadCSS('LocationBrowsingComponent');
    }

    async render() {
        if (this.#container) {
            return;
        }
        this.#locationsData = await this.#getLocations();
        
        this.#createContainer(); // create location-browsing div element, set this.#container
        this.#renderCards(); // render a card element for every location
        this.#dimmerElement = this.#createDimmerElement(); // element to dim screen when a card is expanded
        this.#attachEventListeners(); // attach relevant event listeners

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

    // create div container to dim full screen
    // reference: https://stackoverflow.com/a/15841516
    #createDimmerElement() {
        // dim rest of screen
        const dim = document.createElement('div'); // create new element to dim rest of screen
        dim.setAttribute('id', 'dim');
        dim.style["z-index"] = 998; // move to below card

        // cover full window
        dim.style.height = "100%"; // extra percentage for safety
        dim.style.width = "100%";
        dim.style.position = "absolute";
        dim.style.background = "rgba(0,0,0,0.5)"; // black & mostly transparent
        // begin div in top left of screen
        dim.style.top = 0;
        dim.style.left = 0;

        dim.style.display = "none"; // hide by default

        document.getElementsByTagName("main")[0].appendChild(dim); // add to main div

        return dim; // return element
    }

    // dim window
    #showDimmerElement() {
        this.#dimmerElement.style.display = "block";
    }

    // revert/un-dim window
    #hideDimmerElement() {
        this.#dimmerElement.style.display = "none";
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();

        // related to expanded card view
        hub.subscribe(Events.ExpandLocationCard, () => {
            this.#showDimmerElement(); // dim background when a card is expanded
        })

        // related to minimizing expanded card view
        hub.subscribe(Events.MinimizeLocationCard, () => {
            this.#hideDimmerElement(); // hide dimmer element when a card is minimized/returned to normal view
        })

        // alert eventhub to minimize expanded card view if area outside of card (i.e., dimmer element) is clicked
        this.#dimmerElement.addEventListener("click", () => {
            hub.publish(Events.MinimizeLocationCard); // minimize expanded location card if clicked
        })

        // TODO: search bar and sort by filtering would work together
        // attach event listener for search bar filter
        const searchBarElement = document.getElementById("search-bar");
        searchBarElement.addEventListener("keyup", (event) => this.#filterLocationCardsByQuery(event.target.value)); // update on keyup
        // event.target is reference to searchBarElement (reference: https://developer.mozilla.org/en-US/docs/Web/API/Event/target)

        // attach event listener for 'Sort by' dropdown/select
        const sortByElement = document.getElementById("sort-by-select");
        sortByElement.addEventListener("change", (event) => this.#sortLocationCards(event.target.value)); // update on changed selection
    }
}
