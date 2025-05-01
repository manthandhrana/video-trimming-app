
import pkg from '@prisma/client'; // Import the default export from '@prisma/client'
import dotenv from 'dotenv';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { trimVideoUrl } from '../utils/ffmpegUtils.js'; // Import the trimVideoUrl function
dotenv.config();
const ffProbe = process.env.FFPROBE_PATH
ffmpeg.setFfprobePath(ffProbe);
const { PrismaClient } = pkg;     // Destructure PrismaClient from the imported module

const prisma = new PrismaClient();
const db = prisma; // Use prisma directly as it's instantiated


export const uploadVideo = async (req, res) => {
  try {
    const { filename, path, size } = req.file;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }


    ffmpeg.ffprobe(path, async (err, metadata) => {
      if (err) return res.status(500).json({ error: err.message });

      const duration = metadata.format.duration;

      const video = await prisma.video.create({
        data: {
          name: filename,
          duration,
          size: parseFloat((size / (1024 * 1024)).toFixed(2)),
          status: "uploaded",
          filepath: path,
        },
      });

      res.status(201).json({ message: "Video uploaded", video });
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

export const trimVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body;

    // Fetch the video from the database using the provided id
    const video = await db.video.findUnique({ where: { id: parseInt(id) } });

    // Check if video exists
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Define the path for the trimmed video
    const trimmedPath = `trimmed/trimmed-${Date.now()}.mp4`;

    // Call the trimVideoUrl function to trim the video
    await trimVideoUrl(video.filepath, start, end, trimmedPath);

    // Update the video entry in the database with the trimmed URL and status
    await prisma.video.update({
      where: { id: parseInt(id) },
      data: {
        trimmedUrl: trimmedPath,
        status: "trimmed",
      },
    });

    // Respond with success message and the path to the trimmed video
    res.json({ message: "Video trimmed successfully", trimmedPath });
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Trimming failed", details: err.message });
  }
};



export const addSubtitle = async (req, res) => {
  try {
      const { id } = req.params;
      const { text, startTime, endTime } = req.body;
  
      if (!text || startTime == null || endTime == null) {
        return res.status(400).json({ error: "Missing subtitle data" });
      }
  
      const start = parseFloat(startTime);
      const end = parseFloat(endTime);
  
      if (isNaN(start) || isNaN(end) || start < 0 || end <= 0 || end <= start) {
        return res.status(400).json({
          error: "Invalid time value",
          details: "startTime and endTime must be valid positive numbers and endTime > startTime"
        });
      }
  
      const video = await prisma.video.findUnique({ where: { id: parseInt(id) } });
  
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
  

    const subtitleFilePath = `subtitles/sub-${Date.now()}.srt`;
    const subtitleText = `1\n${new Date(start * 1000).toISOString().substr(11, 8)},000 --> ${new Date(end * 1000).toISOString().substr(11, 8)},000\n${text}\n`;

    // Save subtitle text to .srt file
    fs.mkdirSync('subtitles', { recursive: true });
    fs.writeFileSync(subtitleFilePath, subtitleText);

    const outputPath = `subtitled/subtitled-${Date.now()}.mp4`;
    fs.mkdirSync('subtitled', { recursive: true });

    ffmpeg(video.trimmedUrl)
      .outputOptions(`-vf subtitles=${subtitleFilePath}`)
      .save(outputPath)
      .on('end', async () => {
        await prisma.video.update({
          where: { id: parseInt(id) },
          data: {
            subtitleUrl: `http://localhost:5000/${outputPath}`,
            status: 'subtitled',
          },
        });
        res.json({ message: "Subtitles added", subtitleUrl: `http://localhost:5000/${outputPath}` });
      })
      .on('error', (err) => res.status(500).json({ error: "Subtitle processing failed", details: err.message }));
  } catch (err) {
    res.status(500).json({ error: "Subtitle operation failed", details: err.message });
  }
};


export const renderFinalVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await db.video.findUnique({ where: { id: parseInt(id) } });

    if (!video) return res.status(404).json({ error: "Video not found" });

    const finalPath = `final/final-${Date.now()}.mp4`;
    fs.mkdirSync('final', { recursive: true });

const input = path.resolve(video.subtitleUrl?.replace('http://localhost:5000/', '') ||
                           video.trimmedUrl?.replace('http://localhost:5000/', '') ||
                           video.filepath);
    

    ffmpeg(input)
      .save(finalPath)
      .on('end', async () => {
        await prisma.video.update({
          where: { id: parseInt(id) },
          data: {
            finalUrl: `http://localhost:5000/${finalPath}`,
            status: "rendered",
          },
        });
        res.json({ message: "Final video rendered", finalUrl: `http://localhost:5000/${finalPath}` });
      })
      .on('error', (err) => res.status(500).json({ error: "Rendering failed", details: err.message }));
  } catch (err) {
    res.status(500).json({ error: "Render process failed", details: err.message });
  }
};


export const downloadFinalVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await db.video.findUnique({ where: { id: parseInt(id) } });

    if (!video || !video.finalUrl) return res.status(404).json({ error: "Final video not found" });

    const filePath = video.finalUrl.replace('http://localhost:5000/', '');
    res.download(filePath, err => {
      if (err) res.status(500).json({ error: "Download failed", details: err.message });
    });
  } catch (err) {
    res.status(500).json({ error: "Download process failed", details: err.message });
  }
};
