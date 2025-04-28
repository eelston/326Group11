// start server by running:
// 'npm install -S express' (if express is not installed), 
// 'npm install'
// 'node backend/src/server.js'
// and navigate to http://localhost:3000/pages/FOLDERNAME
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ReportRoutes from "../reports/routes.js"
import LocationRoutes from "../locations/routes.js"

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url); // get current file path
const __dirname = path.dirname(__filename); // get current file folder
const url = path.join(__dirname, "../../frontend/src"); // construct absolute path (ref: https://expressjs.com/en/starter/static-files.html)

// setup middleware to serve static files from frontend directory
app.use(express.static(url)); 
console.log(`Serving static files from ${url}`);

// setup middleware to parse incoming JSON data & add new data
app.use(express.json());

// set up routes by using imported ReportRoutes
app.use("/", ReportRoutes); // mount on app

// set up routes for imported LocationRoutes
app.use("/locations", LocationRoutes); // mount on app

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
