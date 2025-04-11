import { MockCourses } from "../../tests/data/mockcourses.js";

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const showPasswordCheckbox = document.getElementById("show-password-checkbox");
  const emailInput = document.querySelector("input[type='email']");
  const emailEditBtn = document.querySelectorAll(".edit-btn")[0];
  const passwordEditBtn = document.querySelectorAll(".edit-btn")[1];
  const preferences = document.querySelectorAll(".preferences-section input[type='checkbox']");
  const preferenceSaveBtn = document.querySelectorAll(".save-btn")[1];

  /** course related items */
  const subjectSelect = document.getElementById("subject-select");
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
    tx.oncomplete = () => alert("Preferences saved.");
  }

  async function saveClassToDB(className) {
    const db = await openDB();
    const tx = db.transaction("classes", "readwrite");
    tx.objectStore("classes").add({ name: className });
    tx.oncomplete = () => console.log("Class saved to DB:", className);
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
});