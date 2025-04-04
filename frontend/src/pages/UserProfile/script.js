import { UserProfileComponent } from '../../components/UserProfileComponent/UserProfileComponent.js';
// import { UserProfileComponent } from '../../components/UserProfileComponent/UserProfileComponent.js';
import { MockUser } from "../../../tests/data/MockUser.js";

const userProfileComponent = new UserProfileComponent(MockUser);
userProfileComponent.render();

    // document.addEventListener("DOMContentLoaded", () => {
    //     function navigate(viewId) {
    //       // Hide all views
    //       document.querySelectorAll(".view").forEach((view) => {
    //         view.style.display = "none";
    //       });
    
    //       // Show the requested view
    //       document.getElementById(viewId).style.display = "block";
    //     }
    
    //     document
    //       .getElementById("home")
    //       .addEventListener("click", () => navigate("homeView"));
    //     document
    //       .getElementById("profile")
    //       .addEventListener("click", () => navigate("profileView"));
    //     document
    //       .getElementById("about")
    //       .addEventListener("click", () => navigate("aboutView"));
    //     document
    //       .getElementById("settings")
    //       .addEventListener("click", () => navigate("settingsView"));
    
    //     document
    //       .getElementById("colorButton")
    //       .addEventListener("click", () => {
    //         ["home","profile","about","settings"].forEach(item => {
    //           button = document.getElementById(item);
    //           if (button.style.background === "purple") {
    //             button.style.background = "rgb(0, 123, 255)";
    //           } else {
    //             button.style.background = "purple";
    //           }
    //         });
    //       })
    //     // Initialize with the home view
    //     navigate("homeView");
    
    //     // Assuming your images are within a container with the class
    //     // 'image-container'
    //     document.querySelectorAll(".image-container img").forEach((img) => {
    //       img.addEventListener("click", function () {
    //         const parent = this.parentNode;
    //         parent.insertBefore(this, parent.firstChild); // Move the clicked image to the beginning
    //       });
    //     });
    //   });
    