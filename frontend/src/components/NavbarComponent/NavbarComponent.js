import { BaseComponent } from "../BaseComponent/BaseComponent.js"

export class NavbarComponent extends BaseComponent {
    #container;

    constructor() {
        super();
        this.#container = null;
        this.loadCSS('NavbarComponent')
    }

    render() {
        // main navbar content
        this.#container = document.createElement('header');
        this.#container.innerHTML = `
            <div id="app-logo" onclick="location.href='../PostViewing/index.html'">Study on Campus</div>

            <nav>
                <a href="../LocationBrowsing/index.html">Browse Locations</a>
                <input type="button" class="nav-button" value="Create Post" onclick="location.href='../PostCreation/index.html'"/>
                <div class="user-icon can-click"><span class="icon-content">:3</span></div>
            </nav>
        `
        // add to main container (use prepend to place ahead of everything else)
        document.getElementsByTagName('body')[0].prepend(this.#container);

        this.#renderModal();

        this.#attachEventListeners();
    }

    #renderModal() {
        const modalContainerElement = document.createElement('div');
        modalContainerElement.setAttribute('id', '')
    }

    #attachEventListeners() {

    }
}