// Renders xp.html to PNG with Electron:  npx electron assets/render.mjs   (desktop.png)
//                                         SHOT=taskbar npx electron assets/render.mjs   (taskbar.png)
import { app, BrowserWindow } from 'electron';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const taskbar = process.env.SHOT === 'taskbar';
const [width, height, search, file] = taskbar ? [1280, 40, 'taskbar', 'taskbar.png'] : [1280, 720, '', 'desktop.png'];
const zoom = 1.5;

app.whenReady().then(async () => {
  try {
    const win = new BrowserWindow({ show: false, useContentSize: true, width: width * zoom, height: height * zoom, frame: false, transparent: true });
    win.webContents.setZoomFactor(zoom);
    await win.loadFile(path.join(here, 'xp.html'), { search });
    win.webContents.setZoomFactor(zoom);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const image = await win.webContents.capturePage();
    writeFileSync(path.join(here, file), image.toPNG());
    console.log('wrote', file, image.getSize());
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
  app.quit();
});
