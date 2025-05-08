import { BaseComponent } from '../BaseComponent/BaseComponent.js';
import { MockCourses } from '../../lib/data/MockCourses.js';

export class ProfileSettingsComponent extends BaseComponent {
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
        this.loadCSS('ProfileSettingsComponent');
    }

    render() {
        if (this.#container) {
            return this.#container;
        }

        this.#container = document.createElement('section');
        this.#container.classList.add('profile-section');

        const displayNameGroup = this.#createInputGroup('Display Name', 'text', 'Current display name');
        this.#container.appendChild(displayNameGroup);

        const pronounsGroup = this.#createInputGroup('Pronouns', 'text', 'Current pronouns');
        this.#container.appendChild(pronounsGroup);

        const majorGroup = this.#createInputGroup('Major', 'text', 'Current major');
        this.#container.appendChild(majorGroup);

        const factsGroup = this.#createFactsGroup();
        this.#container.appendChild(factsGroup);

        const classesGroup = this.#createClassesGroup();
        this.#container.appendChild(classesGroup);

        const saveButton = document.createElement('button');
        saveButton.classList.add('save-btn');
        saveButton.textContent = 'Save changes';
        this.#container.appendChild(saveButton);

        this.setupEventListeners();
        this.initializeSubjectSelect();
        return this.#container;
    }

    #createInputGroup(label, type, placeholder) {
        const group = document.createElement('div');
        group.classList.add('input-group');

        const labelElement = document.createElement('label');
        labelElement.classList.add('field-label');
        labelElement.textContent = label;

        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;

        group.appendChild(labelElement);
        group.appendChild(input);
        return group;
    }

    #createFactsGroup() {
        const group = document.createElement('div');
        group.classList.add('input-group');

        const label = document.createElement('label');
        label.classList.add('field-label');
        label.textContent = 'About Me';

        const factsContainer = document.createElement('div');
        factsContainer.classList.add('facts-container');
        
        const addFactBtn = document.createElement('button');
        addFactBtn.classList.add('add-fact-btn');
        addFactBtn.textContent = 'Add Fact';
        addFactBtn.addEventListener('click', () => this.#addNewFactInput());

        group.appendChild(label);
        group.appendChild(factsContainer);
        group.appendChild(addFactBtn);
        return group;
    }

    #addNewFactInput() {
        const factsContainer = this.#container.querySelector('.facts-container');
        const factGroup = document.createElement('div');
        factGroup.classList.add('fact-input-group');

        const promptInput = document.createElement('input');
        promptInput.classList.add('fact-prompt');
        promptInput.type = 'text';
        promptInput.placeholder = 'Prompt';

        const answerInput = document.createElement('input');
        answerInput.classList.add('fact-answer');
        answerInput.type = 'text';
        answerInput.placeholder = 'Write something here!';

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-fact-btn');
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => factGroup.remove());

        factGroup.appendChild(promptInput);
        factGroup.appendChild(answerInput);
        factGroup.appendChild(removeBtn);

        factsContainer.appendChild(factGroup);
    }

    #createClassesGroup() {
        const group = document.createElement('div');
        group.classList.add('input-group');

        const label = document.createElement('label');
        label.classList.add('field-label');
        label.textContent = 'Current Classes';

        const classesContainer = document.createElement('div');
        classesContainer.classList.add('current-classes');

        const addBtnContainer = document.createElement('div');
        addBtnContainer.classList.add('add-btn-container');

        const addBtn = document.createElement('button');
        addBtn.classList.add('add-btn');
        addBtn.textContent = '+';

        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');

        const subjectGroup = document.createElement('div');
        subjectGroup.classList.add('dropdown-group');

        const subjectLabel = document.createElement('label');
        subjectLabel.setAttribute('for', 'subject-select');
        subjectLabel.textContent = 'Subject:';

        const subjectSelect = document.createElement('select');
        subjectSelect.id = 'subject-select';
        const defaultSubjectOption = document.createElement('option');
        defaultSubjectOption.value = '';
        defaultSubjectOption.textContent = '-- Select a subject --';
        subjectSelect.appendChild(defaultSubjectOption);

        subjectGroup.appendChild(subjectLabel);
        subjectGroup.appendChild(subjectSelect);

        const numberGroup = document.createElement('div');
        numberGroup.classList.add('dropdown-group');

        const numberLabel = document.createElement('label');
        numberLabel.setAttribute('for', 'course-number-select');
        numberLabel.textContent = 'Number:';

        const numberSelect = document.createElement('select');
        numberSelect.id = 'course-number-select';
        const defaultNumberOption = document.createElement('option');
        defaultNumberOption.value = '';
        defaultNumberOption.textContent = '-- Select a number --';
        numberSelect.appendChild(defaultNumberOption);

        numberGroup.appendChild(numberLabel);
        numberGroup.appendChild(numberSelect);

        const dropdownActions = document.createElement('div');
        dropdownActions.classList.add('dropdown-actions');

        const dropdownAddBtn = document.createElement('button');
        dropdownAddBtn.classList.add('dropdown-add-btn');
        dropdownAddBtn.textContent = 'Add Class';

        dropdownActions.appendChild(dropdownAddBtn);

        dropdownMenu.appendChild(subjectGroup);
        dropdownMenu.appendChild(numberGroup);
        dropdownMenu.appendChild(dropdownActions);

        addBtnContainer.appendChild(addBtn);
        addBtnContainer.appendChild(dropdownMenu);
        classesContainer.appendChild(addBtnContainer);

        group.appendChild(label);
        group.appendChild(classesContainer);
        return group;
    }

    setSettingsService(service) {
        this.settingsService = service;
    }

    setProfile(profile = {}) {
        const displayNameInput = this.#container.querySelector('input[placeholder="Current display name"]');
        const pronounsInput = this.#container.querySelector('input[placeholder="Current pronouns"]');
        const majorInput = this.#container.querySelector('input[placeholder="Current major"]');
        
        if (displayNameInput) displayNameInput.value = profile.displayName || '';
        if (pronounsInput) pronounsInput.value = profile.pronouns || '';
        if (majorInput) majorInput.value = profile.major || '';

        // Clear existing facts
        const factsContainer = this.#container.querySelector('.facts-container');
        if (factsContainer) {
            factsContainer.innerHTML = '';
            
            // Add existing facts
            if (profile.profileContent?.about && Array.isArray(profile.profileContent.about)) {
                profile.profileContent.about.forEach(fact => {
                    const factGroup = document.createElement('div');
                    factGroup.classList.add('fact-input-group');

                    const promptInput = document.createElement('input');
                    promptInput.classList.add('fact-prompt');
                    promptInput.type = 'text';
                    promptInput.placeholder = 'Prompt';
                    promptInput.value = fact.factName || '';

                    const answerInput = document.createElement('input');
                    answerInput.classList.add('fact-answer');
                    answerInput.type = 'text';
                    answerInput.placeholder = 'Write something here!';
                    answerInput.value = fact.factAnswer || '';

                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('remove-fact-btn');
                    removeBtn.textContent = '×';
                    removeBtn.addEventListener('click', () => factGroup.remove());

                    factGroup.appendChild(promptInput);
                    factGroup.appendChild(answerInput);
                    factGroup.appendChild(removeBtn);

                    factsContainer.appendChild(factGroup);
                });
            }
        }
    }

    initializeSubjectSelect() {
        const subjectSelect = this.#container.querySelector('#subject-select');
        const subjects = [...new Set(MockCourses.map(course => course.course_subject))];
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });
    }

    async updateCourseNumbers(subject) {
        const courseNumberSelect = this.#container.querySelector('#course-number-select');
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
        const classesContainer = this.#container.querySelector('.current-classes');
        const addBtnContainer = classesContainer.querySelector('.add-btn-container');
        
        classesContainer.innerHTML = '';
        classesContainer.appendChild(addBtnContainer);
        
        if (classes.length > 0) {
            classes.forEach(cls => {
                const classElement = document.createElement('div');
                classElement.className = 'class-item';
                const span = document.createElement('span');
                span.textContent = `${cls.subject} ${cls.number}`;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-class-btn';
                removeBtn.setAttribute('data-id', cls.id);
                removeBtn.textContent = '×';
                classElement.appendChild(span);
                classElement.appendChild(removeBtn);
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
        const addBtn = this.#container.querySelector('.add-btn');
        const dropdownMenu = this.#container.querySelector('.dropdown-menu');
        
        let dropdownAddBtn = this.#container.querySelector('.dropdown-add-btn');
        if (!dropdownAddBtn) {
            dropdownAddBtn = document.createElement('button');
            dropdownAddBtn.className = 'dropdown-add-btn';
            dropdownAddBtn.textContent = 'Add';
            dropdownMenu.appendChild(dropdownAddBtn);
        }

        const resetDropdowns = () => {
            const subjectSelect = this.#container.querySelector('#subject-select');
            const courseNumberSelect = this.#container.querySelector('#course-number-select');
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

            const subject = this.#container.querySelector('#subject-select').value;
            const number = this.#container.querySelector('#course-number-select').value;
            
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
        this.#container.querySelectorAll('.remove-class-btn').forEach(btn => {
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
        const saveButton = this.#container.querySelector('.save-btn');
        
        saveButton?.addEventListener('click', async () => {
            if (!this.settingsService) return;

            try {
                // Collect all facts
                const facts = [];
                this.#container.querySelectorAll('.fact-input-group').forEach(group => {
                    const promptInput = group.querySelector('.fact-prompt');
                    const answerInput = group.querySelector('.fact-answer');
                    if (promptInput && answerInput && promptInput.value.trim() && answerInput.value.trim()) {
                        facts.push({
                            factName: promptInput.value.trim(),
                            factAnswer: answerInput.value.trim()
                        });
                    }
                });

                const profileData = {
                    userId: this.settingsService.userId,
                    displayName: this.#container.querySelector('input[placeholder="Current display name"]').value,
                    pronouns: this.#container.querySelector('input[placeholder="Current pronouns"]').value,
                    major: this.#container.querySelector('input[placeholder="Current major"]').value,
                    profileContent: {
                        about: facts
                    }
                };

                console.log('Saving profile data:', profileData);

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
        const subjectSelect = this.#container.querySelector('#subject-select');
        subjectSelect?.addEventListener('change', () => {
            this.updateCourseNumbers(subjectSelect.value);
        });
    }
}
