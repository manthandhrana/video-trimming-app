/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a video file
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *       500:
 *         description: Upload failed
 */

/**
 * @swagger
 * /{id}/trim:
 *   post:
 *     summary: Trim a video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start:
 *                 type: number
 *                 description: Start time in seconds
 *               end:
 *                 type: number
 *                 description: End time in seconds
 *     responses:
 *       200:
 *         description: Video trimmed successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Trimming failed
 */

/**
 * @swagger
 * /{id}/subtitles:
 *   post:
 *     summary: Add subtitles to a video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Subtitle text
 *               startTime:
 *                 type: number
 *                 description: Start time in seconds
 *               endTime:
 *                 type: number
 *                 description: End time in seconds
 *     responses:
 *       200:
 *         description: Subtitles added successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Failed to add subtitles
 */

/**
 * @swagger
 * /{id}/render:
 *   post:
 *     summary: Render the final video with all edits
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Final video rendered successfully
 *       404:
 *         description: Video not found
 *       500:
 *         description: Rendering failed
 */

/**
 * @swagger
 * /{id}/download:
 *   get:
 *     summary: Download the final rendered video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Final video file
 *         content:
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Final video not found
 *       500:
 *         description: Download failed
 */

import express from 'express';
import multer from 'multer';
import {
  addSubtitle,
  downloadFinalVideo,
  renderFinalVideo,
  trimVideo,
  uploadVideo
} from '../controllers/videoController.js';
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post('/upload', upload.single('video'), uploadVideo);
router.post('/:id/trim', trimVideo);
router.post('/:id/subtitles', addSubtitle);
router.post('/:id/render', renderFinalVideo);
router.get('/:id/download', downloadFinalVideo);


export default router;
