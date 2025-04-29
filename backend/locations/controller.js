import * as fs from 'fs'; // file system module for interacting with local JSON files (ref: https://www.w3schools.com/nodejs/nodejs_filesystem.asp and https://www.geeksforgeeks.org/how-to-update-data-in-json-file-using-javascript/)
import { fileURLToPath } from "url";
import path from "path";

class LocationController {
  constructor() {
    const __filename = fileURLToPath(import.meta.url); // get current file path
    const __dirname = path.dirname(__filename); // get current file folder

    this.jsonPath = path.join(__dirname, "..", "src/data/locations.json"); // go up one folder then down to src (ref: https://stackoverflow.com/a/9856725)
  }

  // Get locations JSON
  async getLocations(req, res) {
    try {
      // const rawData = fs.readFile('./data/locations.json', (error) => {
      //   if (error) {throw new Error(`issue reading locations JSON: ${error}`)};
      // });
      // // return res.send(rawData);
      
      res.sendFile(this.jsonPath, (error) => {
        if (error) {throw new Error(`issue with sendFile for locations JSON: ${error}`)};
      });
    
    } catch (error) {
      console.log("Issue fetching locations JSON:", error)
      return res
          .status(500)
          .json({ error: "Failed to get locations JSON." });
    }
  }

  // Update locations JSON
  async updateLocations(req, res) {
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
