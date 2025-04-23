import { BaseComponent } from '../BaseComponent/BaseComponent.js'
import { CrowdingHints } from './CrowdingHints.js'
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/Events.js';

export class LocationCardComponent extends BaseComponent {
    #container = null; // private variable to store location card container element
    #locationData;
    #nameTag;

    constructor(locationData = {}) {
        super();
        this.#locationData = locationData;
        this.#nameTag = this.#locationData.name.replaceAll(/[^\w]/g, ""); // used repeatedly for styling, easier to define up here -> location name without spaces or punctuation
        this.loadCSS('LocationCardComponent');
    }

    render() {
        console.log(`Rendering ${this.#locationData.name}`); // printing to console for confirmation
        if (this.#container) {
            return this.#container;
        }
        this.#createContainer(); // create card container

        // call render method corresponding to building type
        if (this.#locationData.type === "Single-Floor") {
            this.#renderSingleFloor();
        } else if (this.#locationData.type === "Multi-Floor") {
            this.#renderMultiFloor();
        }

        this.#renderCrowdingScore();

        this.#renderAddress(); // render location address

        // add event listeners
        this.#attachEventListeners();

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

        // const nameTag = this.#locationData.name.replaceAll(" ", "-"); // replace whitespace with hyphen for styling tag

        this.#container.innerHTML = `
                <span class="exit-expanded show-on-expand">Minimize</span>

                <div class="location-info">
                   <div class="location-name">${this.#locationData.name}</div>
                   <div id="${this.#nameTag}-hint" class="crowding-score-hint"></div>
                </div>
                
                <div class="crowding-score-bar-container">
                   <div id="${this.#nameTag}-bar" class="crowding-score-bar"></div>
                </div>
                <input type="button" class="report-button show-on-expand" value="Report Crowding"/>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>            `
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
                    <div id="${this.#nameTag}-${floor.name}-hint" class="crowding-score-hint"></div>
                </div>
                
                <div class="crowding-score-bar-container">
                    <div id="${this.#nameTag}-${floor.name}-bar" class="crowding-score-bar"></div>
                </div>
                <input type="button" class="report-button floor-${floor.name} show-on-expand" value="Report Crowding"/>
                <div class="crowding-score-updated-time">Last updated ${this.#timestampToString(lastUpdatedTimestamp)}</div>
            `

            this.#container.appendChild(floorInfo);
        });
    }

    // gets crowding score and updates crowding score bar and hint text
    #renderCrowdingScore() {
        // const nameTag = this.#locationData.name.replaceAll(" ", "-"); // replace whitespace in location name with hyphen for styling tag

        if (this.#locationData.type === "Single-Floor") {
            const averageCrowdingScore = this.#calculateAverageCrowdingScore(this.#locationData.reports); // average crowding score
            const level = Math.round(averageCrowdingScore); // level for crowding score bar

            const crowdingScoreHint = this.#container.querySelector(`#${this.#nameTag}-hint`); // get hint div
            crowdingScoreHint.innerText = CrowdingHints[level-1]; // set/reset hint text
            
            const crowdingScoreBar = this.#container.querySelector(`#${this.#nameTag}-bar`); // get crowding score bar element

            const className = crowdingScoreBar.classList.values().find((className) => /level./.test(className)); // get current level/styling tag
            if (className) {crowdingScoreBar.classList.remove(className)}; // remove previous level tag, if exists

            crowdingScoreBar.classList.add(`level${level}`) // replace with updated level

        } else if (this.#locationData.type === "Multi-Floor") {
            this.#locationData.floors.forEach(floor => { 
                const averageCrowdingScore = this.#calculateAverageCrowdingScore(floor.reports); // average crowding score for floor
                const level = Math.round(averageCrowdingScore); // level for crowding score bar

                console.log(`#${this.#nameTag}-${floor.name}-bar`)
                const crowdingScoreHint = this.#container.querySelector(`#${this.#nameTag}-${floor.name}-hint`); // get hint div
                crowdingScoreHint.innerText = CrowdingHints[level-1];

                const crowdingScoreBar = this.#container.querySelector(`#${this.#nameTag}-${floor.name}-bar`); // get crowding score bar element

                const className = crowdingScoreBar.classList.values().find((className) => /level./.test(className)); // get current level/styling tag
                if (className) {crowdingScoreBar.classList.remove(className)}; // remove previous level tag, if exists

                crowdingScoreBar.classList.add(`level${level}`) // replace with updated level
            });
        }

    }

    // adds address to bottom of card
    #renderAddress() {
        // hidden detail when minimized - location address
        const address = document.createElement('div'); // create element for address
        address.classList.add("address");
        address.innerHTML = `<strong>Address:</strong> ${this.#locationData.address}`; // embed location address

        address.classList.add("show-on-expand"); // for styling
        this.#container.appendChild(address);
    }

    // calculate average crowding score from given array of reports
    #calculateAverageCrowdingScore(reports) {
        const crowdingScores = reports.map(report => report.score); // get array of scores
        return crowdingScores.reduce((sum, curr) => sum+curr, 0) / crowdingScores.length; // calculate average
    }

    // convert number to string
    #timestampToString(timestamp) {
        const date = new Date(timestamp); // convert to Date object
        // TODO: consider moving this to src/lib for use with post timestamps
        const options = { // timestamp format options (ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#examples)
            hourCycle: "h24", // TODO: add user setting for 24hr vs 12hr time once server sessions are implemented
            weekday: "short",
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZoneName: "shortGeneric"
        };

        // format date as string with day, date-month-year and time
        const str = date.toLocaleTimeString("en-US", options); // e.g., Fri, 12/19/2025, 12:24 ET

        // additional string formatting
        if (date.getUTCDate() === new Date(Date.now()).getUTCDate()) { // truncate if timestamp date matches today/current day
            return "Today at " + str.substring(str.indexOf(":")-2); // e.g., Today at 15:30 ET or Today at 03:30 PM ET (substring starts two digits before the colon in the time!)
        } 

        return str; // otherwise, return full date (e.g., Fri, 12/19/2025, 12:24 ET)
    }

    // render card in expanded view
    #renderExpandedCard() {
        console.log(`Expanding ${this.#locationData.name} card`); // printing to console for confirmation
        // add tag for card  element selection and styling
        this.#container.classList.add("expanded");        
        // display minimize button, address, report buttons (all previously"hidden" elements)
        this.#container.querySelectorAll(".show-on-expand").forEach(element => {element.style.display = "inline-block"});
        
        // TODO: move this elsewhere to avoid duplicate function creation
        // attach event listeners for reporting crowding score (on button click)
        this.#container.querySelectorAll(".report-button") // get each report button
            .forEach(button => button.addEventListener('click', (event) => {
                const hub = EventHub.getInstance();
                hub.publish(Events.OpenReportModal);

                event.stopPropagation(); // prevent bubble up
                // TODO: implement location crowding score reporting
                // TODO: determine if saving user-id is necessary for location report...
                // if (event.target.classList.values().some(className => className.includes("floor"))) { // TODO: clean up this conditional...
                //    console.log(event.target.classList[1]); // get floor name
                // }
                // console.log(`report for ${this.#locationData.name} ${event.target.}`);
            }));
    }

    // reset expanded card
    #minimizeExpandedCard() {
        const cardContainer = document.querySelector('.expanded'); // select card container (using this.#container prevents dimElement event listener from working)
    
        cardContainer.querySelectorAll('.show-on-expand').forEach(element => {element.style.display = "none"}); // hide expended/detail elements
        
        cardContainer.classList.remove("expanded"); // remove expanded card styling tag
        
        if (document.querySelectorAll(".expanded").length === 0) {console.log(`card minimized`);} // printing for confirmation
    }

    #attachEventListeners() {
        const hub = EventHub.getInstance();

        hub.subscribe(Events.MinimizeLocationCard, () => {
            if (this.#container.classList.contains("expanded")) {
                this.#minimizeExpandedCard();
            }
        })
    
        // attach event listener to expand card view on click 
        this.#container.addEventListener('click', () => { // expand location card on click
            if (!(this.#container.classList.contains("expanded"))) {
                this.#renderExpandedCard(); // render expanded only if card is not already expanded

                // update eventhub for expanded location card
                hub.publish(Events.ExpandLocationCard);
            }
        });
        
        // attach event listener to minimize expanded card view when "minimize" button is pressed
        const exitExpandedButton = this.#container.querySelector(".exit-expanded"); // get minimize button
        exitExpandedButton.addEventListener('click', (event) => {
            if (this.#container.classList.contains("expanded")) { // only attempt if card is expanded (just in case)
                event.stopPropagation(); // stop click from triggering renderExpandedCard after button click (event bubbling)
                // ref: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling ("click on button fires first", "event bubbles up from the innermost element")
                
                this.#minimizeExpandedCard(); // call minimize method only if card is expanded
                
                // update eventhub for minimizing location card -> this affects dimmer element in LocationBrowsingComponent
                hub.publish(Events.MinimizeLocationCard);
            }
        });

        // attach event listener to minimize expanded card view on escape key press
        document.addEventListener('keyup', (event) => {
            if ((event.code === "Escape") && (this.#container.classList.contains("expanded"))){
                this.#minimizeExpandedCard();

                // update eventhub for minimizing location card -> this affects dimmer element
                hub.publish(Events.MinimizeLocationCard);
            }
        });

        // update crowding bar and hint (if needed) when new report is added
        // TODO: optional -> add conditional to prevent unnecessary rendering if score didn't change
        // hub.subscribe(Events.AddReport, this.#renderCrowdingScore)
    }
}
