/********************************************************************
 * Based on InMemoryTaskModel.js from CS326 backend integration example tasks-v4
 * Defining the Report model (for location crowding scores)
 *    based on report mock/draft data structure from MockLocations:
 *    {
 *        id: number,
 *        score: number,
 *        timestamp: number
 *    }
 * 
 * Notes:
 *  - ReportModel holds every report for every location, storage is not specific to one location
 *  - Will likely replace this model with Sequelize database in future milestones
 *********************************************************************/

import { throws } from 'assert';
import { raw } from 'express';
import fs from 'fs'; // file system module for interacting with local JSON files (ref: https://www.w3schools.com/nodejs/nodejs_filesystem.asp and https://www.geeksforgeeks.org/how-to-update-data-in-json-file-using-javascript/)
import { json } from 'stream/consumers';

// This is a simple model that stores tasks in memory. It has methods to create,
// read, update, and delete tasks. The tasks are stored in an array, and the
// methods manipulate this array to perform the CRUD operations.
//
// This model is useful for prototyping and testing, as it provides a quick way
// to store and manipulate data without the need for a persistent database. It
// can be easily replaced with a more sophisticated database model when needed.
class _ReportModel {
    static report_id = 1; // init report id system
  
    constructor() {
      this.reports = [];
    }
  
    /**
     * Adds new report to memory and updates corresponding location data
     * @param {*} report
     *      report: {
              location: string[] of length 1 or 2
              score: number -> Number(localStorage.getItem("crowding")),
              timestamp: number -> Date.now() 
            };
     * @returns added report
     */
    async create(report) {
      console.log("input:", report)
      report.id = _ReportModel.report_id++; // assign report id (and increment model id var)
      this.reports.push(report); // add report to in memory "storage"

      // add report id to corresponding location 'reports' array (ref: https://www.geeksforgeeks.org/how-to-update-data-in-json-file-using-javascript/)
      const GETresponse = await fetch("http://localhost:3000/locations"); // GET method for locations JSON
      if (!GETresponse.ok) {return new Error("Failed to fetch locations.json")};
      
      const jsonData = await GETresponse.json(); // location JSON data
      // doesn't need to be parsed again, ref: https://stackoverflow.com/a/77786334

      const locationInfo = report.location; // this should be an array: ["LocationName"] or ["LocationName", "FloorName"]
      const location = jsonData.find(location => location.name === locationInfo[0]); // get matching location object
      switch (locationInfo.length) {
        case 1: // single floor
          location.reports.push(report.id); // add report id to location's 'reports' array
          break;
        case 2: // multi floor
          const floor = location.floors.find(floor => floor.name === locationInfo[1]); // get matching floor object
          floor.reports.push(report.id); // add report id to floor's 'reports' array
          break;
        default: // else, something wrong with location data array
          throw new Error("Issue with location data. Should be an array of length 1 or 2");
      }

      const PUTresponse = await fetch("http://localhost:3000/locations/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });
      if (!PUTresponse.ok) {throw new Error("Failed to update locations.json")};

      console.log("Report created:", report); // print to console for confirmation
      return report;
    }
  
    async read(id = null) {
      if (id) { // if id is provided
        return this.reports.find((report) => report.id === id); // return report with matching id 
        // find() returns the first element in the provided array that satisfies the provided testing function
      }

      // else, no id provided -> return all stored reports
      console.log(this.reports)
      return this.reports; // otherwise, return all stored reports
    }
  
    async update(report) {
      const index = this.reports.findIndex((r) => r.id === report.id);
      this.reports[index] = report;
      return report;
    }

    /**
     * If no argument is provided, removes all reports
     * If an argument is provided, removes report specified by id from memory and location in locations.json
     * @param {} report (optional)
     *    May be full report object, or just { location: string[], id: number } (crowding score isn't required, technically)
     * @returns deleted report
     */
    async delete(report = null) {
      if (report === null) { // no id provided
        this.reports = []; // clear all reports 

        // TODO: remove all reports from JSON file in a non-spaghetti way
        return;
      }

      // deletion of a specific report from storage
      const index = this.reports.findIndex((r) => r.id === report.id);
      // const index = this.reports.findIndex((r) => r.id === id);
      this.reports.splice(index, 1); // remove matching report from in memory "storage"
      // splice works in place

      // update corresponding location in locations JSON
      const jsonData = require('../src/data/locations.json');
      
      // TODO: clean up duplicate lines of code
      const locationInfo = report.location; // this should be an array: ["LocationName"] or ["LocationName", "FloorName"]
      const location = jsonData.find(location => location.name === locationInfo[0]); // get matching location object
      switch (locationInfo.length) {
        case 1: // single floor
          const idx = location.reports.findIndex(id => id === report.id); // get index of report id in reports array
          location.reports.splice(idx, 1); // remove matching report id
          break;
        case 2: // multi floor
          const floor = location.floors.find(floor => floor.name === locationInfo[1]); // get matching floor object
          const idx2 = floor.reports.findIndex(id => id === report.id); // get index of report id in reports array
          floor.reports.splice(idx2, 1); // remove matching report id
          break;
        default: // else, something wrong with location data array
          throw new Error("Issue with location data. Should be an array of length 1 or 2");
      }

      // write updated data to file
      fs.writeFileSync('../src/data/locations.json', JSON.stringify(jsonData, null, 2));
      // ref: https://www.geeksforgeeks.org/node-js-fs-writefilesync-method/

      return report; // return deleted report (for confirmation or otherwise)
    }
  }
  
  // Create a singleton instance.
  // ref: https://www.patterns.dev/vanilla/singleton-pattern/
  const ReportModel = new _ReportModel();
  
  // For testing/verification - initialize model with sample reports.
  ReportModel.create({ location: ["Courtside Cafe"], score: 1, timestamp: Date.now()});
  // ReportModel.create({ location: ["Student Union", "2"], score: 2, timestamp: Date.now()});
  // ReportModel.create({ location: ["Student Union", "3"], score: 3, timestamp: Date.now()});
  
  export default ReportModel;
  