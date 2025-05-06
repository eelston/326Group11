import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
 
export class PostCreationComponent extends BaseComponent { 
    #container = null; // init component container element
    #tags = [];
    #datetime = null;

    constructor() {
        super();
        this.loadCSS("PostCreationComponent");
    }

    render() {
        this.#createContainer();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement("form");
        this.#container.classList.add('post-form');
        this.#container.innerHTML = this.#getTemplate();
        this.#setMinDateTime();
    }

    #setMinDateTime(){
        const datetimeInput = this.#container.querySelector('#datetime-input');
        if(datetimeInput) {
            const now = new Date();
            const formattedDateTime = now.toISOString().slice(0, 16);
            datetimeInput.setAttribute('min', formattedDateTime);
        }
    }

    #getTemplate() {
        return `
        <div class="post-container">

            <div class="post-content">
                <div class="post-title">
                    <input type="text" id="post-title" placeholder="Name your post." autocomplete="off">
                </div>
                <div class="post-location">
                    <input type="text" id="post-location" placeholder="Have a location in mind?" autocomplete="off">
                </div>
                <div class="post-body">
                    <textarea id="post-body" placeholder="Any extra information? Add it here." autocomplete="off"></textarea>
                </div>
            </div>

            <div class="post-actions">

                <div class="all-buttons">
                    <div class="extra-input">
                        <button type="button" id="add-datetime-btn">Open Date/Time</button>
                        <button type="button" id="add-tags-btn">Open Tag Menu</button>
                    </div>
                    <div class="post-buttons">
                        <button type="button" id="submit-cancel">Cancel</button>
                        <input type="submit" id="submit-post" value="Post">
                    </div>
                </div>

                <div class="datetime-wrapper">
                    <div id="datetime-input-view" class="hidden">
                        <label for="datetime-input">Enter a date and time and press enter: </label>
                        <input type="datetime-local" id="datetime-input">
                    </div>
                    <span id="error" style="color: red; display: none;"></span>
                    <div class="datetime-display" id="datetime-list"></div>
                </div>

                <div class="tag-menu-wrapper">
                    <div id="tag-input-view" class="hidden">
                        <input type="text" id="tag-input" placeholder="Enter a tag and press enter." autocomplete="off"/>
                    </div>
                    <div class="tag-display" id="tag-list"></div>
                </div>
            </div>
        </div>
        `;
    }

    #attachEventListeners() {
        this.#attachFormSubmitListener();
        this.#attachCancelListener();
        this.#attachTagMenuToggleListener();
        this.#attachTagInputListener();
        this.#attachTagDeleteListener();
        this.#attachDateTimeToggleListener();
        this.#attachDateTimeInputListener();
        this.#attachDateTimeDeleteListener();
    }

    #attachFormSubmitListener() {
        this.#container.addEventListener('submit', (e) => this.#handlePostSubmit(e));
    }
    
    #attachCancelListener() {
        const cancelBtn = this.#container.querySelector('#submit-cancel');
        cancelBtn.addEventListener('click', () => this.#handleCancelPost());
    }

    #attachTagMenuToggleListener() {
        const addTagsBtn = this.#container.querySelector('#add-tags-btn');
        const tagInputView = this.#container.querySelector('#tag-input-view');
    
        addTagsBtn.addEventListener('click', () => {
          const isHidden = tagInputView.classList.toggle('hidden');
          addTagsBtn.textContent = isHidden ? 'Open Tag Menu' : 'Close Tag Menu';
          this.#container.querySelector('#tag-input').focus();
        });
    }
    
    #attachTagInputListener() {
        const tagInput = this.#container.querySelector('#tag-input');
        tagInput.addEventListener('keydown', (e) => this.#handleAddTag(e));
    }
    
    #attachTagDeleteListener() {
        const tagList = this.#container.querySelector('#tag-list');
        tagList.addEventListener('click', (e) => this.#handleRemoveTag(e));
    }

    #attachDateTimeToggleListener() {
        const addDateTimeBtn = this.#container.querySelector('#add-datetime-btn');
        const dateTimeInputView = this.#container.querySelector('#datetime-input-view');
    
        addDateTimeBtn.addEventListener('click', () => {
          const isHidden = dateTimeInputView.classList.toggle('hidden');
          addDateTimeBtn.textContent = isHidden ? 'Open Date/Time' : 'Close Date/Time';
          this.#container.querySelector('#datetime-input').focus();
        });
    }

    #attachDateTimeInputListener() {
        const dateTimeInput = this.#container.querySelector("#datetime-input");
        dateTimeInput.addEventListener('keydown', (e) => this.#handleAddDateTime(e));
    }

    #attachDateTimeDeleteListener() {
        const datetime = this.#container.querySelector('#datetime-list');
        datetime.addEventListener('click', (e) => this.#handleRemoveDateTime(e));
    }

    #handleAddTag(e) {
        if (e.key !== 'Enter' || e.target.value.trim() === '') return;
        
        e.preventDefault();
        const tagText = e.target.value.trim();
        const tagList = this.#container.querySelector('#tag-list');

        if (!this.#tags.includes(tagText)){
            const tag = document.createElement('div');
            tag.classList.add('tag');

            const tagLabel = document.createElement('span');
            tagLabel.textContent = tagText;

            const removeBtn = document.createElement('span');
            removeBtn.textContent = '✕';
            removeBtn.classList.add('remove');

            tag.appendChild(removeBtn);
            tag.appendChild(tagLabel);
            tagList.appendChild(tag);

            this.#tags.push(tagText);
        }
        e.target.value = '';
    }

    #handleRemoveTag(e) {
        if (!e.target.classList.contains('remove')) return;

        const tag = e.target.parentElement;
        const tagText = tag.querySelector('span').textContent;
        const index = this.#tags.indexOf(tagText);
        if (index !== -1) this.#tags.splice(index, 1);
        tag.remove();
    }

    #handleAddDateTime(e) {
        if ((e.key && e.key !== 'Enter') || !e.target.value.trim()) return;

        e.preventDefault();

        const datetime = e.target.value.trim();
        const input = new Date(datetime);
        const now = new Date();
        const errorMessage = this.#container.querySelector('#error');

        if (input == 'Invalid Date') {
            errorMessage.innerHTML = "*Must be a valid date."
            errorMessage.style.display = "block";
            e.target.value = '';
            return;
        }

        if (input < now) {
            errorMessage.innerHTML = "*Must be a future date and time."
            errorMessage.style.display = "block";
            e.target.value = '';
            return;
        }

        errorMessage.style.display = "none";

        const datetimeList = this.#container.querySelector('#datetime-list');
        const formatted = input.toLocaleString();

        if (this.#datetime) {
            const existing = datetimeList.querySelector('.datetime');
            const label = existing.querySelector('span:not(.remove)');
            label.textContent = formatted;
        }
        else {
            const datetimeItem = document.createElement('div');
            datetimeItem.classList.add('datetime');

            const datetimeLabel = document.createElement('span');
            datetimeLabel.textContent = formatted;

            const removeBtn = document.createElement('span');
            removeBtn.textContent = '✕';
            removeBtn.classList.add('remove');

            datetimeItem.appendChild(removeBtn);
            datetimeItem.appendChild(datetimeLabel);
            datetimeList.appendChild(datetimeItem);
        }

        this.#datetime = datetime;
        e.target.value = '';
    }

    #handleRemoveDateTime(e) {
        if (!e.target.classList.contains('remove')) return;
        const datetimeElement = e.target.parentElement;
        this.#datetime = null;
        datetimeElement.remove();
    }

    #handlePostSubmit(e) {
        e.preventDefault();
        const titleInput = this.#container.querySelector('#post-title');
        const locationInput = this.#container.querySelector('#post-location');
        const bodyInput = this.#container.querySelector('#post-body');
        const tagList = this.#container.querySelector('#tag-list');
        const datetimeList = this.#container.querySelector('#datetime-list');

        const title = titleInput.value.trim();

        if (title === '') {
            titleInput.placeholder = 'Post name required.';
            titleInput.classList.add('input-error');
            titleInput.focus();
            return;
        }

        titleInput.classList.remove('input-error');

        const post = {
            title: titleInput.value.trim(),
            location: locationInput.value.trim(),
            description: bodyInput.value.trim(),
            tags: this.#tags,
            startTime: new Date(this.#datetime),
            timeStamp: new Date(),
            isExpired: false,
            comments: []
        };

        this.#publishPost(post);
        this.#clearInputs(titleInput, locationInput, bodyInput, tagList, datetimeList);
        window.location.href = "/pages/PostBrowsing/index.html"
    }

    #handleCancelPost() { //TODO UPDATE?
        const titleInput = this.#container.querySelector('#post-title');
        const locationInput = this.#container.querySelector('#post-location');
        const bodyInput = this.#container.querySelector('#post-body');
        const tagList = this.#container.querySelector('#tag-list');
        const datetimeList = this.#container.querySelector('#datetime-list');

        this.#clearInputs(titleInput, locationInput, bodyInput, tagList, datetimeList);
        window.location.href = "/pages/PostBrowsing/index.html";
    }

    #publishPost(post) {
        const hub = EventHub.getInstance();
        hub.publish(Events.StorePost, post);
    }

    #clearInputs(titleInput, locationInput, bodyInput, tagList, datetimeList) {
        titleInput.value = '';
        locationInput.value = '';
        bodyInput.value = '';
        tagList.innerHTML = '';
        datetimeList.innerHTML = '';
        this.#tags = [];
        this.#datetime = null;
    }

}