import { Router } from 'express';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { FILES_BASE_PATH } from '../config';

const router = Router();

// Serve files statically from the base path
router.use('/serve', express.static(FILES_BASE_PATH));

// GET /api/files?path=/some/path
router.get('/', (req, res) => {
  const requestedPath = req.query.path as string || '';
  const fullPath = path.resolve(FILES_BASE_PATH, requestedPath);

  // Basic security: ensure the path is within base directory
  if (!fullPath.startsWith(FILES_BASE_PATH)) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }

  try {
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    const result = items.map(item => {
      const itemPath = path.join(fullPath, item.name);
      const stats = fs.statSync(itemPath);
      return {
        name: item.name,
        type: item.isDirectory() ? 'directory' : 'file',
        size: item.isFile() ? stats.size : null,
        modified: stats.mtime,
      };
    });
    res.json({ success: true, data: result, cwd: requestedPath });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to read directory' });
  }
});

export default router;
