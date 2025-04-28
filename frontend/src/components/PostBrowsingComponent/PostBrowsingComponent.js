import { BaseComponent } from "../BaseComponent/BaseComponent.js"
 
export class PostBrowsingComponent extends BaseComponent { 
    #container = null; 
    #service;
    #allPosts = [];

    constructor(service) {
        super();
        this.loadCSS('PostBrowsingComponent');
        this.#service = service;
    }
 
    async render() {
        document.title = 'Post Feed | Study on Campus';

        this.#container = document.createElement('div');
        this.#container.setAttribute('class', 'posts-container');
        document.querySelector('main').appendChild(this.#container);

        this.#allPosts = await this.#service.loadAllPosts();
        if (this.#allPosts.length === 0) {
            const msg = document.createElement('p');
            msg.setAttribute('class', "empty");
            msg.textContent = 'No posts to display. Be the first to post!';
            this.#container.appendChild(msg);
        } else {
            this.#renderPosts(this.#allPosts);
        }
        this.#searchQueryListener();
        this.#navBarListeners();
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

    #navBarListeners() {
        document.getElementById("app-logo").addEventListener('click', () => {
            window.location.href = "/pages/PostBrowsing/index.html"
        });
        document.getElementById("location-browsing").addEventListener('click', () => {
            window.location.href = "/pages/LocationBrowsing/index.html"
        });
        document.getElementById("make-post").addEventListener('click', () => {
            window.location.href = "/pages/PostCreation/index.html"
        });
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
        const posts = await this.#service.filterPosts(searchQuery);
        this.#renderPosts(posts);

    }

}