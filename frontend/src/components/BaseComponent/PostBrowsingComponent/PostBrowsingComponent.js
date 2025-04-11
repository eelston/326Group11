import { BaseComponent } from "../BaseComponent.js"
 
export class PostBrowsingComponent extends BaseComponent { 
    #container = null; 
    #service;
    #allPosts = [];

    constructor(service) {
        console.log("Loading all Posts...");
        super();
        this.#service = service;
    }

    async render() {
        console.log("Creating new feed");
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
        return this.#container
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
            console.log(post)
            const postView = document.createElement('div');
            postView.classList.add('post', 'can-click');
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
            location.textContent = `${post.location} at ${post.startTime}`;
            postView.appendChild(postHalf);
            postView.appendChild(location);
            this.#container.appendChild(postView);
        });
    }

    filterPosts(searchQuery) {
       const filteredPosts = this.#allPosts.filter(post => {
        const sQLower = searchQuery.toLowerCase();
        return (post.title.toLowerCase().includes(sQLower) || 
        post.description.toLowerCase().includes(sQLower) || 
        post.tags.some(tag => tag.tag.toLowerCase().includes(sQLower)) || 
        post.location.toLowerCase().includes(sQLower)); 
       }); //next milestone will use isExpired as well to check if post is too old.

       this.#renderPosts(filteredPosts);
       }
}