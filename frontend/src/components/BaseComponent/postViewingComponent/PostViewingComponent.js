import { BaseComponent } from "../BaseComponent.js"
 
export class PostViewingComponent extends BaseComponent { 
    #container = null;
    #comments = null;
    #service;
    #post;

    constructor(service) {
        super();
        this.#service = service;

    }

    async render(postId) {
        console.log("loading a post with id: " + postId)
        this.#post = await this.#service.loadPost(postId);
        document.title = `${this.#post.title} | Study on Campus`;

        this.#container = document.createElement('div');
        this.#container.setAttribute('class', 'post-container');
        document.querySelector('main').appendChild(this.#container);
        this.#renderPost(); 
        this.#comments = document.createElement('div');
        this.#comments.setAttribute('class', 'comment-container');
        document.querySelector('main').appendChild(this.#comments);
        this.#renderComments();
        this.#goBackListener();
        this.#navBarListeners();
        }

    #navBarListeners() {
        document.getElementById("app-logo").addEventListener('click', () => {
            window.location.href = "http://127.0.0.1:5500/src/pages/PostBrowsing/index.html"
        });
        document.getElementById("location-browsing").addEventListener('click', () => {
            window.location.href = "http://127.0.0.1:5500/src/pages/LocationBrowsing/index.html"
        });
        document.getElementById("make-post").addEventListener('click', () => {
            window.location.href = "http://127.0.0.1:5500/src/pages/PostCreation/index.html"
        });
    }

    #goBackListener() {
        document.getElementById("go-back").addEventListener('click', () => {
            window.location.href = "http://127.0.0.1:5500/src/pages/PostBrowsing/index.html"
        })
    }

    #renderPost() { // next milestone, post.StartTime will change to an object
        this.#container.innerHTML = `
    <div class="user-post-info">
        <div class="info-subgroup user">
            <span class="post-user can-click"><b>${this.#post.name}</b></span>
            <p>(${this.#post.pronouns})</p>
        </div>
        <div class="info-subgroup date">
            <p>${this.#post.timeStamp.time}</p>
            <p>${this.#post.timeStamp.date}</p>
        </div>
    </div>

    <div class="post-content">
        <h1 class="title"><b>${this.#post.title}</b></h1>
        <div class="tag-container"></div>
        <span class="time data"><b>Starts At: </b>${this.#post.startTime.time}, ${this.#post.startTime.date}</span>
        <span class="location data"><b>Location: </b>${this.#post.location}</span>
        <p class="post-desc">${this.#post.description}</p>
    </div>
`;
        const tagContainer = this.#container.querySelector(".tag-container");
        this.#post.tags.forEach(tag => {
            const newTag = document.createElement('div');
            newTag.classList.add("tag");
            newTag.style.backgroundColor = tag.color;
            newTag.textContent = tag.tag;
            tagContainer.appendChild(newTag);
        });
    }

    #renderComments() {
        this.#comments.innerHTML = '';
        this.#post.postComments.forEach(comment => {
            const c = document.createElement("div");
            c.classList.add("comment");
            this.#comments.appendChild(c);
            const cInfo = document.createElement("div");
            cInfo.classList.add("commenter-info");
            c.appendChild(cInfo);
            const cIcon = document.createElement("div");
            cIcon.classList.add("commenter-icon");
            cInfo.appendChild(cIcon);
            const iconContent = document.createElement("span");
            iconContent.textContent = comment.iconContent;
            cIcon.appendChild(iconContent);
            const cData = document.createElement('div');
            cInfo.appendChild(cData);
            cData.classList.add("comment-data");
            const user = document.createElement("span");
            const pro = document.createElement("span");
            const timeCommented = document.createElement("span");
            cInfo.appendChild(user);
            cInfo.appendChild(pro);
            cInfo.appendChild(timeCommented);
            user.classList.add("comment-user", "can-click");
            user.textContent = `${comment.name}`;
            pro.style.color = "#745faa";
            timeCommented.style.color = "#745faa";
            pro.textContent = `(${comment.pronouns})`;
            timeCommented.textContent = `${comment.timeStamp.time}, ${comment.timeStamp.date}`

            const textArea = document.createElement("div");
            const text = document.createElement("p");
            text.textContent = comment.message;
            textArea.appendChild(text);
            c.appendChild(textArea);
            textArea.classList.add("comment-text");
        })
        const commentBox = document.createElement('div');
        this.#comments.appendChild(commentBox);
        commentBox.classList.add("comment", "add-comment");
        const box = document.createElement("textarea");
        box.classList.add("comment-box");
        box.setAttribute("id", "comment-textbox")
        box.placeholder = "Leave a Comment...";
        box.rows = 4;
        box.maxLength = 400;
        commentBox.appendChild(box);
        const submitC = document.createElement("input");
        submitC.classList.add("comment-add", "can-click");
        submitC.type = "button";
        submitC.value = "add comment";
        commentBox.appendChild(submitC);
        submitC.addEventListener("click", async () => {
            if (box.value.length > 0) {
                const newComment = {
                    userId: "1111111",
                    name: "You",
                    message: box.value,
                    timeStamp: {time: "6:47 P.M.", date: "9/26/2026"},
                    iconContent: ":Y",
                    iconBgColor: "#5ad8cc",
                    pronouns: "they/them"
                }
                this.#post.postComments.push(newComment);
                this.#service.updatePost(this.#post.postId, newComment)
                this.#renderComments();
                box.textContent = '';
            }
        })
    }
}