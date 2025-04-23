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
  
    async create(report) {
      report.id = _ReportModel.report_id++; // assign report id (and increment model id var)
      this.reports.push(report); // add report to "storage"
   
      console.log("Report created:", report); // print to console for confirmation
      return report;
    }
  
    async read(id = null) {
      if (id) { // if id is provided
        return this.reports.find((report) => report.id === id); // return report with matching id 
        // find() returns the first element in the provided array that satisfies the provided testing function
      }
  
      return this.reports; // otherwise, return all stored reports
    }
  
    async update(report) {
      const index = this.reports.findIndex((r) => r.id === report.id);
      this.reports[index] = report;
      return report;
    }
  
    async delete(report = null) { // TODO: determine if this needs to be changed to id...
    // async delete(id = null) {
      if (report === null) { // no id provided
      // if (id === null) { // no id provided
        this.reports = []; // clear all reports 
        return;
      }

      const index = this.reports.findIndex((r) => r.id === report.id);
      // const index = this.reports.findIndex((r) => r.id === id);
      this.reports.splice(index, 1); // remove matching report
      // const report = this.reports.splice(index, 1); // remove matching report
      // splice works in place
      return report; // return deleted report (for confirmation or otherwise)
    }
  }
  
  // Create a singleton instance.
  // ref: https://www.patterns.dev/vanilla/singleton-pattern/
  const ReportModel = new _ReportModel();
  
  // For testing/verification - initialize model with sample reports.
  ReportModel.create({ score: 1, timestamp: Date.now()});
  ReportModel.create({ score: 2, timestamp: Date.now()});
  ReportModel.create({ score: 3, timestamp: Date.now()});
  
  export default ReportModel;
  