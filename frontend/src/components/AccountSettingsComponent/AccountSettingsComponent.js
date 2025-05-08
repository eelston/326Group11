import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class AccountSettingsComponent extends BaseComponent {
    #container = null;

    #eventTarget = new EventTarget();
    
    constructor() {
        super();
        Object.defineProperties(this, {
            addEventListener: {
                value: this.#eventTarget.addEventListener.bind(this.#eventTarget)
            },
            removeEventListener: {
                value: this.#eventTarget.removeEventListener.bind(this.#eventTarget)
            },
            dispatchEvent: {
                value: this.#eventTarget.dispatchEvent.bind(this.#eventTarget)
            }
        });
        this.settingsService = null;
        this.loadCSS('AccountSettingsComponent');
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#container = document.createElement('section');
        this.#container.classList.add('account-section');

        const userIdGroup = document.createElement('div');
        userIdGroup.classList.add('input-group');
        
        const userIdLabel = document.createElement('label');
        userIdLabel.classList.add('field-label');
        userIdLabel.textContent = 'User ID';

        const userIdInput = document.createElement('input');
        userIdInput.type = 'user_id';
        userIdInput.placeholder = 'user_id';
        userIdInput.disabled = true;

        userIdGroup.appendChild(userIdLabel);
        userIdGroup.appendChild(userIdInput);
        this.#container.appendChild(userIdGroup);

        const emailGroup = document.createElement('div');
        emailGroup.classList.add('input-group');

        const emailLabel = document.createElement('label');
        emailLabel.classList.add('field-label');
        emailLabel.textContent = 'Email';

        const emailContainer = document.createElement('div');
        emailContainer.classList.add('input-with-button');

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.placeholder = 'email address';
        emailInput.disabled = true;

        const emailEditBtn = document.createElement('button');
        emailEditBtn.classList.add('edit-btn');
        emailEditBtn.textContent = 'Edit';

        emailContainer.appendChild(emailInput);
        emailContainer.appendChild(emailEditBtn);
        emailGroup.appendChild(emailLabel);
        emailGroup.appendChild(emailContainer);
        this.#container.appendChild(emailGroup);

        const passwordGroup = document.createElement('div');
        passwordGroup.classList.add('input-group');

        const passwordLabel = document.createElement('label');
        passwordLabel.classList.add('field-label');
        passwordLabel.textContent = 'Password';

        const passwordContainer = document.createElement('div');
        passwordContainer.classList.add('input-with-button');

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password-input';
        passwordInput.value = '123456789';
        passwordInput.disabled = true;

        const passwordEditBtn = document.createElement('button');
        passwordEditBtn.classList.add('edit-btn');
        passwordEditBtn.textContent = 'Edit';

        const showPasswordContainer = document.createElement('div');
        showPasswordContainer.classList.add('show-password-container');

        const showPasswordCheckbox = document.createElement('input');
        showPasswordCheckbox.type = 'checkbox';
        showPasswordCheckbox.id = 'show-password-checkbox';

        const showPasswordLabel = document.createElement('small');
        showPasswordLabel.textContent = 'Show Password';

        showPasswordContainer.appendChild(showPasswordCheckbox);
        showPasswordContainer.appendChild(showPasswordLabel);

        passwordContainer.appendChild(passwordInput);
        passwordContainer.appendChild(passwordEditBtn);
        passwordGroup.appendChild(passwordLabel);
        passwordGroup.appendChild(passwordContainer);
        passwordGroup.appendChild(showPasswordContainer);
        this.#container.appendChild(passwordGroup);

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-btn');
        saveButton.textContent = 'Save changes';
        this.#container.appendChild(saveButton);

        this.setupEventListeners();
        return this.#container;
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    setAccount(account) {
        if (!account) return;
        
        const emailInput = this.#container.querySelector('input[type="email"]');
        const userIdInput = this.#container.querySelector('input[type="user_id"]');
        
        if (emailInput) emailInput.value = account.email;
        if (userIdInput) userIdInput.value = account.userId;
    }

    setupEventListeners() {
        const editButtons = this.#container.querySelectorAll('.edit-btn');
        const showPasswordCheckbox = this.#container.querySelector('#show-password-checkbox');
        const passwordInput = this.#container.querySelector('#password-input');
        const saveButton = this.#container.querySelector('.save-btn');
        const emailInput = this.#container.querySelector('input[type="email"]');
        const userIdInput = this.#container.querySelector('input[type="user_id"]');

        if (this.settingsService) {
            userIdInput.value = this.settingsService.userId;
        }

        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('input');
                input.disabled = !input.disabled;
                if (!input.disabled) {
                    input.focus();
                }
            });
        });

        showPasswordCheckbox?.addEventListener('change', (e) => {
            passwordInput.type = e.target.checked ? 'text' : 'password';
        });

        saveButton?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            try {
                const accountData = {
                    email: emailInput.value,
                    password: passwordInput.value,
                    userId: this.settingsService.userId
                };
                await this.settingsService.saveAccount(accountData);
                
                emailInput.disabled = true;
                passwordInput.disabled = true;
                
                this.dispatchEvent(new CustomEvent('settings-updated'));
            } catch (error) {
                this.dispatchEvent(new CustomEvent('settings-error', {
                    detail: 'Failed to save account changes'
                }));
            }
        });
    }
}
