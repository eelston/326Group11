// start server by running:
// 'npm install -S express' (if express is not installed), 
// 'npm install'
// 'node backend/src/server.js'
// and navigate to http://localhost:3000/pages/FOLDERNAME

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import settingsRouter from './routes/settings.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDir = path.join(__dirname, "../../frontend/src");

app.use(express.json());

app.use(express.static(frontendDir));

app.use('/api', settingsRouter);

app.get('/pages/:page', (req, res) => {
    res.sendFile(path.join(frontendDir, 'pages', req.params.page, 'index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
