import { BaseComponent } from "../BaseComponent/BaseComponent.js"

export class NavbarComponent extends BaseComponent {
    #container;
    #navDropdown;

    constructor() {
        super();
        this.#container = null;
        this.loadCSS('NavbarComponent')
    }

    render() {
        // main navbar content
        this.#container = document.createElement('header');
        this.#container.innerHTML = `
            <div id="app-logo" onclick="location.href='../PostBrowsing/index.html'" title="Browse study posts">Study on Campus</div>

            <nav>
                <a href="../LocationBrowsing/index.html">Browse Locations</a>
                <button class="nav-button" value="Create Post" onclick="location.href='../PostCreation/index.html'">Create Post</button>
                <div id="nav-icon" class="user-icon can-click"><span class="icon-content">:3</span></div>
            </nav>
        `
        // add to main container (use prepend to place ahead of everything else)
        document.getElementsByTagName('body')[0].prepend(this.#container);

        this.#navDropdown = this.#renderModal();

        this.#attachEventListeners();
    }

    #renderModal() {
        // dropdown menu for site nav, appears upon clicking user-icon
        const modalContainerElement = document.createElement('div');
        modalContainerElement.setAttribute('id', 'navbar-dropdown-menu')

        modalContainerElement.innerHTML = `
            <span id="close-button">&times</span>
            <div class="user-subsection">
                <div class="user-icon"><span class="icon-content">:3</span></div>
                <div class="user-info">
                    <span class="display-name">name!</span>
                    <span class="user-id">@me!</span>
                </div>
            </div>
            <ul id="nav-options">
                <li id="your-profile-link">Your profile</li>
                <li id="your-posts-link">Your posts</li>
                <li id="settings-link">Settings</li>
                <li id="log-out-link">Log out</li>
            </ul>
        `
        this.#container.appendChild(modalContainerElement);

        return modalContainerElement;
    }

    #attachEventListeners() {
        const navIcon = document.getElementById("nav-icon");
        // toggle navbar modal when the nav icon is clicked
        navIcon.addEventListener("click", (event) => {
            this.#navDropdown.style.display = this.#navDropdown.style.display === "block" ? "none" : "block";
            event.stopPropagation();
        })

        // close navbar modal on button click
        document.getElementById('close-button').addEventListener("click", () => {
            this.#navDropdown.style.display = "none";
        })

        // close navbar modal when area outside dropdown is clicked
        document.addEventListener("click", (event) => {
            if (this.#navDropdown.style.display !== "none" && !this.#navDropdown.contains(event.target)) {
                // ref for .contains() usage: https://johnsonkow.medium.com/event-listener-for-outside-click-75226f5c8ce0
                this.#navDropdown.style.display = "none";
            }
        });

        // nav modal links - put here to make editing a bit easier, may implement a nicer solution later on
        // link to user profile
        // TODO: change with authentication/session milestone, should navigate to current user's profile
        const profileLink = document.getElementById("your-profile-link")
        profileLink.setAttribute("onclick", "location.href = '../UserProfile/index.html'");
        // link to user posts
        // TODO: check if post browsing can implement sort by user id
        const userPostsLink = document.getElementById("your-posts-link");
        
        // link to settings
        const settingsLink = document.getElementById("settings-link");
        settingsLink.setAttribute("onclick", "location.href = `../Settings/index.html`");
        // log out link
        // TODO: need to implement sessions first (later milestone)
    }
}