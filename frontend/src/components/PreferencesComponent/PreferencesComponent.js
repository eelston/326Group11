import { BaseComponent } from '../BaseComponent/BaseComponent.js';

export class PreferencesComponent extends BaseComponent {
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
        this.loadCSS('PreferencesComponent');
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#container = document.createElement('section');
        this.#container.classList.add('preferences-section');

        const majorGroup = this.#createPreferenceGroup('Display Major');
        this.#container.appendChild(majorGroup);

        const pronounsGroup = this.#createPreferenceGroup('Display Pronouns');
        this.#container.appendChild(pronounsGroup);

        const emailGroup = this.#createPreferenceGroup('Email Notifications');
        this.#container.appendChild(emailGroup);

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-btn');
        saveButton.textContent = 'Save changes';
        this.#container.appendChild(saveButton);

        this.setupEventListeners();
        return this.#container;
    }

    #createPreferenceGroup(label) {
        const group = document.createElement('div');
        group.classList.add('input-group');

        const checkboxGroup = document.createElement('div');
        checkboxGroup.classList.add('checkbox-group');

        const labelElement = document.createElement('label');
        labelElement.classList.add('field-label');
        labelElement.textContent = label;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkboxGroup.appendChild(labelElement);
        checkboxGroup.appendChild(checkbox);
        group.appendChild(checkboxGroup);

        return group;
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    setPreferences(preferences = {}) {
        const checkboxes = this.#container.querySelectorAll('input[type="checkbox"]');
        if (checkboxes[0]) checkboxes[0].checked = preferences.displayMajor || false;
        if (checkboxes[1]) checkboxes[1].checked = preferences.displayPronouns || false;
        if (checkboxes[2]) checkboxes[2].checked = preferences.emailNotifications || false;
    }

    setupEventListeners() {
        const saveButton = this.#container.querySelector('.save-btn');
        
        saveButton?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            try {
                const checkboxes = this.#container.querySelectorAll('input[type="checkbox"]');
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
