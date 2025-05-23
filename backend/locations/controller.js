import * as fs from 'fs'; // file system module for interacting with local JSON files (ref: https://www.w3schools.com/nodejs/nodejs_filesystem.asp and https://www.geeksforgeeks.org/how-to-update-data-in-json-file-using-javascript/)
import SQLiteLocationModel from './locations.js';
import { useDemoData } from '../src/data/demo.js';

class LocationController {
  constructor() {
    this.model = SQLiteLocationModel; // get location model
    this.model.init(useDemoData);

    // const __filename = fileURLToPath(import.meta.url); // get current file path
    // const __dirname = path.dirname(__filename); // get current file folder

    // this.jsonPath = path.join(__dirname, "..", "src/data/locations.json"); // go up one folder then down to src (ref: https://stackoverflow.com/a/9856725)
  }

  // Get locations JSON data
  async getLocations(req, res) {
    const locations = await this.model.read();

    return res.json({ locations: locations });
  }

  // Update locations JSON
  async updateLocations(req, res) {
    // try {
    //   if (!req.body) {
    //     throw new Error("Issue with request body");
    //   }

    //   this.model
    // } catch {

    // }

    try {
      // check req body
      if (!req.body) {throw new Error("issue with body of request for updating locations JSON")}
  
      // write updated data to file
      await fs.writeFile(this.jsonPath, JSON.stringify(req.body), (error) => { // JSON stringify formatting ref: https://stackoverflow.com/a/5670892
        if (error) {throw new Error(`issue writing to locations JSON: ${error}`)}
      });
      // ref: https://www.geeksforgeeks.org/node-js-fs-writefilesync-method/
      // ref for callback cb error: https://stackoverflow.com/a/72432465
      
      return res.status(200).json({ok: true}); // successful update
    } catch (error) {
      console.log(`Error updating locations JSON ${error}`)
      return res
      .status(500)
      .json({ error: "Failed to update locations JSON." });
    }
  };
}

export default new LocationController();
