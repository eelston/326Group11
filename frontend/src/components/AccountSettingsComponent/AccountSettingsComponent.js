import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class AccountSettingsComponent extends HTMLElement {
    #base;
    
    constructor() {
        super();
        this.#base = new BaseComponent();
        this.settingsService = null;
    }

    connectedCallback() {
        this.#base.loadCSS('AccountSettingsComponent');
        this.innerHTML = this.render();
        this.setupEventListeners();
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    render() {
        return `
            <section class="account-section">
                <label>User ID <input type="user_id" placeholder="user_id" disabled /></label>
                <label>Email <input type="email" placeholder="email address" disabled /><button class="edit-btn">Edit</button></label>
                <label>Password <input type="password" id="password-input" value="123456789" disabled /><button class="edit-btn">Edit</button></label>
                <div class="show-password-container">
                    <input type="checkbox" id="show-password-checkbox">
                    <small>Show Password</small>
                </div>
                <button class="save-btn">Save changes</button>
            </section>
        `;
    }

    setupEventListeners() {
        const editButtons = this.querySelectorAll('.edit-btn');
        const showPasswordCheckbox = this.querySelector('#show-password-checkbox');
        const passwordInput = this.querySelector('#password-input');
        const saveButton = this.querySelector('.save-btn');
        const emailInput = this.querySelector('input[type="email"]');
        const userIdInput = this.querySelector('input[type="user_id"]');

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

customElements.define('account-settings-component', AccountSettingsComponent);
