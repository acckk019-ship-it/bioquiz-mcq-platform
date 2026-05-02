import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // For large HTML files

const DATA_FILE = path.join(__dirname, 'src', 'data', 'quizzes.json');
const SUBJECTS_FILE = path.join(__dirname, 'src', 'data', 'subjects.json');

app.get('/api/subjects', (req, res) => {
  try {
    const data = fs.readFileSync(SUBJECTS_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read subjects file' });
  }
});

app.post('/api/subjects', (req, res) => {
  try {
    fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write subjects file' });
  }
});

app.get('/api/quizzes', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read data file' });
  }
});

app.post('/api/quizzes', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write data file' });
  }
});

app.post('/api/publish', (req, res) => {
  console.log('Publishing changes to GitHub...');
  
  // Format the commit message
  const date = new Date().toLocaleString();
  const commitMsg = `content: updated quizzes via admin dashboard (${date})`;

  const deployCommand = `npm run build && git add . && git commit -m "${commitMsg}" && git push && npx gh-pages -d dist`;

  exec(deployCommand, { cwd: __dirname }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Deploy error: ${error.message}`);
      return res.status(500).json({ error: 'Deploy failed', details: error.message });
    }
    console.log(`Deploy stdout: ${stdout}`);
    console.error(`Deploy stderr: ${stderr}`);
    res.json({ success: true, message: 'Deployed successfully!' });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Local Admin API running on http://localhost:${PORT}`);
});
