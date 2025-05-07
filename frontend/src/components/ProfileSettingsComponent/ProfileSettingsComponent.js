import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { MockCourses } from '../../lib/data/MockCourses.js';

export class ProfileSettingsComponent extends HTMLElement {
    #base;
    
    constructor() {
        super();
        this.#base = new BaseComponent();
        this.settingsService = null;
    }

    connectedCallback() {
        this.#base.loadCSS('ProfileSettingsComponent');
        this.innerHTML = this.render();
        this.setupEventListeners();
        this.initializeSubjectSelect();
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    setProfile(profile = {}) {
        const displayNameInput = this.querySelector('input[placeholder="Current display name"]');
        const pronounsInput = this.querySelector('input[placeholder="Current pronouns"]');
        const majorInput = this.querySelector('input[placeholder="Current major"]');
        const bioInput = this.querySelector('#bio');
        
        if (displayNameInput) displayNameInput.value = profile.displayName || '';
        if (pronounsInput) pronounsInput.value = profile.pronouns || '';
        if (majorInput) majorInput.value = profile.major || '';
        if (bioInput) bioInput.value = profile.bio || '';
    }

    render() {
        return `
            <section class="profile-section">
                <label>Display name <input type="text" placeholder="Current display name" /></label>
                <label>Pronouns <input type="text" placeholder="Current pronouns" /></label>
                <label>Major <input type="text" placeholder="Current major" /></label>
                <label for="bio">Bio</label>
                <textarea id="bio" placeholder="Current biography"></textarea>
                <h4>Current classes</h4>
                <div class="current-classes">
                    <div class="add-btn-container">
                        <button class="add-btn">+</button>
                        <div class="dropdown-menu">
                            <div class="dropdown-group">
                                <label for="subject-select">Subject:</label>
                                <select id="subject-select">
                                    <option value="">-- Select a subject --</option>
                                </select>
                            </div>
                            <div class="dropdown-group">
                                <label for="course-number-select">Number:</label>
                                <select id="course-number-select">
                                    <option value="">-- Select a number --</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="save-btn">Save changes</button>
            </section>
        `;
    }

    initializeSubjectSelect() {
        const subjectSelect = this.querySelector('#subject-select');
        const subjects = [...new Set(MockCourses.map(course => course.course_subject))];
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }

    async updateCourseNumbers(subject) {
        const courseNumberSelect = this.querySelector('#course-number-select');
        courseNumberSelect.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a number --';
        courseNumberSelect.appendChild(defaultOption);

        if (!this.settingsService) return;

        const settings = await this.settingsService.getSettings();
        const currentClasses = settings.classes || [];
        
        const filteredCourses = MockCourses.filter(course => {
            return course.course_subject === subject && 
                   !currentClasses.some(cls => 
                       cls.subject === subject && 
                       cls.number === course.course_number
                   );
        });

        filteredCourses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.course_number;
            option.textContent = `${course.course_number} - ${course.course_name}`;
            courseNumberSelect.appendChild(option);
        });
    }

    renderClasses(classes = []) {
        const classesContainer = this.querySelector('.current-classes');
        const addBtnContainer = classesContainer.querySelector('.add-btn-container');
        
        // Clear existing classes but keep the add button container
        classesContainer.innerHTML = '';
        classesContainer.appendChild(addBtnContainer);
        
        if (classes.length > 0) {
            classes.forEach(cls => {
                const classElement = document.createElement('div');
                classElement.className = 'class-item';
                classElement.innerHTML = `
                    <span>${cls.subject} ${cls.number}</span>
                    <button class="remove-class-btn" data-id="${cls.id}">×</button>
                `;
                classesContainer.insertBefore(classElement, addBtnContainer);
            });
            
            this.setupClassRemovalListeners();
        }
    }

    setupEventListeners() {
        this.setupAddClassFunctionality();
        this.setupSaveButtonListener();
        this.setupSubjectSelectListener();
    }

    setupAddClassFunctionality() {
        const addBtn = this.querySelector('.add-btn');
        const dropdownMenu = this.querySelector('.dropdown-menu');
        
        let dropdownAddBtn = this.querySelector('.dropdown-add-btn');
        if (!dropdownAddBtn) {
            dropdownAddBtn = document.createElement('button');
            dropdownAddBtn.className = 'dropdown-add-btn';
            dropdownAddBtn.textContent = 'Add';
            dropdownMenu.appendChild(dropdownAddBtn);
        }

        const resetDropdowns = () => {
            const subjectSelect = this.querySelector('#subject-select');
            const courseNumberSelect = this.querySelector('#course-number-select');
            subjectSelect.value = '';
            courseNumberSelect.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '-- Select a number --';
            courseNumberSelect.appendChild(defaultOption);
        };

        addBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
                resetDropdowns();
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && e.target !== addBtn) {
                dropdownMenu.style.display = 'none';
            }
        });

        dropdownAddBtn?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            const subject = this.querySelector('#subject-select').value;
            const number = this.querySelector('#course-number-select').value;
            
            if (!subject || !number) {
                this.dispatchEvent(new CustomEvent('settings-error', {
                    detail: 'Please select both subject and course number'
                }));
                return;
            }
            
            try {
                const classData = {
                    subject,
                    number,
                    userId: this.settingsService.userId
                };
                
                const result = await this.settingsService.addClass(classData);
                if (result) {
                    dropdownMenu.style.display = 'none';
                    this.dispatchEvent(new CustomEvent('settings-updated'));
                }
            } catch (error) {
                this.dispatchEvent(new CustomEvent('settings-error', {
                    detail: 'Failed to add class'
                }));
            }
        });
    }

    setupClassRemovalListeners() {
        this.querySelectorAll('.remove-class-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!this.settingsService) return;

                try {
                    const classElement = btn.parentElement;
                    const classId = btn.getAttribute('data-id');
                    const result = await this.settingsService.removeClass(classId);
                    
                    if (result) {
                        classElement.style.opacity = '0';
                        setTimeout(() => classElement.remove(), 300);
                    }
                } catch (error) {
                    this.dispatchEvent(new CustomEvent('settings-error', {
                        detail: 'Failed to remove class'
                    }));
                }
            });
        });
    }

    setupSaveButtonListener() {
        const saveButton = this.querySelector('.save-btn');
        
        saveButton?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            try {
                const profileData = {
                    displayName: this.querySelector('input[placeholder="Current display name"]').value,
                    pronouns: this.querySelector('input[placeholder="Current pronouns"]').value,
                    major: this.querySelector('input[placeholder="Current major"]').value,
                    bio: this.querySelector('#bio').value
                };

                await this.settingsService.updateProfile(profileData);
                this.dispatchEvent(new CustomEvent('settings-success', {
                    detail: 'Profile saved successfully'
                }));
                this.dispatchEvent(new CustomEvent('settings-updated'));
            } catch (error) {
                this.dispatchEvent(new CustomEvent('settings-error', {
                    detail: 'Failed to save profile'
                }));
            }
        });
    }

    setupSubjectSelectListener() {
        const subjectSelect = this.querySelector('#subject-select');
        subjectSelect?.addEventListener('change', () => {
            this.updateCourseNumbers(subjectSelect.value);
        });
    }
}

customElements.define('profile-settings-component', ProfileSettingsComponent);
