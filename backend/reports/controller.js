/**
 * Controller design pattern from CS 326 task list web app example
 * Keeps user requests and data processing separate from UI and data model(s)
 * 
 * Takes user input (HTTP request) and sends response
 * Each method handles a specific functionality 
 */

import SQLiteReportModel from "./report.js";
import { useDemoData } from "../src/data/demo.js";

class ReportController {
  constructor() {
    this.model = SQLiteReportModel; // get report model instance
    this.model.init(useDemoData);
  }

  // Get all reports
  async getAllReports(req, res) {
    const reports = await this.model.read();
    // The response is an object with a 'reports' property containing an array of
    // reports, defined this way to keep the response consistent across endpoints.
    return res.json({ reports: reports });
  }

  // Get a single report
  async getReport(req, res) {
    try {
      if (!req || !req.query.id) {
        return res.status(400).json({ error: "Bad request, crowding report id is required." });
      }

      const id = new URL(req.host+req.url).searchParams.get("id"); // get id from request, ref: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
      const report = await this.model.read(id);

      // Log for debugging
      console.log(`Read report ${report.id} for ${report.location}, score: ${report.score} `)

      // Send back the created report as response
      return res.status(201).json({ ok: true, body: report });

    } catch (error) {
      // Log any unexpected errors and send a server error response
      console.error("Error getting report:", error);
      return res
        .status(500)
        .json({ error: "Failed to get report. Please try again." });
    }
  }

  // Add a new report
  async addReport(req, res) {
    try {
      // Check if 'report' is provided in the request body
      if (!req.body || !req.body.score) {
        return res.status(400).json({ error: "Bad request, crowding report score is required." });
      }

      // Create the new report object with a unique ID
      const report = await this.model.create(req.body);

      // Log full report for debugging
      const floor = report.floor
        ? `Floor ${report.floor}` 
        : ""

      const timestamp = Date.parse(report.createdAt)
      console.log(`[New Report] ${report.location} ${floor} - score ${report.score} @ timestamp ${timestamp} ms - id ${report.id}`);

      // Send back the created report as the response
      return res.status(201).json({ ok: true, body: report });
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
