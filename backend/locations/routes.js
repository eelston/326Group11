/********************************************************************
 * Based on TaskRoutes.js from CS326 backend integration example tasks-v4
 * Router pattern defines & manages different URL endpoints of an application
 * Each route corresponds to a specific URL path & HTTP method
 * Each route is linked to a function that handles requests for that endpoint
 * This design pattern makes it easier to add, update, and remove routes as app dev progresses
 * 
 * Each route handler specifies what action to take based on the URL & HTTP method,
 * ensuring that the right code is executed for each request type and URL
 *********************************************************************/

import express from "express";
import LocationController from "./controller.js"

class LocationRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Mounted from /locations

  // Define the routes and connect them to controller methods
  initializeRoutes() {
    // define route for getting location data 
    this.router.get("/", async (req, res) => { // '/locations'
      await LocationController.getLocations(req, res);
    });

    // define route for updating location data
    this.router.put("/update", async (req, res) => { // '/locations/update'
      await LocationController.updateLocations(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new LocationRoutes().getRouter();
