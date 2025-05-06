import { BaseComponent } from "../BaseComponent/BaseComponent.js"
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
 
export class PostBrowsingComponent extends BaseComponent { 
    #container = null; 
    #allPosts = [];

    constructor() {
        super();
        this.loadCSS('PostBrowsingComponent');
    }
 
    async render() {
        document.title = 'Post Feed | Study on Campus';

        this.#container = document.createElement('div');
        this.#container.setAttribute('class', 'posts-container');
        document.querySelector('main').appendChild(this.#container);

        const hub = EventHub.getInstance();
        hub.subscribe(Events.LoadPostsSuccess, (posts) => {
            this.#allPosts = posts;
            console.log(this.#allPosts);
            if (this.#allPosts.length === 0) {
                const msg = document.createElement('p');
                msg.setAttribute('class', "empty");
                msg.textContent = 'No posts to display. Be the first to post!';
                this.#container.appendChild(msg);
            } else {
                this.#renderPosts(this.#allPosts);
            }
        })
        hub.publish(Events.LoadPosts);
        this.#searchQueryListener();
    }

    #openPost(postId) {
        const postUrl = new URL('/pages/PostViewing/index.html', window.location.origin);
        postUrl.searchParams.set('id', postId);
        window.location.href = postUrl.href;
    }

    #searchQueryListener() { 
        document.getElementById("search-bar").addEventListener("input", (search) => {
            this.filterPosts(search.target.value)
        })
    }
    
    #renderPosts(posts) {
        this.#container.innerHTML = '';
        if (posts.length === 0) {
            const msg = document.createElement('p');
            msg.classList.add("empty");
            msg.textContent = "No posts found. ☹ Maybe make a post..?";
            this.#container.appendChild(msg);
        } // else :
        posts.forEach(post => {
            const postView = document.createElement('div');
            postView.classList.add('post', 'can-click');
            postView.setAttribute('id', post.postId);

            postView.addEventListener('click', () => {
                this.#openPost(post.postId)
            });

            const postHalf = document.createElement('div');
            postHalf.classList.add('post-half');
            const title = document.createElement('h2');
            title.classList.add('title');
            title.textContent = post.title;
            const tagContainer = document.createElement('div');
            tagContainer.classList.add('tag-container');

            post.tags.forEach(tagObj => {
                const tag = document.createElement('div');
                tag.classList.add('tag');
                tag.style.backgroundColor = tagObj.color;
                tag.textContent = tagObj.tag;
                tagContainer.append(tag);
            });

            const desc = document.createElement('p');
            desc.classList.add('post-text');
            desc.textContent = post.description;
            postHalf.appendChild(title);
            postHalf.appendChild(tagContainer);
            postHalf.appendChild(desc);
            const location = document.createElement('p');
            location.classList.add('location');
            location.textContent = `${post.location} at ${post.startTime.time}, ${post.startTime.date}`;
            postView.appendChild(postHalf);
            postView.appendChild(location);
            this.#container.appendChild(postView);
        });
    }

    async filterPosts(searchQuery = "") {
        const hub = EventHub.getInstance();
        hub.subscribe(Events.FilterPostsSuccess, (posts) => {
            this.#allPosts = posts;
            this.#renderPosts(this.#allPosts);
        })
        await hub.publish(Events.FilterPosts, searchQuery);
    }
}