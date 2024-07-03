import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import fsExtra from "fs-extra/esm";

// const credentials = {
//   "accessKeyId": process.env.ACCESS_KEY_ID,
//   "secretAccessKey": process.env.SECRET_ACCESS_KEY,
//   "region": process.env.REGION,
//   "bucket": process.env.BUCKET_NAME
// }

const videoUpload = async (req, res) => {
  
  try {
    if (!req.file) {
      throw new ApiError({
        status: 400,
        message: "No video file uploaded",
      });
    }

    const fileProperty = req.file.mimetype.split('/');
    if (fileProperty[0] !== 'video') {
      throw new ApiError({
        status: 404,
        message: "Not a supported File Format, Upload Video Only",
      });
    }

    const newPath = req.file.path;
    const filename = path.basename(newPath).split(".")

    console.log(`${filename[0]} ${filename[1]}`);

    const cmdPath = "src/createHLS.sh";

    const createHLSVOD = spawn("bash", [cmdPath, filename[0], filename[1]]);
    createHLSVOD.stdout.on("data", (d) => console.log(`stdout info: ${d}`));
    createHLSVOD.stderr.on("data", (d) => console.log(`stdout output: ${d}`));
    createHLSVOD.on("error", (d) => console.log(`error: ${d}`));
    createHLSVOD.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
      console.log(`Deleting ${newPath}`);
      fsExtra.removeSync(newPath);
      console.info(`Deleted ${newPath} from videos folder.`);
    });

    const directoryName = `./uploads/${filename[0]}`;

    // s3FolderUpload(directoryName, credentials, s3options)
    // .then(function (doc) {
    //     fsExtra.removeSync(directoryName);
    //     console.info(`Deleted ${req.videoId} from uploads folder.`);
    // })
    // .catch(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });

    res.json({
      status: "success",
      message: "Video Uploaded Successfully",
      videoId: req.file.originalname,
    });
  } catch (error) {
    console.error("An error occurred while processing the video.", error);

    if (req.files?.video?.path && fs.existsSync(req.files.video.path)) {
      fs.unlinkSync(req.files.video.path);
    }

    res.status(error.message === "Not a supported File Format, Upload Video Only" ? 404 : 500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { videoUpload };




// import { ApiError } from '../utils/ApiError.js';
// import { ApiResponse } from '../utils/ApiResponse.js';
// // import kill from 'tree-kill';
// import { v4 as uuidv4 } from "uuid"
// import path from "path"
// import fs from "fs"
// import { exec } from "child_process" // watch out
// import { stderr, stdout } from "process"
// import { spawn } from "child_process";


// const videoUpload = asyncHandler(async (req, res) => {
//   if (!req.file) {
//     throw new ApiError({
//       status: 400,
//       message: "No video file uploaded",
//     });
//   }

//   const fileProperty = req.file.mimetype.split('/');
//   if (fileProperty[0] !== 'video') {
//     throw new ApiError({
//       status: 404,
//       message: "Not a supported File Format, Upload Video Only",
//     });
//   }
//   // src\public\temp\dummy.mp4
//   const videoId = uuidv4();

//   const videoPath = req.file.path
//   const outputPath = `./src/public/uploads/${videoId}`
//   const hlsPath = `${outputPath}/index.m3u8`

//   if (!fs.existsSync(outputPath)) {
//     fs.mkdirSync(outputPath, { recursive: true })
//   }

//   // ffmpeg
//   const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

//   exec(ffmpegCommand, (error, stdout, stderr) => {
//     if (error) {
//       console.log(`exec error: ${error}`)
//     }
//     console.log(`stdout: ${stdout}`)
//     console.log(`stderr: ${stderr}`)
//     const videoUrl = `http://localhost:5000/src/public/uploads/${videoId}/index.m3u8`;

//     res.json({
//       message: "Video converted to HLS format",
//       videoUrl: videoUrl,
//       videoId: videoId
//     })
//   })
// });

// export { videoUpload };