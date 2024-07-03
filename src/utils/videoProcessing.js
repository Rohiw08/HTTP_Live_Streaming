import ffmpeg from "fluent-ffmpeg";

const compressVideo = (inputFilePath, outputFilePath) => {
  console.log(inputFilePath);
  console.log(outputFilePath);

  ffmpeg(inputFilePath)
    .outputOptions([
      '-vf', 'scale=-2:1080', // Scale the width to fit the height of 720 pixels
      '-b:v', '1000k',  // Set target bitrate to 1 Mbps
    ])
    .save(outputFilePath)
    .on('end', (stdout) => {
      console.log('Video compression completed successfully!');
      console.log(stdout);
    })
    .on('error', (err) => {
      console.error('Error during video compression:', err);
    }).run()

  // ffmpeg(inputFile)
  // .outputOptions([
  //   '-vf', 'scale=-2:720', // Scale the width to fit the height of 720 pixels
  //   '-b:v', '1000k', // Set target bitrate to 1 Mbps
  // ])
  // .save(outputFile)
}

export { compressVideo }