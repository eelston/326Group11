import { BaseComponent } from "../BaseComponent.js"
 
export class PostBrowsingComponent extends BaseComponent { 
    #container = null;
    #service;

    constructor(postService) {
        console.log("loading a post!")
        super();
        this.#service = postService;

    }

    render() {
        //todo
    }
}