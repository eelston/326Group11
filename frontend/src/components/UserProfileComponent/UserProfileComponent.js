import { BaseComponent } from "../BaseComponent/BaseComponent.js";
// import { EventHub }

export class UserProfileComponent extends BaseComponent {
    #container = null; // init component container element
    #userData; // declare private userData

    constructor(userData = {}) {
        console.log("Constructing User Profile...")
        super();
        this.#userData = userData;
        this.loadCSS('UserProfileComponent');   
    }

    render() { 
        // check if container is already rendered
        if (this.#container) {
            return this.#container;
        }

        // update page title
        document.title = `${this.#userData.name}'s Profile | Study on Campus`;

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
        const profileIcon = document.getElementById('profile-icon'); // get profile icon element
        profileIcon.style.backgroundColor = this.#userData.settings.iconColor; // render icon color
        profileIcon.querySelector('.icon-content').textContent = this.#userData.iconContent; // update icon content

        // fill with user name and id
        document.getElementById('profile-name').innerText = this.#userData.name;
        document.querySelector('.user-id').innerText = `@${this.#userData.userId}`;

        // display pronouns according to user settings
        if (this.#userData.settings.displayPronouns)  { // if enabled
            document.querySelector('.user-pronouns').innerText = this.#userData.pronouns;
        } else {
            document.querySelector('.user-pronouns').style.background = "none";
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
        // this.#setupEditFields();
    }

    /**
     * returns HTML template for user profile content/subsections
     */
    #getProfileContentTemplate() {
        return `
            <div id="about-container" class="profile-subsection">
                <div id="content-container" class="subsection-content">
                    <strong class="profile-subsection-title">About Me</strong>
                    <ul id="about-list">
                    </ul>
                </div>
            </div>
    
            <div id="blurb-container" class="profile-subsection">
                <div id="content-container" class="subsection-content">
                    <p id="blurb">Nothing here!
                    </p>
                </div>
            </div>

            <div id="course-list-container" class="profile-subsection">
                <div id="content-container" class="subsection-content">
                    <strong class="profile-subsection-title">Current Courses</strong>
                    <p id="courses">
                    </p>
                </div>
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
        const aboutList = document.getElementById('about-list'); // get fact/about list
        this.#userData.profileContent.about.forEach(fact => { // populate with each user fact
            const li = document.createElement('li'); // create new list item
            li.innerHTML = `<strong class="fact-title">${fact.factName}:</strong> ${fact.factAnswer}` // add user data (e.g., *Favorite Study Spot:* SEL)
            aboutList.appendChild(li); // add to list
        })

        // user blurb
        const blurbSection = document.getElementById('blurb');
        blurbSection.innerText = this.#userData.profileContent.blurb;

        // current courses
        const courseSection = document.getElementById('courses');
        courseSection.innerHTML = '';
        
        const courseList = document.createElement('ul');
        courseList.className = 'course-list';
        
        this.#userData.profileContent.courses.forEach(course => {
            const li = document.createElement('li');
            li.innerHTML = `${course.course_subject} ${course.course_number}`;
            courseList.appendChild(li);
        });
        
        courseSection.appendChild(courseList);

        // recent posts
        const recentPostSection = document.getElementById('post-embed-container');
        // TODO: THIS IS NOT IMPLEMENTED YET. need to determine how posts are embedded
    }

    /**
     * return base element for editing profile subsection from user profile page 
     */
    #getEditFieldTemplate() {
        const editFieldElement = document.createElement('div'); // new div
        editFieldElement.classList.add('edit-container'); // set id for selection
        editFieldElement.classList.add('subsection-content'); // and class for styling
        editFieldElement.innerHTML = `
            <div id="edit-content-container"></div>
            <div class="edit-options">
                <input type="button" class="button" value="Cancel"/>
                <input type="button" class="button" value="Preview"/>
            </div>
            `;
        return editFieldElement;
    } 

    #setupEditFields() {
        // about container
        const aboutContainer = document.getElementById("about-container");
        aboutContainer.appendChild(this.#getEditFieldTemplate());

        const aboutEditList = document.createElement("ul");
        aboutEditList.setAttribute("id", "about-edit-list");

        const aboutEditContainer = document.getElementById("edit-content-container");
        aboutEditContainer.appendChild(aboutEditList);
        this.#userData.profileContent.about.forEach((fact, i) => { // for each user fact
            const li = document.createElement('li'); // create new list item
            // create input field for each fact
            li.innerHTML = `
                <strong class="fact-title">${fact.factName}:</strong> <input id="fact${i}" class="fact-input" placeholder="${fact.factAnswer}"/>
                <input type="button" class="button" value="Save"/>
                `
            aboutEditList.appendChild(li); // add to list
            const input = document.getElementById(`fact${i}`);
            input.setAttribute('size', input.getAttribute('placeholder').length);
        })

        

        // blurb container
        const blurbContainer = document.getElementById("blurb-container");
        blurbContainer.appendChild(this.#getEditFieldTemplate());

        const blurbEdit = document.querySelector("#blurb-container #edit-content-container");
        blurbEdit.innerHTML = `
            <input id="blurb" placeholder="${this.#userData.profileContent.blurb}"/>
        `
        
        document.querySelector("#blurb-container.edit-container#edit-content-container").appendChild(blurbEdit);
    }

    #attachEventListeners() {
        // const hub = EventHub.getInstance();

    //     // Subscribe to the 'NewTask' event to add a new task
    //     hub.subscribe('NewTask', taskData => this.#addTaskToList(taskData));

    // // Attach event listener for clearing tasks
    // const clearTasksBtn = this.#container.querySelector('#clearTasksBtn');
    // clearTasksBtn.addEventListener('click', () => this.#clearTasks());

    // // Subscribe to 'UnStoreTasksSuccess' to clear the task list
    // hub.subscribe(Events.UnStoreTasksSuccess, () => this.#clearTaskList());

        // TODO: determine events (if any) for user profile page
        // planned/WIP:
            // location -> navigate to location browsing page, filtered for spec location
            // if viewer === profile owner, display button to navigate to user settings
            // ALSO: need to add user settings for profile content
    }
}
