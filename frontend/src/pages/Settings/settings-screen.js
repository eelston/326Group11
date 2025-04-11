import { MockCourses } from "../../tests/data/MockCourses.js";

document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password-input");
  const showPasswordCheckbox = document.getElementById("show-password-checkbox");
  const emailInput = document.querySelector("input[type='email']");
  const emailEditBtn = document.querySelectorAll(".edit-btn")[0];
  const passwordEditBtn = document.querySelectorAll(".edit-btn")[1];
  const dropdownMenu = document.querySelector(".dropdown-menu");
  const addBtnContainer = document.querySelector(".add-btn-container");
  const addBtn = addBtnContainer.querySelector(".add-btn");
  const dropdownAddBtn = document.querySelector(".dropdown-add-btn");
  const courseSelect = dropdownMenu.querySelector("#mock-course-select");
  const currentClassesContainer = document.querySelector(".current-classes");

  const preferences = document.querySelectorAll(".preferences-section input[type='checkbox']");
  const preferenceSaveBtn = document.querySelectorAll(".save-btn")[1];

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
  addBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "block";
    }
  });

  document.addEventListener("click", (event) => {
    if (!addBtnContainer.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  /** add classes */
  dropdownAddBtn.addEventListener("click", () => {
    const className = courseSelect.value;
    if (className === "") return;

    const input = document.createElement("input");
    input.type = "text";
    input.value = className;
    input.disabled = true;

    currentClassesContainer.insertBefore(input, addBtnContainer);
    dropdownMenu.style.display = "none";
    courseSelect.value = "";
    saveClassToDB(className);
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

  /** use MockCourses */
  console.log("Example Courses (from MockCourses.js):", MockCourses);
  MockCourses.forEach(course => {
    const option = document.createElement("option");
    option.value = course.course_name;
    option.textContent = `${course.course_name} (${course.course_subject} ${course.course_number})`;
    courseSelect.appendChild(option);
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
});