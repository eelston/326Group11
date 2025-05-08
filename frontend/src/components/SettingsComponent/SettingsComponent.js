import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { AccountSettingsComponent } from '../AccountSettingsComponent/AccountSettingsComponent.js';
import { PreferencesComponent } from '../PreferencesComponent/PreferencesComponent.js';
import { ProfileSettingsComponent } from '../ProfileSettingsComponent/ProfileSettingsComponent.js';
import { NavbarComponent } from '../NavbarComponent/NavbarComponent.js';
import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/SettingsEvents.js';
import { SettingsService } from '../../services/SettingsRepositoryService.js';

export class SettingsComponent extends BaseComponent {
    #container = null;
    #accountComponent = null;
    #profileComponent = null;
    #preferencesComponent = null;
    #accountEl = null;
    #profileEl = null;
    #preferencesEl = null;
    
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
        this.settingsService = new SettingsService();
        this.eventHub = EventHub.getInstance();
        this.currentView = localStorage.getItem('settingsTab') || 'account'; // Get saved tab or default to account
        this.loadCSS('SettingsComponent');

        this.#accountComponent = new AccountSettingsComponent();
        this.#profileComponent = new ProfileSettingsComponent();
        this.#preferencesComponent = new PreferencesComponent();
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#container = document.createElement('div');
        this.#container.setAttribute('id', 'settings-container');
        
        document.getElementsByTagName('main')[0].appendChild(this.#container);

        this.#setupMessages();
        this.#setupContent();
        this.setupComponents();
        this.setupEventListeners();
        this.loadSettings();

        return this.#container;
    }

    #setupMessages() {
        const messagesDiv = document.createElement('div');
        messagesDiv.setAttribute('id', 'settings-messages');

        const errorDiv = document.createElement('div');
        errorDiv.setAttribute('id', 'settings-error');
        errorDiv.classList.add('error-message');
        errorDiv.style.display = 'none';

        const successDiv = document.createElement('div');
        successDiv.setAttribute('id', 'settings-success');
        successDiv.classList.add('success-message');
        successDiv.style.display = 'none';

        messagesDiv.appendChild(errorDiv);
        messagesDiv.appendChild(successDiv);
        this.#container.appendChild(messagesDiv);
    }

    #setupContent() {
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('settings-container');

        const nav = document.createElement('nav');
        nav.classList.add('settings-nav');

        const views = ['account', 'profile', 'preferences'];
        views.forEach(view => {
            const button = document.createElement('button');
            button.classList.add('nav-btn');
            if (view === this.currentView) button.classList.add('active');
            button.dataset.view = view;
            button.textContent = view.charAt(0).toUpperCase() + view.slice(1);
            nav.appendChild(button);
        });

        contentDiv.appendChild(nav);

        const settingsContent = document.createElement('div');
        settingsContent.classList.add('settings-content');

        this.#accountEl = this.#accountComponent.render();
        this.#accountEl.style.display = this.currentView === 'account' ? 'block' : 'none';

        this.#profileEl = this.#profileComponent.render();
        this.#profileEl.style.display = this.currentView === 'profile' ? 'block' : 'none';

        this.#preferencesEl = this.#preferencesComponent.render();
        this.#preferencesEl.style.display = this.currentView === 'preferences' ? 'block' : 'none';

        settingsContent.appendChild(this.#accountEl);
        settingsContent.appendChild(this.#profileEl);
        settingsContent.appendChild(this.#preferencesEl);

        contentDiv.appendChild(settingsContent);
        this.#container.appendChild(contentDiv);
    }

    setupComponents() {
        [
            this.#accountComponent,
            this.#profileComponent,
            this.#preferencesComponent
        ].forEach(component => {
            component.setSettingsService(this.settingsService);
            component.addEventListener('settings-updated', () => this.loadSettings());
            component.addEventListener('settings-error', (e) => this.showMessage(this.#container.querySelector('#settings-error'), e.detail));
            component.addEventListener('settings-success', (e) => this.showMessage(this.#container.querySelector('#settings-success'), e.detail));
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        const navButtons = this.#container.querySelectorAll('.nav-btn');
        console.log('Found nav buttons:', navButtons.length);
        
        navButtons.forEach(button => {
            console.log('Setting up click listener for:', button.dataset.view);
            button.addEventListener('click', (e) => {
                console.log('Button clicked:', button.dataset.view);
                this.switchView(button.dataset.view);
            });
        });

        this.eventHub.subscribe(Events.SETTINGS_SUCCESS, (message) => {
            this.showMessage(this.#container.querySelector('#settings-success'), message);
        });

        this.eventHub.subscribe(Events.SETTINGS_ERROR, (error) => {
            this.showMessage(this.#container.querySelector('#settings-error'), error);
        });
    }

    switchView(view) {
        console.log('Switching view to:', view);
        if (view === this.currentView) {
            console.log('Already on this view');
            return;
        }

        this.#container.querySelectorAll('.nav-btn').forEach(btn => {
            const isActive = btn.dataset.view === view;
            btn.classList.toggle('active', isActive);
            console.log('Button:', btn.dataset.view, 'Active:', isActive);
        });

        // Save current view to localStorage
        localStorage.setItem('settingsTab', view);

        const elements = {
            account: this.#accountEl,
            profile: this.#profileEl,
            preferences: this.#preferencesEl
        };

        Object.entries(elements).forEach(([key, element]) => {
            const shouldShow = key === view;
            element.style.display = shouldShow ? 'block' : 'none';
            console.log('Element:', key, 'Show:', shouldShow);
        });

        this.currentView = view;
        console.log('Current view updated to:', this.currentView);
    }

    async loadSettings() {
        try {
            console.log('Loading settings...');
            const settings = await this.settingsService.getSettings();
            console.log('Settings loaded:', settings);
            
            if (settings) {
                this.#profileComponent.setProfile(settings.profile);
                this.#profileComponent.renderClasses(settings.classes);
                this.#preferencesComponent.setPreferences(settings.preferences);
            } else {
                throw new Error('No settings data received');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.showMessage(
                this.#container.querySelector('#settings-error'), 
                error.message || 'Unable to load settings. Please ensure the server is running.'
            );
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
