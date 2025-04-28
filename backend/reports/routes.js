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

// For example, a GET request to "/users" might retrieve a list of users, while a POST
// request to "/users" might add a new user. Each route handler specifies
// what action to take based on the URL and HTTP method, ensuring that the
// right code is executed for each request type and URL.

// By keeping routes separate from other logic, such as data handling and business rules,
// changes can be made to the endpoints without altering the application’s core functionality.
// This structure also supports scalability, as it’s easy to add more routes
// without affecting existing ones, and facilitates testing by allowing each
// route to be tested independently for correct handling of inputs and outputs.

import express from "express";
// import TaskController from "../controller/TaskController.js";
import ReportController from "../reports/controller.js"

class ReportRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  /** Define routes and connect them to controller methods */ 
  initializeRoutes() {

    // DESCRIPTION
    //   Get all reports. This endpoint returns an object with a 'reports' property
    //   containing an array of reports.
    // REQUEST
    //   GET /reports
    // RESPONSE
    //   {
    //     "reports": [ ... ]
    //   }
    // STATUS CODES
    //   200 - OK: The request was successful
    //   500 - Internal Server Error: The server encountered an error
    this.router.get("/reports", async (req, res) => {
      await ReportController.getAllReports(req, res);
    });

    // DESCRIPTION
    //   Add a new report. This endpoint creates a new report with the provided
    //   crowding score and timestamp. The endpoint returns the created report.
    // REQUEST
    //   POST /report
    //   {
    //     "score": crowding report score
    //     "timestamp": report timestamp (number)
    //   }
    // RESPONSE
    //   {
    //     "id": generated id,
    //     "score": crowding report score
    //     "timestamp": report timestamp
    //   }
    // STATUS CODES
    //   200 - OK: The task was created successfully
    //   400 - Bad Request: The request was invalid or missing required data
    //   500 - Internal Server Error: The server encountered an error
    this.router.post("/report", async (req, res) => {
      await ReportController.addReport(req, res);
    });

    // DESCRIPTION
    //   Clear a single report, specified by id.
    //   This endpoint deletes the specified task and returns the deleted task
    //   This operation cannot be undone.
    // REQUEST
    //   DELETE /report
    // RESPONSE
    //   {
    //     "id": id of deleted task,
    //     "score": corresponding score (optional),
    //     "timestamp": report timestamp (optional)
    //   }
    // STATUS CODES
    //   200 - OK: The tasks were cleared successfully
    //   500 - Internal Server Error: The server encountered an error
    this.router.delete("/report", async (req, res) => {
      await ReportController.clearTasks(req, res);
    });

    // DESCRIPTION
    //   Clear all reports. This endpoint deletes all stored reports
    //   and returns an empty response. This operation cannot be undone.
    // REQUEST
    //   DELETE /reports <-- Note: plural for deletion of ALL reports, versus singular for deletion of a specific report 
    // RESPONSE
    //   { }
    // STATUS CODES
    //   200 - OK: The tasks were cleared successfully
    //   500 - Internal Server Error: The server encountered an error
    this.router.delete("/reports", async (req, res) => {
      await ReportController.clearTasks(req, res);
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new ReportRoutes().getRouter();
