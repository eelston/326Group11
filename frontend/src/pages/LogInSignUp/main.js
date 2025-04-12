import { Events } from '../../eventhub/LoginEvents.js';
import { EventHub } from '../../eventhub/EventHub.js';
import { UserAuthenticationService} from '../../services/UserAuthenticationService.js';

document.addEventListener("DOMContentLoaded", () => {
    
    const eventHub = EventHub.getInstance();
    const authService = new UserAuthenticationService();

    //subscriptions

    //successful login
    eventHub.subscribe(Events.LOGIN_SUCCESS, (user) => {
        window.location.href = "/frontend/src/pages/PostBrowsing/index.html";
    });

    //unsuccessful login (incorrect email/password)
    eventHub.subscribe(Events.LOGIN_FAILURE, (error) => {
        const errorSpan = document.querySelector("#log-in .enter-error-message");
        if (errorSpan) {
            errorSpan.textContent = error.message;
            errorSpan.style.display = "block";
        }
    });

    //successful signup
    eventHub.subscribe(Events.SIGNUP_SUCCESS, (user) => {
        window.location.href = "/frontend/src/pages/UserProfile/index.html";
    });

    //unsuccessful signup (duplicate email)
    eventHub.subscribe(Events.SIGNUP_FAILURE, (error) => {
        const errorSpan = document.querySelector("#sign-up .enter-error-message");
        if (errorSpan) {
            errorSpan.textContent = error.message;
            errorSpan.style.display = "block";
        }
    });

    eventHub.subscribe(Events.USER_LOGIN, (credentials) => {
        authService.handleLogin(credentials);
    });

    eventHub.subscribe(Events.USER_SIGNUP, (userData) => {
        authService.handleSignup(userData);
    });


    //multi-view functionality
    function navigate(viewId){
        document.querySelectorAll(".view").forEach((view) => {
            view.style.display = "none";
        });
        document.getElementById(viewId).style.display = "block";
        clearInputFields(viewId);
    }

    //clears inputs and error messages when switching between pages
    function clearInputFields(viewId){
        const emailInput = document.querySelector(`#${viewId} input[type="text"]`);
        const passwordInput = document.querySelector(`#${viewId} input[type="password"]`);
        const emailErrorSpan = document.querySelector(`#${viewId} .email-error-message`);
        const passwordErrorSpan = document.querySelector(`#${viewId} .password-error-message`);
        const enterErrorSpan = document.querySelector(`#${viewId} .enter-error-message`);

        if (emailInput) emailInput.value = "";
        if (passwordInput) passwordInput.value = "";
        if (emailErrorSpan) emailErrorSpan.style.display = "none";
        if (passwordErrorSpan) passwordErrorSpan.style.display = "none";
        if (enterErrorSpan) enterErrorSpan.style.display = "none";
    }

    //event-handlers to switch between login and signup pages
    document.getElementById("new-user").addEventListener("click", (e) => {
        e.preventDefault();
        navigate("signup");
    });

    document.getElementById("old-user").addEventListener("click", (e) => {
        e.preventDefault();
        navigate("login")
    });

    navigate("login");

    //validating email format
    function validateEmail(email){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
        return emailRegex.test(email);
    }

    //show invalid email/password messages
    function showMessage(inputElement, messageClass, isEmail){
        const messageElement = inputElement.parentNode.querySelector(`.${messageClass}`);
        if (isEmail){
            messageElement.style.display = validateEmail(inputElement.value) ? "none" : "block";
        }
        else {
            messageElement.style.display = inputElement.value.length >= 8 ? "none" : "block";
        }
    }

    //handling form input
    function handleForm(formId, emailId, emailMessage, passwordId, passwordMessage, redirectUrl){
        const emailInput = document.getElementById(emailId);
        const passwordInput = document.getElementById(passwordId);
        const form = document.getElementById(formId);

        emailInput.addEventListener("input", () => showMessage(emailInput, emailMessage, true));
        passwordInput.addEventListener("input", () => showMessage(passwordInput, passwordMessage, false));

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const emailValid = validateEmail(emailInput.value);
            const passwordValid = passwordInput.value.length >= 8;

            if (!emailValid || !passwordValid) return;

            const payload = {
                email: emailInput.value,
                password: passwordInput.value
            };

            if (formId === "log-in") {
                eventHub.publish("USER_LOGIN", payload);
            } else {
                eventHub.publish("USER_SIGNUP", payload);
            }
        });
    }

    handleForm("log-in", "log-in-email", "email-error-message", "log-in-password", "password-error-message", "../PostBrowsing/index.html");
    handleForm("sign-up", "sign-up-email", "email-error-message", "sign-up-password", "password-error-message", "../UserProfile/index.html");

});