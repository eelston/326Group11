import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class PreferencesComponent extends HTMLElement {
    #base;
    
    constructor() {
        super();
        this.#base = new BaseComponent();
        this.settingsService = null;
    }

    connectedCallback() {
        this.#base.loadCSS('PreferencesComponent');
        this.innerHTML = this.render();
        this.setupEventListeners();
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    setPreferences(preferences = {}) {
        const checkboxes = this.querySelectorAll('input[type="checkbox"]');
        if (checkboxes[0]) checkboxes[0].checked = preferences.displayMajor || false;
        if (checkboxes[1]) checkboxes[1].checked = preferences.displayPronouns || false;
        if (checkboxes[2]) checkboxes[2].checked = preferences.emailNotifications || false;
    }

    render() {
        return `
            <section class="preferences-section">
                <label>Display major on posts <input type="checkbox" /></label>
                <label>Display pronouns on posts <input type="checkbox" /></label>
                <label>Receive email notifications <input type="checkbox" /></label>
                <button class="save-btn">Save changes</button>
            </section>
        `;
    }

    setupEventListeners() {
        const saveButton = this.querySelector('.save-btn');
        
        saveButton?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            try {
                const checkboxes = this.querySelectorAll('input[type="checkbox"]');
                const preferences = {
                    displayMajor: checkboxes[0].checked,
                    displayPronouns: checkboxes[1].checked,
                    emailNotifications: checkboxes[2].checked,
                    userId: this.settingsService.userId
                };

                await this.settingsService.savePreferences(preferences);
                this.dispatchEvent(new CustomEvent('settings-success', {
                    detail: 'Preferences saved successfully'
                }));
                this.dispatchEvent(new CustomEvent('settings-updated'));
            } catch (error) {
                this.dispatchEvent(new CustomEvent('settings-error', {
                    detail: 'Failed to save preferences'
                }));
            }
        });
    }
}

customElements.define('preferences-component', PreferencesComponent);
