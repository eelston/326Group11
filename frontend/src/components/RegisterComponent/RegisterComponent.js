import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export class RegisterComponent extends BaseComponent { 
    #container = null;
    #isLoginMode = true;

    constructor() {
        super();
        this.loadCSS("RegisterComponent");
    }

    render() {
        this.#createContainer();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement("div");
        this.#container.classList.add('page');
        this.#updateForm();
    }

    #updateForm() {
        this.#container.innerHTML = this.#getTemplate();
        this.#setFormTitle();
        this.#attachEventListeners();
    }

    #setFormTitle() {
        const title = this.#container.querySelector("#form-title");
        title.textContent = this.#isLoginMode ? "Log In" : "Sign Up";
    }

    #getTemplate() {
        const prefix = this.#isLoginMode ? "log-in" : "sign-up";
        const submitLabel = this.#isLoginMode ? "Log In" : "Sign Up";
        const toggleText = this.#isLoginMode
            ? "New User? Sign Up Here!"
            : "Have an account? Log In Here!";

        const userIdInput = !this.#isLoginMode
        ? `
            <div class="userid">
                <label for="userid">Username:</label>
                <input type="text" id="userid" autocomplete="off" required>
                <span class="userid-error-message" style="color:red;display:none">*Username is required.</span>
            </div>
            `
        : "";

        return `
            <div id="register-container">
            <h1 id="form-title" class="form-title"></h1>
            <form id="${prefix}-form">
                ${userIdInput}
                <div class="email">
                    <label for="email">Email:</label>
                        <input type="text" id="email" autocomplete="off" required>
                    <span class="email-error-message" style="color:red;display:none">*Must be a valid email.</span>
                </div>
                <div class="password">
                    <label for="password">Password:</label>
                        <input type="password" id="password" autocomplete="off" required>
                    <span class="password-error-message" style="color:red;display:none">*Password must be at least 8 characters.</span>
                </div>
                <div class="buttons">
                    <span class="enter-error-message" style="color:red;display:none"></span>
                    <input type="submit" id=submit value="${submitLabel}">
                    <button type="button" id="toggle-form">${toggleText}</button>
                </div>
            </form>
            </div>
        `;
    }

    #attachEventListeners() {
        this.#attachToggleFormListener();
        this.#attachEmailListener();
        this.#attachPasswordListener();
        if (!this.#isLoginMode) {
            this.#attachUserIdListener();
        }
        this.#attachFormSubmitListener();
    }

    #attachToggleFormListener() {
        const toggleFormButton = this.#container.querySelector("#toggle-form");
        toggleFormButton.addEventListener("click", (e) => this.#toggleFormState(e));
    }

    #attachEmailListener() {
        const emailInput = this.#container.querySelector("#email");
        emailInput.addEventListener("input", () => this.#showErrorMessage(emailInput, "email-error-message", 1));
    }

    #attachPasswordListener() {
        const passwordInput = this.#container.querySelector("#password");
        passwordInput.addEventListener("input", () => this.#showErrorMessage(passwordInput, "password-error-message", 2));
    }

    #attachUserIdListener() {
        const userIdInput = this.#container.querySelector("#userid");
        if (userIdInput) {
            userIdInput.addEventListener("input", () => this.#showErrorMessage(userIdInput, "userid-error-message", 3));
        }
    }

    #attachFormSubmitListener() {
        const submitButton = this.#container.querySelector("#submit");
        submitButton.addEventListener("submit", (e) => this.#handleFormSubmit(e));
    }

    #toggleFormState(e) {
        e.preventDefault();
        this.#isLoginMode = !this.#isLoginMode;
        this.#updateForm();
    }

    #showErrorMessage(inputElement, messageClass, box) {
        const messageElement = inputElement.parentNode.querySelector(`.${messageClass}`);
        if (box == 1) {
            messageElement.style.display = this.#validateEmail(inputElement.value) ? "none" : "block";
        } else if (box == 2){
            messageElement.style.display = inputElement.value.length >= 8 ? "none" : "block";
        }
        else {
            messageElement.style.display = inputElement.value == "" ? "block" : "none";
        }
    }

    #validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
        return emailRegex.test(email);
    }

    #handleFormSubmit(e) {
        e.preventDefault();

        const emailInput = this.#container.querySelector("#email");
        const passwordInput = this.#container.querySelector("#password");
        const userIdInput = this.#container.querySelector("#userid");

        const emailValid = this.#validateEmail(emailInput.value);
        const passwordValid = passwordInput.value.length >= 8;
        const userIdValid = this.#isLoginMode ? true : userIdInput && userIdInput.value.trim() !== "";

        this.#showErrorMessage(emailInput, "email-error-message", 1);
        this.#showErrorMessage(passwordInput, "password-error-message", 2);
        if (!this.#isLoginMode) {
            this.#showErrorMessage(userIdInput, "userid-error-message", 3);
        }

        if (!emailValid || !passwordValid || !userIdValid) return;

        const payload = {
            email: emailInput.value,
            password: passwordInput.value
        };
    
        if (!this.#isLoginMode) {
            payload.userId = userIdInput.value.trim();
        }

    }
}