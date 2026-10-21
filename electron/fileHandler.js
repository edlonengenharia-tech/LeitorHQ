const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
const COMIC_EXTENSIONS = ['.cbz', '.cbr', '.cb7'];

/**
 * Load a comic file (CBZ, CBR, CB7, PDF)
 */
async function loadComic(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case '.cbz':
      return await loadCBZ(filePath);
    case '.cbr':
      return await loadCBR(filePath);
    case '.cb7':
      return await loadCB7(filePath);
    case '.pdf':
      return await loadPDF(filePath);
    default:
      throw new Error(`Unsupported format: ${ext}`);
  }
}

/**
 * Load a folder of images
 */
async function loadFolder(folderPath) {
  const files = fs.readdirSync(folderPath)
    .filter(f => {
      const ext = path.extname(f).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const pages = await Promise.all(
    files.map(async (file, index) => {
      const fullPath = path.join(folderPath, file);
      const buffer = fs.readFileSync(fullPath);
      const base64 = buffer.toString('base64');
      const ext = path.extname(file).toLowerCase();
      const mime = getMimeType(ext);

      return {
        id: `page-${index}`,
        image: `data:${mime};base64,${base64}`,
        title: `Page ${index + 1}`,
      };
    })
  );

  return {
    title: path.basename(folderPath),
    pages,
    totalPages: pages.length,
  };
}

/**
 * Load CBZ (ZIP) file
 */
async function loadCBZ(filePath) {
  const AdmZip = require('adm-zip');
  const zip = new AdmZip(filePath);
  const entries = zip.getEntries();

  const imageEntries = entries
    .filter(entry => {
      const ext = path.extname(entry.entryName).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext) && !entry.isDirectory;
    })
    .sort((a, b) => a.entryName.localeCompare(b.entryName, undefined, { numeric: true }));

  const pages = imageEntries.map((entry, index) => {
    const buffer = entry.getData();
    const base64 = buffer.toString('base64');
    const ext = path.extname(entry.entryName).toLowerCase();
    const mime = getMimeType(ext);

    return {
      id: `page-${index}`,
      image: `data:${mime};base64,${base64}`,
      title: `Page ${index + 1}`,
    };
  });

  return {
    title: path.basename(filePath, '.cbz'),
    pages,
    totalPages: pages.length,
  };
}

/**
 * Load CBR (RAR) file - requires unrar
 */
async function loadCBR(filePath) {
  // Try using unrar command
  try {
    const { stdout } = await execAsync(`unrar l "${filePath}"`);
    const lines = stdout.split('\n');
    const files = [];

    for (const line of lines) {
      const ext = path.extname(line.trim()).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(line.trim().split(/\s+/).pop());
      }
    }

    // Extract to temp directory
    const tempDir = path.join(require('os').tmpdir(), 'autocomix-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });

    await execAsync(`unrar x -y "${filePath}" "${tempDir}/"`);

    const comicData = await loadFolder(tempDir);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    return comicData;
  } catch (error) {
    throw new Error('CBR files require unrar to be installed. Please install unrar and try again.');
  }
}

/**
 * Load CB7 (7z) file - requires 7z
 */
async function loadCB7(filePath) {
  try {
    const tempDir = path.join(require('os').tmpdir(), 'autocomix-' + Date.now());
    fs.mkdirSync(tempDir, { recursive: true });

    await execAsync(`7z x "${filePath}" -o"${tempDir}" -y`);

    const comicData = await loadFolder(tempDir);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    return comicData;
  } catch (error) {
    throw new Error('CB7 files require 7-Zip to be installed. Please install 7-Zip and try again.');
  }
}

/**
 * Load PDF file - requires pdf.js or similar
 */
async function loadPDF(filePath) {
  // PDF support would require a PDF rendering library
  // For now, return an error suggesting conversion
  throw new Error('PDF support requires additional configuration. Consider converting to CBZ format.');
}

/**
 * Read a single file
 */
async function readFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = getMimeType(ext);
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

/**
 * Get file information
 */
async function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  return {
    name: path.basename(filePath),
    size: stats.size,
    modified: stats.mtime,
    isDirectory: stats.isDirectory(),
  };
}

/**
 * Get MIME type from extension
 */
function getMimeType(ext) {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

module.exports = {
  loadComic,
  loadFolder,
  loadCBZ,
  loadCBR,
  loadCB7,
  loadPDF,
  readFile,
  getFileInfo,
};
