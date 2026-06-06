import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

delete process.env.LOVABLE_SANDBOX;
delete process.env.DEV_SERVER__PROJECT_PATH;
process.env.NITRO_PRESET = "vercel";

const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const child = spawn(process.execPath, [viteBin, "build"], {
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
