import fs from 'fs';
// fs stands for File System
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileRemover = (filename) => {
  fs.unlink(path.join(__dirname, '../uploads', filename), function (err) {
    if (err && err.code == 'ENOENT') {
      // file doens't exist
      console.log(`File doesn't exist, won't remove it.${filename}`);
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.log(`Error occurred while trying to remove file: ${filename}`);
    } else {
      console.log(`File removed: ${filename}`);
    }
  });
};

export { fileRemover };
