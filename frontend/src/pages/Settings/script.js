import { MockCourses } from "../../lib/data/MockCourses.js";
import { NavbarComponent } from "../../components/NavbarComponent/NavbarComponent.js";

// const navbarComponent = new NavbarComponent();
// navbarComponent.render();
// some of the button styling in style.css (width: 72%) affects the navbar component
// maybe see if it's feasible to use the specific button tags for styling?

document.addEventListener("DOMContentLoaded", () => {
  const subjects = [...new Set(MockCourses.map(course => course.course_subject))];
  
  const subjectSelect = document.getElementById("subject-select");
  subjects.forEach(subject => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });

  const passwordInput = document.getElementById("password-input");
  const showPasswordCheckbox = document.getElementById("show-password-checkbox");
  const emailInput = document.querySelector("input[type='email']");
  const emailEditBtn = document.querySelectorAll(".edit-btn")[0];
  const passwordEditBtn = document.querySelectorAll(".edit-btn")[1];
  const preferences = document.querySelectorAll(".preferences-section input[type='checkbox']");
  const preferenceSaveBtn = document.querySelectorAll(".save-btn")[1];
  const accountSaveBtn = document.querySelectorAll(".save-btn")[0];
  const profileSaveBtn = document.querySelectorAll(".save-btn")[2];
  const majorInput = document.getElementById("major-input");
  const pronounsInput = document.getElementById("pronouns-input");

  /** course related items */
  const courseNumberSelect = document.getElementById("course-number-select");
  const dropdownAddBtn = document.querySelector(".dropdown-add-btn");
  const currentClasses = document.querySelector(".current-classes");
  const addBtnContainer = document.querySelector(".add-btn-container");
  const addBtn = document.querySelector(".add-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  /** show/hide password */
  showPasswordCheckbox.addEventListener("change", () => {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
  });

  /** edit email & password fields */
  emailEditBtn.addEventListener("click", () => {
    emailInput.disabled = false;
    emailInput.focus();
  });

  passwordEditBtn.addEventListener("click", () => {
    passwordInput.disabled = false;
    passwordInput.focus();
  });

  /** form validation (basic) */
  emailInput.addEventListener("input", () => {
    if (!emailInput.value.includes("@")) {
      emailInput.setCustomValidity("Invalid email format");
    } else {
      emailInput.setCustomValidity("");
    }
  });

  /** dropdown for adding class */
  addBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (event) => {
    if (!addBtnContainer.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  /** save preferences to IndexedDB */
  preferenceSaveBtn.addEventListener("click", () => {
    const prefs = Array.from(preferences).map(cb => cb.checked);
    const prefData = {
      displayMajor: prefs[0],
      displayPronouns: prefs[1],
      emailNotifications: prefs[2]
    };
    savePreferencesToDB(prefData);
  });

  /** save account changes */
  accountSaveBtn.addEventListener("click", () => {
    emailInput.disabled = true;
    passwordInput.disabled = true;
    
    const accountData = {
      email: emailInput.value,
      password: passwordInput.value
    };
    
    alert("Account information updated.");
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.checkValidity()) {
      emailInput.disabled = true;
    }
  });

  passwordInput.addEventListener("blur", () => {
    if (passwordInput.value.length > 0) {
      passwordInput.disabled = true;
    }
  });

  /** IndexedDB */
  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("UserSettingsDB", 1);
      request.onerror = () => reject("DB failed");
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        db.createObjectStore("preferences", { keyPath: "id" });
        db.createObjectStore("classes", { autoIncrement: true });
      };
    });
  }

  async function savePreferencesToDB(prefs) {
    const db = await openDB();
    const tx = db.transaction("preferences", "readwrite");
    const store = tx.objectStore("preferences");
    store.put({ id: "userPrefs", ...prefs });
    tx.oncomplete = () => alert("Preferences updated.");
  }

  async function saveClassToDB(className) {
    const db = await openDB();
    const tx = db.transaction("classes", "readwrite");
    tx.objectStore("classes").add({ name: className });
    tx.oncomplete = () => console.log("Class saved to DB:", className);
  }

  async function saveProfileToDB(profileData) {
    try {
      const db = await openDB();
      const tx = db.transaction("preferences", "readwrite");
      const store = tx.objectStore("preferences");
      await store.put({ id: "userProfile", ...profileData });
      alert("Profile information updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile information. Please try again.");
    }
  }

  subjectSelect?.addEventListener("change", (event) => {
    console.log("Subject changed:", event.target.value);
    const subject = event.target.value;
    
    courseNumberSelect.innerHTML = '<option value="">-- Select a number --</option>';

    if (subject) {
      console.log("Filtering courses for subject:", subject);
      const subjectCourses = MockCourses.filter(course => course.course_subject === subject);
      console.log("Found courses:", subjectCourses);

      if (subjectCourses.length > 0) {
        subjectCourses.forEach(course => {
          const option = document.createElement("option");
          option.value = course.course_number;
          option.textContent = `${course.course_number} - ${course.course_name}`;
          courseNumberSelect.appendChild(option);
        });
        courseNumberSelect.disabled = false;
      } else {
        console.log("No courses found for subject:", subject);
        courseNumberSelect.disabled = true;
      }
    } else {
      courseNumberSelect.disabled = true;
    }
    dropdownAddBtn.disabled = true;
  });

  courseNumberSelect?.addEventListener("change", (event) => {
    dropdownAddBtn.disabled = !event.target.value;
  });

  dropdownAddBtn?.addEventListener("click", () => {
    const subject = subjectSelect.value;
    const number = courseNumberSelect.value;
    if (!subject || !number) return;

    const course = MockCourses.find(c => 
      c.course_subject === subject && c.course_number === number
    );

    if (course) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = `${course.course_name} (${course.course_subject} ${course.course_number})`;
      input.disabled = true;

      currentClasses.insertBefore(input, currentClasses.querySelector(".add-btn-container"));
      
      subjectSelect.value = "";
      courseNumberSelect.innerHTML = '<option value="">-- Select a number --</option>';
      courseNumberSelect.disabled = true;
      dropdownAddBtn.disabled = true;
      dropdownMenu.style.display = "none";

      saveClassToDB(course.course_name);
    }
  });

  /** save profile changes */
  profileSaveBtn?.addEventListener("click", async () => {
    if (!majorInput.value && !pronounsInput.value) {
      alert("Please enter at least one field before saving.");
      return;
    }

    const profileData = {
      major: majorInput.value,
      pronouns: pronounsInput.value
    };
    
    await saveProfileToDB(profileData);
    
    majorInput.disabled = true;
    pronounsInput.disabled = true;
  });

  majorInput?.addEventListener("blur", () => {
    if (majorInput.value.length > 0) {
      majorInput.disabled = true;
    }
  });

  pronounsInput?.addEventListener("blur", () => {
    if (pronounsInput.value.length > 0) {
      pronounsInput.disabled = true;
    }
  });
});