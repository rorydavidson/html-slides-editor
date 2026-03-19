const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;
const SLIDES_DIR = process.env.SLIDES_DIR || process.cwd();

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// List HTML files in a directory (defaults to SLIDES_DIR)
app.get('/api/files', (req, res) => {
  const dir = req.query.dir ? path.resolve(req.query.dir) : SLIDES_DIR;
  try {
    const files = fs.readdirSync(dir)
      .filter(f => f.endsWith('.html') && !f.startsWith('.'))
      .map(f => {
        const fullPath = path.join(dir, f);
        return {
          name: f,
          path: fullPath,
          modified: fs.statSync(fullPath).mtime.toISOString()
        };
      })
      .sort((a, b) => b.modified.localeCompare(a.modified));
    res.json({ dir, files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Browse directories — returns subdirectories and parent path
app.get('/api/browse', (req, res) => {
  const dir = req.query.dir ? path.resolve(req.query.dir) : os.homedir();
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirs = entries
      .filter(e => e.isDirectory() && !e.name.startsWith('.'))
      .map(e => ({ name: e.name, path: path.join(dir, e.name) }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const htmlFiles = entries
      .filter(e => e.isFile() && e.name.endsWith('.html') && !e.name.startsWith('.'))
      .map(e => {
        const fullPath = path.join(dir, e.name);
        return {
          name: e.name,
          path: fullPath,
          modified: fs.statSync(fullPath).mtime.toISOString()
        };
      })
      .sort((a, b) => b.modified.localeCompare(a.modified));

    const parent = path.dirname(dir);
    res.json({
      dir,
      parent: parent !== dir ? parent : null,
      dirs,
      files: htmlFiles
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read an HTML file (accepts absolute paths)
app.get('/api/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath) return res.status(400).json({ error: 'path parameter required' });

  const resolved = path.resolve(filePath);

  try {
    const content = fs.readFileSync(resolved, 'utf-8');
    res.json({ content, path: resolved });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Write an HTML file (accepts absolute paths)
app.post('/api/file', (req, res) => {
  const { path: filePath, content } = req.body;
  if (!filePath || !content) {
    return res.status(400).json({ error: 'path and content required' });
  }

  const resolved = path.resolve(filePath);

  try {
    fs.writeFileSync(resolved, content, 'utf-8');
    res.json({ ok: true, path: resolved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Slides editor running at http://localhost:${PORT}`);
  console.log(`Default slides directory: ${SLIDES_DIR}`);
});
