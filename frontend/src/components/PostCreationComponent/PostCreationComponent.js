import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import { IndexedDB } from '../../utility/indexeddb.js';
 
export class PostCreationComponent extends BaseComponent { 
    #container = null; // init component container element
    #tags = [];

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
                    <button type="button" id="add-tags-btn">Open Tag Menu</button>
                    <div class="post-buttons">
                        <button type="button" id="submit-cancel">Cancel</button>
                        <input type="submit" id="submit-post" value="Post">
                    </div>
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

    #handlePostSubmit(e) {
        e.preventDefault();
        const titleInput = this.#container.querySelector('#post-title');
        const locationInput = this.#container.querySelector('#post-location');
        const bodyInput = this.#container.querySelector('#post-body');
        const tagList = this.#container.querySelector('#tag-list');

        const title = titleInput.value.trim();

        if (title === '') {
            titleInput.placeholder = 'Post name required.';
            titleInput.classList.add('input-error');
            titleInput.focus();
            return;
        }

        titleInput.classList.remove('input-error');

        const post = {
            title,
            location: locationInput.value.trim(),
            body: bodyInput.value.trim(),
            tags: this.#tags,
            createdAt: new Date()
        };

        IndexedDB.savePost(post).then((post) => {
            this.#publishPost(post);
            this.#clearInputs(titleInput, locationInput, bodyInput, tagList);
            window.location.href = "/frontend/src/pages/PostBrowsing/index.html";
        });
    }

    #handleCancelPost() {
        window.location.href = "/frontend/src/pages/PostBrowsing/index.html";
    }

    #handleAddTag(e) {
        if (e.key !== 'Enter' || e.target.value.trim() === '') return;
        
        e.preventDefault();
        const tagText = e.target.value.trim();
        const tagList = this.#container.querySelector('#tag-list');

        const tag = document.createElement('div');
        tag.classList.add('tag');

        const tagLabel = document.createElement('span');
        tagLabel.textContent = tagText;

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '✕';
        removeBtn.classList.add('remove-tag');

        tag.appendChild(removeBtn);
        tag.appendChild(tagLabel);
        tagList.appendChild(tag);

        this.#tags.push(tagText);
        e.target.value = '';
    }

    #handleRemoveTag(e) {
        if (!e.target.classList.contains('remove-tag')) return;

        const tag = e.target.parentElement;
        const tagText = tag.querySelector('span').textContent;
        const index = this.#tags.indexOf(tagText);
        if (index !== -1) this.#tags.splice(index, 1);
        tag.remove();
    }

    #publishPost(post) {
        const hub = EventHub.getInstance();
        hub.publish(Events.NewPost, { post });
        hub.publish(Events.StorePost, { post });
    }

    #clearInputs(titleInput, locationInput, bodyInput, tagList) {
        titleInput.value = '';
        locationInput.value = '';
        bodyInput.value = '';
        tagList.innerHTML = '';
        this.#tags = [];
    }

}