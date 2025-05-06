import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath } from "url";
import path from "path";
import * as fs from 'fs'; // file system module (ref: https://www.w3schools.com/nodejs/nodejs_filesystem.asp and https://www.geeksforgeeks.org/how-to-update-data-in-json-file-using-javascript/)

// get folder name for current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize new Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(__dirname, "../src/data/locations.sqlite"), // absolute path to folder for location database
});

// define location model
export const Location = sequelize.define("Location", {
    id: { // unique universal identifier
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    reports: { // null if multi-floor, report array
        type: DataTypes.JSON,
        allowNull: true
    },

    floors: { // not null if multi-floor (floors, reports)
        type: DataTypes.JSON,
        allowNull: true
    }
})

// define SQLite model
class _SQLiteLocationModel {
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate(); // check connection
        await sequelize.sync(); // sync model with database
        // { force: true } overwrites existing database table to match model

        console.log("Location database synchronized successfully"); // no exceptions from above thrown

        let pullFromJSON = false;
        // check if database table is empty
        try {
            const { count, rows } = await Location.findAndCountAll(); // ref: https:// sequelize.org/v5/manual/models-usage.html
            if ((count === 0) && (rows.length === 0)) {
                pullFromJSON = true;
            }
        } catch (error) {
            throw error
        }

        // create new from template
        if (fresh || pullFromJSON) {
            await this.delete();

            // pull from template JSON
            const __filename = fileURLToPath(import.meta.url); // get current file path
            const __dirname = path.dirname(__filename); // get current file folder
            const dataPath = path.join(__dirname, "..", "src/data/locations.json"); // absolute path, go up one folder then down to src (ref: https://stackoverflow.com/a/9856725)

            // read from JSON
            console.log(`Loading location database content from template at "${dataPath}"`);
            const data = fs.readFileSync(dataPath); // blocks rest of the program from executing until the file has been completely read 
            // ref: https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
            // this prevents other operations from occurring (e.g., read calls) before all the locations have been loaded from the JSON file

            const dataArray = JSON.parse(data); // data from JSON

            dataArray.forEach(async location => { // for each location object
                const locationToCreate = {
                    name: location.name,
                    address: location.address,
                    type: location.type,
                }

                // add report or floors attribute depending on building type
                if (location.type === "Single-Floor") { 
                    locationToCreate.reports = JSON.stringify(location.reports);

                } else if (location.type === "Multi-Floor") {
                    locationToCreate.floors = JSON.stringify(location.floors);
                }

                // add to database
                await this.create(locationToCreate);
            })
        }
    }

    async create(location) {
        return await Location.create(location);
    }

    async read(name = null) {
        if (name) { // if location name is provided
            return await Location.findByPk(name);
        }

        return await Location.findAll(); // otherwise, return all locations
    }

    async update(location = null) { // update location information
        // ideally, the only mutable information should be building or floor reports array
        // potential TODO: add validation to enforce above

        const locationToUpdate = await Location.findByPk(location.name);
        if (!locationToUpdate) { // no matching location to update
            return null;
        }

        await locationToUpdate.update(location);
        return locationToUpdate;
    }

    async delete(location = null) {
        if (location === null) {
            await Location.destroy({ truncate: true }); // remove all reports
            return; // escape
        }

        // app has no need for specific location deletion, but keeping here for completion
        await Location.destroy({ where: { name: location.name } }); // remove specific location
        return location;
    }
}

// export singleton instance
const SQLiteLocationModel = new _SQLiteLocationModel();
export default SQLiteLocationModel;
