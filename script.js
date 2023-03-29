// Install core-js
import 'ffmpeg.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


const inputFile = document.querySelector("#input-file");
const outputFileName = document.querySelector("#output-file-name");
const convertButton = document.querySelector("#convert-button");

module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    }
  ]
}

convertButton.addEventListener("click", () => {
  if (!inputFile.files[0]) {
    alert("Please select a .webm file to convert.");
    return;
  }

  const file = inputFile.files[0];
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = async () => {
    const buffer = reader.result;
    const output = await webmToMp4(buffer);
    const blob = new Blob([output], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(".webm", "")}.mp4`;
    link.click();
  };
});

async function webmToMp4(buffer) {
  // Convert .webm to .mp4 using a conversion tool or library
  // Example using FFmpeg.js library
  const { default: FFmpeg } = await import("ffmpeg.js");
  const instance = new FFmpeg({
    arguments: [
      "-i",
      "pipe:0",
      "-c:v",
      "libx264",
      "-crf",
      "18",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-f",
      "mp4",
      "pipe:1",
    ],
    MEMFS: [{ name: "input.webm", data: new Uint8Array(buffer) }],
  });
  await instance.run();
  return instance.MEMFS[0].data;
}
