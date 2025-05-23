import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { LocationCardComponent } from '../LocationCardComponent/LocationCardComponent.js';
import { CrowdingHints } from '../LocationCardComponent/CrowdingHints.js'
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';
import { calculateAverageCrowdingScore } from '../../utility/reportUtils.js';

export class LocationBrowsingComponent extends BaseComponent {
    #container = null; // private variable to store the container element
    #locationsData; // private variable for location data from server
    #dimmerElement; // private variable for background dimmer element
    #reportModal; // private variable for crowding score report modal

    constructor() {
        super();
        this.loadCSS('LocationBrowsingComponent');
    }

    async render() {
        if (this.#container) {
            return;
        }

        this.#locationsData = await this.#getLocations();

        this.#renderSearchOptions(); // render search bar and sort dropdown
        
        this.#createContainer(); // create location-browsing div element, set this.#container
        await this.#renderCards(); // render a card element for every location
        this.#dimmerElement = this.#createDimmerElement(); // element to dim screen when a card is expanded
        this.#reportModal = this.#createReportModal(); // element to report crowding score for expanded card
        this.#attachEventListeners(); // attach relevant event listeners  
        document.getElementsByTagName('main')[0].appendChild(this.#container); // add container to main component
    }

    #renderSearchOptions() {
        // create div for search option elements (search bar, card order/sorting dropdown)
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
    async #renderCards(locations = this.#locationsData, sortOption = null) { // render method defaults to rendering locations data from server (currently JSON) and by recently updated
        const locationBrowsingContainer = this.#container;
        locationBrowsingContainer.innerHTML = ""; // clear any pre-existing HTML

        // determine order for location rendering
        // TODO: potentially add additional sorting as query to controller getLocations? 
        // TODO: search bar and sorting dropdown still don't work together (unimplemented)
        // note for later: this solution is a bit unsatisfactory in terms of. cleanliness? but it works for the most part
        let toBeRendered = locations;
        for (let location of toBeRendered) {
            location.average = await this.#getAverageCrowdingScore(location);
        }

        if (sortOption === "Ascending Crowd Score") {
            toBeRendered.sort((a, b) =>  a.average-b.average); // sort by avg score (ascending)
        } else if (sortOption === "Descending Crowd Score") {
            toBeRendered.sort((a, b) => b.average-a.average); // sort by avg score (descending)
        }

        for (let location of toBeRendered) { // render each location in given order
            const locationObject = {
                name: location.name,
                address: location.address,
                type: location.type,
            }

            // parse report or floors attribute depending on building type
            if (location.type === "Single-Floor") { 
                locationObject.reports = JSON.parse(location.reports);

            } else if (location.type === "Multi-Floor") {
                locationObject.floors = JSON.parse(location.floors);
            }

            const locationCard = new LocationCardComponent(locationObject); // create new component for each location
            locationBrowsingContainer.appendChild(await locationCard.render()); // add location card to location browsing container
        }
    }

    // returns the average crowding score for an entire location
    // TODO: does this need to be handled by service or controller? for now it won't.
    async #getAverageCrowdingScore(location) {
        let average = null;
        if (location.type === "Single-Floor") {
            const reportIds = JSON.parse(location.reports);
            average =  await calculateAverageCrowdingScore(reportIds); // calculate average crowding score

        } else if (location.type === "Multi-Floor") {
            const floors = JSON.parse(location.floors); // array of floor objects
            const reportIds = floors.map(floor => floor.reports) // get array of array of reportIds
                .flat(); // flatten to one array
            average = await calculateAverageCrowdingScore(reportIds); // calculate average crowding score
        }
        return average;
    }

    // fetch location data to render
    async #getLocations() {
        try {
            const response = await fetch("/locations"); // fetch locations from backend
            if (response.ok) {
                const json = await response.json();
                const data = await json.locations;
                if (Array.isArray(data) && data.length > 0) { // check data format / if location data exists
                    this.#locationsData = data; // save location data
                    return data;

                } else {
                    throw new Error("Locations data is not an array, or no locations in array.");
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

        const matches = this.#locationsData.filter(location => { // filter locations by title match
            return location.name.toLowerCase().includes(key);
        })

        this.#renderCards(matches); // render filtered cards only
    }

    #sortLocationCards(sortOption) {
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
    }

    #minimizeReportModal() {
        // return button stylings to default
        this.#reportModal.querySelectorAll(".score-select").forEach(button => {
            // will default to stylesheet, ref: https://stackoverflow.com/a/2028029
            button.style.background = "";
            button.style.border = "";
            button.style.color = "";
        })

        // hide modal
        this.#hideElement(this.#reportModal);

        // clear user selection from local storage if possible
        localStorage.removeItem("crowding"); 
    }

    // set up report modal element & button event listeners
    #createReportModal() {
        const reportModal = document.createElement('div'); // create new element for report modal
        reportModal.setAttribute('id', 'report-modal');

        document.getElementsByTagName("main")[0].appendChild(reportModal); // add to main div
        
        reportModal.innerHTML = `
            <p>How crowded is <strong id="report-location-name"></strong>?</p>

            <button id="level1" class="score-select"></button>
            <button id="level2" class="score-select"></button>
            <button id="level3" class="score-select"></button>
            <button id="level4" class="score-select"></button>
            <button id="level5" class="score-select"></button>

            <button id="report-submit" type="submit" value="Submit">Submit</button>
        `
        CrowdingHints.forEach((hint, i) => {
            const level = i+1; // index corresponds to button

            const button = document.querySelector(`button#level${level}`); // get each button
            button.innerText = `${level}: ${hint}` // add corresponding hint to button text

            const colors = ["green", "blue", "yellow", "orange", "red"]; // for button styling

            // attach event listener for each button to save crowding score locally and update styling
            button.addEventListener("click", (event) => {
                // get previous selection from local storage
                const prevSelection = Number(localStorage.getItem("crowding")); // convert from string
                if (prevSelection !== 0) { // if value is not null
                    // get previously selected button element
                    const prevButton = document.querySelector(`button#level${prevSelection}`);
                    
                    // revert styling
                    const prevButtonColor = colors[prevSelection-1]
                    prevButton.style.background = `var(--light-${prevButtonColor})`;
                    prevButton.style.border = `1px solid var(--light-${prevButtonColor})`;
                    prevButton.style.color = "var(--grey-500)"
                }

                // update selected button's styling
                const newButtonColor = colors[level-1];
                button.style.background = `var(--bright-${newButtonColor})`;
                button.style.border = `1px solid var(--dark-${newButtonColor})`;
                button.style.color = "black"; // text color

                // save/overwrite crowding score selection to localstorage
                localStorage.setItem("crowding", level.toString());

                // prevent event bubble up
                event.stopPropagation();
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
        sortByElement.addEventListener("change", (event) => this.#sortLocationCards(event.target.value)); // render with changed dropdown selection

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
                this.#minimizeReportModal();
            }
        });

        // attach event listener for Escape key press
        // if report modal is open, minimize report modal
        // otherwise, minimize expanded location card (still check if card is in expanded card view)
        document.addEventListener("keyup", (event) => {
            if (event.code === "Escape") { // escape key press
                if (this.#reportModal.style.display !== "none") { // report modal visible
                    this.#minimizeReportModal(); // minimize report modal
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

            // check if no selection made
            if (localStorage.getItem("crowding") === null) {
                alert("Please select a crowding score level.");
                return;
            }

            // construct data for add report
            const data = {
                location: reportSubject[0],
                score: Number(localStorage.getItem("crowding")), // convert to number
            }

            if (reportSubject.length === 2) { // multi floor
                data.floor = reportSubject[1]; // add floor name
            }

            hub.publish(Events.AddReport, data); // alert event hub -> trigger backend action
        })

        // attach event listeners for successful crowding score report
        hub.subscribe(Events.AddReportSuccess, async () => {
            alert("Your report has been saved. Thank you."); // TODO: make this a modal? (less intrusive)

            this.#minimizeReportModal();; // close modal after successful report submission
            hub.publish(Events.MinimizeLocationCard); // close location card
            this.#locationsData = await this.#getLocations(); // update location data attribute 
            await this.#renderCards(); // TODO: maybe render only the card that changed
        })
    }
}
