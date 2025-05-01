import ffmpeg from 'fluent-ffmpeg';

import dotenv from 'dotenv';
dotenv.config();

const ffmpegPath = process.env.FFMPEG_PATH
const ffProbe = process.env.FFPROBE_PATH

// Set the paths to ffmpeg and ffprobe if they are in a custom location
ffmpeg.setFfmpegPath(ffmpegPath|| 'ffmpeg');
ffmpeg.setFfprobePath(ffProbe|| 'ffprobe');

export const trimVideoUrl = (inputPath, start, end, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
};
