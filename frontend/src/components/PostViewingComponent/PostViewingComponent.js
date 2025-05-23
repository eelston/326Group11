import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class PostViewingComponent extends BaseComponent { 
    #container = null;
    #comments = null;
    #post;

    constructor() {
        super();
        this.loadCSS("PostViewingComponent");
    }
 
    async render(postId) {
        console.log("loading a post with id: " + postId)
        const hub = EventHub.getInstance();
        hub.subscribe(Events.LoadPostSuccess, async (post) => {
            this.#post = post;
            document.title = `${this.#post.title} | Study on Campus`;
            console.log(this.#post);

            this.#container = document.createElement('div');
            this.#container.setAttribute('class', 'post-container');
            document.querySelector('main').appendChild(this.#container);
            await this.#renderPost(); 
            this.#comments = document.createElement('div');
            this.#comments.setAttribute('class', 'comment-container');
            document.querySelector('main').appendChild(this.#comments);
            this.#renderComments();
            this.#goBackListener();
            this.#postSettingsDropdownListener();
            this.#deleteButtonListener();
        });
        hub.publish(Events.LoadPost, postId);
    }

    #goBackListener() {
        document.getElementById("go-back").addEventListener('click', () => {
            window.location.href = "/pages/PostBrowsing/index.html"
        })
    }

    #deleteButtonListener() {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.addEventListener('click', async () => {
            if (confirm("Are you sure you want to delete your post? This action CANNOT be undone.")) {
                const hub = EventHub.getInstance();
                hub.subscribe(Events.UnStorePostSuccess, () => {
                    window.location.href = "/pages/PostBrowsing/index.html";
                })
                hub.publish(Events.UnStorePost, this.#post.postId);
            }
            const settingsMenu = document.getElementsByClassName('settings-dropdown')[0];
            settingsMenu.style.display = 'none';
        })
    }

    #postSettingsDropdownListener() {
        const settingsMenu = document.getElementsByClassName('settings-dropdown')[0];
        const ddButton = document.getElementById('post-settings');
        ddButton.addEventListener('click', () => {
            if (settingsMenu.style.display === 'none') {
                settingsMenu.style.display = 'block';
            } else {
                settingsMenu.style.display = 'none';
            }
        });
        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && !ddButton.contains(e.target)) {
                settingsMenu.style.display = 'none';
            }
        })
    }

    async #renderPost() { 
        const posted = this.#createTimeObj(this.#post.createdAt);
        const start = this.#createTimeObj(this.#post.startTime);
        const tmrw = this.#isEventTmrw(start);
        const userData = await this.#getUserData(this.#post.userId);
        this.#container.innerHTML = `
    <div class="user-post-info">
        <div class="info-subgroup user">
            <span class="post-user can-click"><b>${userData.user.name}</b></span>
            <p>(${userData.user.pronouns})</p>
        </div>
        <div class="info-subgroup date">
            <p>${posted.time}</p>
            <p>${posted.date}</p>
        </div>
        <div class="info-subgroup settings-container">
            <span id="post-settings" class="can-click"><b>…</b></span>
            <div class = "settings-dropdown">
                <span id = "deleteButton" class = "dd-settings-content can-click">Delete Post</span>
            </div>
        </div>
    </div>

    <div class="post-content">
        <h1 class="title"><b>${this.#post.title}</b></h1>
        <div class="tag-container"></div>
        <span class="time data"><b>Starts At: </b>${start.time}, ${tmrw}</span>
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
        this.#post.postComments.forEach(async comment => {
            const c = document.createElement("div");
            c.classList.add("comment");
            this.#comments.appendChild(c);
            const cInfo = document.createElement("div");
            cInfo.classList.add("commenter-info");
            c.appendChild(cInfo);
            const cIcon = document.createElement("div");
            cIcon.classList.add("commenter-icon");
            cIcon.style.backgroundColor = comment.color;
            cInfo.appendChild(cIcon);
            const iconContent = document.createElement("span");
            const userData = await this.#getUserData(comment.userId);
            console.log("Post user's data below")
            console.log(userData);
            iconContent.textContent = userData.user.iconContent;
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
            user.textContent = `${userData.user.name}`;
            pro.style.color = "#745faa";
            timeCommented.style.color = "#745faa";
            pro.textContent = `(${userData.user.pronouns})`;
            const timeFormat = this.#createTimeObj(comment.createdAt);
            timeCommented.textContent = `${timeFormat.time}, ${timeFormat.date}`;

            const settings = document.createElement("div");
            cInfo.appendChild(settings);
            settings.classList.add("c-settings-container");
            const dots = document.createElement("span");
            dots.classList.add("comment-settings", "can-click");
            dots.innerHTML="…";
            settings.appendChild(dots);

            const comSetDD = document.createElement("div");
            comSetDD.classList.add("comment-dropdown");
            const delButton = document.createElement("span");
            delButton.classList.add("commentDeleteButton");
            delButton.classList.add("can-click");
            delButton.innerHTML = "Delete";
            comSetDD.appendChild(delButton);
            dots.appendChild(comSetDD);
            comSetDD.style.display = 'none';
            
            dots.addEventListener('click', () => {
                if (comSetDD.style.display === 'none') {
                    comSetDD.style.display = 'block';
                } else {
                    comSetDD.style.display = 'none';
                }
            });
            delButton.id = `commentId${comment.commentId}`
            this.#deleteCommentListener(comment.commentId);

            const textArea = document.createElement("div");
            const text = document.createElement("p");
            text.textContent = comment.message;
            textArea.appendChild(text);
            c.appendChild(textArea);
            textArea.classList.add("comment-text");
        })

        const commentBox = document.createElement('div');
        if (this.#post.postComments.length === 0) {
            const talk = document.createElement("p");
            talk.style.marginBottom = '15px';
            talk.style.textAlign = 'center';
            talk.innerHTML = "No comments yet. Be the first to comment!"
            commentBox.appendChild(talk);
        }
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
        submitC.addEventListener("click", () => {
            if (box.value.length > 0) {
                const newComment = {
                    postId: this.#post.postId,
                    userId: "User3", // AUTH NEEDED IN THE FUTURE - julia
                    message: box.value,
                    color: this.#randomColor(),
                }
                this.#post.postComments.push(newComment);
                const hub = EventHub.getInstance();
                hub.subscribe(Events.UpdatePostSuccess, (postUpdated) => {
                    this.#post = postUpdated;
                    this.#renderComments();
                    box.textContent = '';
                });
                hub.publish(Events.UpdatePost, this.#post);
            }
        })
    }
    #createTimeObj(timeStamp) {
        const time = new Date(timeStamp);
        const hours = String(time.getHours()).padStart(2, '0');
        const mins = String(time.getMinutes()).padStart(2, '0');
        const month = time.getMonth();
        const day = time.getDate();
        const year = time.getFullYear();
        if (year < new Date().getFullYear()) {
            return {time: `${hours}:${mins}`, date:`TBD`};
        } else {
            return {time: `${hours}:${mins}`, date:`${month}/${day}/${year}`};
        }
    }

    #isEventTmrw(timeObj) {
        if (timeObj.date === "TBD") {
            return "TBD"
        }
        const [month, day, year] = timeObj.date.split("/").map(num => parseInt(num));
        const userTime = new Date(Date.now());
        const currTime = [userTime.getMonth(), userTime.getDate(), userTime.getFullYear()];
        if (year === currTime[2] && month === currTime[0] && (day - currTime[1] === 1)) {
            return "Tomorrow"
        }
        return timeObj.date;
    }

    #deleteCommentListener(commentId) {
        const deleteButton = document.getElementById(`commentId${commentId}`)
            deleteButton.addEventListener('click', async () => {
                if (confirm("Are you sure you want to delete your comment? This action CANNOT be undone.")) {
                    const index = this.#post.postComments.findIndex(c => c.commentId === commentId);
                    this.#post.postComments.splice(index, 1);
                    const hub = EventHub.getInstance();
                    hub.subscribe(Events.UpdatePostSuccess, (updatedPost) => {
                        this.#post = updatedPost;
                        const comment = document.getElementById(`commentId${commentId}`);
                        if (comment) { 
                            comment.remove(); 
                            this.#renderComments();
                        }
                    });
                    hub.publish(Events.UpdatePost, this.#post);
                }
            })
    }

    #getUserData(userId) {
        const hub = EventHub.getInstance();
        return new Promise((resolve, reject) => {
            const returnData = (user) => {
                resolve(user);
            }
            const failure = (error) => {
                reject(new Error("Failed to fetch user data"));
            }
            hub.subscribe(Events.LoadUserDataSuccess, returnData);
            hub.subscribe(Events.LoadUserDataFailure, failure)
            hub.publish(Events.LoadUserData, userId);
        })
    }

    #randomColor() { // Function for random colors 
        const colors = ["#5ad8cc", "#62e366", "#f0ed69", "#ffb963", "#ff8175", "#e6e6e6"];
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }
}