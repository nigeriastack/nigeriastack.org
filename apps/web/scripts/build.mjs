import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";

const root = process.cwd();
const distClient = path.join(root, "dist", "client");
fs.mkdirSync(path.join(distClient, ".well-known"), { recursive: true });

const shellHtml = fs.readFileSync(path.join(root, "src", "shell.html"), "utf8");
fs.writeFileSync(path.join(distClient, "index.html"), shellHtml, "utf8");

for (const rel of [".well-known/ngstack-keys.json", "llms.txt", "sw.js"]) {
  const srcFile = path.join(root, "public", rel);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(distClient, rel));
  }
}

const gzBytes = zlib.gzipSync(Buffer.from(shellHtml, "utf8")).length;
console.log(`[BUILD] nigeriastack-org-portal built -> dist/client/index.html (${gzBytes} bytes gzipped)`);
if (gzBytes > 35840) {
  console.error(`[FATAL] Initial shell (${gzBytes} bytes) exceeds 35,840-byte budget!`);
  process.exit(1);
}
