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

        // call render method corresponding to building type
        if (this.#locationData.type === "Single-Floor") {
            this.#renderSingleFloor();
        } else if (this.#locationData.type === "Multi-Floor") {
            this.#renderMultiFloor();
        }

        this.#createDimmerElement();

        // add event listeners
        this.#attachEventListeners();
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
                <span class="exit-expanded show-on-expand">Minimize</span>

                <div class="location-info">
                   <div class="location-name">${this.#locationData.name}</div>
                   <div class="crowding-score-hint">${CrowdingHints[level-1]}</div>
                </div>
                
                <div class="crowding-score-bar-container">
                   <div id="level${level}" class="crowding-score-bar"></div>
                </div>
                <input type="button" class="report-button show-on-expand" value="Report Crowding"/>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>
            `
        
        this.#renderAddress();
    }

    // render card for location with multiple floors
    #renderMultiFloor() {
        // add location name and minimize "button"
        this.#container.innerHTML = `
            <div class="location-name">${this.#locationData.name}</div>
            <span class="exit-expanded show-on-expand">Minimize</span>
        `;
        // TODO: fix minimize button appearing below location title when expanded

        // render information for each floor under location
        this.#locationData.floors.forEach(floor => { 
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
                <input type="button" class="report-button floor-${floor.name} show-on-expand" value="Report Crowding"/>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>
            `

            this.#container.appendChild(floorInfo);
        });
        
        this.#renderAddress();
    }

    #renderAddress() {
        // hidden detail - location address
        const address = document.createElement('div'); // create element for address
        address.classList.add("address");
        address.innerHTML = `<strong>Address:</strong> ${this.#locationData.address}`; // embed location address

        address.classList.add("show-on-expand"); // for styling
        this.#container.appendChild(address);
    }

    // calculate average crowding score from given array of reports
    #calculateAverageCrowdingScore(reports) {
        const crowdingScores = reports.map(report => report.score) // get array of scores
        return crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length // calculate average
    }

    // convert number to string
    #timestampToString(timestamp) {
        // return new Date(timestamp).toString();
        return new Date(timestamp).toLocaleString("en-US");
        // TODO: tidy timestamp output to more closely match mockup
        // (toLocaleString gives time in user's timezone, but would maybe like to display on card as well)
    }
    
    // init div to dim full screen
    // reference: https://stackoverflow.com/a/15841516
    #createDimmerElement() {
        // dim rest of screen
        const dim = document.createElement('div'); // create new element to dim rest of screen
        dim.setAttribute('id', 'dim');
        dim.style["z-index"] = 998; // move to below card

        // cover full window
        dim.style.height = "100%";
        dim.style.width = "100%";
        dim.style.position = "absolute";
        dim.style.background = "rgba(0,0,0,0.5)"; // black & mostly transparent
        // begin div in top left of screen
        dim.style.top = 0;
        dim.style.left = 0;

        dim.style.display = "none";

        document.getElementsByTagName("main")[0].appendChild(dim); // add to view
    }

    // render card in expanded view
    #renderExpandedCard() {
        this.#container.classList.add("expanded"); // add tag for styling and to prevent multiple function calls
        this.#container.querySelectorAll(".show-on-expand").forEach(element => {element.style.display = "inline-block"}); // display minimize option
    
        const exitExpandedButton = this.#container.querySelector(".exit-expanded");
    
        // attach event listeners for reporting crowding score (on button click)
        this.#container.querySelectorAll(".report-button") // get each report button
            .forEach(button => button.addEventListener('click', (event) => {
                // TODO: implement location crowding score reporting
                // TODO: determine if saving user-id is necessary for location report...
                // if (event.target.classList.values().some(className => className.includes("floor"))) { // TODO: clean up this conditional...
                //    console.log(event.target.classList[1]); // get floor name
                // }
                // console.log(`report for ${this.#locationData.name} ${event.target.}`);
            }))

        // attach event listener for exiting expanded card view
        exitExpandedButton.addEventListener('click', (event) => {
            this.#revertExpandedCard();
            event.stopPropagation(); // prevent renderExpendedCard from activating more than once
            // reference: https://api.jquery.com/event.stopImmediatePropagation/
        });

        // also, exit expanded card view if user clicks outside of card
        const dimElement = document.getElementById('dim');
        dimElement.addEventListener('click', this.#revertExpandedCard);

        // dim rest of screen
        dimElement.style.display = 'block'; // show dimmer div
    }

    // reset expanded card
    #revertExpandedCard() {
        const cardContainer = document.querySelector('.expanded'); // select card container (using this.#container prevents dimElement event listener from working)
        cardContainer.querySelectorAll('.show-on-expand').forEach(element => {element.style.display = "none"}); // hide expended/detail elements
        document.getElementById('dim').style.display = 'none'; // hide dimmer div

        document.querySelector(".expanded").classList.remove("expanded"); // remove expanded card styling tag
    }

    #attachEventListeners() {
        // const hub = EventHub.getInstance();
        
        // attach event listener for expanded card view
        this.#container.addEventListener('click', () => { // expand card on click
            if (!(this.#container.classList.contains("expanded"))) {
                this.#renderExpandedCard(); // render expanded only if card is not already expanded
            }
        });        
    }
}
