// start server by running:
// 'npm install -S express' (if express is not installed), 
// 'npm install'
// 'node backend/src/server.js'
// and navigate to http://localhost:3000/pages/FOLDERNAME
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import PostRoutes from "./routes/PostRoutes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url); // get file path
const __dirname = path.dirname(__filename); // get file folder
const url = path.join(__dirname, "../../frontend/src"); // ref: https://stackoverflow.com/a/76335925 and https://expressjs.com/en/starter/static-files.html

// setup middleware to serve static files from frontend directory
app.use(express.static(url)); 
console.log(`Serving static files from ${url}`);

// setup middleware to parse incoming JSON data & add new data
app.use(express.json());

app.use("/v1", PostRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
