import Service from "./Service.js"
import { Events } from "../eventhub/Events.js";
import { EventHub } from "../eventhub/EventHub.js";

export class ReportRepositoryRemoteService extends Service {
  constructor() {
    super();
    this.#initReports();
  }

  addSubscriptions() { // this is called in super()
    this.subscribe(Events.AddReport, (data) => {
      this.addReport(data);
    });

    this.subscribe(Events.DeleteReport, (data) => {
        this.deleteReport(data);
      });

    this.subscribe(Events.ClearAllReports, () => {
      this.clearAllReports();
    });
  }

  // The #initTasks() method is an async method that fetches tasks from the
  // server. It uses the fetch API to make a GET request to the /v1/tasks
  // endpoint. If the request is successful, it parses the response as JSON and
  // iterates over the tasks, converting the base64 string back to a blob using
  // the Base64.convertBase64ToFile() method. It then publishes a NewTask event
  // with the task data. This method is called in the constructor to initialize
  // the tasks when the service is created.
  async #initReports() {
    const response = await fetch("/reports"); // GET request

    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }

    const data = await response.json();

    data.reports.forEach(async (report) => {
      // Publish the task. This will likely update the UI with the task data.
      // What is cool is that we do not care about the UI here. We just publish
      // the event and let the UI components handle the update or whatever part
      // of this application is interested in the task data.
      // this.publish(Events.AddReport, report);
    });
  }

  async getAllReports() {
    // const response = await fetch("/reports"); // GET request
    // console.log("get all reports test")
    // console.log(response)
    
    // if (!response.ok) {
    //   throw new Error("Failed to fetch reports");
    // }

    // const data = await response.json();
    // return data; 
  }

  async addReport(reportData) {
    const response = await fetch("/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error(`Bad response (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    EventHub.getInstance().publish(Events.AddReportSuccess, data);
    return data;
  }

  async deleteReport(report) {
    const response = await fetch("/report", {
        method: "DELETE",
        body: JSON.stringify(report) // { id: 1 } or full report item
      });
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error("Failed to clear report");
      }
  
      // Notify subscribers that report has been cleared from the server.
      // This is likely needed to update the UI.
      this.publish(Events.DeleteReportSuccess);
  
      return data;
  }

  async clearAllReports() {
    const response = await fetch("/reports", {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Failed to clear reports");
    }

    // Notify subscribers that reports have been cleared from the server.
    // This is likely needed to update the UI.
    this.publish(Events.DeleteReportSuccess);

    return data;
  }
}
