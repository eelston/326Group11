import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { LocationCardComponent } from '../LocationCardComponent/LocationCardComponent.js';
import { CrowdingHints } from '../LocationCardComponent/CrowdingHints.js'
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';
// import { fetch } from "../../utility/fetchLocations.js"
import { ReportRepositoryRemoteService } from '../../services/ReportRepositoryRemoteService.js';

export class LocationBrowsingComponent extends BaseComponent {
    #container = null; // private variable to store the container element
    #locationsData; // private variable for location data from server
    #dimmerElement; // private variable for background dimmer element
    #reportModal; // private variable for crowding score report modal

    constructor() {
        super();
        this.loadCSS('LocationBrowsingComponent');
        this.service = new ReportRepositoryRemoteService();
    }

    async render() {
        if (this.#container) {
            return;
        }
        this.#locationsData = await this.#getLocations();

        this.#renderSearchOptions(); // render search bar and sort dropdown
        
        this.#createContainer(); // create location-browsing div element, set this.#container
        this.#renderCards(); // render a card element for every location
        this.#dimmerElement = this.#createDimmerElement(); // element to dim screen when a card is expanded
        this.#reportModal = this.#createReportModal(); // element to report crowding score for expanded card
        this.#attachEventListeners(); // attach relevant event listeners   
        // add container to main component
        document.getElementsByTagName('main')[0].appendChild(this.#container); 
    }

    #renderSearchOptions() {
        // create div for search bar
        // TODO: condense a bit, and also fix some redundancy with the html & css, because search button no longer exists
        // also TODO: maybe just do this with innerHTML lol
        const searchOptionContainer = document.createElement('div');
        searchOptionContainer.setAttribute('id', 'search-option-container');

        searchOptionContainer.innerHTML = `
            <input type="text" id="search-bar" placeholder="Enter keywords...">

            <div id="sort-by-container">
                <label for="sort-by-select">Sort by</label>
                <select id="sort-by-select" autocomplete="off">
                    <option value="Recently Updated" selected="selected">Recently Updated</option>
                    <option value="Ascending Crowd Score">Ascending Crowd Score</option>
                    <option value="Descending Crowd Score">Descending Crowd Score</option>
                </select>
            </div>
        `
        
        document.getElementsByTagName('main')[0].appendChild(searchOptionContainer);
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
            // check if there are reports
            if (location.reports.length === 0) {return null}; // no reports stored for location (null ~= 0)

            return location.reports[0].timestamp; // return most recent timestamp
        } else if (location.type === "Multi-Floor") {
            const allReports = location.floors.map(floor => floor.reports); // get array of report arrays
            if (allReports.length === 0) {return null}; // no reports stored for location

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

    // fetch location data to render
    async #getLocations() {
        try {
            const response = await fetch("/locations"); // fetch locations from backend
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) { // check data format / if location data exists
                    this.#locationsData = data; // save location data
                    return data;

                } else {
                    throw new Error("data is not an array, or no locations in array");
                }
            } else {
                throw new Error(response.status);
            }

        } catch (error) { // error handling
            console.log(`Error fetching location data: ${error}`);
        }  
        
        // previous implementation with mock server (local JSON file)
        // try {
        //     const response = await fetch("http://localhost:3000/lib/data/MockLocations.json");
        //     if (response.ok) {
        //         const json = await response.json();
        //         const data = await JSON.parse(json);

        //         if (Array.isArray(data) && data.length > 0) { // check data format / if location data exists
        //             this.#locationsData = data; // save location data
        //             return data;

        //         } else {
        //             throw new Error("no locations found");
        //         }
        //     } else {
        //         throw new Error(response.status);
        //     }

        // } catch (error) { // error handling
        //     console.log(`Error fetching location data: ${error}`);
        // }        
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
        dim.style.position = "fixed"; // always cover full screen (fixes cutoff issue with smaller screen widths)
        dim.style.background = "rgba(0,0,0,0.5)"; // black & mostly transparent
        // begin div in top left of screen
        dim.style.top = 0;
        dim.style.left = 0;

        dim.style.display = "none"; // hide by default

        document.getElementsByTagName("main")[0].appendChild(dim); // add to main div

        return dim; // return element
    }

    // show element 
    #showElement(element) {
        element.style.display = "flex";
    }

    // hide element
    #hideElement(element) {
        element.style.display = "none";

        if (element === this.#reportModal) {localStorage.removeItem("crowding")}; // clear selection
        // TODO: determine if it's cleaner to split dimmer and report modal functions into two again
    }

    // set up report modal element & button event listeners
    #createReportModal() {
        const reportModal = document.createElement('div'); // create new element for report modal
        reportModal.setAttribute('id', 'report-modal');

        document.getElementsByTagName("main")[0].appendChild(reportModal); // add to main div
        
        reportModal.innerHTML = `
            <p>How crowded is <strong id="report-location-name"></strong>?</p>

            <button id="level1"></button>
            <button id="level2"></button>
            <button id="level3"></button>
            <button id="level4"></button>
            <button id="level5"></button>

            <button id="report-submit" type="submit" value="Submit">Submit</button>
        `
        CrowdingHints.forEach((hint, i) => {
            const button = document.querySelector(`button#level${i+1}`); // get each button
            button.innerText = `${i+1}: ${hint}` // add corresponding hint to button text

            // attach event listener for each button to save crowding score locally
            button.addEventListener("click", (event) => {
                // console.log(i+1);
                localStorage.setItem("crowding", (i+1).toString()); // save/overwrite crowding score selection to localstorage
                event.stopPropagation(); // prevent bubble up
            });
        })
        
        reportModal.style.display = "none"; // hide by default
        localStorage.removeItem("crowding"); // clear previous crowding score data, if any
        // TODO: move this somewhere more intuitive?
        return reportModal;
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();

        // related to expanded card view
        hub.subscribe(Events.ExpandLocationCard, () => {
            this.#showElement(this.#dimmerElement); // dim background when a card is expanded
        })

        // related to minimizing expanded card view
        hub.subscribe(Events.MinimizeLocationCard, () => {
            this.#hideElement(this.#dimmerElement); // hide dimmer element when a card is minimized/returned to normal view
        })

        // alert event hub to minimize expanded card view if area outside of card (i.e., dimmer element) is clicked
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

        // subscribe event listener for opening report modal
        hub.subscribe(Events.OpenReportModal, (data) => { // data is { name: string, floor: null || string } (depends on single or multi-floor) 
            this.#showElement(this.#reportModal); // open report modal

            const locationNameElement = document.getElementById("report-location-name"); // get element for location name in "How busy is ... ?"
            locationNameElement.innerText = data.name; // add primary location name

            if (data.floor !== null) { // if multi-floor
                const floorName = data.floor.substring(data.floor.indexOf("-") + 1); // get rid of "floor-" substring, leave floor code (e.g. "floor-2" -> "2")
                locationNameElement.innerText += ` Floor ${floorName}`; // add floor name to question
            };
        });
        
        // close report modal if area outside modal is clicked
        document.addEventListener("click", (event) => {
            if (this.#reportModal.style.display !== "none" && !this.#reportModal.contains(event.target)) {
                // ref for .contains() usage: https://johnsonkow.medium.com/event-listener-for-outside-click-75226f5c8ce0
                this.#hideElement(this.#reportModal);
                console.log("clicked outside")
            }
        });

        // attach event listener for Escape key press
        // if report modal is open, minimize report modal
        // otherwise, minimize expanded location card (still check if card is in expanded card view)
        document.addEventListener("keyup", (event) => {
            if (event.code === "Escape") { // escape key press
                if (this.#reportModal.style.display !== "none") { // report modal visible
                    this.#hideElement(this.#reportModal); // minimize report modal
                    event.stopPropagation(); // shouldn't matter, but just to be safe
                } else if (document.querySelector(".expanded") !== undefined) { // otherwise, escape expanded card if applicable
                    hub.publish(Events.MinimizeLocationCard); // minimize expanded card (via event hub subscription)
                }
            }
        });

        // attach event listener for crowding score modal submit button click
        const reportSubmitButton = document.getElementById("report-submit");
        reportSubmitButton.addEventListener("click", (event) => {
            event.stopPropagation(); // prevent any bubble up (should be find regardless, report modal itself has no events on click)

            const reportSubject = document.getElementById("report-location-name").innerText // "LocationName" or "LocationName Floor FloorName"
                .split(" Floor ") // should be ["LocationName"] or ["LocationName", "FloorName"]
            // console.log(reportSubject);

            // check if no selection made
            if (localStorage.getItem("crowding") === null) {
                alert("Please select a crowding score level.");
                return;
            }

            // construct data for add report
            const data = {
                report: {
                    location: reportSubject,
                    score: Number(localStorage.getItem("crowding")), // convert to number
                    timestamp: Date.now()
                }    
            };

            hub.publish(Events.AddReport, data); // alert event hub -> trigger backend action
        })

        // attach event listeners for successful crowding score report
        hub.subscribe(Events.AddReportSuccess, () => {
            this.#hideElement(this.#reportModal); // close modal after successful report submission
            hub.publish(Events.MinimizeLocationCard);
            alert("Your report has been saved. Thank you.") // TODO: make this a modal? (less intrusive) 

            this.#renderCards(); // TODO: maybe render only the card that changed
        })
    }
}
