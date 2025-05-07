import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { AccountSettingsComponent } from '../AccountSettingsComponent/AccountSettingsComponent.js';
import { PreferencesComponent } from '../PreferencesComponent/PreferencesComponent.js';
import { ProfileSettingsComponent } from '../ProfileSettingsComponent/ProfileSettingsComponent.js';
import { NavbarComponent } from '../NavbarComponent/NavbarComponent.js';
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/SettingsEvents.js';
import { SettingsService } from '../../services/SettingsRepositoryService.js';

export class SettingsComponent extends HTMLElement {
    #base;

    constructor() {
        super();
        this.#base = new BaseComponent();
        this.settingsService = new SettingsService();
        this.eventHub = EventHub.getInstance();
        this.currentView = 'account'; // Default view
    }

    connectedCallback() {
        this.#base.loadCSS('SettingsComponent');
        this.innerHTML = this.render();
        this.setupComponents();
        this.setupEventListeners();
        this.loadSettings();
    }

    render() {
        return `
            <div id="settings-messages">
                <div id="settings-error" class="error-message" style="display: none"></div>
                <div id="settings-success" class="success-message" style="display: none"></div>
            </div>

            <div class="settings-container">
                <nav class="settings-nav">
                    <button class="nav-btn active" data-view="account">Account</button>
                    <button class="nav-btn" data-view="profile">Profile</button>
                    <button class="nav-btn" data-view="preferences">Preferences</button>
                </nav>
                
                <div class="settings-content">
                    <account-settings-component style="display: block;"></account-settings-component>
                    <profile-settings-component style="display: none;"></profile-settings-component>
                    <preferences-component style="display: none;"></preferences-component>
                </div>
            </div>
        `;
    }

    setupComponents() {
        // Initialize all child components
        const accountComponent = this.querySelector('account-settings-component');
        const profileComponent = this.querySelector('profile-settings-component');
        const preferencesComponent = this.querySelector('preferences-component');

        // Set the settings service for each component
        accountComponent.setSettingsService(this.settingsService);
        profileComponent.setSettingsService(this.settingsService);
        preferencesComponent.setSettingsService(this.settingsService);

        // Set up event listeners for the child components
        [accountComponent, profileComponent, preferencesComponent].forEach(component => {
            component.addEventListener('settings-updated', () => this.loadSettings());
            component.addEventListener('settings-error', (e) => this.showMessage(this.querySelector('#settings-error'), e.detail));
            component.addEventListener('settings-success', (e) => this.showMessage(this.querySelector('#settings-success'), e.detail));
        });
    }

    setupEventListeners() {
        // Set up navigation buttons
        const navButtons = this.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchView(button.dataset.view);
            });
        });

        // Set up event hub subscriptions
        this.eventHub.subscribe(Events.SETTINGS_SUCCESS, (message) => {
            this.showMessage(this.querySelector('#settings-success'), message);
        });

        this.eventHub.subscribe(Events.SETTINGS_ERROR, (error) => {
            this.showMessage(this.querySelector('#settings-error'), error);
        });
    }

    switchView(view) {
        if (view === this.currentView) return;

        // Update navigation buttons
        this.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update component visibility
        const components = {
            account: this.querySelector('account-settings-component'),
            profile: this.querySelector('profile-settings-component'),
            preferences: this.querySelector('preferences-component')
        };

        Object.entries(components).forEach(([key, component]) => {
            component.style.display = key === view ? 'block' : 'none';
        });

        this.currentView = view;
    }

    async loadSettings() {
        try {
            const settings = await this.settingsService.getSettings();
            if (settings) {
                // Update profile component
                const profileComponent = this.querySelector('profile-settings-component');
                profileComponent.setProfile(settings.profile);
                profileComponent.renderClasses(settings.classes);

                // Update preferences component
                const preferencesComponent = this.querySelector('preferences-component');
                preferencesComponent.setPreferences(settings.preferences);
            }
        } catch (error) {
            this.showMessage(this.querySelector('#settings-error'), 
                'Unable to load settings. Please ensure the server is running.');
        }
    }

    showMessage(element, message, duration = 3000) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.opacity = '0';
                setTimeout(() => element.style.display = 'none', 300);
            }, duration);
        }
    }
}

customElements.define('settings-component', SettingsComponent);
