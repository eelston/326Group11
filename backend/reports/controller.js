// The controller pattern is a design pattern commonly used in software
// engineering to separate the business logic of an application from its
// presentation layer. It organizes the code in a way that keeps the
// handling of user requests, business rules, and data processing separate
// from the user interface and data models. This pattern is especially
// useful in applications that involve handling HTTP requests, such as
// web applications, where different types of requests need distinct
// processing workflows.

// In the controller pattern, a "controller" is responsible for taking user
// input (e.g., an HTTP request), processing it according to the business
// logic, and sending a response. By using this pattern, each controller
// method manages a specific functionality, like adding a task or updating
// a user profile, which keeps the logic modular and reusable. Controllers
// interact with models (for data) and views (for user feedback) without
// knowing the internal details of each, promoting low coupling.

// The controller pattern also improves maintainability by isolating
// different concerns in the codebase. Changes to business logic or data
// processing can be made within the controller without affecting other
// parts of the application. Additionally, this pattern allows for easier
// testing, as each controller can be tested in isolation to verify that it
// handles input and output correctly, without dependencies on the
// application's interface or data storage layers.

// import ModelFactory from "../model/ModelFactory.js";
import ReportModel from "./report.js";

class ReportController {
  constructor() {
    this.model = ReportModel; // get report model instance   
  }

  // Get all tasks
  async getAllReports(req, res) {
    const tasks = await this.model.read();
    // The response is an object with a 'tasks' property containing an array of
    // tasks. This could be anything, but we define it as an object with a
    // 'tasks' property to keep the response consistent across different
    // endpoints.
    res.json({ tasks });
  }

  // Add a new task
  async addReport(req, res) {
    try {
      // Check if 'task' is provided in the request body
      if (!req.body || !req.body.score) {
        return res.status(400).json({ error: "Crowding report score is required." });
      }

      // Create the new task object with a unique ID
      const report = await this.model.create(req.body);

      // Log full report for debugging
      console.log(`New report: ${report.id} - ${report.score} - ${report.timestamp} ms`);

      // Send back the created task as the response
      return res.status(201).json(report);
    } catch (error) {
      // Log any unexpected errors and send a server error response
      console.error("Error adding report:", error);
      return res
        .status(500)
        .json({ error: "Failed to add report. Please try again." });
    }
  }

  // Clear specific report
  async clearReport(req, res) { // TODO: maybe change to deleteReport for clarity?
    try {
      // Check for report id in request body
      if (!req.body || !req.body.id) {
        return res.status(400).json({ error: "Crowding report id is required for deletion." });
      }

      // Delete specified report object
      const report = await this.model.delete(req.body.id);

      // Log for confirmation
      console.log(`Report ${report.id} deleted.`);
      
      // Send remaining report log as response? TODO: maybe change to res = deleted report? sim pop()
      res.json(await this.model.read());
    } catch (error) {
      // Log any errors and send server error response
      console.log("Error removing report:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete report. Please try again." });
    }
  }

  // Clear all tasks
  async clearAllReports(req, res) {
    await this.model.delete();
    res.json(await this.model.read());
  }
}

export default new ReportController();
