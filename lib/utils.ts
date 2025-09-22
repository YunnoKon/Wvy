import { join } from "@std/path";
import { ensureDir } from "@std/fs";

const GITHUB_REPO = "YunnoKon/deno_wry";
const HELPER_VERSION = "0.1.0";
const HELPER_NAME = "deno_wry.exe"; // windows only

export async function getHelperPath(): Promise<string> {
  // put helper in a visible folder inside the project
  const installDir = join(Deno.cwd(), ".bin");

  await ensureDir(installDir);
  const helperPath = join(installDir, HELPER_NAME);

  try {
    await Deno.lstat(helperPath);
    return helperPath; // already exists
  } catch {
    const url =
      `https://github.com/${GITHUB_REPO}/releases/download/${HELPER_VERSION}/${HELPER_NAME}`;
    console.log(`Downloading helper from ${url}...`);

    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      throw new Error(`Download failed: ${res.status} ${res.statusText}`);
    }

    const data = new Uint8Array(await res.arrayBuffer());
    await Deno.writeFile(helperPath, data);

    return helperPath;
  }
}
