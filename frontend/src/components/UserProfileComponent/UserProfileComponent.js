import { BaseComponent } from "../BaseComponent/BaseComponent.js";

export class UserProfileComponent extends BaseComponent {
    #container = null; // init component container element

    constructor(userData = {}) {
        console.log("Constructing User Profile...")
        super();
        this.userData = userData;
        this.loadCSS('UserProfileComponent');   
    }

    render() {
        // check if container is already rendered
        if (this.#container) {
            return this.#container;
        }

        // update page title
        document.title = `${this.userData.name}'s Profile | Study on Campus`;

        // create container div with relevant class
        this.#container = document.createElement('div');
        this.#container.setAttribute('id', 'profile-container');

        // add container to main component
        document.getElementsByTagName('main')[0].appendChild(this.#container);

        // set up subsection divs
        this.#setupProfileHeader(); // user icon, name, id, pronouns
        this.#setupProfileContent(); // user profile content (about, blurb, courses, recent post)
        this.#attachEventListeners();

    }

    #setupProfileHeader() {
        // set up profile header HTML
        const profileHeader = document.createElement('div');
        profileHeader.setAttribute('id', 'profile-header');
        profileHeader.innerHTML = this.#getProfileHeaderTemplate();
        this.#container.appendChild(profileHeader); // add to user profile container

        // populate with user data
        this.#updateProfileHeader();
    }

    /**
     * returns HTML template for profile header
     */
    #getProfileHeaderTemplate() {
        return `
            <div class="user-icon" id="profile-icon"><span class="icon-content"></span></div>

            <div class="header-text-container">
                <div class="display-name" id="profile-name"></div>
                <div class="user-pronouns"></div>
                <div class="user-id"></div>
            </div>
        `;
    }

    /**
     * populate user profile header corresponding user data/content
     */
    #updateProfileHeader() {
        // renders icon belonging to user profile (NOT necessarily the same as user viewing this page)
        document.getElementById('profile-icon').querySelector('.icon-content').textContent = this.userData.iconContent;

        // fill with user name and id
        document.getElementById('profile-name').innerText = this.userData.name;
        document.querySelector('.user-id').innerText = `@${this.userData.userId}`;

        // display pronouns according to user settings
        if (this.userData.settings.displayPronouns)  { // if enabled
            document.querySelector('.user-pronouns').innerText = this.userData.pronouns;
        } else {
            document.querySelector('.user-pronouns').style.background = "none"; // display: none affects user--id placement, TODO: maybe adjust to avoid that (later)
        }
    }

    
    #setupProfileContent() {
        // set up profile content container HTML
        const profileContent = document.createElement('div');
        profileContent.setAttribute('id', 'profile-content');
        profileContent.innerHTML = this.#getProfileContentTemplate();
        this.#container.appendChild(profileContent); // add to user profile container

        // populate with user data
        this.#updateProfileContent();
    }

    /**
     * returns HTML template for user profile content/subsections
     */
    #getProfileContentTemplate() {
        return `
            <div id="about-container" class="profile-subsection">
                <strong class="profile-subsection-title">About Me</strong>
                <ul id="about-list">
                </ul>
            </div>
    
            <div id="blurb-container" class="profile-subsection">
                <p id="blurb">Nothing here!
                </p>
            </div>

            <div id="course-list-container" class="profile-subsection">
                <strong class="profile-subsection-title">Current Courses</strong>
                <p id="courses">
                </p>
            </div>
    
            <div id="recent-post-container" class="profile-subsection">
                <strong class="profile-subsection-title">Recent Post</strong>
                <div id="post-embed-container">
                    <p class="placeholder-text">Nothing here!</p>
                </div>
            </div>
        `;
    }

    /**
     * populate user profile subsections with corresponding user data/content
     */
    #updateProfileContent() {
        // about section
        const aboutSection = document.getElementById('about-list'); // get fact/about list
        this.userData.profileContent.about.forEach(fact => { // populate with each user fact
            const li = document.createElement('li'); // create new list item
            li.innerHTML = `<strong class="fact-title">${fact.factName}:</strong> ${fact.factContent}` // add user data (e.g., *Favorite Study Spot:* SEL)
            aboutSection.appendChild(li); // add to list
        })

        // user blurb
        const blurbSection = document.getElementById('blurb');
        blurbSection.innerText = this.userData.profileContent.blurb;

        // current courses
        const courseSection = document.getElementById('courses');
        courseSection.innerText = this.userData.profileContent.courses;
        // TODO: swap this over to a list if we implement a course database

        // recent posts
        const recentPostSection = document.getElementById('post-embed-container');
        // TODO: THIS IS NOT IMPLEMENTED YET. need to determine how posts are embedded
    }

    #attachEventListeners() {
        // const hub = EventHub.getInstance();

        // TODO: determine events (if any) for user profile page
        // planned/WIP:
            // location -> navigate to location browsing page, filtered for spec location
            // if viewer === profile owner, display button to navigate to user settings
            // ALSO: need to add user settings for profile content
    }
}