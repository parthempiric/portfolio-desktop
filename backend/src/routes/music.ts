import { Router } from 'express';
import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { FILES_BASE_PATH } from '../config';
import { parseFile } from 'music-metadata';

const router = Router();

// GET /api/music?path=/some/path.mp3
router.get('/', async (req, res) => {
    const requestedPath = req.query.path as string || '';
    const fullPath = path.resolve(FILES_BASE_PATH, requestedPath);

    if (!fullPath.startsWith(FILES_BASE_PATH)) {
        return res.status(403).json({ success: false, error: 'Access denied' });
    }

    try {
        const metadata = await parseFile(fullPath);

        let base64Cover = ""
        if (metadata.common.picture?.[0].data) {
            const b = Buffer.from(metadata.common.picture[0].data)
            base64Cover = `data:${metadata.common.picture[0].format};base64,${b.toString("base64")}`
        }

        res.json({
            success: true, data: {
                title: metadata.common.title,
                artist: metadata.common.artist,
                duration: metadata.format.duration,
                cover: base64Cover,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to read directory' });
    }
});

export default router;
