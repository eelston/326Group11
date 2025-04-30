import { Sequelize, DataTypes } from "sequelize";
import path from 'path';
import { fileURLToPath } from 'url';

// get folder name for current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize new Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.resolve(__dirname, "../src/data/reports.sqlite"), // absolute path to folder for report database
});

// define report model
export const Report = sequelize.define("Report", {
    id: { // unique universal identifier
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    location: { // name of corresponding location/building
        type: DataTypes.STRING,
        allowNull: false
    },

    floor: { // floor name, if applicable
        type: DataTypes.STRING,
        // allowNull defaults to true
    },

    score: { // crowding report score
        type: DataTypes.NUMBER,
        allowNull: false
    },

    timestamp: { // report submission time
        type: DataTypes.NUMBER,
        allowNull: false
    }
});

class _SQLiteReportModel {
    constructor() {}

    async init(fresh = false) {
        await sequelize.authenticate(); // check connection
        await sequelize.sync({ force: true }); // sync model with database
        // { force: true } overwrites existing database table to match model

        console.log("Report database synchronized successfully"); // no exceptions from above thrown

        if (fresh) { // create new
            await this.delete();

            // mock/default report data
            await this.create({
                location: "Courtside Cafe",
                score: 1,
                timestamp: Date.parse("2025-04-30T14:00:00") // "Creating a date from a string has a lot of behavior inconsistencies", ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#examples
                // note - using standardized format for this mock data, just to be safe, because using a nonstandard format (i.e., missing a space) in one date was resulting in an invalid parse 
            });

            await this.create({
                location: "Science & Engineering Library",
                floor: "2",
                score: 3,
                timestamp: Date.now()
            });

            await this.create({
                location: "Science & Engineering Library",
                floor: "3",
                score: 2,
                timestamp: Date.parse("2025-05-21T12:00:00")
            });
        }
    }

    async create(report) {
        console.log(`creating Report`)
        return await Report.create(report); // build and save report
    }

    async read(id = null) {
        if (id) { // if id is provided
            return await Report.findByPk(id); // return specified report (find by primary key)
        }

        return await Report.findAll(); // otherwise return all stored reports
    }

    async delete(report = null) {
        if (report === null) { // specific report not provided
          await Report.destroy({ truncate: true }); // remove all reports
          return; // escape
        }
    
        await Report.destroy({ where: { id: report.id } }); // remove specific report
        return report;
      }
}

// export singleton instance
const SQLiteReportModel = new _SQLiteReportModel();
export default SQLiteReportModel;
