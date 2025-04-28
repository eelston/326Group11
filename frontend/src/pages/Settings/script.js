import { EventHub } from '../../eventhub/EventHub.js';
import { Events } from '../../eventhub/SettingsEvents.js';
import { SettingsService } from '../../services/SettingsRepositoryService.js';
import { MockCourses } from '../../lib/data/MockCourses.js';

document.addEventListener("DOMContentLoaded", async () => {
    const settingsService = new SettingsService();
    const eventHub = EventHub.getInstance();
    
    const accountSaveBtn = document.querySelector('.account-section .save-btn');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password-input');
    const editButtons = document.querySelectorAll('.edit-btn');
    const showPasswordCheckbox = document.getElementById('show-password-checkbox');
    const userIdInput = document.querySelector('input[type="user_id"]');
    const successMessage = document.getElementById('settings-success');
    const errorMessage = document.getElementById('settings-error');
    
    userIdInput.value = settingsService.userId;
    
    const showMessage = (element, message, duration = 3000) => {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            element.style.opacity = '1';
            setTimeout(() => {
                element.style.opacity = '0';
                setTimeout(() => element.style.display = 'none', 300);
            }, duration);
        }
    };
    
    eventHub.subscribe(Events.SETTINGS_SUCCESS, (message) => {
        showMessage(successMessage, message);
    });

    eventHub.subscribe(Events.SETTINGS_ERROR, (error) => {
        showMessage(errorMessage, error);
    });

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

    const loadSettings = async () => {
        try {
            const settings = await settingsService.getSettings();
            if (settings) {
                populateFormFields(settings);
                renderClasses(settings.classes);
            }
        } catch (error) {
            showMessage(errorMessage, 'Unable to load settings. Please ensure the server is running.');
        }
    };

    await loadSettings();

    accountSaveBtn?.addEventListener('click', async () => {
        try {
            const accountData = {
                email: emailInput.value,
                password: passwordInput.value,
                userId: settingsService.userId
            };
            await settingsService.saveAccount(accountData);
            
            emailInput.disabled = true;
            passwordInput.disabled = true;
            
            await loadSettings();
        } catch (error) {
            showMessage(errorMessage, 'Failed to save account changes');
        }
    });

    const subjectSelect = document.getElementById('subject-select');
    const subjects = [...new Set(MockCourses.map(course => course.course_subject))];
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });

    const courseNumberSelect = document.createElement('select');
    courseNumberSelect.id = 'course-number-select';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '-- Select a number --';
    courseNumberSelect.appendChild(defaultOption);
    
    const courseNumberContainer = document.querySelector('.dropdown-group:nth-child(2)');
    courseNumberContainer.appendChild(courseNumberSelect);

    subjectSelect.addEventListener('change', () => {
        updateCourseNumbers(subjectSelect.value);
    });

    const setupAddClassFunctionality = () => {
        const addBtn = document.querySelector('.add-btn');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        let dropdownAddBtn = document.querySelector('.dropdown-add-btn');
        if (!dropdownAddBtn) {
            dropdownAddBtn = document.createElement('button');
            dropdownAddBtn.className = 'dropdown-add-btn';
            dropdownAddBtn.textContent = 'Add';
            dropdownMenu.appendChild(dropdownAddBtn);
        }

        const resetDropdowns = () => {
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
            const subject = document.getElementById('subject-select').value;
            const number = document.getElementById('course-number-select').value;
            
            if (!subject || !number) {
                showMessage(errorMessage, 'Please select both subject and course number');
                return;
            }
            
            try {
                const classData = {
                    subject,
                    number,
                    userId: settingsService.userId
                };
                
                const result = await settingsService.addClass(classData);
                if (result) {
                    dropdownMenu.style.display = 'none';
                    await loadSettings();
                }
            } catch (error) {
                showMessage(errorMessage, 'Failed to add class');
            }
        });
    };

    setupAddClassFunctionality();

    async function updateCourseNumbers(subject) {
        courseNumberSelect.innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Select a number --';
        courseNumberSelect.appendChild(defaultOption);

        const settings = await settingsService.getSettings();
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

    function populateFormFields(settings) {
        const preferencesForm = document.querySelector('.preferences-section');
        if (settings.preferences) {
            const checkboxes = preferencesForm.querySelectorAll('input[type="checkbox"]');
            if (checkboxes[0]) checkboxes[0].checked = settings.preferences.displayMajor || false;
            if (checkboxes[1]) checkboxes[1].checked = settings.preferences.displayPronouns || false;
            if (checkboxes[2]) checkboxes[2].checked = settings.preferences.emailNotifications || false;
        }
        
        const profileForm = document.querySelector('.profile-section');
        if (settings.profile) {
            const displayNameInput = profileForm.querySelector('input[placeholder="Current display name"]');
            const pronounsInput = profileForm.querySelector('input[placeholder="Current pronouns"]');
            const majorInput = profileForm.querySelector('input[placeholder="Current major"]');
            const bioInput = profileForm.querySelector('#bio');
            
            if (displayNameInput) displayNameInput.value = settings.profile.displayName || '';
            if (pronounsInput) pronounsInput.value = settings.profile.pronouns || '';
            if (majorInput) majorInput.value = settings.profile.major || '';
            if (bioInput) bioInput.value = settings.profile.bio || '';
        }
        
        if (settings.profile && settings.profile.email) {
            emailInput.value = settings.profile.email;
        }
    }

    function renderClasses(classes) {
        const classesContainer = document.querySelector('.current-classes');
        
        const addBtnContainer = classesContainer.querySelector('.add-btn-container');
        classesContainer.innerHTML = '';
        classesContainer.appendChild(addBtnContainer);
        
        if (classes && classes.length > 0) {
            classes.forEach(cls => {
                const classElement = document.createElement('div');
                classElement.className = 'class-item';
                classElement.innerHTML = `
                    <span>${cls.subject} ${cls.number}</span>
                    <button class="remove-class-btn" data-id="${cls.id}">×</button>
                `;
                classesContainer.insertBefore(classElement, addBtnContainer);
            });
            
            document.querySelectorAll('.remove-class-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    try {
                        const classElement = btn.parentElement;
                        const classId = btn.getAttribute('data-id');
                        const result = await settingsService.removeClass(classId);
                        
                        if (result) {
                            classElement.style.opacity = '0';
                            setTimeout(() => classElement.remove(), 300);
                        }
                    } catch (error) {
                        showMessage(errorMessage, 'Failed to remove class');
                    }
                });
            });
        }
    }

    const preferencesForm = document.querySelector('.preferences-section');
    preferencesForm?.querySelector('.save-btn')?.addEventListener('click', async () => {
        try {
            const checkboxes = preferencesForm.querySelectorAll('input[type="checkbox"]');
            const preferences = {
                displayMajor: checkboxes[0].checked,
                displayPronouns: checkboxes[1].checked,
                emailNotifications: checkboxes[2].checked,
                userId: settingsService.userId
            };
            await settingsService.savePreferences(preferences);
            showMessage(successMessage, 'Preferences saved successfully');
            await loadSettings();
        } catch (error) {
            showMessage(errorMessage, 'Failed to save preferences');
        }
    });

    const profileForm = document.querySelector('.profile-section');
    profileForm?.querySelector('.save-btn')?.addEventListener('click', async () => {
        try {
            const profileData = {
                displayName: profileForm.querySelector('input[placeholder="Current display name"]').value,
                pronouns: profileForm.querySelector('input[placeholder="Current pronouns"]').value,
                major: profileForm.querySelector('input[placeholder="Current major"]').value,
                bio: profileForm.querySelector('#bio').value
            };
            await settingsService.updateProfile(profileData);
            showMessage(successMessage, 'Profile saved successfully');
            
            await loadSettings();
        } catch (error) {
            showMessage(errorMessage, 'Failed to save profile');
        }
    });
});
