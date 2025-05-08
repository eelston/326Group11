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
import PostRoutes from "./routes/PostRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import settingsRouter from './routes/settings.js';
import session from "express-session";
import passport from "./auth/passport.js";
import env from "./auth/env.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url); // get current file path
const __dirname = path.dirname(__filename); // get current file folder
const url = path.join(__dirname, "../../frontend/src"); // construct absolute path (ref: https://expressjs.com/en/starter/static-files.html)

// setup middleware to serve static files from frontend directory
app.use(express.static(url)); 
console.log(`Serving static files from ${url}`);

app.use(express.json());

//session management
app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

//passport and authentication state
app.use(passport.initialize());
app.use(passport.session());

// set up routes by using imported ReportRoutes
app.use("/", ReportRoutes); // mount on app

// set up routes for imported LocationRoutes
app.use("/locations", LocationRoutes); // mount on app

// set up routes for imported settings router
app.use('/api', settingsRouter);

app.get('/pages/:page', (req, res) => {
    res.sendFile(path.join(frontendDir, 'pages', req.params.page, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// set up routes for imported PostRoutes
app.use("/v1", PostRoutes);

app.use("/users", UserRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
