# Video Trimming Platform

## Description
---
This is a Video Trimming Platform built with  Node.js Express.js, allowing users to upload videos, trim them, and download the edited clips. The app is responsive, providing an intuitive interface for users to interact with, and integrates with the backend to process video trimming operations.


## Features
---
✅ **Video Upload & Trim**  
- Upload videos of various formats 
- **30-second timer** for each question  
- Choose start and end points to trim the video

✅ **Added Subtitle**  
- Upload subtitle text with start and End Time
- Option to embed subtitles into the video
- subtitles added in final download

✅ **Video Processing**  
- Uses FFmpeg for efficient video trimming
- Fast processing with minimal waiting time

## Technologies Used
---
- **Backend:** Node JS, Express JS 
- **Video Processing:**  FFmpeg 
- **Databse:** PostgreSQL
- **Tools:** Swagger API (for backend documentation)

## Installation & Setup
---
Follow these steps to set up the project on your local machine:

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/manthandhrana/video-trimming-app.git
cd video-trimming-app  
```
2️⃣ Install Dependencies
```sh
npm install
```
 3️⃣ Set up .env file
 ```sh
DATABASE_URL=posgresqlURL
PORT=5000
FFMPEG_PATH=ffmpegPath
FFPROBE_PATH=ffprobePath
```

4️⃣ Start Server
 ```sh
node server.js
```

### This will start the project at http://localhost:5000/api-docs
  
## How App Look Like

#### upload Page
![upload_01](https://github.com/user-attachments/assets/ad4e442d-438e-4dbd-a63d-43aba7696130)
![upload_02](https://github.com/user-attachments/assets/c1e59d9b-dd10-4c62-90aa-7aff7ebd5b0b)

#### Trimming page
![trim_01](https://github.com/user-attachments/assets/bb8e1f8a-6689-4af2-86b9-3e76dd9beb4f)
![trim_02](https://github.com/user-attachments/assets/675c1ead-f6c9-4e02-9a69-7b551edeee1e)

#### Adding Subtitle
![subtitle_01](https://github.com/user-attachments/assets/02777e7d-3456-44d8-a4ac-b9fa472536b8)
![subtitle_02](https://github.com/user-attachments/assets/ac3d72f4-bbed-46a7-8d96-1956e687c722)

#### video rendering
![rendering_01](https://github.com/user-attachments/assets/891c0c8b-4a04-4c7e-b8d8-6b22a2223a4b)
![rendering_02](https://github.com/user-attachments/assets/c365f6bb-e239-4df2-9bc3-87d17547183f)

#### download final video
![downlaod_01](https://github.com/user-attachments/assets/4e9f9bd9-7800-494c-9145-ec66d5a54c5d)
![downlaod_02](https://github.com/user-attachments/assets/1b684cec-a79f-4f2f-b8b7-26eb1882ad7f)
