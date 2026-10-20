// Transcribes public/speaker-audio.wav into public/captions.json (word-level).
// Usage: node scripts/transcribe.mjs [model]   (default model: medium)
import fs from "fs";
import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  toCaptions,
  transcribe,
} from "@remotion/install-whisper-cpp";

const model = process.argv[2] ?? "medium";
const whisperPath = path.join(process.cwd(), "whisper.cpp");
const whisperCppVersion = "1.5.5";

await installWhisperCpp({ to: whisperPath, version: whisperCppVersion });
await downloadWhisperModel({ model, folder: whisperPath });

const whisperCppOutput = await transcribe({
  model,
  whisperPath,
  whisperCppVersion,
  inputPath: path.join(process.cwd(), "public", "speaker-audio.wav"),
  tokenLevelTimestamps: true,
  language: "ru",
});

const { captions } = toCaptions({ whisperCppOutput });
fs.writeFileSync(
  path.join(process.cwd(), "public", "captions.json"),
  JSON.stringify(captions, null, 2),
);
console.log(`Wrote ${captions.length} caption tokens to public/captions.json`);
